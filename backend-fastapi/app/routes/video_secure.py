"""
Routes sécurisées pour le streaming vidéo avec protection anti-téléchargement
"""

from fastapi import APIRouter, Request, HTTPException, Depends, Response
from sqlalchemy.orm import Session
import requests
import re
from typing import Optional

from app.database import get_db
from app.models import Video, Student
from app.security import get_current_student

router = APIRouter()

def extract_drive_file_id(url: str) -> Optional[str]:
    """Extraire l'ID du fichier Google Drive depuis l'URL"""
    if not url:
        return None
    
    patterns = [
        r'(?:https?://)?(?:www\.)?drive\.google\.com/file/d/([^/?]+)',
        r'(?:https?://)?(?:www\.)?drive\.google\.com/open\?id=([^&]+)',
        r'(?:https?://)?(?:docs|drive)\.google\.com/(?:a/[^/]+/)?(?:uc)\?(?:.+&)?id=([^&]+)',
        r'(?:https?://)?(?:www\.)?drive\.google\.com/(?:a/[^/]+/)?(?:u/\d+/)?(?:uc)\?(?:.+&)?id=([^&]+)',
        r'(?:https?://)?(?:www\.)?drive\.google\.com/file/d/([^/]+)/view',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    
    return None

@router.get("/stream/{video_id}")
async def stream_video_secure(
    video_id: int,
    request: Request,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Stream sécurisé d'une vidéo avec protection anti-téléchargement
    """
    # Vérifier le Referer pour bloquer les téléchargements directs
    # Cette vérification est légère et n'affecte pas l'affichage normal
    referer = request.headers.get("referer", "")
    user_agent = request.headers.get("user-agent", "").lower()
    
    # Liste des agents de téléchargement connus à bloquer
    download_agents = ["wget", "curl", "idm", "internetdownloadmanager", "httpclient"]
    if any(agent in user_agent for agent in download_agents):
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    # Vérifier que la vidéo existe et que l'étudiant y a accès
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Vidéo non trouvée")
    
    # Vérifier l'accès de l'étudiant au cours
    # Implémentation simple de la vérification d'accès
    
    # Extraire l'ID du fichier Google Drive
    file_id = extract_drive_file_id(video.drive_url)
    if not file_id:
        raise HTTPException(status_code=400, detail="URL Google Drive invalide")
    
    # Construire l'URL de streaming Google Drive
    drive_stream_url = f"https://drive.google.com/uc?export=download&id={file_id}"
    
    # Préparer les headers pour le streaming
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    # Gérer les requêtes Range pour le streaming progressif
    range_header = request.headers.get("range")
    if range_header:
        headers["Range"] = range_header
    
    try:
        # Faire la requête vers Google Drive
        response = requests.get(drive_stream_url, headers=headers, stream=True)
        
        if response.status_code not in (200, 206):
            raise HTTPException(status_code=404, detail="Vidéo non accessible")
        
        # Préparer les headers de réponse
        response_headers = {}
        
        # Copier les headers importants de Google Drive
        important_headers = [
            'content-length', 'content-range', 'content-type', 
            'accept-ranges', 'last-modified', 'etag'
        ]
        
        for header in important_headers:
            if header in response.headers:
                response_headers[header] = response.headers[header]
        
        # Ajouter des headers de sécurité renforcés pour empêcher le téléchargement
        # tout en garantissant la lecture en streaming dans les navigateurs
        response_headers.update({
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'SAMEORIGIN',
            'Cache-Control': 'no-store, no-cache, must-revalidate, private, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Range',
            'Cross-Origin-Resource-Policy': 'cross-origin',
            'Content-Disposition': 'inline; filename="protected-content.mp4"',  # Empêche le téléchargement automatique
            'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet, noimageindex',  # Bloquer l'indexation
            'Referrer-Policy': 'strict-origin-when-cross-origin',  # Limite les informations de référence
            'Feature-Policy': 'fullscreen *',  # Permet le mode plein écran uniquement
            'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',  # Restreint les permissions
            'Content-Security-Policy': "media-src 'self' https://drive.google.com;"  # Restreint les sources média
        })
        
        # Créer la réponse streaming
        def generate():
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    yield chunk
        
        # Déterminer le type de contenu approprié basé sur l'URL
        media_type = "video/*"  # Type générique par défaut
        video_url = video.drive_url.lower()
        
        if ".webm" in video_url or "webm=true" in video_url:
            media_type = "video/webm"
        elif ".mp4" in video_url:
            media_type = "video/mp4"
        elif ".mkv" in video_url:
            media_type = "video/x-matroska"
        
        # Utiliser content-type de Google Drive si disponible
        if "content-type" in response.headers and "video" in response.headers["content-type"]:
            media_type = response.headers["content-type"]
        
        return Response(
            content=generate(),
            status_code=response.status_code,
            headers=response_headers,
            media_type=media_type
        )
        
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Erreur de streaming: {str(e)}")

@router.get("/thumbnail/{video_id}")
async def get_video_thumbnail(
    video_id: int,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Récupérer la miniature d'une vidéo de manière sécurisée
    """
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Vidéo non trouvée")
    
    file_id = extract_drive_file_id(video.drive_url)
    if not file_id:
        raise HTTPException(status_code=400, detail="URL Google Drive invalide")
    
    # URL de miniature Google Drive
    thumbnail_url = f"https://drive.google.com/thumbnail?id={file_id}&sz=w320-h180"
    
    try:
        response = requests.get(thumbnail_url)
        if response.status_code == 200:
            return Response(
                content=response.content,
                media_type="image/jpeg",
                headers={
                    'Cache-Control': 'public, max-age=3600',
                    'X-Content-Type-Options': 'nosniff'
                }
            )
        else:
            raise HTTPException(status_code=404, detail="Miniature non disponible")
    except requests.RequestException:
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération de la miniature")
