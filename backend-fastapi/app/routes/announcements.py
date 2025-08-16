from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid
from datetime import datetime

from app.database import get_db
from app.models import Announcement, Admin
from app.schemas import AnnouncementResponse, AnnouncementUpdate
from app.security import get_current_admin

router = APIRouter()

# Configuration pour l'upload d'images
UPLOAD_DIR = "backend/uploads/images/announcements"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/", response_model=List[AnnouncementResponse])
async def get_announcements(
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    """Récupérer toutes les annonces (publique)"""
    query = db.query(Announcement)
    if active_only:
        query = query.filter(Announcement.is_active == True)
    
    announcements = query.order_by(Announcement.display_order.asc(), Announcement.created_at.desc()).all()
    return announcements

@router.get("/admin", response_model=List[AnnouncementResponse])
async def get_admin_announcements(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Récupérer toutes les annonces pour l'admin"""
    announcements = db.query(Announcement).order_by(Announcement.created_at.desc()).all()
    return announcements

@router.post("/", response_model=AnnouncementResponse)
async def create_announcement(
    display_order: int = Form(0),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Créer une nouvelle annonce"""
    
    # Vérifier le type de fichier
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Le fichier doit être une image")
    
    # Générer un nom de fichier unique
    file_extension = os.path.splitext(image.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Sauvegarder l'image
    try:
        with open(file_path, "wb") as buffer:
            content = await image.read()
            buffer.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la sauvegarde: {str(e)}")
    
    # Créer l'annonce en base
    db_announcement = Announcement(
        image_url=f"/images/announcements/{unique_filename}",
        image_filename=unique_filename,
        display_order=display_order,
        admin_id=current_admin.id
    )
    
    db.add(db_announcement)
    db.commit()
    db.refresh(db_announcement)
    
    return db_announcement

@router.put("/{announcement_id}", response_model=AnnouncementResponse)
async def update_announcement(
    announcement_id: int,
    announcement_update: AnnouncementUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Mettre à jour une annonce"""
    
    db_announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not db_announcement:
        raise HTTPException(status_code=404, detail="Annonce non trouvée")
    
    # Mettre à jour les champs
    for field, value in announcement_update.dict(exclude_unset=True).items():
        setattr(db_announcement, field, value)
    
    db.commit()
    db.refresh(db_announcement)
    
    return db_announcement

@router.delete("/{announcement_id}")
async def delete_announcement(
    announcement_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Supprimer une annonce"""
    
    db_announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not db_announcement:
        raise HTTPException(status_code=404, detail="Annonce non trouvée")
    
    # Supprimer le fichier image
    try:
        file_path = os.path.join(UPLOAD_DIR, db_announcement.image_filename)
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception as e:
        print(f"Erreur lors de la suppression du fichier: {e}")
    
    # Supprimer de la base
    db.delete(db_announcement)
    db.commit()
    
    return {"message": "Annonce supprimée avec succès"}
