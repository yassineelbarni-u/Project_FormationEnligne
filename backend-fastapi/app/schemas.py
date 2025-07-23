"""
Schémas pour le système de gestion des vidéos
"""

from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# Schémas de base existants
class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminResponse(BaseModel):
    id: int
    email: str
    name: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

# ==================== SCHÉMAS ÉTUDIANTS ====================

class StudentLogin(BaseModel):
    email: EmailStr
    access_code: str  # Code d'accès ou mot de passe

class StudentResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str]
    level: Optional[str]
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Schémas pour les cours
class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None
    subject: str
    level: str
    drive_folder_id: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class CourseUpdate(CourseBase):
    title: Optional[str] = None
    subject: Optional[str] = None
    level: Optional[str] = None

class CourseResponse(CourseBase):
    id: int
    access_code: str
    is_active: bool
    admin_id: int
    created_at: datetime
    video_count: Optional[int] = 0
    student_count: Optional[int] = 0
    
    class Config:
        from_attributes = True

# Schémas pour les vidéos
class VideoBase(BaseModel):
    title: str
    description: Optional[str] = None
    drive_url: str
    duration: Optional[str] = None
    order_in_course: int = 0
    is_free: bool = False

class VideoCreate(VideoBase):
    course_id: int

class VideoUpdate(VideoBase):
    title: Optional[str] = None
    drive_file_id: Optional[str] = None
    drive_url: Optional[str] = None
    course_id: Optional[int] = None

class VideoResponse(VideoBase):
    id: int
    thumbnail_url: Optional[str]
    course_id: int
    admin_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Schémas pour les étudiants
class StudentBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    level: Optional[str] = None

class StudentCreate(StudentBase):
    course_id: Optional[int] = None

class StudentUpdate(StudentBase):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    level: Optional[str] = None

# Schémas pour l'accès aux cours
class CourseAccessCreate(BaseModel):
    student_id: int
    course_id: int
    access_type: str = "standard"  # "standard", "email", "link", "code"
    duration_days: Optional[int] = 30

class CourseAccessResponse(BaseModel):
    id: int
    student_id: int
    course_id: int
    access_type: str
    access_token: str
    expires_at: Optional[datetime]
    is_active: bool
    created_at: datetime
    
    # Infos supplémentaires - ces champs doivent être remplis
    student_name: str
    student_email: str
    course_title: str
    
    class Config:
        from_attributes = True

# Schéma pour générer un lien d'accès
class GenerateAccessLink(BaseModel):
    course_id: int
    expires_days: Optional[int] = 30
    access_type: str = "link"  # "link" ou "code"

# Statistiques du dashboard
class DashboardStats(BaseModel):
    total_courses: int
    total_videos: int
    total_students: int
    total_accesses: int
    recent_activity: List[dict]
