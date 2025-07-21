"""
Routes pour la gestion globale des vidéos
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import Admin, Video, Course
from app.schemas import VideoResponse, VideoUpdate
from app.security import get_current_admin

router = APIRouter()

@router.get("/", response_model=List[VideoResponse])
async def get_all_videos(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Récupérer toutes les vidéos de l'admin"""
    videos = db.query(Video).filter(Video.admin_id == current_admin.id).all()
    return videos

@router.get("/{video_id}", response_model=VideoResponse)
async def get_video(
    video_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Récupérer une vidéo spécifique"""
    video = db.query(Video).filter(
        Video.id == video_id,
        Video.admin_id == current_admin.id
    ).first()
    
    if not video:
        raise HTTPException(status_code=404, detail="Vidéo non trouvée")
    
    return video

@router.put("/{video_id}", response_model=VideoResponse)
async def update_video(
    video_id: int,
    video_update: VideoUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Mettre à jour une vidéo"""
    video = db.query(Video).filter(
        Video.id == video_id,
        Video.admin_id == current_admin.id
    ).first()
    
    if not video:
        raise HTTPException(status_code=404, detail="Vidéo non trouvée")
    
    for field, value in video_update.dict(exclude_unset=True).items():
        setattr(video, field, value)
    
    db.commit()
    db.refresh(video)
    
    return video

@router.delete("/{video_id}")
async def delete_video(
    video_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Supprimer une vidéo"""
    video = db.query(Video).filter(
        Video.id == video_id,
        Video.admin_id == current_admin.id
    ).first()
    
    if not video:
        raise HTTPException(status_code=404, detail="Vidéo non trouvée")
    
    db.delete(video)
    db.commit()
    
    return {"message": "Vidéo supprimée avec succès"}

@router.get("/stats/summary")
async def get_video_stats(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Statistiques des vidéos"""
    total_videos = db.query(Video).filter(Video.admin_id == current_admin.id).count()
    
    videos_by_course = db.query(
        Course.title,
        func.count(Video.id).label('video_count')
    ).join(Video).filter(
        Video.admin_id == current_admin.id
    ).group_by(Course.id, Course.title).all()
    
    return {
        "total_videos": total_videos,
        "videos_by_course": [
            {"course": course, "count": count} 
            for course, count in videos_by_course
        ]
    }
