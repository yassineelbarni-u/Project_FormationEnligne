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
        pdf_url: "",
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

  const closeModal = () => {
    setShowAddForm(false)
    setNewVideo({
      title: "",
      description: "",
      drive_url: "",
      pdf_url: "",
      module_name: "",
      order_in_course: videos.length + 1,
      is_free: false,
    })
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="course-videos-loading-modern">
          <div className="loading-spinner-modern"></div>
          <p>Chargement des vidéos...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="course-videos-page-modern">
        {/* Header moderne */}
        <div className="page-header-course-modern">
          <div className="header-left-modern">
            <button className="back-btn-modern" onClick={() => navigate("/admin/courses")}>
              ← Retour aux cours
            </button>
            <div className="course-info-modern">
              <div className="course-icon-modern">📚</div>
              <div className="course-details-modern">
                <h1>{course?.title}</h1>
                <p>{course?.subject} • {course?.level} • {videos.length} vidéos</p>
              </div>
            </div>
          </div>
          <button className="btn-primary-course-modern" onClick={() => setShowAddForm(true)}>
            🎥 Ajouter Vidéo
          </button>
        </div>

        {/* Statistiques rapides */}
        <div className="stats-course-modern">
          <div className="stat-item-modern">
            <div className="stat-icon-modern">🎬</div>
            <div className="stat-content-modern">
              <div className="stat-number-modern">{videos.length}</div>
              <div className="stat-label-modern">Vidéos</div>
            </div>
          </div>
          <div className="stat-item-modern">
            <div className="stat-icon-modern">📚</div>
            <div className="stat-content-modern">
              <div className="stat-number-modern">{moduleNames.length}</div>
              <div className="stat-label-modern">Modules</div>
            </div>
          </div>
          <div className="stat-item-modern">
            <div className="stat-icon-modern">🆓</div>
            <div className="stat-content-modern">
              <div className="stat-number-modern">{videos.filter(v => v.is_free).length}</div>
              <div className="stat-label-modern">Gratuites</div>
            </div>
          </div>
        </div>

        {/* Modal d'ajout moderne */}
        {showAddForm && (
          <div className="modal-overlay-course-modern" onClick={closeModal}>
            <div className="modal-container-course-modern" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-course-modern">
                <div className="modal-title-course-modern">
                  <div className="modal-icon-course-modern">🎥</div>
                  <div>
                    <h2>Nouvelle Vidéo</h2>
                    <p>Ajouter une vidéo Google Drive au cours</p>
                  </div>
                </div>
                <button className="modal-close-btn-course-modern" onClick={closeModal}>
                  ✕
                </button>
              </div>

              <div className="modal-body-course-modern">
                <form onSubmit={handleAddVideo} className="form-course-modern">
                  <div className="form-grid-course-modern">
                    <div className="form-field-course-modern">
                      <label htmlFor="title">
                        <span className="label-text-course-modern">Titre de la vidéo</span>
                        <span className="label-required-course-modern">*</span>
                      </label>
                      <input
                        id="title"
                        type="text"
                        value={newVideo.title}
                        onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                        placeholder="Ex: Introduction aux fonctions"
                        required
                        className="form-input-course-modern"
                      />
                    </div>

                    <div className="form-field-course-modern">
                      <label htmlFor="order">
                        <span className="label-text-course-modern">Ordre</span>
                      </label>
                      <input
                        id="order"
                        type="number"
                        value={newVideo.order_in_course}
                        onChange={(e) => setNewVideo({ ...newVideo, order_in_course: Number.parseInt(e.target.value) })}
                        min="0"
                        className="form-input-course-modern"
                      />
                    </div>
                  </div>

                  <div className="form-field-course-modern">
                    <label htmlFor="drive_url">
                      <span className="label-text-course-modern">URL Google Drive</span>
                      <span className="label-required-course-modern">*</span>
                    </label>
                    <input
                      id="drive_url"
                      type="url"
                      value={newVideo.drive_url}
                      onChange={(e) => setNewVideo({ ...newVideo, drive_url: e.target.value })}
                      placeholder="https://drive.google.com/file/d/..."
                      required
                      className="form-input-course-modern"
                    />
                  </div>

                  <div className="form-field-course-modern">
                    <label htmlFor="pdf_url">
                      <span className="label-text-course-modern">URL PDF (optionnel)</span>
                    </label>
                    <input
                      id="pdf_url"
                      type="url"
                      value={newVideo.pdf_url || ""}
                      onChange={(e) => setNewVideo({ ...newVideo, pdf_url: e.target.value })}
                      placeholder="https://drive.google.com/file/d/..."
                      className="form-input-course-modern"
                    />
                    <div className="field-hint-course-modern">Document PDF complémentaire pour cette vidéo</div>
                  </div>

                  <div className="form-field-course-modern">
                    <label htmlFor="module_name">
                      <span className="label-text-course-modern">Module/Playlist</span>
                    </label>
                    <select
                      id="module_select"
                      value={newVideo.module_name}
                      onChange={(e) => setNewVideo({ ...newVideo, module_name: e.target.value })}
                      className="form-select-course-modern"
                    >
                      <option value="">-- Sélectionnez un module --</option>
                      {moduleNames.map((name, idx) => (
                        <option key={idx} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                    <input
                      id="module_name"
                      type="text"
                      value={newVideo.module_name}
                      onChange={(e) => setNewVideo({ ...newVideo, module_name: e.target.value })}
                      placeholder="Ou créez un nouveau module..."
                      className="form-input-course-modern"
                    />
                    <div className="field-hint-course-modern">Regroupez vos vidéos en modules thématiques</div>
                  </div>

                  <div className="form-field-course-modern">
                    <label htmlFor="description">
                      <span className="label-text-course-modern">Description</span>
                    </label>
                    <textarea
                      id="description"
                      value={newVideo.description}
                      onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                      placeholder="Description de la vidéo..."
                      rows="3"
                      className="form-textarea-course-modern"
                    />
                  </div>

                  <div className="form-field-course-modern">
                    <div className="checkbox-field-course-modern">
                      <input
                        id="is_free"
                        type="checkbox"
                        checked={newVideo.is_free}
                        onChange={(e) => setNewVideo({ ...newVideo, is_free: e.target.checked })}
                        className="form-checkbox-course-modern"
                      />
                      <label htmlFor="is_free" className="checkbox-label-course-modern">
                        <span className="checkbox-text-course-modern">Vidéo gratuite</span>
                        <span className="checkbox-description-course-modern">
                          Cette vidéo sera accessible gratuitement
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="modal-actions-course-modern">
                    <button type="button" className="btn-secondary-course-modern" onClick={closeModal}>
                      Annuler
                    </button>
                    <button type="submit" className="btn-primary-course-modern">
                      Ajouter la vidéo
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Liste des vidéos par modules */}
        <div className="videos-section-course-modern">
          {videos.length === 0 ? (
            <div className="empty-state-course-modern">
              <div className="empty-illustration-course-modern">
                <div className="empty-icon-course-modern">🎥</div>
                <div className="empty-graphics-course-modern"></div>
              </div>
              <div className="empty-content-course-modern">
                <h3>Aucune vidéo dans ce cours</h3>
                <p>Commencez par ajouter votre première vidéo Google Drive</p>
                <button className="btn-primary-course-modern" onClick={() => setShowAddForm(true)}>
                  🎥 Ajouter une vidéo
                </button>
              </div>
            </div>
          ) : (
            <div className="modules-container-modern">
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
                  <div key={moduleName} className="module-modern">
                    <div className="module-header-modern">
                      <div className="module-title-modern">
                        <div className="module-icon-modern">📁</div>
                        <div>
                          <h3>{moduleName}</h3>
                          <p>{moduleVideos.length} vidéo{moduleVideos.length > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    </div>
                    <div className="videos-grid-course-modern">
                      {moduleVideos.map((video, index) => (
                        <div key={video.id} className="video-card-course-modern">
                          <div className="video-thumbnail-course-modern">
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
                            <div className="video-overlay-course-modern">
                              <div className="video-badges-course-modern">
                                <div className="video-order-course-modern">#{video.order_in_course || index + 1}</div>
                                {video.is_free && <div className="video-free-course-modern">🆓 GRATUIT</div>}
                              </div>
                            </div>
                          </div>

                          <div className="video-content-course-modern">
                            <h4 className="video-title-course-modern">{video.title}</h4>
                            {video.description && (
                              <p className="video-description-course-modern">{video.description}</p>
                            )}
                            
                            <div className="video-footer-course-modern">
                              <div className="video-actions-course-modern">
                                <a 
                                  href={video.drive_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="btn-action-course-modern watch"
                                  title="Voir sur Google Drive"
                                >
                                  ▶️
                                </a>
                                <button 
                                  className="btn-action-course-modern edit" 
                                  onClick={() => openEditModal(video)}
                                  title="Modifier la vidéo"
                                >
                                  ✏️
                                </button>
                                <button 
                                  className="btn-action-course-modern delete" 
                                  onClick={() => deleteVideo(video.id)}
                                  title="Supprimer la vidéo"
                                >
                                  🗑️
                                </button>
                              </div>
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

        {/* Modal d'édition */}
        {showEditModal && editVideo && (
          <div className="modal-overlay-course-modern" onClick={closeEditModal}>
            <div className="modal-container-course-modern" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-course-modern">
                <div className="modal-title-course-modern">
                  <div className="modal-icon-course-modern">✏️</div>
                  <div>
                    <h2>Modifier la vidéo</h2>
                    <p>Modifiez les informations de la vidéo</p>
                  </div>
                </div>
                <button className="modal-close-btn-course-modern" onClick={closeEditModal}>
                  ✕
                </button>
              </div>

              <div className="modal-body-course-modern">
                <form onSubmit={handleEditSubmit} className="form-course-modern">
                  <div className="form-grid-course-modern">
                    <div className="form-field-course-modern">
                      <label htmlFor="edit_title">
                        <span className="label-text-course-modern">Titre</span>
                        <span className="label-required-course-modern">*</span>
                      </label>
                      <input
                        id="edit_title"
                        type="text"
                        name="title"
                        value={editVideo.title}
                        onChange={handleEditChange}
                        required
                        className="form-input-course-modern"
                      />
                    </div>

                    <div className="form-field-course-modern">
                      <label htmlFor="edit_order">
                        <span className="label-text-course-modern">Ordre</span>
                      </label>
                      <input
                        id="edit_order"
                        type="number"
                        name="order_in_course"
                        value={editVideo.order_in_course}
                        onChange={handleEditChange}
                        min="0"
                        className="form-input-course-modern"
                      />
                    </div>
                  </div>

                  <div className="form-field-course-modern">
                    <label htmlFor="edit_drive_url">
                      <span className="label-text-course-modern">URL Google Drive</span>
                      <span className="label-required-course-modern">*</span>
                    </label>
                    <input
                      id="edit_drive_url"
                      type="url"
                      name="drive_url"
                      value={editVideo.drive_url}
                      onChange={handleEditChange}
                      required
                      className="form-input-course-modern"
                    />
                  </div>

                  <div className="form-field-course-modern">
                    <label htmlFor="edit_pdf_url">
                      <span className="label-text-course-modern">URL PDF (optionnel)</span>
                    </label>
                    <input
                      id="edit_pdf_url"
                      type="url"
                      name="pdf_url"
                      value={editVideo.pdf_url || ""}
                      onChange={handleEditChange}
                      className="form-input-course-modern"
                    />
                  </div>

                  <div className="form-field-course-modern">
                    <label htmlFor="edit_module_name">
                      <span className="label-text-course-modern">Module/Playlist</span>
                    </label>
                    <select
                      id="edit_module_select"
                      name="module_name"
                      value={editVideo.module_name}
                      onChange={handleEditChange}
                      className="form-select-course-modern"
                    >
                      <option value="">-- Sélectionnez un module --</option>
                      {moduleNames.map((name, idx) => (
                        <option key={idx} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                    <input
                      id="edit_module_name"
                      type="text"
                      name="module_name"
                      value={editVideo.module_name}
                      onChange={handleEditChange}
                      placeholder="Nom du module/playlist"
                      className="form-input-course-modern"
                    />
                  </div>

                  <div className="form-field-course-modern">
                    <label htmlFor="edit_description">
                      <span className="label-text-course-modern">Description</span>
                    </label>
                    <textarea
                      id="edit_description"
                      name="description"
                      value={editVideo.description}
                      onChange={handleEditChange}
                      rows="3"
                      className="form-textarea-course-modern"
                    />
                  </div>

                  <div className="form-field-course-modern">
                    <div className="checkbox-field-course-modern">
                      <input
                        id="edit_is_free"
                        type="checkbox"
                        name="is_free"
                        checked={!!editVideo.is_free}
                        onChange={(e) => setEditVideo({ ...editVideo, is_free: e.target.checked })}
                        className="form-checkbox-course-modern"
                      />
                      <label htmlFor="edit_is_free" className="checkbox-label-course-modern">
                        <span className="checkbox-text-course-modern">Vidéo gratuite</span>
                      </label>
                    </div>
                  </div>

                  <div className="modal-actions-course-modern">
                    <button type="button" className="btn-secondary-course-modern" onClick={closeEditModal}>
                      Annuler
                    </button>
                    <button type="submit" className="btn-primary-course-modern">
                      Enregistrer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default CourseVideos
