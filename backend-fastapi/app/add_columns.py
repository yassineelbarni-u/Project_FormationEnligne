"""
Script pour ajouter manuellement les colonnes à la table announcements
"""

from sqlalchemy import create_engine, text
from app.database import DATABASE_URL

def add_columns():
    # Créer la connexion à la base de données
    engine = create_engine(DATABASE_URL)
    
    # Commandes SQL pour ajouter les colonnes
    commands = [
        "ALTER TABLE announcements ADD COLUMN IF NOT EXISTS title VARCHAR(255)",
        "ALTER TABLE announcements ADD COLUMN IF NOT EXISTS description TEXT",
        "ALTER TABLE announcements ADD COLUMN IF NOT EXISTS price VARCHAR(100)"
    ]
    
    # Exécuter chaque commande
    with engine.connect() as conn:
        for cmd in commands:
            try:
                conn.execute(text(cmd))
                print(f"Exécuté: {cmd}")
            except Exception as e:
                print(f"Erreur: {e}")
        
        conn.commit()
    
    print("Terminé!")

if __name__ == "__main__":
    add_columns()
