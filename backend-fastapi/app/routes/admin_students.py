"""
Routes pour l'administration des étudiants
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import Admin, Student, Course, CourseAccess
from app.schemas import StudentCreate, StudentUpdate, StudentResponse
from app.security import get_current_admin

router = APIRouter()

@router.get("/", response_model=List[StudentResponse])
async def get_all_students(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Récupérer tous les étudiants
    """
    # Option 1: Récupérer uniquement les étudiants associés aux cours de l'admin
    students_with_courses = (
        db.query(Student)
        .join(Student.courses)
        .filter(Course.admin_id == current_admin.id)
        .distinct()
    )
    
    # Récupérer tous les étudiants (pour afficher même ceux sans cours)
    students = db.query(Student).all()

    # Ajouter le compteur de cours pour chaque étudiant
    for student in students:
        courses_count = db.query(Course).filter(
            Course.students.any(Student.id == student.id),
            Course.admin_id == current_admin.id
        ).count()
        student.courses_count = courses_count
    
    return students

@router.post("/", response_model=StudentResponse)
async def create_student(
    student_data: StudentCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Créer un nouvel étudiant et l'associer à un cours (optionnel)
    """
    # Vérifier si l'email est déjà utilisé
    existing_student = db.query(Student).filter(Student.email == student_data.email).first()
    
    if existing_student:
        db_student = existing_student
    else:
        # Créer le nouvel étudiant
        db_student = Student(
            name=student_data.name,
            email=student_data.email,
            phone=student_data.phone,
            level=student_data.level
        )
        db.add(db_student)
        db.commit()
        db.refresh(db_student)
    
    # Si un cours est spécifié, ajouter l'étudiant au cours
    if hasattr(student_data, 'course_id') and student_data.course_id:
        course = db.query(Course).filter(
            Course.id == student_data.course_id,
            Course.admin_id == current_admin.id
        ).first()
        
        if not course:
            raise HTTPException(status_code=404, detail="Cours non trouvé")
        
        if db_student not in course.students:
            course.students.append(db_student)
            db.commit()
    
    # Ajouter le compteur de cours
    courses_count = db.query(Course).filter(
        Course.students.any(Student.id == db_student.id),
        Course.admin_id == current_admin.id
    ).count()
    db_student.courses_count = courses_count
    
    return db_student

@router.get("/{student_id}", response_model=StudentResponse)
async def get_student(
    student_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Récupérer les détails d'un étudiant
    """
    student = db.query(Student).filter(Student.id == student_id).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Étudiant non trouvé")
    
    # On calcule toujours le nombre de cours associés à cet étudiant pour l'administrateur actuel
    # mais on ne bloque plus l'accès si l'étudiant n'est pas associé à un cours
    courses_count = db.query(Course).filter(
        Course.students.any(Student.id == student_id),
        Course.admin_id == current_admin.id
    ).count()
    
    # Ajout du compteur de cours (même s'il est à 0)
    student.courses_count = courses_count
    
    return student

@router.put("/{student_id}", response_model=StudentResponse)
async def update_student(
    student_id: int,
    student_data: StudentUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Mettre à jour un étudiant
    """
    student = db.query(Student).filter(Student.id == student_id).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Étudiant non trouvé")
    
    # Vérifier que l'étudiant est associé à au moins un cours de l'admin
    courses_count = db.query(Course).filter(
        Course.students.any(Student.id == student_id),
        Course.admin_id == current_admin.id
    ).count()
    
    if courses_count == 0:
        raise HTTPException(status_code=404, detail="Étudiant non associé à vos cours")
    
    # Mettre à jour les champs
    for field, value in student_data.dict(exclude_unset=True).items():
        if value is not None:
            setattr(student, field, value)
    
    db.commit()
    db.refresh(student)
    
    student.courses_count = courses_count
    
    return student

@router.delete("/{student_id}")
async def delete_student(
    student_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Supprimer un étudiant complètement du système
    """
    student = db.query(Student).filter(Student.id == student_id).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Étudiant non trouvé")
    
    try:
        # Récupérer les cours de l'admin auxquels l'étudiant peut être inscrit
        courses = db.query(Course).filter(
            Course.students.any(Student.id == student_id),
            Course.admin_id == current_admin.id
        ).all()
        
        # Retirer l'étudiant de tous les cours de l'admin s'il y en a
        for course in courses:
            course.students.remove(student)
            
        # Supprimer tous les accès de l'étudiant aux cours
        db.query(CourseAccess).filter(
            CourseAccess.student_id == student_id
        ).delete(synchronize_session=False)
        
        # Supprimer l'étudiant de la base de données
        db.delete(student)
        db.commit()
        
        return {"message": "Étudiant supprimé avec succès"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la suppression de l'étudiant: {str(e)}"
        )
    
    db.commit()
    
    return {"message": "Étudiant retiré avec succès de tous vos cours"}
