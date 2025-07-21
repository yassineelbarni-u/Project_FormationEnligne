"""
Point d'entrée principal FastAPI avec toutes les routes
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Imports locaux
from app.database import engine
from app.models import Base
from app.routes import auth, admin, courses, videos

# Créer les tables
Base.metadata.create_all(bind=engine)

# Initialiser FastAPI
app = FastAPI(
    title="Ilyas Nahi Admin API - Système Vidéos",
    description="API complète pour la gestion des cours et vidéos YouTube",
    version="2.0.0"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"  # Temporaire pour debug
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Inclure les routes
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(courses.router, prefix="/api/admin/courses", tags=["courses"])
app.include_router(videos.router, prefix="/api/admin/videos", tags=["videos"])  # ✅ AJOUTÉ

@app.get("/")
async def root():
    return {
        "message": "Ilyas Nahi Admin API - Système de Gestion Vidéos",
        "version": "2.0.0",
        "features": [
            "Gestion des cours",
            "Intégration YouTube",
            "Contrôle d'accès par email/lien",
            "Dashboard admin complet"
        ]
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "youtube_integration": "ready"
    }

if __name__ == "__main__":
    print("🚀 Démarrage du serveur avec système de gestion vidéos...")
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=True)
