"""
Routes d'administration pour les témoignages
"""

from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, asc

from app.database import get_db
from app.models import Admin, Testimonial
from app.schemas_testimonials import (
    TestimonialCreate, 
    TestimonialUpdate, 
    TestimonialResponse, 
    TestimonialStats
)
from app.security import get_current_admin

router = APIRouter()

@router.get("/", response_model=List[TestimonialResponse])
async def get_all_testimonials(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    is_active: Optional[bool] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = Query("created_at", regex="^(created_at|nom|ecole|rating)$"),
    sort_order: Optional[str] = Query("desc", regex="^(asc|desc)$"),
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Récupérer tous les témoignages avec filtres et pagination
    """
    query = db.query(Testimonial)
    
    # Filtre par statut actif/inactif
    if is_active is not None:
        query = query.filter(Testimonial.is_active == is_active)
    
    # Recherche par nom, école ou commentaire
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            Testimonial.nom.ilike(search_term) |
            Testimonial.ecole.ilike(search_term) |
            Testimonial.comment.ilike(search_term)
        )
    
    # Tri
    if sort_order == "desc":
        query = query.order_by(desc(getattr(Testimonial, sort_by)))
    else:
        query = query.order_by(asc(getattr(Testimonial, sort_by)))
    
    # Pagination
    testimonials = query.offset(skip).limit(limit).all()
    
    return testimonials

@router.get("/stats", response_model=TestimonialStats)
async def get_testimonial_stats(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Obtenir les statistiques des témoignages
    """
    total_testimonials = db.query(Testimonial).count()
    active_testimonials = db.query(Testimonial).filter(Testimonial.is_active == True).count()
    
    # Moyenne des notes
    avg_rating = db.query(func.avg(Testimonial.rating)).filter(Testimonial.is_active == True).scalar()
    avg_rating = round(float(avg_rating or 0), 2)
    
    # Témoignages récents (30 derniers jours)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_testimonials = db.query(Testimonial).filter(
        Testimonial.created_at >= thirty_days_ago
    ).count()
    
    return TestimonialStats(
        total_testimonials=total_testimonials,
        active_testimonials=active_testimonials,
        average_rating=avg_rating,
        recent_testimonials=recent_testimonials
    )

@router.get("/{testimonial_id}", response_model=TestimonialResponse)
async def get_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Récupérer un témoignage spécifique
    """
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Témoignage non trouvé"
        )
    return testimonial


@router.put("/{testimonial_id}", response_model=TestimonialResponse)
async def update_testimonial(
    testimonial_id: int,
    testimonial_data: TestimonialUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Modifier un témoignage existant
    """
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Témoignage non trouvé"
        )
    
    try:
        # Mise à jour des champs modifiés uniquement
        update_data = testimonial_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(testimonial, field, value)
        
        testimonial.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(testimonial)
        
        return testimonial
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la modification du témoignage: {str(e)}"
        )

@router.delete("/{testimonial_id}")
async def delete_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Supprimer un témoignage
    """
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Témoignage non trouvé"
        )
    
    try:
        db.delete(testimonial)
        db.commit()
        
        return {"message": f"Témoignage '{testimonial.nom}' supprimé avec succès"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la suppression du témoignage: {str(e)}"
        )

@router.put("/{testimonial_id}/toggle-status")
async def toggle_testimonial_status(
    testimonial_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Activer/désactiver un témoignage
    """
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Témoignage non trouvé"
        )
    
    try:
        testimonial.is_active = not testimonial.is_active
        testimonial.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(testimonial)
        
        status_text = "activé" if testimonial.is_active else "désactivé"
        return {"message": f"Témoignage '{testimonial.nom}' {status_text} avec succès"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la modification du statut: {str(e)}"
        )