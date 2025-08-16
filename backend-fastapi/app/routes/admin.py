"""
Routes admin avec statistiques des cours et vidéos
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import Admin, Course, Video, Student, CourseAccess
from app.schemas import DashboardStats
from app.security import get_current_admin

router = APIRouter()

@router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Statistiques du dashboard admin"""
    
    # Compter les éléments
    total_courses = db.query(Course).filter(Course.admin_id == current_admin.id).count()
    total_videos = db.query(Video).filter(Video.admin_id == current_admin.id).count()
    total_students = db.query(Student).count()
    total_accesses = db.query(CourseAccess).join(Course).filter(Course.admin_id == current_admin.id).count()
    
    # Activité récente
    recent_courses = db.query(Course).filter(Course.admin_id == current_admin.id).order_by(Course.created_at.desc()).limit(3).all()
    recent_videos = db.query(Video).filter(Video.admin_id == current_admin.id).order_by(Video.created_at.desc()).limit(3).all()
    
    recent_activity = []
    
    # Ajouter les cours récents
    for course in recent_courses:
        student_count = len(course.students)
        recent_activity.append({
            "id": str(course.id),
            "type": "course",
            "title": course.title,
            "date": course.created_at.strftime("%d/%m/%Y"),
            "views": student_count,
            "subject": course.subject
        })
    
    # Ajouter les vidéos récentes
    for video in recent_videos:
        recent_activity.append({
            "id": str(video.id),
            "type": "video",
            "title": video.title,
            "date": video.created_at.strftime("%d/%m/%Y"),
            "views": 0,  # YouTube analytics à implémenter plus tard
            "course_id": video.course_id
        })
    
    # Trier par date
    recent_activity.sort(key=lambda x: x["date"], reverse=True)
    
    return DashboardStats(
        total_courses=total_courses,
        total_videos=total_videos,
        total_students=total_students,
        total_accesses=total_accesses,
        recent_activity=recent_activity[:10]
    )
