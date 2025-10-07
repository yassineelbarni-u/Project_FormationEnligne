"""
Routes pour l'administration des accès aux cours
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
import secrets

from app.database import get_db
from app.models import Admin, Student, Course, CourseAccess
from app.schemas import CourseAccessCreate, CourseAccessResponse, GenerateAccessLink
from app.security import get_current_admin

router = APIRouter()

@router.get("/", response_model=List[CourseAccessResponse])
async def get_all_accesses(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    
    # Obtenir les accès aux cours de l'administrateur
    accesses = (
        db.query(CourseAccess)
        .join(Course)
        .filter(Course.admin_id == current_admin.id)
        .all()
    )
    
    # Enrichir les données pour l'affichage
    for access in accesses:
        # Vérifier si l'étudiant existe encore
        if access.student:
            access.student_name = access.student.name
            access.student_email = access.student.email
            # S'assurer que student_id est défini
            access.student_id = access.student.id
        else:
            access.student_name = "Étudiant supprimé"
            access.student_email = "email inconnu"
            # Utiliser une valeur par défaut pour student_id si l'étudiant est supprimé
            access.student_id = 0
            
        # Vérifier si le cours existe encore
        if access.course:
            access.course_title = access.course.title
            # S'assurer que course_id est défini
            access.course_id = access.course.id
        else:
            access.course_title = "Cours supprimé"
            # Utiliser une valeur par défaut pour course_id si le cours est supprimé
            access.course_id = 0
    
    return accesses

@router.post("/", response_model=CourseAccessResponse)
async def create_access(
    access_data: CourseAccessCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Créer un nouvel accès pour un étudiant à un cours
    """
    # Vérifier que le cours appartient à l'admin
    course = db.query(Course).filter(
        Course.id == access_data.course_id,
        Course.admin_id == current_admin.id
    ).first()
    
    if not course:
        raise HTTPException(status_code=404, detail="Cours non trouvé")
    
    # Vérifier que l'étudiant existe
    student = db.query(Student).filter(Student.id == access_data.student_id).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Étudiant non trouvé")
    
    # Calculer la date d'expiration si nécessaire
    expires_at = None
    if access_data.duration_days:
        expires_at = datetime.utcnow() + timedelta(days=access_data.duration_days)
    
    # Créer le nouvel accès
    db_access = CourseAccess(
        student_id=access_data.student_id,
        course_id=access_data.course_id,
        access_type=access_data.access_type,
        access_token=secrets.token_urlsafe(32),
        expires_at=expires_at,
        is_active=True
    )
    
    db.add(db_access)
    
    if student not in course.students:
        course.students.append(student)
    
    db.commit()
    db.refresh(db_access)
    
    if student:
        db_access.student_name = student.name
        db_access.student_email = student.email
        db_access.student_id = student.id
    else:
        db_access.student_name = "Étudiant supprimé"
        db_access.student_email = "email inconnu"
        db_access.student_id = 0
        
    if course:
        db_access.course_title = course.title
        db_access.course_id = course.id
    else:
        db_access.course_title = "Cours supprimé"
        db_access.course_id = 0
    
    return db_access

@router.get("/{access_id}", response_model=CourseAccessResponse)
async def get_access(
    access_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Récupérer les détails d'un accès
    """
    access = (
        db.query(CourseAccess)
        .join(Course)
        .filter(
            CourseAccess.id == access_id,
            Course.admin_id == current_admin.id
        )
        .first()
    )
    
    if not access:
        raise HTTPException(status_code=404, detail="Accès non trouvé")
    
    if access.student:
        access.student_name = access.student.name
        access.student_email = access.student.email
        access.student_id = access.student.id
    else:
        access.student_name = "Étudiant supprimé"
        access.student_email = "email inconnu"
        access.student_id = 0
        
    if access.course:
        access.course_title = access.course.title
        access.course_id = access.course.id
    else:
        access.course_title = "Cours supprimé"
        access.course_id = 0
    
    return access

@router.put("/{access_id}", response_model=CourseAccessResponse)
async def update_access(
    access_id: int,
    access_data: dict,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Mettre à jour un accès
    """
    access = (
        db.query(CourseAccess)
        .join(Course)
        .filter(
            CourseAccess.id == access_id,
            Course.admin_id == current_admin.id
        )
        .first()
    )
    
    if not access:
        raise HTTPException(status_code=404, detail="Accès non trouvé")
    
    # Mettre à jour les champs fournis
    if "access_type" in access_data:
        access.access_type = access_data["access_type"]
    
    if "is_active" in access_data:
        access.is_active = access_data["is_active"]
    
    if "duration_days" in access_data and access_data["duration_days"]:
        access.expires_at = datetime.utcnow() + timedelta(days=int(access_data["duration_days"]))
    
    db.commit()
    db.refresh(access)
    
    if access.student:
        access.student_name = access.student.name
        access.student_email = access.student.email
        access.student_id = access.student.id
    else:
        access.student_name = "Étudiant supprimé"
        access.student_email = "email inconnu"
        access.student_id = 0
        
    if access.course:
        access.course_title = access.course.title
        access.course_id = access.course.id
    else:
        access.course_title = "Cours supprimé"
        access.course_id = 0
    
    return access

@router.delete("/{access_id}")
async def delete_access(
    access_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Supprimer un accès
    """
    access = (
        db.query(CourseAccess)
        .join(Course)
        .filter(
            CourseAccess.id == access_id,
            Course.admin_id == current_admin.id
        )
        .first()
    )
    
    if not access:
        raise HTTPException(status_code=404, detail="Accès non trouvé")
    
    db.delete(access)
    db.commit()
    
    return {"message": "Accès supprimé avec succès"}
