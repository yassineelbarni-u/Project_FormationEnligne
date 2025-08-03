"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import StudentLayout from "../../components/student/StudentLayout"
import "./CourseView.css"

const BACKEND_URL = "http://localhost:8001"

const CourseView = () => {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [videos, setVideos] = useState([])
  const [currentVideo, setCurrentVideo] = useState(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedModules, setExpandedModules] = useState([])
  const navigate = useNavigate()

  // Fonction pour organiser les vidéos par module
  const organizeVideosIntoModules = (videos) => {
    const modules = {}
    videos.forEach((video) => {
      const moduleName = video.module_name || "Autres vidéos"
      if (!modules[moduleName]) {
        modules[moduleName] = []
      }
      modules[moduleName].push(video)
    })
    return modules
  }

  // Fonction pour obtenir toutes les vidéos dans l'ordre
  const getAllVideosInOrder = () => {
    const modules = organizeVideosIntoModules(videos)
    const allVideos = []
    Object.values(modules).forEach((moduleVideos) => {
      allVideos.push(...moduleVideos.sort((a, b) => (a.order_in_course || 0) - (b.order_in_course || 0)))
    })
    return allVideos
  }

  // Navigation entre vidéos
  const goToNextVideo = () => {
    const allVideos = getAllVideosInOrder()
    const nextIndex = currentVideoIndex + 1
    if (nextIndex < allVideos.length) {
      setCurrentVideo(allVideos[nextIndex])
      setCurrentVideoIndex(nextIndex)
    }
  }

  const goToPreviousVideo = () => {
    const allVideos = getAllVideosInOrder()
    const prevIndex = currentVideoIndex - 1
    if (prevIndex >= 0) {
      setCurrentVideo(allVideos[prevIndex])
      setCurrentVideoIndex(prevIndex)
    }
  }

  // Fonction pour basculer l'état d'expansion d'un module
  const toggleModule = (moduleName) => {
    if (expandedModules.includes(moduleName)) {
      setExpandedModules(expandedModules.filter((name) => name !== moduleName))
    } else {
      setExpandedModules([...expandedModules, moduleName])
    }
  }

  // Lors du premier chargement, définir tous les modules comme étant développés
  useEffect(() => {
    if (videos.length > 0) {
      const modules = Object.keys(organizeVideosIntoModules(videos))
      setExpandedModules(modules)
    }
  }, [videos])

  useEffect(() => {
    fetchCourseData()
  }, [courseId])

  const fetchCourseData = async () => {
    try {
      const token = localStorage.getItem("student_token")
      const courseResponse = await fetch(`${BACKEND_URL}/api/student/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const videosResponse = await fetch(`${BACKEND_URL}/api/student/course/${courseId}/videos`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (courseResponse.ok && videosResponse.ok) {
        const courseData = await courseResponse.json()
        const videosData = await videosResponse.json()
        setCourse(courseData)
        setVideos(videosData)

        // Sélectionner la première vidéo par défaut
        if (videosData.length > 0) {
          const allVideos = getAllVideosInOrder()
          setCurrentVideo(allVideos[0])
          setCurrentVideoIndex(0)
        }
      } else if (courseResponse.status === 401 || videosResponse.status === 401) {
        navigate("/student/login")
      } else if (courseResponse.status === 403) {
        navigate("/student/dashboard")
      }
    } catch (error) {
      console.error("Erreur lors du chargement du cours:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const extractDriveFileId = (url) => {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?drive\.google\.com\/file\/d\/([^/?]+)/,
      /(?:https?:\/\/)?(?:www\.)?drive\.google\.com\/open\?id=([^&]+)/,
      /(?:https?:\/\/)?(?:docs|drive)\.google\.com\/(?:a\/[^/]+\/)?(?:uc)\?(?:.+&)?id=([^&]+)/,
      /(?:https?:\/\/)?(?:www\.)?drive\.google\.com\/(?:a\/[^/]+\/)?(?:u\/\d+\/)?(?:uc)\?(?:.+&)?id=([^&]+)/,
    ]
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  const generateDriveEmbedUrl = (driveUrl) => {
    const fileId = extractDriveFileId(driveUrl)
    if (!fileId) return "about:blank"
    return `https://drive.google.com/file/d/${fileId}/preview`
  }

  // ✅ Fonction pour générer une vraie miniature de vidéo Google Drive
  const generateVideoThumbnail = (video) => {
    const fileId = extractDriveFileId(video.drive_url)
    if (fileId) {
      // Utiliser l'API Google Drive pour obtenir la miniature réelle
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w320-h180`
    }
    // Fallback avec une image de tableau/cours
    return `https://via.placeholder.com/320x180/1f2937/ffffff?text=${encodeURIComponent(video.title.substring(0, 10))}`
  }

  const selectVideo = (video) => {
    const allVideos = getAllVideosInOrder()
    const index = allVideos.findIndex((v) => v.id === video.id)
    setCurrentVideo(video)
    setCurrentVideoIndex(index)
  }

  if (isLoading) {
    return (
      <StudentLayout>
        <div className="course-loading">
          <div className="loading-spinner"></div>
          <p>Chargement du cours...</p>
        </div>
      </StudentLayout>
    )
  }

  if (!course) {
    return (
      <StudentLayout>
        <div className="course-error">
          <div className="error-icon">📚</div>
          <h2>Cours non trouvé</h2>
          <p>Ce cours n'existe pas ou vous n'y avez pas accès.</p>
          <button onClick={() => navigate("/student/dashboard")} className="btn-back">
            Retour aux cours
          </button>
        </div>
      </StudentLayout>
    )
  }

  const allVideos = getAllVideosInOrder()
  const hasNextVideo = currentVideoIndex < allVideos.length - 1
  const hasPreviousVideo = currentVideoIndex > 0

  return (
    <StudentLayout>
      <div className="course-view-container">
        {/* Header du cours */}
        <div className="course-header">
          <button onClick={() => navigate("/student/dashboard")} className="back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Retour aux cours
          </button>
          <div className="course-info">
            <h1>{course.title}</h1>
            <div className="course-meta">
              <span className="course-subject">{course.subject}</span>
              <span className="course-level">{course.level}</span>
              <span className="video-count">{videos.length} vidéos</span>
            </div>
          </div>
        </div>

        {/* Layout responsive */}
        <div className="course-layout">
          {/* Section contenu - À GAUCHE sur desktop */}
          <div className="content-section">
            <div className="content-header">
              <h2>Contenu du cours</h2>
              <div className="video-count-badge">{videos.length} vidéos</div>
            </div>

            <div className="modules-list">
              {Object.entries(organizeVideosIntoModules(videos)).map(([moduleName, moduleVideos]) => (
                <div key={moduleName} className="module-section">
                  <div className="module-header" onClick={() => toggleModule(moduleName)}>
                    <div className="module-info">
                      <div className="module-details">
                        <h3 className="module-title">{moduleName}</h3>
                        <span className="module-count">{moduleVideos.length} vidéos</span>
                      </div>
                    </div>
                    <div className={`module-toggle ${expandedModules.includes(moduleName) ? "expanded" : ""}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6,9 12,15 18,9" />
                      </svg>
                    </div>
                  </div>

                  {expandedModules.includes(moduleName) && (
                    <div className="module-videos">
                      {moduleVideos.map((video, index) => (
                        <div
                          key={video.id}
                          className={`video-lesson ${currentVideo?.id === video.id ? "active" : ""}`}
                          onClick={() => selectVideo(video)}
                        >
                          <div className="lesson-thumbnail">
                            <img
                              src={generateVideoThumbnail(video) || "/placeholder.svg"}
                              onError={(e) => {
                                // Fallback si la miniature Google Drive ne fonctionne pas
                                e.target.src = `https://via.placeholder.com/320x180/1f2937/ffffff?text=${encodeURIComponent(video.title.substring(0, 8))}`
                              }}
                            />
                            <div className="play-icon">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <polygon points="5,3 19,12 5,21" />
                              </svg>
                            </div>
                            {video.is_free && <div className="free-label">Gratuit</div>}
                          </div>

                          <div className="lesson-info">
                            <div className="lesson-number">LEÇON {index + 1}</div>
                            <h4 className="lesson-title">{video.title}</h4>
                            {video.description && <p className="lesson-description">{video.description}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section vidéo - À DROITE sur desktop */}
          <div className="video-section">
            {currentVideo ? (
              <div className="video-player-container">
                <div className="video-title-bar">
                  <h2>{currentVideo.title}</h2>
                  <div className="video-controls">
                    {currentVideo.is_free && <span className="free-badge">Gratuit</span>}
                    <div className="navigation-controls">
                      <button
                        className="nav-btn prev-btn"
                        onClick={goToPreviousVideo}
                        disabled={!hasPreviousVideo}
                        title="Vidéo précédente"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polygon points="19,20 9,12 19,4" />
                        </svg>
                      </button>
                      <span className="video-counter">
                        {currentVideoIndex + 1} / {allVideos.length}
                      </span>
                      <button
                        className="nav-btn next-btn"
                        onClick={goToNextVideo}
                        disabled={!hasNextVideo}
                        title="Vidéo suivante"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polygon points="5,4 15,12 5,20" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="video-player">
                  <iframe
                    src={generateDriveEmbedUrl(currentVideo.drive_url)}
                    title={currentVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    width="100%"
                    height="100%"
                  />
                </div>

                {currentVideo.description && (
                  <div className="video-description">
                    <h3>À propos de cette leçon</h3>
                    <p>{currentVideo.description}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="no-video-placeholder">
                <div className="placeholder-icon">🎥</div>
                <h3>Sélectionnez une leçon</h3>
                <p>Choisissez une vidéo dans la liste pour commencer votre apprentissage</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  )
}

export default CourseView
