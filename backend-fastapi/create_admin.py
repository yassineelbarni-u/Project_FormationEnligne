"""
Script pour créer l'admin par défaut - Version avec vérification
"""

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import Base, Admin
from app.security import get_password_hash

# Créer les tables
Base.metadata.create_all(bind=engine)

def create_default_admin():
    db = SessionLocal()
    
    try:
        print("🔍 Vérification de l'admin existant...")
        
        # Vérifier si l'admin existe déjà
        existing_admin = db.query(Admin).filter(Admin.email == "admin@ilyasnahi.com").first()
        
        if not existing_admin:
            print("➕ Création de l'admin par défaut...")
            admin = Admin(
                email="admin@ilyasnahi.com",
                name="Ilyas Nahi",
                hashed_password=get_password_hash("admin123"),
                is_active=True
            )
            db.add(admin)
            db.commit()
            print("✅ Admin créé avec succès!")
        else:
            print("ℹ️ Admin existe déjà")
        
        # Vérifier tous les admins
        all_admins = db.query(Admin).all()
        print(f"📋 Admins dans la base:")
        for admin in all_admins:
            print(f"   - {admin.name} ({admin.email}) - Actif: {admin.is_active}")
        
        print("\n" + "="*50)
        print("🎯 INFORMATIONS DE CONNEXION:")
        print("="*50)
        print("📧 Email: admin@ilyasnahi.com")
        print("🔑 Mot de passe: admin123")
        print("🌐 Backend: http://localhost:8001")
        print("🎯 Frontend: http://localhost:3000/login")
        print("="*50)
    
    except Exception as e:
        print(f"❌ Erreur: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_default_admin()
