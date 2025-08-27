"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import StudentLayout from "../../components/student/StudentLayout"
import apiService from "../../utils/api"
import "./CourseView.css"
import "./pdf-styles.css"
import "./webm-styles.css"

const CourseView = () => {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [videos, setVideos] = useState([])
  const [currentVideo, setCurrentVideo] = useState(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedModules, setExpandedModules] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const showCaptureWarning = () => {
      alert(
        "⚠️ Capture d'écran interdite !\n\nLa capture d'écran et l'enregistrement vidéo sont interdits sur cette page pour protéger le contenu du cours.",
      )
    }

    const preventScreenCapture = (e) => {
      // Empêcher Print Screen
      if (e.key === "PrintScreen") {
        e.preventDefault()
        showCaptureWarning()
        return false
      }

      // Empêcher Win+G
      if (e.key === "g" && e.metaKey) {
        e.preventDefault()
        showCaptureWarning()
        return false
      }

      // Empêcher Alt+Print Screen
      if (e.key === "PrintScreen" && e.altKey) {
        e.preventDefault()
        showCaptureWarning()
        return false
      }

      // Empêcher Ctrl+Shift+S
      if (e.key === "S" && e.ctrlKey && e.shiftKey) {
        e.preventDefault()
        showCaptureWarning()
        return false
      }

      // Empêcher Win+Shift+S (Outil Capture Windows)
      if (e.key === "S" && e.metaKey && e.shiftKey) {
        e.preventDefault()
        showCaptureWarning()
        return false
      }
    }

    const preventRightClick = (e) => {
      e.preventDefault()
      showCaptureWarning()
      return false
    }

    const preventDragDrop = (e) => {
      e.preventDefault()
      return false
    }

    let visibilityCleanup = null

    const setupScreenRecordingDetection = () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const handleVisibilityChange = () => {
            if (document.hidden) {
              console.log("[v0] Page cachée - possible capture en cours")
            }
          }

          document.addEventListener("visibilitychange", handleVisibilityChange)

          visibilityCleanup = () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange)
          }
        }
      } catch (error) {
        console.log("[v0] Détection d'enregistrement non supportée")
      }
    }

    // Ajouter les event listeners
    document.addEventListener("keydown", preventScreenCapture)
    document.addEventListener("keyup", preventScreenCapture)
    document.addEventListener("contextmenu", preventRightClick)
    document.addEventListener("dragstart", preventDragDrop)
    document.addEventListener("selectstart", preventDragDrop)

    // Empêcher la sélection de texte
    document.body.style.userSelect = "none"
    document.body.style.webkitUserSelect = "none"
    document.body.style.mozUserSelect = "none"
    document.body.style.msUserSelect = "none"

    setupScreenRecordingDetection()

    // Nettoyage lors du démontage du composant
    return () => {
      document.removeEventListener("keydown", preventScreenCapture)
      document.removeEventListener("keyup", preventScreenCapture)
      document.removeEventListener("contextmenu", preventRightClick)
      document.removeEventListener("dragstart", preventDragDrop)
      document.removeEventListener("selectstart", preventDragDrop)

      // Restaurer la sélection de texte
      document.body.style.userSelect = ""
      document.body.style.webkitUserSelect = ""
      document.body.style.mozUserSelect = ""
      document.body.style.msUserSelect = ""

      if (visibilityCleanup) {
        visibilityCleanup()
      }
    }
  }, [])

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

  useEffect(() => {
    if (videos.length > 0) {
      const modules = Object.keys(organizeVideosIntoModules(videos))
      setExpandedModules(modules)
    }
  }, [videos])

  useEffect(() => {
    const fetchData = async () => {
      await fetchCourseData()
    }
    fetchData()
  }, [courseId]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCourseData = async () => {
    try {
      setIsLoading(true)

      // Utiliser apiService pour récupérer les données
      const courseData = await apiService.getStudentCourse(courseId)
      const videosData = await apiService.getStudentCourseVideos(courseId)

      setCourse(courseData)
      setVideos(videosData)

      // Sélectionner la première vidéo par défaut
      if (videosData.length > 0) {
        const allVideos = getAllVideosInOrder()
        setCurrentVideo(allVideos[0])
        setCurrentVideoIndex(0)
      }
    } catch (error) {
      console.error("Erreur lors du chargement du cours:", error)

      // Gestion des erreurs d'authentification
      if (error.message.includes("401")) {
        navigate("/student/login")
      } else if (error.message.includes("403")) {
        navigate("/student/dashboard")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const extractDriveFileId = (url) => {
    if (!url) return null

    // Ajout d'un pattern pour le format avec view?usp=drive_link et autres paramètres
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?drive\.google\.com\/file\/d\/([^/?]+)/,
      /(?:https?:\/\/)?(?:www\.)?drive\.google\.com\/open\?id=([^&]+)/,
      /(?:https?:\/\/)?(?:docs|drive)\.google\.com\/(?:a\/[^/]+\/)?(?:uc)\?(?:.+&)?id=([^&]+)/,
      /(?:https?:\/\/)?(?:www\.)?drive\.google\.com\/(?:a\/[^/]+\/)?(?:u\/\d+\/)?(?:uc)\?(?:.+&)?id=([^&]+)/,
      /(?:https?:\/\/)?(?:www\.)?drive\.google\.com\/file\/d\/([^/]+)\/view/,
      /(?:https?:\/\/)?(?:www\.)?drive\.google\.com\/file\/d\/([^/]+)\/view\?.*$/,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }

   
    try {
      if (url.includes("/file/d/") && url.includes("/view")) {
        const parts = url.split("/file/d/")[1]
        const id = parts.split("/view")[0]
        if (id) return id
      }
    } catch (error) {
      console.error("Erreur lors de l'extraction manuelle de l'ID:", error)
    }

    console.log("⚠️ Impossible d'extraire l'ID Google Drive de l'URL:", url)
    return null
  }

  const generateDriveEmbedUrl = (driveUrl) => {
    const fileId = extractDriveFileId(driveUrl)
    if (!fileId) return "about:blank"

    
    return `https://drive.google.com/file/d/${fileId}/preview?rm=minimal&dscb=1`
  }

  // Détecte si l'URL correspond à un fichier WebM
  const isWebmVideo = (url) => {
    if (!url) return false
    return url.toLowerCase().includes(".webm") || url.toLowerCase().includes("webm=true")
  }

  const generateWebmDirectUrl = (driveUrl) => {
    const fileId = extractDriveFileId(driveUrl)
    if (!fileId) return null

    // URL directe pour les fichiers WebM depuis Google Drive
    return `https://drive.google.com/uc?export=download&id=${fileId}`
  }

  // Fonction pour générer l'URL d'affichage du PDF Google Drive
  const generatePdfEmbedUrl = (pdfUrl) => {
    console.log("🔗 Transformation de l'URL PDF:", pdfUrl)

    const fileId = extractDriveFileId(pdfUrl)
    console.log("📄 ID du fichier PDF extrait:", fileId)

    if (!fileId) {
      console.warn("⚠️ Impossible d'extraire l'ID, utilisation de l'URL originale")
      return pdfUrl
    }

    return `https://drive.google.com/file/d/${fileId}/preview?rm=minimal&dscb=1`
  }

  // Fonction pour générer une vraie miniature de vidéo Google Drive
  const generateVideoThumbnail = (video) => {
    const fileId = extractDriveFileId(video.drive_url)
    if (fileId) {
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w320-h180`
    }
    return `https://via.placeholder.com/320x180/1f2937/ffffff?text=${encodeURIComponent(video.title.substring(0, 10))}`
  }

  const selectVideo = (video) => {
    const allVideos = getAllVideosInOrder()
    const index = allVideos.findIndex((v) => v.id === video.id)
    console.log("📄 Vidéo sélectionnée:", video)
    console.log("PDF URL:", video.pdf_url)
    if (video.pdf_url) {
      console.log("PDF ID extrait:", extractDriveFileId(video.pdf_url))
      console.log("PDF URL transformée:", generatePdfEmbedUrl(video.pdf_url))
    }
    setCurrentVideo(video)
    setCurrentVideoIndex(index)

    console.log("Vidéo sélectionnée:", video)
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
      <div
        className="course-view-container"
        style={{
          userSelect: "none",
          webkitUserSelect: "none",
          mozUserSelect: "none",
          msUserSelect: "none",
          webkitTouchCallout: "none",
          webkitUserDrag: "none",
          webkitTapHighlightColor: "transparent",
        }}
      >
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
                              alt={`Miniature de la vidéo ${video.title}`}
                              onError={(e) => {
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
                  {isWebmVideo(currentVideo.drive_url) ? (
                    // Lecteur vidéo HTML5 natif pour les fichiers WebM
                    <video
                      src={generateWebmDirectUrl(currentVideo.drive_url)}
                      title={currentVideo.title}
                      controls
                      controlsList="nodownload"
                      width="100%"
                      height="100%"
                      autoPlay
                      playsInline
                      className="webm-video-player"
                      onError={(e) => {
                        console.error("Erreur de lecture WebM:", e)
                        // Si vous avez un élément pour afficher des erreurs, vous pouvez l'utiliser ici
                        e.target.outerHTML = `<div class="video-error-message">
                          <p>Erreur de lecture de la vidéo WebM.</p>
                          <p>Causes possibles: format non supporté par le navigateur ou problème d'accès.</p>
                          <a href="${generateWebmDirectUrl(currentVideo.drive_url)}" target="_blank" rel="noopener noreferrer">
                            Essayer d'ouvrir la vidéo dans un nouvel onglet
                          </a>
                        </div>`
                      }}
                    >
                      Votre navigateur ne prend pas en charge les vidéos WebM.
                      <a href={generateWebmDirectUrl(currentVideo.drive_url)} target="_blank" rel="noopener noreferrer">
                        Ouvrir la vidéo dans un nouvel onglet
                      </a>
                    </video>
                  ) : (
                    // Iframe classique pour les autres formats de vidéo
                    <iframe
                      src={generateDriveEmbedUrl(currentVideo.drive_url)}
                      title={currentVideo.title}
                      frameBorder="0"
                      allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      width="100%"
                      height="100%"
                      // Ajouter sandbox pour limiter certaines fonctionnalités
                      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    />
                  )}
                </div>

                {/* Description de la vidéo */}
                {currentVideo.description && (
                  <div className="video-description">
                    <h3>À propos de cette leçon</h3>
                    <p>{currentVideo.description}</p>
                  </div>
                )}

                {/* PDF associé à la vidéo */}
                {currentVideo.pdf_url && (
                  <div className="video-pdf-container">
                    <div className="pdf-header-container">
                      <h3>Document du cours</h3>
                      <div className="pdf-button-container">
                        <a
                          href={generatePdfEmbedUrl(currentVideo.pdf_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pdf-view-button"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <path d="M14 2v6h6"></path>
                            <path d="M16 13H8"></path>
                            <path d="M16 17H8"></path>
                            <path d="M10 9H8"></path>
                          </svg>
                          Voir le document PDF
                        </a>
                      </div>
                    </div>
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