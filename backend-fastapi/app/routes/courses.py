"""
Routes pour la gestion des cours
"""

from typing import List
import re
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
import secrets
import string

from app.database import get_db
from app.models import Admin, Course, Video, Student, CourseAccess
from app.schemas import (
    CourseCreate, CourseUpdate, CourseResponse,
    VideoCreate, VideoUpdate, VideoResponse,
    StudentCreate, StudentUpdate, StudentResponse,
    CourseAccessCreate, CourseAccessResponse, GenerateAccessLink
)
from app.security import get_current_admin

router = APIRouter()

def extract_drive_file_id(url):
    """Extraire l'ID de fichier Google Drive d'une URL"""
    # Gérer différents formats d'URL Google Drive
    patterns = [
        r'(?:https?:\/\/)?(?:www\.)?drive\.google\.com\/file\/d\/([^\/\?]+)',  # Format /file/d/{id}
        r'(?:https?:\/\/)?(?:www\.)?drive\.google\.com\/open\?id=([^&]+)',     # Format ?id={id}
        r'(?:https?:\/\/)?(?:docs|drive)\.google\.com\/(?:a\/[^\/]+\/)?(?:uc)\?(?:.+&)?id=([^&]+)', # Format ?id={id} pour uc
        r'(?:https?:\/\/)?(?:www\.)?drive\.google\.com\/(?:a\/[^\/]+\/)?(?:u\/\d+\/)?(?:uc)\?(?:.+&)?id=([^&]+)'  
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    
    return None

def generate_access_code():
    """Générer un code d'accès unique"""
    return ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(8))

def generate_access_token():
    """Générer un token d'accès unique"""
    return secrets.token_urlsafe(32)

# ==================== GESTION DES COURS ====================

