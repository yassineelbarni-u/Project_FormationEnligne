from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import GratuitCourse, Admin
from app.security import get_current_admin
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

# Pydantic models
class GratuitCourseCreate(BaseModel):
    title: str
    url: str
    description: str = None
    category: str = "cours"  # "cours" ou "concours"

class GratuitCourseUpdate(BaseModel):
    title: str = None
    url: str = None
    description: str = None
    category: str = None

class GratuitCourseResponse(BaseModel):
    id: int
    title: str
    url: str
    description: str
    category: str
    admin_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

@router.get("/", response_model=List[GratuitCourseResponse])
async def get_all_cours_gratuits(
    skip: int = 0,
    limit: int = 100,
    category: str = None,
    db: Session = Depends(get_db)
):
    """Récupérer tous les cours gratuits (public)"""
    query = db.query(GratuitCourse)
    if category:
        query = query.filter(GratuitCourse.category == category)
    
    cours = query.offset(skip).limit(limit).all()
    return cours

@router.get("/admin", response_model=List[GratuitCourseResponse])
async def get_admin_cours_gratuits(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    if not current_admin.is_super_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé aux super admins"
        )
    cours = db.query(GratuitCourse).offset(skip).limit(limit).all()
    return cours

@router.post("/", response_model=GratuitCourseResponse)
async def create_cours_gratuit(
    cours_data: GratuitCourseCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    if not current_admin.is_super_admin:
        raise HTTPException(status_code=403, detail="Accès réservé aux super admins")
    """Créer un nouveau cours gratuit"""
    db_cours = GratuitCourse(
        title=cours_data.title,
        url=cours_data.url,
        description=cours_data.description,
        category=cours_data.category,
        admin_id=current_admin.id
    )
    
    db.add(db_cours)
    db.commit()
    db.refresh(db_cours)
    return db_cours

@router.put("/{cours_id}", response_model=GratuitCourseResponse)
async def update_cours_gratuit(
    cours_id: int,
    cours_data: GratuitCourseUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    if not current_admin.is_super_admin:
        raise HTTPException(status_code=403, detail="Accès réservé aux super admins")
    """Mettre à jour un cours gratuit"""
    db_cours = db.query(GratuitCourse).filter(GratuitCourse.id == cours_id).first()
    
    if not db_cours:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cours gratuit non trouvé"
        )
    
    # Mettre à jour les champs modifiés
    for field, value in cours_data.dict(exclude_unset=True).items():
        setattr(db_cours, field, value)
    
    db.commit()
    db.refresh(db_cours)
    return db_cours

@router.delete("/{cours_id}")
async def delete_cours_gratuit(
    cours_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    if not current_admin.is_super_admin:
        raise HTTPException(status_code=403, detail="Accès réservé aux super admins")
    """Supprimer un cours gratuit"""
    db_cours = db.query(GratuitCourse).filter(GratuitCourse.id == cours_id).first()
    
    if not db_cours:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cours gratuit non trouvé"
        )
    
    db.delete(db_cours)
    db.commit()
    return {"message": "Cours gratuit supprimé avec succès"}

@router.get("/{cours_id}", response_model=GratuitCourseResponse)
async def get_cours_gratuit(
    cours_id: int,
    db: Session = Depends(get_db)
):
    """Récupérer un cours gratuit par ID"""
    cours = db.query(GratuitCourse).filter(GratuitCourse.id == cours_id).first()
    
    if not cours:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cours gratuit non trouvé"
        )
    
    return cours
