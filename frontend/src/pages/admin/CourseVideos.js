"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"
import apiService from "../../utils/api"
import "./CourseVideos.css"
import "./module-styles.css"

const CourseVideos = () => {
  // Hooks et fonctions pour la modale d'édition vidéo
  const [showEditModal, setShowEditModal] = useState(false)
  const [editVideo, setEditVideo] = useState(null)

  const openEditModal = (video) => {
    setEditVideo({ ...video })
    setShowEditModal(true)
  }

  const closeEditModal = () => {
    setShowEditModal(false)
    setEditVideo(null)
  }

  const handleEditChange = (e) => {
    setEditVideo({ ...editVideo, [e.target.name]: e.target.value })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editVideo.title || !editVideo.drive_url) {
      alert("Titre et URL Drive requis")
      return
    }
    try {
      const updated = await apiService.updateVideo(editVideo.id, editVideo)
      setVideos(videos.map((v) => (v.id === editVideo.id ? updated : v)))
      closeEditModal()
      alert("Vidéo modifiée !")
    } catch (error) {
      alert("Erreur lors de la modification")
    }
  }
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [videos, setVideos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    drive_url: "",
    pdf_url: "", 
    order_in_course: 0,
    is_free: false,
    module_name: "",
  })

  const [moduleNames, setModuleNames] = useState([])

  useEffect(() => {
    fetchCourse()
    fetchVideos()
  }, [courseId])

  useEffect(() => {
    if (videos.length > 0) {
      const uniqueModules = [...new Set(videos.filter((v) => v.module_name).map((v) => v.module_name))].sort((a, b) =>
        a.localeCompare(b),
      )
      setModuleNames(uniqueModules)
    }
  }, [videos])

  const fetchCourse = async () => {
    try {
      const data = await apiService.getCourse(courseId)
      setCourse(data)
    } catch (error) {
      console.error("Erreur lors du chargement du cours:", error)
    }
  }

  const fetchVideos = async () => {
    try {
      const data = await apiService.getCourseVideos(courseId)
      setVideos(data)
    } catch (error) {
      console.error("Erreur lors du chargement des vidéos:", error)
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

  const handleAddVideo = async (e) => {
    e.preventDefault()
    if (!extractDriveFileId(newVideo.drive_url)) {
      alert("URL Google Drive invalide")
      return
    }

    try {
      const video = await apiService.addVideoToCourse(courseId, {
        ...newVideo,
        course_id: Number.parseInt(courseId),
      })
      
      setVideos([...videos, video])
      setNewVideo({
        title: "",
        description: "",
        drive_url: "",
        pdf_url: "",  // Réinitialisation du champ PDF
        module_name: "",
        order_in_course: videos.length + 1,
        is_free: false,
      })
      setShowAddForm(false)
      alert("Vidéo ajoutée avec succès !")
    } catch (error) {
      alert(error?.response?.data?.detail || "Erreur lors de l'ajout")
    }
  }

  const deleteVideo = async (videoId) => {
    if (!window.confirm("Supprimer cette vidéo ?")) return

    try {
      await apiService.deleteVideo(videoId)
      setVideos(videos.filter((v) => v.id !== videoId))
      alert("Vidéo supprimée")
    } catch (error) {
      alert("Erreur lors de la suppression")
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des vidéos...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="course-videos-page">
        {/* Header */}
        <div className="page-header">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate("/admin/courses")}>
              ← Retour aux cours
            </button>
            <div className="course-info">
              <h1>📚 {course?.title}</h1>
              <p>
                {course?.subject} • {course?.level} • {videos.length} vidéos
              </p>
            </div>
          </div>
          <button className="btn-primary" onClick={() => setShowAddForm(true)}>
            🎥 Ajouter Vidéo
          </button>
        </div>

        {/* Formulaire d'ajout */}
        {showAddForm && (
          <div className="add-video-form">
            <div className="form-header">
              <h3>🎥 Ajouter une vidéo Google Drive</h3>
              <button className="close-btn" onClick={() => setShowAddForm(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleAddVideo}>
              <div className="form-group">
                <label>Titre de la vidéo *</label>
                <input
                  type="text"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                  placeholder="Titre de la vidéo"
                  required
                />
              </div>

              <div className="form-group">
                <label>URL Google Drive de la vidéo *</label>
                <input
                  type="url"
                  value={newVideo.drive_url}
                  onChange={(e) => setNewVideo({ ...newVideo, drive_url: e.target.value })}
                  placeholder="https://drive.google.com/file/d/..."
                  required
                />
              </div>

              <div className="form-group">
                <label>URL Google Drive du PDF (optionnel)</label>
                <input
                  type="url"
                  value={newVideo.pdf_url || ""}
                  onChange={(e) => setNewVideo({ ...newVideo, pdf_url: e.target.value })}
                  placeholder="https://drive.google.com/file/d/..."
                />
                <small className="input-help">
                  Ajoutez un lien vers un document PDF complémentaire pour cette vidéo.
                </small>
              </div>

              <div className="form-group">
                <label>Module/Playlist</label>
                <div className="module-selector">
                  <select
                    value={newVideo.module_name}
                    onChange={(e) => setNewVideo({ ...newVideo, module_name: e.target.value })}
                  >
                    <option value="">-- Sélectionnez ou créez un module --</option>
                    {moduleNames.map((name, idx) => (
                      <option key={idx} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  {!moduleNames.includes(newVideo.module_name) && newVideo.module_name && (
                    <div className="new-module-badge">Nouveau</div>
                  )}
                </div>
                <input
                  type="text"
                  value={newVideo.module_name}
                  onChange={(e) => setNewVideo({ ...newVideo, module_name: e.target.value })}
                  placeholder="Nom du module/playlist (ex: Les intégrales)"
                />
                <small className="input-help">
                  Regroupez vos vidéos en modules ou playlists avec un nom explicite.
                </small>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newVideo.description}
                  onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                  placeholder="Description de la vidéo..."
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ordre dans le cours</label>
                  <input
                    type="number"
                    value={newVideo.order_in_course}
                    onChange={(e) => setNewVideo({ ...newVideo, order_in_course: Number.parseInt(e.target.value) })}
                    min="0"
                  />
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={newVideo.is_free}
                      onChange={(e) => setNewVideo({ ...newVideo, is_free: e.target.checked })}
                    />
                    Vidéo gratuite
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddForm(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Ajouter la vidéo
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des vidéos */}
        <div className="videos-list">
          {videos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎥</div>
              <h3>Aucune vidéo dans ce cours</h3>
              <p>Commencez par ajouter votre première vidéo Google Drive</p>
              <button className="btn-primary" onClick={() => setShowAddForm(true)}>
                🎥 Ajouter une vidéo
              </button>
            </div>
          ) : (
            <div className="modules-container">
              {(() => {
                const modules = {}

                videos.forEach((video) => {
                  const moduleName = video.module_name || "Autres vidéos"
                  if (!modules[moduleName]) {
                    modules[moduleName] = []
                  }
                  modules[moduleName].push(video)
                })

                return Object.entries(modules).map(([moduleName, moduleVideos]) => (
                  <div key={moduleName} className="module">
                    <div className="module-header">
                      <h3 className="module-title">
                        {moduleName} ({moduleVideos.length})
                      </h3>
                    </div>
                    <div className="videos-grid">
                      {moduleVideos.map((video, index) => (
                        <div key={video.id} className="video-card">
                          <div className="video-thumbnail">
                            <img
                              src={
                                video.thumbnail_url ||
                                `/placeholder.svg?height=200&width=350&query=video thumbnail` ||
                                "/placeholder.svg"
                              }
                              alt={video.title}
                              onError={(e) => {
                                e.target.src = `/placeholder.svg?height=200&width=350&query=video thumbnail`
                              }}
                            />
                            <div className="video-order">#{video.order_in_course || index + 1}</div>
                            {video.is_free && <div className="video-free">GRATUIT</div>}
                          </div>
                          <div className="video-content">
                            <h4 className="video-title">{video.title}</h4>
                            {video.description && <p className="video-description">{video.description}</p>}
                            <div className="video-actions">
                              <a href={video.drive_url} target="_blank" rel="noopener noreferrer" className="btn-watch">
                                ▶️
                              </a>
                              <button className="btn-edit" onClick={() => openEditModal(video)}>
                                ✏️ Modifier
                              </button>
                              <button className="btn-delete" onClick={() => deleteVideo(video.id)}>
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              })()}
            </div>
          )}
        </div>
      {/* Modale édition vidéo, styles uniques */}
      {showEditModal && editVideo && (
        <div className="video-edit-modal-overlay">
          <div className="video-edit-modal">
            <div className="video-edit-header">
              <h2>✏️ Modifier la vidéo</h2>
              <button className="video-edit-close" onClick={closeEditModal}>✕</button>
            </div>
            <form className="video-edit-form" onSubmit={handleEditSubmit}>
              <div className="video-edit-group">
                <label htmlFor="title">Titre *</label>
                <input type="text" name="title" id="title" value={editVideo.title} onChange={handleEditChange} required />
              </div>
              <div className="video-edit-group">
                <label htmlFor="drive_url">URL Google Drive *</label>
                <input type="url" name="drive_url" id="drive_url" value={editVideo.drive_url} onChange={handleEditChange} required />
              </div>
              <div className="video-edit-group">
                <label htmlFor="pdf_url">URL PDF (optionnel)</label>
                <input type="url" name="pdf_url" id="pdf_url" value={editVideo.pdf_url || ""} onChange={handleEditChange} />
              </div>
              <div className="video-edit-group">
                <label htmlFor="module_name">Module/Playlist</label>
                <select name="module_name" id="module_name" value={editVideo.module_name} onChange={handleEditChange}>
                  <option value="">Sélectionner un module</option>
                  {moduleNames.map((name, idx) => (
                    <option key={idx} value={name}>{name}</option>
                  ))}
                </select>
                <input type="text" name="module_name" value={editVideo.module_name} onChange={handleEditChange} placeholder="Nom du module/playlist" />
              </div>
              <div className="video-edit-group">
                <label htmlFor="description">Description</label>
                <textarea name="description" id="description" value={editVideo.description} onChange={handleEditChange} rows={3} />
              </div>
              <div className="video-edit-group">
                <label htmlFor="order_in_course">Ordre dans le cours</label>
                <input type="number" name="order_in_course" id="order_in_course" value={editVideo.order_in_course} onChange={handleEditChange} min={0} />
              </div>
              <div className="video-edit-group">
                <label>
                  <input type="checkbox" name="is_free" checked={!!editVideo.is_free} onChange={e => setEditVideo({ ...editVideo, is_free: e.target.checked })} />
                  Vidéo gratuite
                </label>
              </div>
              <div className="video-edit-actions">
                <button type="button" className="video-edit-cancel" onClick={closeEditModal}>Annuler</button>
                <button type="submit" className="video-edit-save">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </AdminLayout>
  )
}

export default CourseVideos