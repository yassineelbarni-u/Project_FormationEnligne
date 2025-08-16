"""
Routes d'authentification - Version propre sans debug
"""

from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Admin
from app.schemas import AdminLogin, Token, AdminResponse
from app.security import verify_password, create_access_token, get_current_admin

router = APIRouter()

@router.post("/login", response_model=Token)
async def login_admin(admin_data: AdminLogin, db: Session = Depends(get_db)):
    """
    Connexion administrateur
    """
    # Chercher l'admin par email
    admin = db.query(Admin).filter(Admin.email == admin_data.email).first()
    
    if not admin or not verify_password(admin_data.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Créer le token JWT
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": admin.email}, 
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": admin.id,
            "email": admin.email,
            "name": admin.name,
            "is_active": admin.is_active
        }
    }

@router.get("/verify")
async def verify_token(current_admin: Admin = Depends(get_current_admin)):
    """
    Vérifier la validité du token
    """
    return {
        "valid": True, 
        "user_id": current_admin.id,
        "email": current_admin.email,
        "name": current_admin.name
    }

@router.get("/me", response_model=AdminResponse)
async def get_current_user(current_admin: Admin = Depends(get_current_admin)):
    """
    Récupérer les infos de l'admin connecté
    """
    return current_admin
