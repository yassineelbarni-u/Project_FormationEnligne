"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import StudentLayout from "../../components/student/StudentLayout"
import styles from "./StudentDashboard.module.css"

const BACKEND_URL = "http://localhost:8001"

const StudentDashboard = () => {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem("student_user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
    fetchMyCourses()
  }, [])

  const fetchMyCourses = async () => {
    try {
      const token = localStorage.getItem("student_token")
      const response = await fetch(`${BACKEND_URL}/api/student/my-courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCourses(data)
      } else if (response.status === 401) {
        navigate("/student/login")
      }
    } catch (error) {
      console.error("Erreur lors du chargement des cours:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSubjectIcon = (subject) => {
    const subject_lower = subject ? subject.toLowerCase() : '';
    
    // Utiliser des images SVG pour les matières
    if (subject_lower.includes('math')) {
      return (
        <img 
          src="/images/subjects/math-icon.svg" 
          alt="Mathématiques" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23667eea" stroke-width="2"><path d="M3 3l18 18M3 21L21 3M7 12h10"/></svg>';
          }}
        />
      );
    }
    else if (subject_lower.includes('phys')) {
      return (
        <img 
          src="/images/subjects/physics-icon.svg" 
          alt="Physique" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23667eea" stroke-width="2"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>';
          }}
        />
      );
    }
    else {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#667eea" strokeWidth="2">
          <path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 01-2.5-2.5z"></path>
          <path d="M8 7h6M8 11h8M8 15h5"></path>
        </svg>
      );
    }
  }

  const getLevelClass = (level) => {
    const classes = {
      Débutant: "levelBeginner",
      Intermédiaire: "levelIntermediate",
      Avancé: "levelAdvanced",
      default: "levelDefault",
    }
    return classes[level] || classes.default
  }

  const handleStartLearning = (courseId, e) => {
    // Ajouter une petite animation avant la navigation
    const button = e.currentTarget
    button.style.transform = "scale(0.95)"
    setTimeout(() => {
      navigate(`/student/course/${courseId}`)
    }, 150)
  }

  return (
    <StudentLayout>
      <div className={styles.dashboard}>
        {/* Header de bienvenue */}
        <div className={styles.welcomeHeader}>
          <div className={styles.welcomeContent}>
            <h1>Bienvenue, {user?.name || "Étudiant"} 👋</h1>
            <p>Voici vos cours disponibles. Continuez votre apprentissage !</p>
          </div>
          <div className={styles.userStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{courses.length}</span>
              <span className={styles.statLabel}>Cours</span>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className={styles.dashboardContent}>
          {isLoading ? (
            <div className={styles.coursesLoading}>
              <div className={styles.loadingSpinner}></div>
              <p>Chargement de vos cours...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📚</div>
              <h3>Aucun cours disponible</h3>
              <p>Vous n'avez pas encore accès à des cours. Contactez votre formateur.</p>
            </div>
          ) : (
            <div className={styles.coursesGrid}>
              {courses.map((course) => (
                <div key={course.id} className={styles.courseCard}>
                  <div className={styles.courseHeader}>
                    <div className={styles.courseIcon}>{getSubjectIcon(course.subject)}</div>
                    <div className={`${styles.courseLevel} ${styles[getLevelClass(course.level)]}`}>{course.level}</div>
                  </div>

                  <div className={styles.courseContent}>
                    <h3 className={styles.courseTitle}>{course.title}</h3>
                    <p className={styles.courseSubject}>{course.subject}</p>
                    {course.description && <p className={styles.courseDescription}>{course.description}</p>}

                    <div className={styles.courseStats}>
                      <div className={styles.stat}>
                        <svg
                          className={styles.statIcon}
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polygon points="23,7 16,12 23,17" />
                          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                        </svg>
                        <span>{course.video_count || 0} vidéos</span>
                      </div>
                      <div className={styles.stat}>
                        <svg
                          className={styles.statIcon}
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12,6 12,12 16,14" />
                        </svg>
                        <span>~{Math.ceil((course.video_count || 0) * 15)} min</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.courseActions}>
                    <button
                      className={styles.button}
                      onClick={(e) => handleStartLearning(course.id, e)}
                      aria-label={`Commencer le cours ${course.title}`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                      Commencer à apprendre
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  )
}

export default StudentDashboard
