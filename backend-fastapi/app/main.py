"""
Point d'entrée principal FastAPI avec toutes les routes
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Imports locaux
from app.database import engine
from app.models import Base
from app.routes import auth, admin, courses, videos, students

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
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclure les routes
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(courses.router, prefix="/api/admin/courses", tags=["courses"])
app.include_router(videos.router, prefix="/api/admin/videos", tags=["videos"])
app.include_router(students.router, prefix="/api/student", tags=["students"])  # ✅ NOUVEAU

@app.get("/")
async def root():
    return {"message": "API Système de Gestion des Cours"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    print("🚀 Démarrage du serveur avec système de gestion vidéos...")
    uvicorn.run(app, host="0.0.0.0", port=8001)
