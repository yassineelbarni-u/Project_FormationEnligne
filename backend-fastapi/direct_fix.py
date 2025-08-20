"""
Script direct pour ajouter les colonnes manquantes à la table announcements
"""

from sqlalchemy import create_engine, text

# Remplacez ces valeurs par vos informations de connexion réelles
DATABASE_URL = "mysql+pymysql://root:rootpassword@mysql_db:3306/projet_courses"

def add_columns():
    try:
        # Créer la connexion à la base de données
        engine = create_engine(DATABASE_URL)
        
        # SQL pour ajouter les colonnes
        sql = """
        ALTER TABLE announcements ADD COLUMN IF NOT EXISTS title VARCHAR(255);
        ALTER TABLE announcements ADD COLUMN IF NOT EXISTS description TEXT;
        ALTER TABLE announcements ADD COLUMN IF NOT EXISTS price VARCHAR(100);
        """
        
        # Exécuter le SQL
        with engine.connect() as conn:
            conn.execute(text(sql))
            conn.commit()
            print("Les colonnes ont été ajoutées avec succès!")
    except Exception as e:
        print(f"Erreur: {e}")

if __name__ == "__main__":
    add_columns()
