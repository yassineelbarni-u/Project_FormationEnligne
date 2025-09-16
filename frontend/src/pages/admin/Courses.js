"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"
import apiService from "../../utils/api"
import "./Courses.css"

const API_URL = process.env.REACT_APP_API_URL;

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
      const data = await apiService.getCourses()
      setCourses(data)
    } catch (error) {
      console.error("Erreur lors du chargement des cours:", error)
      if (error.message.includes("401")) {
        navigate("/login")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const deleteCourse = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) return
    try {
      await apiService.deleteCourse(id)
      setCourses(courses.filter((course) => course.id !== id))
      alert("Cours supprimé avec succès")
    } catch (error) {
      alert("Erreur lors de la suppression")
    }
  }

  const generateAccessLink = async (courseId) => {
    try {
      const response = await apiService.request(`/api/admin/courses/${courseId}/generate-link`, {
        method: "POST",
        body: JSON.stringify({
          course_id: courseId,
          access_type: "link",
          expires_days: 30,
        }),
      })
      navigator.clipboard.writeText(response.access_url)
      alert(`Lien d'accès copié !\n${response.access_url}`)
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
      <div className="courses-page-modern">
        {/* Header moderne */}
        <div className="page-header-courses-modern">
          <div className="header-content-courses-modern">
            <div className="header-icon-courses-modern">📚</div>
            <div className="header-text-courses-modern">
              <h1>Gestion des Cours</h1>
              <p>Créez et gérez vos cours avec vidéos Google Drive</p>
            </div>
          </div>
          <button className="btn-primary-courses-modern" onClick={() => navigate("/admin/courses/new")}>
            📚 Nouveau Cours
          </button>
        </div>

        {/* Statistiques modernes */}
        <div className="stats-section-courses-modern">
          <div className="stat-card-courses-modern total">
            <div className="stat-icon-courses-modern">📚</div>
            <div className="stat-content-courses-modern">
              <div className="stat-number-courses-modern">{courses.length}</div>
              <div className="stat-label-courses-modern">Total Cours</div>
            </div>
          </div>
          <div className="stat-card-courses-modern subjects">
            <div className="stat-icon-courses-modern">🎯</div>
            <div className="stat-content-courses-modern">
              <div className="stat-number-courses-modern">{subjects.length}</div>
              <div className="stat-label-courses-modern">Matières</div>
            </div>
          </div>
          <div className="stat-card-courses-modern videos">
            <div className="stat-icon-courses-modern">🎥</div>
            <div className="stat-content-courses-modern">
              <div className="stat-number-courses-modern">
                {courses.reduce((total, course) => total + (course.video_count || 0), 0)}
              </div>
              <div className="stat-label-courses-modern">Vidéos</div>
            </div>
          </div>
          <div className="stat-card-courses-modern students">
            <div className="stat-icon-courses-modern">👥</div>
            <div className="stat-content-courses-modern">
              <div className="stat-number-courses-modern">
                {courses.reduce((total, course) => total + (course.student_count || 0), 0)}
              </div>
              <div className="stat-label-courses-modern">Étudiants</div>
            </div>
          </div>
        </div>

        {/* Section de recherche moderne */}
        <div className="search-section-courses-modern">
          <div className="search-container-courses-modern">
            <div className="search-field-courses-modern">
              <span className="search-icon-courses-modern">🔍</span>
              <input
                type="text"
                placeholder="Rechercher un cours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input-courses-modern"
              />
            </div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="filter-select-courses-modern"
            >
              <option value="all">📖 Toutes les matières</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section des cours */}
        <div className="courses-section-modern">
          <div className="section-header-courses-modern">
            <h2>Mes Cours ({filteredCourses.length})</h2>
            <p>Gérez vos cours et leurs contenus</p>
          </div>

          {isLoading ? (
            <div className="courses-loading-modern">
              <div className="loading-grid-courses-modern">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="course-card-skeleton-modern">
                    <div className="skeleton-image-modern"></div>
                    <div className="skeleton-header-modern"></div>
                    <div className="skeleton-content-modern">
                      <div className="skeleton-title-modern"></div>
                      <div className="skeleton-text-modern"></div>
                      <div className="skeleton-actions-modern"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="courses-grid-modern">
              {filteredCourses.map((course) => (
                <div key={course.id} className="course-card-modern">
                  <div className="course-image-modern">
                    <img
                      src={course.image_filename ? 
                        `${API_URL}${course.image_url}` : 
                        "/assets/math-course.png"}
                      alt={course.title}
                      onError={(e) => {
                        e.target.src = "/assets/math-course.png"
                        e.target.onerror = null
                      }}
                    />
                    <div className="course-overlay-modern">
                      <div className="course-badges-modern">
                        <div className="course-subject-modern">{course.subject}</div>
                        <div className="course-level-modern">{course.level}</div>
                      </div>
                    </div>
                  </div>

                  <div className="course-content-modern">
                    <div className="course-header-modern">
                      <h3 className="course-title-modern">{course.title}</h3>
                    </div>

                    <p className="course-description-modern">{course.description}</p>

                    <div className="course-stats-modern">
                      <div className="stat-item-courses-modern">
                        <span className="stat-icon-courses-modern">🎥</span>
                        <span>{course.video_count || 0} vidéos</span>
                      </div>
                      <div className="stat-item-courses-modern">
                        <span className="stat-icon-courses-modern">👥</span>
                        <span>{course.student_count || 0} étudiants</span>
                      </div>
                    </div>

                    <div className="course-access-modern">
                      <div className="access-code-modern">
                        <span className="access-label-modern">Code d'accès:</span>
                        <strong className="access-value-modern">{course.access_code}</strong>
                      </div>
                    </div>

                    <div className="course-actions-modern">
                      <button
                        className="btn-action-courses-modern videos"
                        onClick={() => navigate(`/admin/courses/${course.id}/videos`)}
                        title="Gérer les vidéos"
                      >
                        🎥
                      </button>
                      <button
                        className="btn-action-courses-modern edit"
                        onClick={() => navigate(`/admin/courses/${course.id}/edit`)}
                        title="Modifier le cours"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-action-courses-modern access"
                        onClick={() => generateAccessLink(course.id)}
                        title="Générer lien d'accès"
                      >
                        🔗
                      </button>
                      <button 
                        className="btn-action-courses-modern delete" 
                        onClick={() => deleteCourse(course.id)} 
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state-courses-modern">
              <div className="empty-illustration-courses-modern">
                <div className="empty-icon-courses-modern">📚</div>
                <div className="empty-graphics-courses-modern"></div>
              </div>
              <div className="empty-content-courses-modern">
                <h3>
                  {searchTerm || selectedSubject !== "all"
                    ? "Aucun cours trouvé"
                    : "Aucun cours créé"}
                </h3>
                <p>
                  {searchTerm || selectedSubject !== "all"
                    ? "Aucun cours ne correspond à vos critères de recherche"
                    : "Commencez par créer votre premier cours"}
                </p>
                <button className="btn-primary-courses-modern" onClick={() => navigate("/admin/courses/new")}>
                  📚 Créer un cours
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default Courses
