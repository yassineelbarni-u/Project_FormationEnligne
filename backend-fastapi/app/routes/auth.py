"""
Routes d'authentification - Version complète avec Google OAuth
"""
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel
import os
from jose import JWTError, jwt
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from app.database import get_db
from app.models import Admin, Student, CourseAccess
from app.schemas import AdminLogin, Token, AdminResponse
from app.security import verify_password, create_access_token, get_current_admin

router = APIRouter()
security = HTTPBearer()

# Configuration Google
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

# Modèles pour Google OAuth
class GoogleLoginRequest(BaseModel):
    credential: str

class StudentLoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict

# ========== ROUTES ADMIN ==========

@router.post("/login", response_model=Token)
async def login_admin(admin_data: AdminLogin, db: Session = Depends(get_db)):
    """
    Connexion administrateur
    """
    admin = db.query(Admin).filter(Admin.email == admin_data.email).first()
    
    if not admin or not verify_password(admin_data.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
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
    Vérifier le token admin
    """
    return {
        "message": "Token valide",
        "user": {
            "id": current_admin.id,
            "email": current_admin.email,
            "name": current_admin.name
        }
    }

@router.get("/me", response_model=AdminResponse)
async def get_current_user(current_admin: Admin = Depends(get_current_admin)):
    """
    Récupérer les infos de l'admin connecté
    """
    return current_admin

# ========== ROUTES GOOGLE OAUTH ==========

@router.post("/google-login", response_model=StudentLoginResponse)
async def google_login(request: GoogleLoginRequest, db: Session = Depends(get_db)):
    """
    Connexion étudiant via Google Sign-In
    """
    try:
        print(f"🔍 Reçu credential Google: {request.credential[:50]}...")
        
        # Vérifier le token Google
        idinfo = id_token.verify_oauth2_token(
            request.credential,
            google_requests.Request(),
            GOOGLE_CLIENT_ID
        )
        
        # Récupérer les infos utilisateur
        google_email = idinfo.get('email')
        google_name = idinfo.get('name', google_email.split('@')[0] if google_email else 'Étudiant')
        google_picture = idinfo.get('picture', '')
        
        print(f"✅ Token Google valide pour: {google_email}")
        
        if not google_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email non trouvé dans le token Google"
            )
        
        # Vérifier que l'étudiant existe dans la base de données
        student = db.query(Student).filter(
            Student.email == google_email, 
            Student.is_active == True
        ).first()
        
        if not student:
            print(f"❌ Email {google_email} non trouvé dans la BDD")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email non autorisé. Contactez votre formateur pour obtenir l'accès."
            )
        
        # Mettre à jour le nom si Google en a un meilleur
        if google_name and (not student.name or len(google_name) > len(student.name or "")):
            student.name = google_name
            db.commit()
        
        # Vérifier que l'étudiant a au moins un accès à un cours
        active_accesses = db.query(CourseAccess).filter(
            CourseAccess.student_id == student.id,
            CourseAccess.is_active == True,
            CourseAccess.expires_at > datetime.utcnow()
        ).count()
        
        if active_accesses == 0:
            print(f"❌ Aucun cours actif pour {student.name}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Aucun cours accessible. Vos accès ont peut-être expiré."
            )
        
        # Créer le token d'accès JWT
        access_token_expires = timedelta(days=30)
        access_token = create_access_token(
            data={"sub": str(student.id), "email": google_email, "type": "student"},
            expires_delta=access_token_expires
        )
        
        print(f"✅ Connexion réussie pour {student.name}")
        
        return StudentLoginResponse(
            access_token=access_token,
            token_type="bearer",
            user={
                "id": student.id,
                "name": student.name or google_name,
                "email": student.email,
                "level": getattr(student, 'level', 'Étudiant'),
                "profile_picture": google_picture
            }
        )
        
    except ValueError as e:
        print(f"❌ Token Google invalide: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token Google invalide"
        )
    except Exception as e:
        print(f"❌ Erreur serveur: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur interne: {str(e)}"
        )

@router.get("/google-test")
async def test_google_config():
    """
    Route de test pour vérifier la configuration Google
    """
    return {
        "message": "Configuration Google OK",
        "client_id": GOOGLE_CLIENT_ID[:20] + "..." if GOOGLE_CLIENT_ID else "NON CONFIGURÉ",
        "client_id_configured": bool(GOOGLE_CLIENT_ID)
    }
