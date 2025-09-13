"""
Routes publiques pour les témoignages
"""

from typing import List
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models import Testimonial
from app.schemas_testimonials import TestimonialPublic, TestimonialCreate

router = APIRouter()

@router.get("/active", response_model=List[TestimonialPublic])
async def get_active_testimonials(
    limit: int = Query(10, ge=1, le=50, description="Nombre de témoignages à récupérer"),
    db: Session = Depends(get_db)
):
    """
    Récupérer les témoignages actifs pour l'affichage public
    Triés par date de création (plus récents en premier)
    """
    testimonials = db.query(Testimonial).filter(
        Testimonial.is_active == True
    ).order_by(desc(Testimonial.created_at)).limit(limit).all()
    
    return testimonials

@router.get("/featured", response_model=List[TestimonialPublic])
async def get_featured_testimonials(
    limit: int = Query(6, ge=1, le=20, description="Nombre de témoignages mis en avant"),
    db: Session = Depends(get_db)
):
    """
    Récupérer les témoignages les mieux notés et les plus récents
    Pour la section mise en avant sur la page d'accueil
    """
    testimonials = db.query(Testimonial).filter(
        Testimonial.is_active == True
    ).filter(
        Testimonial.rating >= 4  # Seulement les témoignages avec note >= 4
    ).order_by(
        desc(Testimonial.rating),  # D'abord par note
        desc(Testimonial.created_at)  # Puis par date
    ).limit(limit).all()
    
    return testimonials


@router.post("/submit", response_model=dict, status_code=status.HTTP_201_CREATED)
def submit_testimonial(
    testimonial: TestimonialCreate,
    db: Session = Depends(get_db)
):
    """
    Permettre au public de soumettre un témoignage
    Les témoignages sont actifs immédiatement et visibles sur le site
    """
    try:
        # Créer le témoignage avec is_active = True par défaut
        new_testimonial = Testimonial(
            nom=testimonial.nom,
            ecole=testimonial.ecole,
            comment=testimonial.comment,
            rating=testimonial.rating or 5,  # Note par défaut de 5
            is_active=True,  # ACTIF IMMÉDIATEMENT - visible sur le site
            admin_id=None  # Pas d'admin associé car créé par le public
        )
        
        db.add(new_testimonial)
        db.commit()
        db.refresh(new_testimonial)
        
        return {
            "message": "Témoignage publié avec succès ! Il est maintenant visible sur le site.",
            "status": "published",
            "testimonial_id": new_testimonial.id
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la soumission du témoignage"
        )