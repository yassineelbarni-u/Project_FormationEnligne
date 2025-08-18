"""
Point d'entrée principal FastAPI avec toutes les routes
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os

# Imports locaux
from app.database import engine
from app.models import Base
from app.routes import auth, admin, courses, videos, students, admin_students, admin_accesses, admin_management, announcements
from app.routes import recruitment, applications

# Créer les tables
Base.metadata.create_all(bind=engine)

# Initialiser FastAPI
app = FastAPI(
    title="Système de Gestion des Cours",
    version="1.0.0"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Origine spécifique du frontend React
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

# Inclure les routes
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(courses.router, prefix="/api/admin/courses", tags=["courses"])
app.include_router(videos.router, prefix="/api/admin/videos", tags=["videos"])
app.include_router(students.router, prefix="/api/student", tags=["students"])
app.include_router(admin_students.router, prefix="/api/admin/students", tags=["admin_students"])
app.include_router(admin_accesses.router, prefix="/api/admin/accesses", tags=["admin_accesses"])
app.include_router(admin_management.router, prefix="/api/admin/management", tags=["admin_management"])

app.include_router(announcements.router, prefix="/api/admin/announcements", tags=["announcements_admin"])
app.include_router(announcements.router, prefix="/api/announcements", tags=["announcements_public"])

app.include_router(recruitment.router, prefix="/api/recruitment", tags=["recruitment"])
app.include_router(applications.router, prefix="/api/applications", tags=["applications"])
app.include_router(recruitment.router, prefix="/api/admin/recruitment", tags=["admin_recruitment"])
app.include_router(applications.router, prefix="/api/admin/applications", tags=["admin_applications"])

# Créer le dossier pour les images d'annonces dans le backend
announcements_images_dir = "backend/uploads/images/announcements"
os.makedirs(announcements_images_dir, exist_ok=True)

cv_upload_dir = "backend/uploads/cv"
os.makedirs(cv_upload_dir, exist_ok=True)

# Servir les fichiers statiques depuis le backend
app.mount("/images", StaticFiles(directory="backend/uploads/images"), name="images")
app.mount("/cv", StaticFiles(directory="backend/uploads/cv"), name="cv")

@app.get("/")
async def root():
    return {"message": "API Système de Gestion des Cours avec Recrutement"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    print("🚀 Démarrage du serveur avec système de recrutement...")
    uvicorn.run(app, host="0.0.0.0", port=8001)
