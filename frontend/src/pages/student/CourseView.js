"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import StudentLayout from "../../components/student/StudentLayout"
import styles from "./CourseView.module.css"

const BACKEND_URL = "http://localhost:8001"

const CourseView = () => {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [videos, setVideos] = useState([])
  const [currentVideo, setCurrentVideo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCourseData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId])

  const fetchCourseData = async () => {
    try {
      const token = localStorage.getItem("student_token")

      // Récupérer les détails du cours
      const courseResponse = await fetch(`${BACKEND_URL}/api/student/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Récupérer les vidéos du cours
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
          setCurrentVideo(videosData[0])
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
      /(?:https?:\/\/)?(?:www\.)?drive\.google\.com\/file\/d\/([^/?]+)/, // Format /file/d/{id}
      /(?:https?:\/\/)?(?:www\.)?drive\.google\.com\/open\?id=([^&]+)/, // Format ?id={id}
      /(?:https?:\/\/)?(?:docs|drive)\.google\.com\/(?:a\/[^/]+\/)?(?:uc)\?(?:.+&)?id=([^&]+)/, // Format ?id={id} pour uc
      /(?:https?:\/\/)?(?:www\.)?drive\.google\.com\/(?:a\/[^/]+\/)?(?:u\/\d+\/)?(?:uc)\?(?:.+&)?id=([^&]+)/, // Format étendu avec u/x/
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  // Générer l'URL d'intégration de Google Drive
  const generateDriveEmbedUrl = (fileId) => {
    // Si on n'a pas réussi à extraire l'ID, retourner une URL par défaut
    if (!fileId) return "about:blank";
    return `https://drive.google.com/file/d/${fileId}/preview`
  }

  const formatDuration = (duration) => {
    if (!duration) return "N/A"
    
    // Si la durée est juste un nombre (minutes), formater en MM:00
    if (!isNaN(duration)) {
      const minutes = parseInt(duration);
      return `${minutes}:00`;
    }
    
    // Si le format est déjà MM:SS, le retourner tel quel
    return duration;
  }

  if (isLoading) {
    return (
      <StudentLayout>
        <div className={styles.courseLoading}>
          <div className={styles.loadingSpinner}></div>
          <p>Chargement du cours...</p>
        </div>
      </StudentLayout>
    )
  }

  if (!course) {
    return (
      <StudentLayout>
        <div className={styles.courseError}>
          <div className={styles.errorIcon}>📚</div>
          <h2>Cours non trouvé</h2>
          <p>Ce cours n'existe pas ou vous n'y avez pas accès.</p>
          <button onClick={() => navigate("/student/dashboard")} className={styles.btnBack}>
            Retour aux cours
          </button>
        </div>
      </StudentLayout>
    )
  }

  return (
    <StudentLayout>
      <div className={styles.courseView}>
        {/* Header du cours */}
        <div className={styles.courseHeader}>
          <button onClick={() => navigate("/student/dashboard")} className={styles.backBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Retour aux cours
          </button>
          <div className={styles.courseInfo}>
            <h1>{course.title}</h1>
            <div className={styles.courseMeta}>
              <span className={styles.subject}>{course.subject}</span>
              <span className={styles.level}>{course.level}</span>
              <span className={styles.videoCount}>{videos.length} vidéos</span>
            </div>
          </div>
        </div>

        <div className={styles.courseContent}>
          {/* Sidebar avec liste des vidéos */}
          <div className={styles.videoSidebar}>
            <div className={styles.sidebarHeader}>
              <h3>Contenu du cours</h3>
              <p>{videos.length} vidéos</p>
            </div>

            <div className={styles.videoList}>
              {videos.map((video, index) => (
                <div
                  key={video.id}
                  className={`${styles.videoItem} ${currentVideo?.id === video.id ? styles.active : ""}`}
                  onClick={() => setCurrentVideo(video)}
                >
                  <div className={styles.videoThumbnail}>
                    <img
                      src={
                        video.thumbnail_url ||
                        `https://drive.google.com/thumbnail?id=${extractDriveFileId(video.drive_url)}`
                      }
                      alt={video.title}
                      onError={(e) => {
                        // En cas d'erreur, utiliser une image de secours générée dynamiquement
                        e.target.onerror = null;
                        e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="90" viewBox="0 0 160 90" fill="none"><rect width="160" height="90" fill="%23667eea"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" fill="white" font-size="12">Vidéo</text></svg>`;
                      }}
                    />
                    <div className={styles.videoDuration}>{formatDuration(video.duration)}</div>
                    <div className={styles.playOverlay}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    </div>
                  </div>

                  <div className={styles.videoInfo}>
                    <div className={styles.videoNumber}>Séance {index + 1}</div>
                    <h4 className={styles.videoTitle}>{video.title}</h4>
                    {video.description && <p className={styles.videoDescription}>{video.description}</p>}
                  </div>

                  {video.is_free && <span className={styles.freeBadge}>Gratuit</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Lecteur vidéo principal */}
          <div className={styles.videoPlayerSection}>
            {currentVideo ? (
              <div className={styles.videoPlayer}>
                <div className={styles.videoHeader}>
                  <h2>{currentVideo.title}</h2>
                  <div className={styles.videoMeta}>
                    <span>Durée: {formatDuration(currentVideo.duration)}</span>
                    {currentVideo.is_free && <span className={styles.freeTag}>Gratuit</span>}
                  </div>
                </div>
                
                <div className={styles.drivePlayer}>
                  <iframe
                    src={generateDriveEmbedUrl(extractDriveFileId(currentVideo.drive_url))}
                    title={currentVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {currentVideo.description && (
                  <div className={styles.videoDescriptionFull}>
                    <h3>À propos de la leçon</h3>
                    <p>{currentVideo.description}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.noVideoSelected}>
                <div className={styles.noVideoIcon}>🎥</div>
                <h3>Sélectionnez une vidéo</h3>
                <p>Choisissez une vidéo dans la liste pour commencer à apprendre</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  )
}

export default CourseView
