"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"
import apiService from "../../utils/api"
import "./Videos.css"


const Videos = () => {
  const [videos, setVideos] = useState([])
  const [courses, setCourses] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchVideos()
    fetchCourses()
  }, [])

    const fetchVideos = async () => {
    try {
      const data = await apiService.getVideos()
      setVideos(data)
    } catch (error) {
      if (error.message.includes("401")) {
        navigate("/login")
      }
      console.error("Error fetching videos:", error)
    } finally {
      setIsLoading(false)
    }
  }


      const fetchCourses = async () => {
        try {
          const data = await apiService.getCourses()
          setCourses(data)
        } catch (error) {
          console.error("Error fetching courses:", error)
        }
      }


  const deleteVideo = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette vidéo ?")) return

    try {
      await apiService.deleteVideo(id)
      setVideos(videos.filter((video) => video.id !== id))
      alert("Vidéo supprimée avec succès")
    } catch (error) {
      alert("Erreur lors de la suppression")
    }
  }


  const getCourseTitle = (courseId) => {
    const course = courses.find((c) => c.id === courseId)
    return course ? course.title : "Cours inconnu"
  }

  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (video.description && video.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCourse = selectedCourse === "" || video.course_id.toString() === selectedCourse
    return matchesSearch && matchesCourse
  })

  return (
    <AdminLayout>
      <div className="videos-page">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>🎥 Toutes les Vidéos</h1>
            <p>Gérez toutes vos vidéos Google Drive de formation</p>
          </div>
          <button className="btn-primary" onClick={() => navigate("/admin/courses")}>
            📚 Gérer les Cours
          </button>
        </div>

        {/* Search and Filters */}
        <div className="search-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher une vidéo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="filter-select">
            <option value="">Tous les cours</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-number">{videos.length}</div>
            <div className="stat-label">Total Vidéos</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{courses.length}</div>
            <div className="stat-label">Cours</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{videos.filter((v) => v.is_free).length}</div>
            <div className="stat-label">Vidéos Gratuites</div>
          </div>
        </div>

        {/* Videos Grid */}
        {isLoading ? (
          <div className="videos-loading">
            <div className="loading-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="video-card-skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-text"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="videos-grid">
            {filteredVideos.map((video) => (
              <div key={video.id} className="video-card">
                <div className="video-thumbnail">
                  <img
                    src={video.thumbnail_url || "/placeholder.svg?height=200&width=400&query=video thumbnail"}
                    alt={video.title}
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=200&width=400"
                    }}
                  />
                  <div className="video-course-badge">📚 {getCourseTitle(video.course_id)}</div>
                  {video.duration && <div className="video-duration">{video.duration}</div>}
                  {video.is_free && <div className="video-free">GRATUIT</div>}
                </div>

                <div className="video-content">
                  <h3 className="video-title">{video.title}</h3>
                  {video.description && (
                    <p className="video-description">
                      {video.description.length > 100 ? `${video.description.substring(0, 100)}...` : video.description}
                    </p>
                  )}

                  <div className="video-meta">
                    <span className="video-order">#{video.order_in_course}</span>
                    <span className="video-date">{new Date(video.created_at).toLocaleDateString("fr-FR")}</span>
                  </div>

                  <div className="video-actions">
                    <a href={video.youtube_url} target="_blank" rel="noopener noreferrer" className="btn-watch">
                      ▶️ Google Drive
                    </a>
                    <button className="btn-course" onClick={() => navigate(`/admin/courses/${video.course_id}/videos`)}>
                      📚 Cours
                    </button>
                    <button className="btn-delete" onClick={() => deleteVideo(video.id)}>
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredVideos.length === 0 && !isLoading && (
          <div className="empty-state">
            <div className="empty-icon">🎥</div>
            <h3>Aucune vidéo trouvée</h3>
            <p>
              {searchTerm || selectedCourse
                ? "Aucune vidéo ne correspond à vos critères de recherche"
                : "Commencez par créer un cours et ajouter des vidéos Google Drive"}
            </p>
            <button className="btn-primary" onClick={() => navigate("/admin/courses")}>
              📚 Gérer les Cours
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default Videos
