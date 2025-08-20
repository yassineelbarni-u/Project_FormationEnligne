"""
Script de migration manuel pour ajouter les champs titre, description et prix à la table announcements
"""

import sqlite3

# Connexion à la base de données SQLite
def add_fields_to_announcements():
    try:
        conn = sqlite3.connect("app.db")
        cursor = conn.cursor()
        
        # Vérifier si les colonnes existent déjà
        cursor.execute("PRAGMA table_info(announcements)")
        columns = cursor.fetchall()
        column_names = [col[1] for col in columns]
        
        # Ajouter les colonnes si elles n'existent pas
        if "title" not in column_names:
            cursor.execute("ALTER TABLE announcements ADD COLUMN title TEXT")
        
        if "description" not in column_names:
            cursor.execute("ALTER TABLE announcements ADD COLUMN description TEXT")
        
        if "price" not in column_names:
            cursor.execute("ALTER TABLE announcements ADD COLUMN price TEXT")
        
        conn.commit()
        print("Migration réussie: Les champs ont été ajoutés à la table announcements")
        
    except Exception as e:
        print(f"Erreur lors de la migration: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    add_fields_to_announcements()
