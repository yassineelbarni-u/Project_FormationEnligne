"""
Schémas Pydantic pour les témoignages
"""

from pydantic import BaseModel, validator
from datetime import datetime
from typing import Optional

# Schéma de base pour les témoignages
class TestimonialBase(BaseModel):
    nom: str
    ecole: str
    comment: str
    rating: Optional[int] = 5
    is_active: Optional[bool] = True

    @validator('rating')
    def validate_rating(cls, v):
        if v is not None and (v < 1 or v > 5):
            raise ValueError('La note doit être entre 1 et 5')
        return v

    @validator('nom', 'ecole')
    def validate_required_fields(cls, v):
        if not v or not v.strip():
            raise ValueError('Ce champ est obligatoire')
        return v.strip()

    @validator('comment')
    def validate_comment(cls, v):
        if not v or not v.strip():
            raise ValueError('Le commentaire est obligatoire')
        return v.strip()

# Schéma pour créer un témoignage
class TestimonialCreate(TestimonialBase):
    pass

# Schéma pour modifier un témoignage
class TestimonialUpdate(BaseModel):
    nom: Optional[str] = None
    ecole: Optional[str] = None
    comment: Optional[str] = None
    rating: Optional[int] = None
    is_active: Optional[bool] = None

    @validator('rating')
    def validate_rating(cls, v):
        if v is not None and (v < 1 or v > 5):
            raise ValueError('La note doit être entre 1 et 5')
        return v

# Schéma de réponse pour un témoignage
class TestimonialResponse(TestimonialBase):
    id: int
    admin_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Schéma pour la liste des témoignages (public)
class TestimonialPublic(BaseModel):
    id: int
    nom: str
    ecole: str
    comment: str
    rating: int
    created_at: datetime

    class Config:
        from_attributes = True

# Schéma pour les statistiques des témoignages
class TestimonialStats(BaseModel):
    total_testimonials: int
    active_testimonials: int
    average_rating: float
    recent_testimonials: int  # Témoignages des 30 derniers jours