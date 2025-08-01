"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"
import "./Courses.css"

const BACKEND_URL = "http://localhost:8001"

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSubject, setSelectedSubject] = useState("all")
  const navigate = useNavigate()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${BACKEND_URL}/api/admin/courses/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCourses(data)
      } else if (response.status === 401) {
        navigate("/login")
      }
    } catch (error) {
      console.error("Erreur lors du chargement des cours:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteCourse = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${BACKEND_URL}/api/admin/courses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setCourses(courses.filter((course) => course.id !== id))
        alert("Cours supprimé avec succès")
      }
    } catch (error) {
      alert("Erreur lors de la suppression")
    }
  }

  const generateAccessLink = async (courseId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${BACKEND_URL}/api/admin/courses/${courseId}/generate-link`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course_id: courseId,
          access_type: "link",
          expires_days: 30,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        navigator.clipboard.writeText(data.access_url)
        alert(`Lien d'accès copié !\n${data.access_url}`)
      }
    } catch (error) {
      alert("Erreur lors de la génération du lien")
    }
  }

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = selectedSubject === "all" || course.subject === selectedSubject
    return matchesSearch && matchesSubject
  })

  const subjects = [...new Set(courses.map((course) => course.subject))]

  return (
    <AdminLayout>
      <div className="courses-page">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>Gestion des Cours</h1>
            <p>Créez et gérez vos cours avec vidéos Google Drive</p>
          </div>
          <button className="btn-primary" onClick={() => navigate("/admin/courses/new")}>
            📚 Nouveau Cours
          </button>
        </div>

        {/* Search and Filters */}
        <div className="search-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher un cours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="filter-select"
          >
            <option value="all">Toutes les matières</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="courses-loading">
            <div className="loading-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="course-card-skeleton">
                  <div className="skeleton-header"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-text"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="courses-grid">
            {filteredCourses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-header">
                  <div className="course-subject">{course.subject}</div>
                  <div className="course-level">{course.level}</div>
                </div>
                <div className="course-content">
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-description">{course.description}</p>
                  <div className="course-stats">
                    <div className="stat-item">
                      <span className="stat-icon">🎥</span>
                      <span>{course.video_count || 0} vidéos</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">👥</span>
                      <span>{course.student_count || 0} étudiants</span>
                    </div>
                  </div>
                  <div className="course-access">
                    <div className="access-code">
                      <strong>Code: {course.access_code}</strong>
                    </div>
                  </div>
                  <div className="course-actions">
                    <button
                      className="btn-edit"
                      onClick={() => navigate(`/admin/courses/${course.id}/videos`)}
                      title="Gérer les vidéos"
                    >
                      🎥 Vidéos
                    </button>
                  
        
                    <button
                      className="btn-edit"
                      onClick={() => navigate(`/admin/courses/${course.id}/edit`)}
                      title="Modifier le cours"
                    >
                      ✏️
                    </button>
                    <button className="btn-delete" onClick={() => deleteCourse(course.id)} title="Supprimer">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredCourses.length === 0 && !isLoading && (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>Aucun cours trouvé</h3>
            <p>Commencez par créer votre premier cours</p>
            <button className="btn-primary" onClick={() => navigate("/admin/courses/new")}>
              📚 Créer un cours
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default Courses
