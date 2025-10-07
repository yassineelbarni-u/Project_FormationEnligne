"""
Routes pour l'espace étudiant
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime

from app.database import get_db
from app.models import Student, Course, Video, CourseAccess
from app.schemas import StudentLogin, StudentResponse, CourseResponse, VideoResponse
from app.security import verify_password, create_access_token, get_current_student

router = APIRouter()

# AUTHENTIFICATION ETUDIANT
@router.post("/login")
async def login_student(student_data: StudentLogin, db: Session = Depends(get_db)):
    """
    Connexion étudiant avec email et code d'accès
    """
    # Chercher l'etudiant par email
    student = db.query(Student).filter(Student.email == student_data.email).first()

    if not student:
        # En production, l'étudiant doit déjà exister (inscription préalable)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email non trouvé"
        )

    # Vérifier le code d'accès (l'étudiant doit déjà avoir un CourseAccess actif lié à ce code)
    course_access = db.query(CourseAccess).join(Course).filter(
        CourseAccess.student_id == student.id,
        Course.access_code == student_data.access_code,
        CourseAccess.is_active == True,
        CourseAccess.expires_at > datetime.utcnow()
    ).first()

    if not course_access:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Code d'accès invalide"
        )
    
    # Créer le token JWT
    from datetime import timedelta
    access_token_expires = timedelta(hours=24) 
    access_token = create_access_token(
        data={"sub": student.email, "type": "student"}, 
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": student.id,
            "email": student.email,
            "name": student.name,
            "level": student.level
        }
    }

@router.get("/me", response_model=StudentResponse)
async def get_current_student_info(current_student: Student = Depends(get_current_student)):
    """
    Récupérer les infos de l'étudiant connecté
    """
    return current_student

#COURS DE L'ÉTUDIANT 

@router.get("/my-courses", response_model=List[CourseResponse])
async def get_my_courses(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Récupérer tous les cours auxquels l'étudiant a accès
    """
    # Récupérer les cours via les accès actifs
    courses = db.query(Course).join(CourseAccess).filter(
        CourseAccess.student_id == current_student.id,
        CourseAccess.is_active == True,
        CourseAccess.expires_at > datetime.utcnow()
    ).all()
    
    # Ajouter les compteurs pour chaque cours
    for course in courses:
        course.video_count = db.query(Video).filter(Video.course_id == course.id).count()
        course.student_count = len(course.students)
        if course.image_filename:
            course.image_url = f"/api/admin/courses/{course.id}/image"
        else:
            course.image_url = None
    
    return courses

@router.get("/course/{course_id}", response_model=CourseResponse)
async def get_course_details(
    course_id: int,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Récupérer les détails d'un cours spécifique
    """
    # Vérifier que l'étudiant a accès à ce cours
    access = db.query(CourseAccess).filter(
        CourseAccess.student_id == current_student.id,
        CourseAccess.course_id == course_id,
        CourseAccess.is_active == True,
        CourseAccess.expires_at > datetime.utcnow()
    ).first()
    
    if not access:
        raise HTTPException(status_code=403, detail="Accès non autorisé à ce cours")
    
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Cours non trouvé")
    
    # Ajouter les compteurs
    course.video_count = db.query(Video).filter(Video.course_id == course.id).count()
    course.student_count = len(course.students)
    if course.image_filename:
        course.image_url = f"/api/admin/courses/{course.id}/image"
    else:
        course.image_url = None
    
    return course

@router.get("/course/{course_id}/videos", response_model=List[VideoResponse])
async def get_course_videos(
    course_id: int,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Récupérer toutes les vidéos d'un cours
    """
    # Vérifier l'accès
    access = db.query(CourseAccess).filter(
        CourseAccess.student_id == current_student.id,
        CourseAccess.course_id == course_id,
        CourseAccess.is_active == True,
        CourseAccess.expires_at > datetime.utcnow()
    ).first()
    
    if not access:
        raise HTTPException(status_code=403, detail="Accès non autorisé à ce cours")
    
    # Récupérer les vidéos ordonnées
    videos = db.query(Video).filter(
        Video.course_id == course_id
    ).order_by(Video.order_in_course).all()
    
    return videos

#ACCÈS PAR TOKEN/LIEN

@router.get("/access/{access_token}")
async def access_course_by_token(access_token: str, db: Session = Depends(get_db)):
    """
    Accéder à un cours via un token d'accès (lien partagé)
    """
    # Chercher l'accès par token
    access = db.query(CourseAccess).filter(
        CourseAccess.access_token == access_token,
        CourseAccess.is_active == True,
        CourseAccess.expires_at > datetime.utcnow()
    ).first()
    
    if not access:
        raise HTTPException(status_code=404, detail="Lien d'accès invalide ou expiré")
    
    # Récupérer le cours
    course = db.query(Course).filter(Course.id == access.course_id).first()
    
    return {
        "course": {
            "id": course.id,
            "title": course.title,
            "description": course.description,
            "subject": course.subject,
            "level": course.level
        },
        "access_info": {
            "expires_at": access.expires_at,
            "access_type": access.access_type
        },
        "login_required": access.student_id is not None
    }

@router.post("/join-by-code")
async def join_course_by_code(course_code: str, student_email: str, db: Session = Depends(get_db)):
    """
    Rejoindre un cours avec un code d'accès
    """
    # Chercher le cours par code
    course = db.query(Course).filter(Course.access_code == course_code).first()
    
    if not course:
        raise HTTPException(status_code=404, detail="Code de cours invalide")
    
    # Trouver ou créer l'étudiant
    student = db.query(Student).filter(Student.email == student_email).first()
    if not student:
        student = Student(
            name=student_email.split('@')[0],
            email=student_email
        )
        db.add(student)
        db.commit()
        db.refresh(student)
    
    # Vérifier si l'accès existe déjà
    existing_access = db.query(CourseAccess).filter(
        CourseAccess.student_id == student.id,
        CourseAccess.course_id == course.id,
        CourseAccess.is_active == True
    ).first()
    
    if existing_access:
        return {"message": "Vous avez déjà accès à ce cours", "course_id": course.id}
    
    # Créer l'accès
    from datetime import timedelta
    import secrets
    
    new_access = CourseAccess(
        student_id=student.id,
        course_id=course.id,
        access_type="code",
        access_token=secrets.token_urlsafe(32),
        expires_at=datetime.utcnow() + timedelta(days=365)
    )
    
    db.add(new_access)
    db.commit()
    
    return {
        "message": "Accès accordé avec succès",
        "course": {
            "id": course.id,
            "title": course.title,
            "subject": course.subject
        }
    }
