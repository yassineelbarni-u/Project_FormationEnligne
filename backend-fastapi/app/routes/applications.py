"""
Routes API pour la gestion des candidatures
"""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import os
import uuid

from app.database import get_db
from app.models import JobApplication, JobOffer, Admin
from app.schemas import JobApplicationCreate, JobApplicationUpdate, JobApplicationResponse
from app.security import get_current_admin

router = APIRouter()

# Configuration pour l'upload des CV
UPLOAD_DIR = "backend/uploads/cv"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/", response_model=JobApplicationResponse)
async def create_job_application(
    job_offer_id: int = Form(...),
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(None),
    cover_letter: str = Form(None),
    cv_file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Créer une nouvelle candidature (public)"""
    
    # Vérifier que l'offre d'emploi existe et est active
    job_offer = db.query(JobOffer).filter(
        JobOffer.id == job_offer_id,
        JobOffer.is_active == True
    ).first()
    
    if not job_offer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Offre d'emploi non trouvée ou inactive"
        )
    
    # Vérifier si une candidature existe déjà pour cette offre et cet email
    existing_application = db.query(JobApplication).filter(
        JobApplication.job_offer_id == job_offer_id,
        JobApplication.email == email
    ).first()
    
    if existing_application:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vous avez déjà postulé pour cette offre"
        )
    
    # Sauvegarder le fichier CV
    cv_filename = None
    cv_url = None
    
    if cv_file:
        # Générer un nom unique pour le fichier
        file_extension = cv_file.filename.split(".")[-1]
        cv_filename = f"{uuid.uuid4()}.{file_extension}"
        cv_path = os.path.join(UPLOAD_DIR, cv_filename)
        
        # Sauvegarder le fichier
        with open(cv_path, "wb") as buffer:
            content = await cv_file.read()
            buffer.write(content)
        
        cv_url = f"/cv/{cv_filename}"
    
    # Créer la candidature
    application = JobApplication(
        job_offer_id=job_offer_id,
        first_name=first_name,
        last_name=last_name,
        email=email,
        phone=phone,
        cover_letter=cover_letter,
        cv_filename=cv_filename,
        cv_url=cv_url
    )
    
    db.add(application)
    db.commit()
    db.refresh(application)
    
    # Ajouter les informations de l'offre
    application.job_title = job_offer.title
    application.company_name = job_offer.company
    
    return application

# Routes admin protégées
@router.get("/", response_model=List[JobApplicationResponse])
async def get_job_applications(
    job_offer_id: Optional[int] = None,
    status: Optional[str] = None,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Récupérer toutes les candidatures (admin seulement)"""
    if not current_admin.is_super_admin:
        raise HTTPException(status_code=403, detail="Accès réservé aux super admins")
    
    query = db.query(JobApplication).join(JobOffer)
    
    if job_offer_id:
        query = query.filter(JobApplication.job_offer_id == job_offer_id)
    
    if status:
        query = query.filter(JobApplication.status == status)
    
    applications = query.order_by(JobApplication.created_at.desc()).all()
    
    # Ajouter les informations des offres
    for app in applications:
        app.job_title = app.job_offer.title
        app.company_name = app.job_offer.company
    
    return applications

@router.get("/{application_id}", response_model=JobApplicationResponse)
async def get_job_application(
    application_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Récupérer une candidature spécifique (admin seulement)"""
    if not current_admin.is_super_admin:
        raise HTTPException(status_code=403, detail="Accès réservé aux super admins")
    
    application = db.query(JobApplication).filter(
        JobApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidature non trouvée"
        )
    
    application.job_title = application.job_offer.title
    application.company_name = application.job_offer.company
    
    return application

@router.put("/{application_id}", response_model=JobApplicationResponse)
async def update_job_application(
    application_id: int,
    application_data: JobApplicationUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Mettre à jour une candidature (admin seulement)"""
    if not current_admin.is_super_admin:
        raise HTTPException(status_code=403, detail="Accès réservé aux super admins")
    
    application = db.query(JobApplication).filter(
        JobApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidature non trouvée"
        )
    
    # Mettre à jour les champs modifiés
    update_data = application_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(application, field, value)
    
    application.updated_at = datetime.now()
    db.commit()
    db.refresh(application)
    
    application.job_title = application.job_offer.title
    application.company_name = application.job_offer.company
    
    return application

@router.delete("/{application_id}")
async def delete_job_application(
    application_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Supprimer une candidature (admin seulement)"""
    if not current_admin.is_super_admin:
        raise HTTPException(status_code=403, detail="Accès réservé aux super admins")
    
    application = db.query(JobApplication).filter(
        JobApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidature non trouvée"
        )
    
    # Supprimer le fichier CV s'il existe
    if application.cv_filename:
        cv_path = os.path.join(UPLOAD_DIR, application.cv_filename)
        if os.path.exists(cv_path):
            os.remove(cv_path)
    
    db.delete(application)
    db.commit()
    
    return {"message": "Candidature supprimée avec succès"}