@router.get("/", response_model=List[CourseResponse])
async def get_courses(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Récupérer tous les cours de l'admin"""
    courses = db.query(Course).filter(Course.admin_id == current_admin.id).all()
    
    # Ajouter les compteurs
    for course in courses:
        course.video_count = db.query(Video).filter(Video.course_id == course.id).count()
        course.student_count = len(course.students)
    
    return courses

@router.post("/", response_model=CourseResponse)
async def create_course(
    course: CourseCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Créer un nouveau cours"""
    # Générer un code d'accès unique
    access_code = generate_access_code()
    
    # Vérifier que le code est unique
    while db.query(Course).filter(Course.access_code == access_code).first():
        access_code = generate_access_code()
    
    db_course = Course(
        **course.dict(),
        access_code=access_code,
        admin_id=current_admin.id
    )
    
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    
    # Ajouter les compteurs
    db_course.video_count = 0
    db_course.student_count = 0
    
    return db_course

@router.get("/{course_id}", response_model=CourseResponse)
async def get_course(
    course_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Récupérer un cours spécifique"""
    course = db.query(Course).filter(
        Course.id == course_id,
        Course.admin_id == current_admin.id
    ).first()
    
    if not course:
        raise HTTPException(status_code=404, detail="Cours non trouvé")
    
    # Ajouter les compteurs
    course.video_count = db.query(Video).filter(Video.course_id == course.id).count()
    course.student_count = len(course.students)
    
    return course

@router.put("/{course_id}", response_model=CourseResponse)
async def update_course(
    course_id: int,
    course_update: CourseUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Mettre à jour un cours"""
    course = db.query(Course).filter(
        Course.id == course_id,
        Course.admin_id == current_admin.id
    ).first()
    
    if not course:
        raise HTTPException(status_code=404, detail="Cours non trouvé")
    
    for field, value in course_update.dict(exclude_unset=True).items():
        setattr(course, field, value)
    
    db.commit()
    db.refresh(course)
    
    return course

@router.delete("/{course_id}")
async def delete_course(
    course_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Supprimer un cours"""
    course = db.query(Course).filter(
        Course.id == course_id,
        Course.admin_id == current_admin.id
    ).first()
    
    if not course:
        raise HTTPException(status_code=404, detail="Cours non trouvé")
    
    db.delete(course)
    db.commit()
    
    return {"message": "Cours supprimé avec succès"}

# ==================== GESTION DES VIDÉOS ====================

@router.get("/{course_id}/videos", response_model=List[VideoResponse])
async def get_course_videos(
    course_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Récupérer toutes les vidéos d'un cours"""
    # Vérifier que le cours appartient à l'admin
    course = db.query(Course).filter(
        Course.id == course_id,
        Course.admin_id == current_admin.id
    ).first()
    
    if not course:
        raise HTTPException(status_code=404, detail="Cours non trouvé")
    
    videos = db.query(Video).filter(Video.course_id == course_id).order_by(Video.order_in_course).all()
    return videos

@router.post("/{course_id}/videos", response_model=VideoResponse)
async def add_video_to_course(
    course_id: int,
    video: VideoCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Ajouter une vidéo à un cours"""
    # Vérifier que le cours appartient à l'admin
    course = db.query(Course).filter(
        Course.id == course_id,
        Course.admin_id == current_admin.id
    ).first()
    
    if not course:
        raise HTTPException(status_code=404, detail="Cours non trouvé")
    
    # Extraire l'ID Google Drive de l'URL
    drive_file_id = extract_drive_file_id(video.drive_url)
    if not drive_file_id:
        raise HTTPException(status_code=400, detail="URL Google Drive invalide")
    
    # Générer une URL de miniature par défaut (en pratique, il faudrait implémenter une solution pour extraire une vignette)
    # Pour l'instant, on utilise une image par défaut
    thumbnail_url = f"https://drive.google.com/thumbnail?id={drive_file_id}"
    
    db_video = Video(
        title=video.title,
        description=video.description,
        drive_url=video.drive_url,
        drive_file_id=drive_file_id,
        thumbnail_url=thumbnail_url,
        duration=video.duration,
        order_in_course=video.order_in_course,
        is_free=video.is_free,
        module_name=video.module_name,
        course_id=course_id,
        admin_id=current_admin.id
    )
    
    db.add(db_video)
    db.commit()
    db.refresh(db_video)
    
    return db_video

# ==================== GESTION DES ACCÈS ====================

@router.post("/{course_id}/access", response_model=CourseAccessResponse)
async def grant_course_access(
    course_id: int,
    access_data: CourseAccessCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Donner accès à un cours à un étudiant par email"""
    # Vérifier que le cours appartient à l'admin
    course = db.query(Course).filter(
        Course.id == course_id,
        Course.admin_id == current_admin.id
    ).first()
    
    if not course:
        raise HTTPException(status_code=404, detail="Cours non trouvé")
    
    # Trouver ou créer l'étudiant
    student = db.query(Student).filter(Student.email == access_data.student_email).first()
    if not student:
        student = Student(
            name=access_data.student_email.split('@')[0],
            email=access_data.student_email
        )
        db.add(student)
        db.commit()
        db.refresh(student)
    
    # Vérifier si l'accès existe déjà
    existing_access = db.query(CourseAccess).filter(
        CourseAccess.student_id == student.id,
        CourseAccess.course_id == course_id,
        CourseAccess.is_active == True
    ).first()
    
    if existing_access:
        raise HTTPException(status_code=400, detail="L'étudiant a déjà accès à ce cours")
    
    # Créer l'accès
    from datetime import datetime, timedelta
    
    access_token = generate_access_token()
    expires_at = datetime.utcnow() + timedelta(days=access_data.expires_days or 30)
    
    db_access = CourseAccess(
        student_id=student.id,
        course_id=course_id,
        access_type=access_data.access_type,
        access_token=access_token,
        expires_at=expires_at
    )
    
    db.add(db_access)
    db.commit()
    db.refresh(db_access)
    
    # Ajouter les infos supplémentaires
    db_access.student_name = student.name
    db_access.student_email = student.email
    db_access.course_title = course.title
    
    return db_access

@router.post("/{course_id}/generate-link")
async def generate_course_access_link(
    course_id: int,
    link_data: GenerateAccessLink,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Générer un lien d'accès public pour un cours"""
    # Vérifier que le cours appartient à l'admin
    course = db.query(Course).filter(
        Course.id == course_id,
        Course.admin_id == current_admin.id
    ).first()
    
    if not course:
        raise HTTPException(status_code=404, detail="Cours non trouvé")
    
    # Générer le token d'accès
    access_token = generate_access_token()
    
    from datetime import datetime, timedelta
    expires_at = datetime.utcnow() + timedelta(days=link_data.expires_days or 30)
    
    # Créer l'accès générique (sans étudiant spécifique)
    db_access = CourseAccess(
        student_id=None,  # Accès générique
        course_id=course_id,
        access_type=link_data.access_type,
        access_token=access_token,
        expires_at=expires_at
    )
    
    db.add(db_access)
    db.commit()
    db.refresh(db_access)
    
    # Générer l'URL d'accès
    base_url = "http://localhost:3000"  # À adapter selon ton domaine
    
    if link_data.access_type == "link":
        access_url = f"{base_url}/course/access/{access_token}"
    else:  # code
        access_url = f"{base_url}/course/join"
        
    return {
        "access_token": access_token,
        "access_url": access_url,
        "access_code": course.access_code if link_data.access_type == "code" else None,
        "expires_at": expires_at,
        "course_title": course.title
    }

@router.get("/{course_id}/accesses", response_model=List[CourseAccessResponse])
async def get_course_accesses(
    course_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Récupérer tous les accès d'un cours"""
    # Vérifier que le cours appartient à l'admin
    course = db.query(Course).filter(
        Course.id == course_id,
        Course.admin_id == current_admin.id
    ).first()
    
    if not course:
        raise HTTPException(status_code=404, detail="Cours non trouvé")
    
    accesses = db.query(CourseAccess).filter(CourseAccess.course_id == course_id).all()
    
    # Ajouter les infos supplémentaires
    for access in accesses:
        if access.student_id:
            student = db.query(Student).filter(Student.id == access.student_id).first()
            if student:
                access.student_name = student.name
                access.student_email = student.email
        access.course_title = course.title
    
    return accesses
