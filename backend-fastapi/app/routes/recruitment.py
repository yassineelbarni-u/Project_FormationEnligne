"""
Routes API pour la gestion des offres d'emploi
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models import JobOffer, Admin
from app.schemas import JobOfferCreate, JobOfferUpdate, JobOfferResponse
from app.security import get_current_admin

router = APIRouter()

@router.get("/", response_model=List[JobOfferResponse])
async def get_job_offers(
    active_only: bool = False,
    db: Session = Depends(get_db)
):
    """Récupérer toutes les offres d'emploi (public)"""
    query = db.query(JobOffer)
    
    if active_only:
        query = query.filter(JobOffer.is_active == True)
    
    job_offers = query.order_by(JobOffer.created_at.desc()).all()
    
    # Ajouter le nombre de candidatures pour chaque offre
    for offer in job_offers:
        offer.applications_count = len(offer.applications)
    
    return job_offers

@router.get("/{job_offer_id}", response_model=JobOfferResponse)
async def get_job_offer(
    job_offer_id: int,
    db: Session = Depends(get_db)
):
    """Récupérer une offre d'emploi spécifique"""
    job_offer = db.query(JobOffer).filter(JobOffer.id == job_offer_id).first()
    
    if not job_offer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Offre d'emploi non trouvée"
        )
    
    job_offer.applications_count = len(job_offer.applications)
    return job_offer

# Routes admin protégées
@router.post("/", response_model=JobOfferResponse)
async def create_job_offer(
    job_offer_data: JobOfferCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    if not current_admin.is_super_admin:
        raise HTTPException(status_code=403, detail="Accès réservé aux super admins")
    
    """Créer une nouvelle offre d'emploi (admin seulement)"""
    job_offer = JobOffer(
        **job_offer_data.dict(),
        admin_id=current_admin.id
    )
    
    db.add(job_offer)
    db.commit()
    db.refresh(job_offer)
    
    job_offer.applications_count = 0
    return job_offer

@router.put("/{job_offer_id}", response_model=JobOfferResponse)
async def update_job_offer(
    job_offer_id: int,
    job_offer_data: JobOfferUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    if not current_admin.is_super_admin:
        raise HTTPException(status_code=403, detail="Accès réservé aux super admins")
    
    """Mettre à jour une offre d'emploi (admin seulement)"""
    job_offer = db.query(JobOffer).filter(JobOffer.id == job_offer_id).first()
    
    if not job_offer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Offre d'emploi non trouvée"
        )
    
    # Mettre à jour les champs modifiés
    update_data = job_offer_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(job_offer, field, value)
    
    job_offer.updated_at = datetime.now()
    db.commit()
    db.refresh(job_offer)
    
    job_offer.applications_count = len(job_offer.applications)
    return job_offer

@router.delete("/{job_offer_id}")
async def delete_job_offer(
    job_offer_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    if not current_admin.is_super_admin:
        raise HTTPException(status_code=403, detail="Accès réservé aux super admins")
    
    """Supprimer une offre d'emploi (admin seulement)"""
    job_offer = db.query(JobOffer).filter(JobOffer.id == job_offer_id).first()
    
    if not job_offer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Offre d'emploi non trouvée"
        )
    
    # Supprimer d'abord les candidatures associées
    for application in job_offer.applications:
        db.delete(application)
    
    # Puis supprimer l'offre
    db.delete(job_offer)
    db.commit()
    
    return {"message": "Offre d'emploi supprimée avec succès"}

@router.put("/{job_offer_id}/toggle")
async def toggle_job_offer_status(
    job_offer_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    if not current_admin.is_super_admin:
        raise HTTPException(status_code=403, detail="Accès réservé aux super admins")
    
    """Activer/désactiver une offre d'emploi"""
    job_offer = db.query(JobOffer).filter(JobOffer.id == job_offer_id).first()
    
    if not job_offer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Offre d'emploi non trouvée"
        )
    
    job_offer.is_active = not job_offer.is_active
    job_offer.updated_at = datetime.now()
    db.commit()
    
    return {"message": f"Offre {'activée' if job_offer.is_active else 'désactivée'} avec succès"}
