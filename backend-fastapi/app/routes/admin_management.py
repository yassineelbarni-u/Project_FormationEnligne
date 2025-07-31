""" Routes pour la gestion des administrateurs - Réservé au Super Admin """

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Admin
from app.schemas import AdminCreate, AdminUpdate, AdminResponse
from app.security import get_current_admin, get_password_hash

router = APIRouter()

def verify_super_admin(current_admin: Admin = Depends(get_current_admin)):
    """Vérifier que l'utilisateur actuel est un super admin"""
    if not current_admin.is_super_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès refusé. Seuls les super administrateurs peuvent gérer les admins."
        )
    return current_admin

@router.get("/", response_model=List[AdminResponse])
async def get_all_admins(
    current_admin: Admin = Depends(verify_super_admin),
    db: Session = Depends(get_db)
):
    """Récupérer tous les administrateurs"""
    admins = db.query(Admin).all()
    return admins

@router.post("/", response_model=AdminResponse)
async def create_admin(
    admin_data: AdminCreate,
    current_admin: Admin = Depends(verify_super_admin),
    db: Session = Depends(get_db)
):
    """Créer un nouvel administrateur"""
    
    # Vérifier si l'email existe déjà
    existing_admin = db.query(Admin).filter(Admin.email == admin_data.email).first()
    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Un administrateur avec cet email existe déjà"
        )
    
    # Créer le nouvel admin
    hashed_password = get_password_hash(admin_data.password)
    
    db_admin = Admin(
        email=admin_data.email,
        name=admin_data.name,
        hashed_password=hashed_password,
        is_super_admin=admin_data.is_super_admin,
        is_active=True
    )
    
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    
    return db_admin

@router.get("/{admin_id}", response_model=AdminResponse)
async def get_admin(
    admin_id: int,
    current_admin: Admin = Depends(verify_super_admin),
    db: Session = Depends(get_db)
):
    """Récupérer un administrateur spécifique"""
    admin = db.query(Admin).filter(Admin.id == admin_id).first()
    
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Administrateur non trouvé"
        )
    
    return admin

@router.put("/{admin_id}", response_model=AdminResponse)
async def update_admin(
    admin_id: int,
    admin_data: AdminUpdate,
    current_admin: Admin = Depends(verify_super_admin),
    db: Session = Depends(get_db)
):
    """Mettre à jour un administrateur"""
    admin = db.query(Admin).filter(Admin.id == admin_id).first()
    
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Administrateur non trouvé"
        )
    
    # Empêcher la modification de son propre statut super_admin
    if admin_id == current_admin.id and "is_super_admin" in admin_data.dict(exclude_unset=True):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vous ne pouvez pas modifier votre propre statut de super administrateur"
        )
    
    # Mettre à jour les champs
    update_data = admin_data.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        if field == "password" and value:
            setattr(admin, "hashed_password", get_password_hash(value))
        else:
            setattr(admin, field, value)
    
    db.commit()
    db.refresh(admin)
    
    return admin

@router.delete("/{admin_id}")
async def delete_admin(
    admin_id: int,
    current_admin: Admin = Depends(verify_super_admin),
    db: Session = Depends(get_db)
):
    """Supprimer un administrateur"""
    admin = db.query(Admin).filter(Admin.id == admin_id).first()
    
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Administrateur non trouvé"
        )
    
    # Empêcher la suppression de son propre compte
    if admin_id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vous ne pouvez pas supprimer votre propre compte"
        )
    
    # Vérifier s'il reste au moins un super admin
    if admin.is_super_admin:
        super_admin_count = db.query(Admin).filter(Admin.is_super_admin == True).count()
        if super_admin_count <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Impossible de supprimer le dernier super administrateur"
            )
    
    db.delete(admin)
    db.commit()
    
    return {"message": "Administrateur supprimé avec succès"}

@router.put("/{admin_id}/toggle-status")
async def toggle_admin_status(
    admin_id: int,
    current_admin: Admin = Depends(verify_super_admin),
    db: Session = Depends(get_db)
):
    """Activer/Désactiver un administrateur"""
    admin = db.query(Admin).filter(Admin.id == admin_id).first()
    
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Administrateur non trouvé"
        )
    
    # Empêcher la désactivation de son propre compte
    if admin_id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vous ne pouvez pas désactiver votre propre compte"
        )
    
    admin.is_active = not admin.is_active
    db.commit()
    db.refresh(admin)
    
    status_text = "activé" if admin.is_active else "désactivé"
    return {"message": f"Administrateur {status_text} avec succès"}
