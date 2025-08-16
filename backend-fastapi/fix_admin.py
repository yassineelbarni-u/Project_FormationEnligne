"""
Script pour corriger/recréer l'admin avec le bon mot de passe
"""

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import Base, Admin
from app.security import get_password_hash, verify_password

def fix_admin():
    print("🔧 CORRECTION ADMIN - DÉBUT")
    print("="*50)
    
    # Créer les tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        target_email = "admin@ilyasnahi.com"
        target_password = "admin123"
        
        # Supprimer l'ancien admin s'il existe
        print("1️⃣ Suppression ancien admin...")
        old_admin = db.query(Admin).filter(Admin.email == target_email).first()
        if old_admin:
            db.delete(old_admin)
            db.commit()
            print("✅ Ancien admin supprimé")
        
        # Créer le nouveau hash
        print("2️⃣ Création nouveau hash...")
        new_hash = get_password_hash(target_password)
        print(f"🔐 Nouveau hash: {new_hash[:50]}...")
        
        # Tester le hash immédiatement
        test_result = verify_password(target_password, new_hash)
        print(f"🧪 Test hash: {test_result}")
        
        if not test_result:
            print("❌ ERREUR: Le hash ne fonctionne pas!")
            return
        
        # Créer le nouvel admin
        print("3️⃣ Création nouvel admin...")
        new_admin = Admin(
            email=target_email,
            name="Ilyas Nahi",
            hashed_password=new_hash,
            is_active=True
        )
        
        db.add(new_admin)
        db.commit()
        db.refresh(new_admin)
        
        print(f"✅ Admin créé avec ID: {new_admin.id}")
        
        # Test final
        print("4️⃣ Test final...")
        final_admin = db.query(Admin).filter(Admin.email == target_email).first()
        final_test = verify_password(target_password, final_admin.hashed_password)
        
        print(f"🎯 Test final: {final_test}")
        
        if final_test:
            print("🎉 SUCCÈS! Admin corrigé et testé")
        else:
            print("❌ ÉCHEC! Problème persistant")
    
    except Exception as e:
        print(f"💥 Erreur: {e}")
        db.rollback()
    
    finally:
        db.close()
    
    print("="*50)
    print("🔧 CORRECTION ADMIN - FIN")

if __name__ == "__main__":
    fix_admin()
