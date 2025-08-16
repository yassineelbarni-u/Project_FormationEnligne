"""
Routes pour la gestion globale des vidéos
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Admin, Video, Course
from app.schemas import VideoResponse
from app.security import get_current_admin

router = APIRouter()

@router.get("/", response_model=List[VideoResponse])
async def get_all_videos(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Récupérer toutes les vidéos de l'admin
    """
    videos = db.query(Video).filter(Video.admin_id == current_admin.id).all()
    return videos

@router.delete("/{video_id}")
async def delete_video(
    video_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Supprimer une vidéo
    """
    video = db.query(Video).filter(
        Video.id == video_id,
        Video.admin_id == current_admin.id
    ).first()
    
    if not video:
        raise HTTPException(status_code=404, detail="Vidéo non trouvée")
    
    db.delete(video)
    db.commit()
    
    return {"message": "Vidéo supprimée avec succès"}
