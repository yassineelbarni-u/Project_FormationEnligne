"""
Modèles pour le système de gestion des vidéos Google Drive
"""

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
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relations
    courses = relationship("Course", back_populates="admin")
    videos = relationship("Video", back_populates="admin")

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    description = Column(Text)
    subject = Column(String(100))  # Maths, Physique, Chimie...
    level = Column(String(50))     # Débutant, Intermédiaire, Avancé
    drive_folder_id = Column(String(255))  # ID du dossier Google Drive
    access_code = Column(String(50), unique=True)  # Code d'accès unique
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
    drive_file_id = Column(String(255))     # ID du fichier Google Drive
    drive_url = Column(String(500))         # URL complète Google Drive
    thumbnail_url = Column(String(500))
    duration = Column(String(50))
    order_in_course = Column(Integer, default=0)  # Ordre dans le cours
    is_free = Column(Boolean, default=False)      # Vidéo gratuite ou payante
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
    expires_at = Column(DateTime(timezone=True))  # Date d'expiration
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relations
    student = relationship("Student", back_populates="accesses")
    course = relationship("Course", back_populates="accesses")
