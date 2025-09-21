from app.database import SessionLocal
from app.models import Admin
from sqlalchemy.orm import Session
from passlib.hash import bcrypt

def create_super_admin():
    db: Session = SessionLocal()
    try:
        # Vérifier si un super admin existe déjà
        super_admin = db.query(Admin).filter(Admin.is_super_admin == True).first()
        if not super_admin:
            # Créer un super admin par défaut
            new_admin = Admin(
                email="admin@e-learning.com",
                name="Super Admin",
                hashed_password=bcrypt.hash("adminpassword"),
                is_super_admin=True,
                is_active=True
            )
            db.add(new_admin)
            db.commit()
            print("Super admin créé avec succès.")
        else:
            print("Un super admin existe déjà.")
    finally:
        db.close()

if __name__ == "__main__":
    create_super_admin()