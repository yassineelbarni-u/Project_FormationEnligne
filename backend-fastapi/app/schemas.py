""" Schémas pour le système de gestion des vidéos """

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
    is_super_admin: bool  # 🆕 Nouveau champ
    created_at: datetime
    
    class Config:
        from_attributes = True

# 🆕 Nouveaux schémas pour la gestion des admins
class AdminCreate(BaseModel):
    email: EmailStr
    name: str
    password: str
    is_super_admin: bool = False

class AdminUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None

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
    image_filename: Optional[str] = None  # Ajout du champ image_filename pour stocker le nom du fichier image

class CourseCreate(CourseBase):
    pass

class CourseUpdate(CourseBase):
    title: Optional[str] = None
    subject: Optional[str] = None
    level: Optional[str] = None
    image_filename: Optional[str] = None  # Ajout du champ image_filename dans CourseUpdate

class CourseResponse(CourseBase):
    id: int
    access_code: str
    is_active: bool
    admin_id: int
    created_at: datetime
    video_count: Optional[int] = 0
    student_count: Optional[int] = 0
    image_url: Optional[str] = None  # Ajout du champ image_url pour l'URL complète de l'image
    
    class Config:
        from_attributes = True

# Schémas pour les vidéos
class VideoBase(BaseModel):
    title: str
    description: Optional[str] = None
    drive_url: str
    pdf_url: Optional[str] = None  # Lien vers le PDF du cours (optionnel)
    order_in_course: int = 0
    is_free: bool = False
    module_name: Optional[str] = None

class VideoCreate(VideoBase):
    course_id: int

class VideoUpdate(VideoBase):
    title: Optional[str] = None
    drive_file_id: Optional[str] = None
    drive_url: Optional[str] = None
    pdf_url: Optional[str] = None  # Lien vers le PDF du cours (optionnel)
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


# ==================== SCHÉMAS ANNONCES ====================

class AnnouncementBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[str] = None
    is_active: bool = True
    display_order: int = 0

class AnnouncementCreate(AnnouncementBase):
    pass

class AnnouncementUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[str] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None

class AnnouncementResponse(AnnouncementBase):
    id: int
    image_url: str
    image_filename: str
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[str] = None
    admin_id: Optional[int]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True



# ==================== SCHÉMAS RECRUTEMENT ====================

class JobOfferBase(BaseModel):
    title: str
    company: str
    location: Optional[str] = None
    description: str
    requirements: Optional[str] = None
    benefits: Optional[str] = None
    salary_range: Optional[str] = None
    application_deadline: Optional[datetime] = None

class JobOfferCreate(JobOfferBase):
    pass

class JobOfferUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    benefits: Optional[str] = None
    salary_range: Optional[str] = None
    application_deadline: Optional[datetime] = None
    is_active: Optional[bool] = None

class JobOfferResponse(JobOfferBase):
    id: int
    is_active: bool
    admin_id: int
    created_at: datetime
    updated_at: datetime
    applications_count: Optional[int] = 0
    
    class Config:
        from_attributes = True

class JobApplicationBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    cover_letter: Optional[str] = None

class JobApplicationCreate(JobApplicationBase):
    job_offer_id: int

class JobApplicationUpdate(BaseModel):
    status: Optional[str] = None  # "pending", "reviewed", "accepted", "rejected"
    admin_notes: Optional[str] = None

class JobApplicationResponse(JobApplicationBase):
    id: int
    job_offer_id: int
    cv_filename: Optional[str]
    cv_url: Optional[str]
    status: str
    admin_notes: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    # Informations supplémentaires
    job_title: Optional[str] = None
    company_name: Optional[str] = None
    
    class Config:
        from_attributes = True
