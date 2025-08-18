""" Modèles pour le système de gestion des vidéos Google Drive """

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

# Table d'association pour les étudiants et cours
student_course_association = Table(
    'student_courses',
    Base.metadata,
    Column('student_id', Integer, ForeignKey('students.id')),
    Column('course_id', Integer, ForeignKey('courses.id'))
)

class Admin(Base):
    __tablename__ = "admins"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    name = Column(String(255))
    hashed_password = Column(String(255))
    is_active = Column(Boolean, default=True)
    is_super_admin = Column(Boolean, default=False)  # 🆕 Nouveau champ pour différencier les types d'admin
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relations
    courses = relationship("Course", back_populates="admin")
    videos = relationship("Video", back_populates="admin")
    job_offers = relationship("JobOffer", back_populates="admin")
    announcements = relationship("Announcement", back_populates="admin")

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    description = Column(Text)
    subject = Column(String(100))  # Maths, Physique, Chimie...
    level = Column(String(50))     # Débutant, Intermédiaire, Avancé
    drive_folder_id = Column(String(255))  # ID du dossier Google Drive
    access_code = Column(String(50), unique=True)  # Code d'accès unique
    image_filename = Column(String(255), nullable=True)  # Nom du fichier image
    is_active = Column(Boolean, default=True)
    admin_id = Column(Integer, ForeignKey("admins.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relations
    admin = relationship("Admin", back_populates="courses")
    videos = relationship("Video", back_populates="course")
    students = relationship("Student", secondary=student_course_association, back_populates="courses")
    accesses = relationship("CourseAccess", back_populates="course")

class Video(Base):
    __tablename__ = "videos"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    description = Column(Text)
    drive_file_id = Column(String(255))
    drive_url = Column(String(500))
    thumbnail_url = Column(String(500))
    order_in_course = Column(Integer, default=0)  # Ordre dans le cours
    is_free = Column(Boolean, default=False)      # Vidéo gratuite ou payante
    module_name = Column(String(255))             # Nom du module/playlist
    course_id = Column(Integer, ForeignKey("courses.id"))
    admin_id = Column(Integer, ForeignKey("admins.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relations
    course = relationship("Course", back_populates="videos")
    admin = relationship("Admin", back_populates="videos")

class Student(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    email = Column(String(255), unique=True, index=True)
    phone = Column(String(20))
    level = Column(String(100))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relations
    courses = relationship("Course", secondary=student_course_association, back_populates="students")
    accesses = relationship("CourseAccess", back_populates="student")

class CourseAccess(Base):
    __tablename__ = "course_accesses"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    access_type = Column(String(50))
    access_token = Column(String(255))
    expires_at = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relations
    student = relationship("Student", back_populates="accesses")
    course = relationship("Course", back_populates="accesses")

class Announcement(Base):
    __tablename__ = "announcements"
    
    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String(500), nullable=False)
    image_filename = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)
    admin_id = Column(Integer, ForeignKey("admins.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relations
    admin = relationship("Admin", back_populates="announcements")

class JobOffer(Base):
    __tablename__ = "job_offers"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    company = Column(String(255), nullable=False)
    location = Column(String(255))
    description = Column(Text, nullable=False)
    requirements = Column(Text)
    benefits = Column(Text)
    salary_range = Column(String(100))
    application_deadline = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)
    admin_id = Column(Integer, ForeignKey("admins.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relations
    admin = relationship("Admin", back_populates="job_offers")
    applications = relationship("JobApplication", back_populates="job_offer")

class JobApplication(Base):
    __tablename__ = "job_applications"
    
    id = Column(Integer, primary_key=True, index=True)
    job_offer_id = Column(Integer, ForeignKey("job_offers.id"), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(20))
    cover_letter = Column(Text)
    cv_filename = Column(String(255))
    cv_url = Column(String(500))
    status = Column(String(50), default="pending")  # "pending", "reviewed", "accepted", "rejected"
    admin_notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relations
    job_offer = relationship("JobOffer", back_populates="applications")
