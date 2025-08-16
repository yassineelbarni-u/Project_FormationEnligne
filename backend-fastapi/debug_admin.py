"""
Script de diagnostic pour vérifier l'admin et le mot de passe
"""

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import Base, Admin
from app.security import get_password_hash, verify_password

def debug_admin():
    print("🔍 DIAGNOSTIC ADMIN - DÉBUT")
    print("="*60)
    
    # Créer les tables si elles n'existent pas
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # 1. Vérifier la connexion à la base de données
        print("1️⃣ Test connexion base de données...")
        try:
            db.execute("SELECT 1")
            print("✅ Connexion DB OK")
        except Exception as e:
            print(f"❌ Erreur DB: {e}")
            return
        
        # 2. Lister tous les admins
        print("\n2️⃣ Liste des admins dans la base:")
        all_admins = db.query(Admin).all()
        if not all_admins:
            print("❌ AUCUN ADMIN TROUVÉ dans la base!")
        else:
            for admin in all_admins:
                print(f"   📧 {admin.email}")
                print(f"   👤 {admin.name}")
                print(f"   🔑 Hash: {admin.hashed_password[:50]}...")
                print(f"   ✅ Actif: {admin.is_active}")
                print(f"   📅 Créé: {admin.created_at}")
                print("   " + "-"*40)
        
        # 3. Chercher l'admin spécifique
        print("\n3️⃣ Recherche admin spécifique:")
        target_email = "admin@ilyasnahi.com"
        admin = db.query(Admin).filter(Admin.email == target_email).first()
        
        if not admin:
            print(f"❌ Admin avec email '{target_email}' NON TROUVÉ!")
            print("🔧 Création de l'admin...")
            
            # Créer l'admin
            new_admin = Admin(
                email=target_email,
                name="Ilyas Nahi",
                hashed_password=get_password_hash("admin123"),
                is_active=True
            )
            db.add(new_admin)
            db.commit()
            db.refresh(new_admin)
            
            print(f"✅ Admin créé avec ID: {new_admin.id}")
            admin = new_admin
        else:
            print(f"✅ Admin trouvé: {admin.name}")
        
        # 4. Tester le mot de passe
        print("\n4️⃣ Test du mot de passe:")
        test_password = "admin123"
        
        print(f"   🔑 Mot de passe testé: '{test_password}'")
        print(f"   🔐 Hash stocké: {admin.hashed_password}")
        
        # Test de vérification
        is_valid = verify_password(test_password, admin.hashed_password)
        print(f"   ✅ Vérification: {is_valid}")
        
        if not is_valid:
            print("❌ PROBLÈME: Le mot de passe ne correspond pas!")
            print("🔧 Régénération du hash...")
            
            # Régénérer le hash
            new_hash = get_password_hash(test_password)
            admin.hashed_password = new_hash
            db.commit()
            
            print(f"✅ Nouveau hash: {new_hash}")
            
            # Re-tester
            is_valid_new = verify_password(test_password, new_hash)
            print(f"✅ Nouvelle vérification: {is_valid_new}")
        
        # 5. Test complet de login
        print("\n5️⃣ Test complet de login:")
        test_admin = db.query(Admin).filter(Admin.email == target_email).first()
        if test_admin and verify_password("admin123", test_admin.hashed_password):
            print("✅ LOGIN TEST RÉUSSI!")
            print(f"   👤 Nom: {test_admin.name}")
            print(f"   📧 Email: {test_admin.email}")
            print(f"   🆔 ID: {test_admin.id}")
        else:
            print("❌ LOGIN TEST ÉCHOUÉ!")
    
    except Exception as e:
        print(f"💥 Erreur générale: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        db.close()
    
    print("\n" + "="*60)
    print("🔍 DIAGNOSTIC ADMIN - FIN")

if __name__ == "__main__":
    debug_admin()
