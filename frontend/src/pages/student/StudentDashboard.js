"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import StudentLayout from "../../components/student/StudentLayout"
import apiService from "../../utils/api"
import "./StudentDashboard.css"

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

  // ✅ Utilisation d'apiService au lieu d'appels directs
  const fetchMyCourses = async () => {
    try {
      setIsLoading(true)
      const data = await apiService.getStudentCourses()
      setCourses(data)
    } catch (error) {
      console.error("Erreur lors du chargement des cours:", error)
      if (error.message.includes("401")) {
        navigate("/student/login")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getSubjectIcon = (subject) => {
    const subject_lower = subject ? subject.toLowerCase() : ""

    if (subject_lower.includes("math")) {
      return (
        <div className="subject-icon math">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3l18 18M3 21L21 3M7 12h10" />
          </svg>
        </div>
      )
    } else if (subject_lower.includes("phys")) {
      return (
        <div className="subject-icon physics">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="8" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </div>
      )
    } else if (subject_lower.includes("info") || subject_lower.includes("program")) {
      return (
        <div className="subject-icon computer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>
      )
    } else {
      return (
        <div className="subject-icon default">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 01-2.5-2.5z" />
            <path d="M8 7h6M8 11h8M8 15h5" />
          </svg>
        </div>
      )
    }
  }

  const getLevelBadgeClass = (level) => {
    const classes = {
      Débutant: "level-beginner",
      Intermédiaire: "level-intermediate",
      Avancé: "level-advanced",
    }
    return classes[level] || "level-default"
  }

  const handleStartLearning = (courseId, e) => {
    const button = e.currentTarget
    button.style.transform = "scale(0.95)"
    setTimeout(() => {
      navigate(`/student/course/${courseId}`)
    }, 150)
  }

  const getTotalVideos = () => {
    return courses.reduce((total, course) => total + (course.video_count || 0), 0)
  }

  const getEstimatedTime = () => {
    const totalVideos = getTotalVideos()
    return Math.ceil(totalVideos * 15) // 15 min par vidéo en moyenne
  }

  return (
    <StudentLayout>
      <div className="dashboard-container">
        {/* Section de bienvenue */}
        <div className="welcome-section">
          <div className="welcome-content">
            <div className="welcome-text">
              <h1>Bienvenue, {user?.name || "Étudiant"} 👋</h1>
              <p>Continuez votre parcours d'apprentissage avec vos cours personnalisés</p>
            </div>
            <div className="welcome-stats">
              <div className="stat-card">
                <div className="stat-number">{courses.length}</div>
                <div className="stat-label">Cours disponibles</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{getTotalVideos()}</div>
                <div className="stat-label">Vidéos totales</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">~{getEstimatedTime()}min</div>
                <div className="stat-label">Temps d'étude</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section des cours */}
        <div className="courses-section">
          <div className="section-header">
            <h2>Mes Cours</h2>
            <p>Accédez à tous vos cours et continuez votre progression</p>
          </div>

          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Chargement de vos cours...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>Aucun cours disponible</h3>
              <p>Vous n'avez pas encore accès à des cours. Contactez votre formateur pour obtenir l'accès.</p>
              <button className="btn-contact" onClick={() => (window.location.href = "mailto:support@eduplatform.com")}>
                Contacter le support
              </button>
            </div>
          ) : (
            <div className="courses-grid">
              {courses.map((course) => (
                <div key={course.id} className="course-card">
                  <div className="course-header">
                    {getSubjectIcon(course.subject)}
                    <div className={`course-level ${getLevelBadgeClass(course.level)}`}>{course.level}</div>
                  </div>

                  <div className="course-content">
                    <div className="course-subject">{course.subject}</div>
                    <h3 className="course-title">{course.title}</h3>
                    {course.description && <p className="course-description">{course.description}</p>}

                    <div className="course-stats">
                      <div className="stat-item">
                        <svg
                          className="stat-icon"
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
                      <div className="stat-item">
                        <svg
                          className="stat-icon"
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

                  <div className="course-actions">
                    <button
                      className="btn-start-learning"
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
