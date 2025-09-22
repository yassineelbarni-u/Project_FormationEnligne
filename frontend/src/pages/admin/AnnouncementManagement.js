"use client"

import { useState, useEffect } from "react"
import AdminLayout from "../../components/admin/AdminLayout"
import apiService from "../../utils/api"
import "./AnnouncementManagement.css"

const API_URL = process.env.REACT_APP_API_URL;

const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)
  const [formData, setFormData] = useState({
    image: null,
    title: "",
    description: "",
    price: ""
  })
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const data = await apiService.getAnnouncements()
      setAnnouncements(data)
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors du chargement des annonces" })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.image && !editingAnnouncement) {
      setMessage({ type: "error", text: "L'image est requise" })
      return
    }

    try {
      const submitData = new FormData()
      if (formData.image) {
        submitData.append("image", formData.image)
      }
      
      if (formData.title) {
        submitData.append("title", formData.title)
      }
      
      if (formData.description) {
        submitData.append("description", formData.description)
      }
      
      if (formData.price) {
        submitData.append("price", formData.price)
      }

      if (editingAnnouncement) {
        await apiService.updateAnnouncement(editingAnnouncement.id, submitData)
        setMessage({ type: "success", text: "Annonce modifiée avec succès" })
      } else {
        await apiService.createAnnouncement(submitData)
        setMessage({ type: "success", text: "Annonce créée avec succès" })
      }

      resetForm()
      fetchAnnouncements()
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Erreur lors de l'enregistrement" })
    }
  }

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement)
    setFormData({
      image: null,
      title: announcement.title || "",
      description: announcement.description || "",
      price: announcement.price || ""
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      try {
        await apiService.deleteAnnouncement(id)
        setMessage({ type: "success", text: "Annonce supprimée avec succès" })
        fetchAnnouncements()
      } catch (error) {
        setMessage({ type: "error", text: "Erreur lors de la suppression" })
      }
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      await apiService.toggleAnnouncementStatus(id)
      setMessage({ type: "success", text: "Statut modifié avec succès" })
      fetchAnnouncements()
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de la modification du statut" })
    }
  }

  const resetForm = () => {
    setFormData({ image: null, title: "", description: "", price: "" })
    setEditingAnnouncement(null)
    setShowForm(false)
    setMessage({ type: "", text: "" })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: "error", text: "L'image ne doit pas dépasser 5MB" })
        return
      }
      setFormData({ ...formData, image: file })
    }
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <AdminLayout>
      <div className="announcement-management-modern">
        {/* Header moderne */}
        <div className="page-header-announcement-modern">
          <div className="header-content-announcement-modern">
            <div className="header-icon-announcement-modern">📢</div>
            <div className="header-text-announcement-modern">
              <h1>Gestion des Annonces</h1>
              <p>Gérez vos annonces et promotions</p>
            </div>
          </div>
          <button className="btn-primary-announcement-modern" onClick={() => setShowForm(true)}>
            ➕ Nouvelle Annonce
          </button>
        </div>

        {/* Statistiques */}
        <div className="stats-section-announcement-modern">
          <div className="stat-card-announcement-modern total">
            <div className="stat-icon-announcement-modern">📢</div>
            <div className="stat-content-announcement-modern">
              <div className="stat-number-announcement-modern">{announcements.length}</div>
              <div className="stat-label-announcement-modern">Total</div>
            </div>
          </div>
          <div className="stat-card-announcement-modern active">
            <div className="stat-icon-announcement-modern">✅</div>
            <div className="stat-content-announcement-modern">
              <div className="stat-number-announcement-modern">{announcements.filter(a => a.is_active).length}</div>
              <div className="stat-label-announcement-modern">Actives</div>
            </div>
          </div>
          <div className="stat-card-announcement-modern inactive">
            <div className="stat-icon-announcement-modern">⏸️</div>
            <div className="stat-content-announcement-modern">
              <div className="stat-number-announcement-modern">{announcements.filter(a => !a.is_active).length}</div>
              <div className="stat-label-announcement-modern">Inactives</div>
            </div>
          </div>
        </div>

        {/* Message d'alerte */}
        {message.text && (
          <div className={`alert-modern ${message.type === "success" ? "alert-success-modern" : "alert-error-modern"}`}>
            <div className="alert-icon-modern">
              {message.type === "success" ? "✅" : "⚠️"}
            </div>
            <div className="alert-content-modern">{message.text}</div>
            <button className="alert-close-modern" onClick={() => setMessage({ type: "", text: "" })}>
              ✕
            </button>
          </div>
        )}

        {/* Modal moderne */}
        {showForm && (
          <div className="modal-overlay-announcement-modern" onClick={resetForm}>
            <div className="modal-container-announcement-modern" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-announcement-modern">
                <div className="modal-title-announcement-modern">
                  <div className="modal-icon-announcement-modern">
                    {editingAnnouncement ? "✏️" : "📢"}
                  </div>
                  <div>
                    <h2>{editingAnnouncement ? "Modifier l'Annonce" : "Nouvelle Annonce"}</h2>
                    <p>{editingAnnouncement ? "Modifiez votre annonce" : "Créez une nouvelle annonce"}</p>
                  </div>
                </div>
                <button className="modal-close-btn-announcement-modern" onClick={resetForm}>
                  ✕
                </button>
              </div>

              <div className="modal-body-announcement-modern">
                <form onSubmit={handleSubmit} className="announcement-form-modern">
                  <div className="form-field-announcement-modern">
                    <label htmlFor="title">
                      <span className="label-text-announcement-modern">Titre</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Titre de l'annonce (optionnel)"
                      className="form-input-announcement-modern"
                    />
                  </div>
                  
                  <div className="form-field-announcement-modern">
                    <label htmlFor="description">
                      <span className="label-text-announcement-modern">Description</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Description du cours (optionnel)"
                      rows="4"
                      className="form-textarea-announcement-modern"
                    />
                  </div>
                  
                  <div className="form-field-announcement-modern">
                    <label htmlFor="price">
                      <span className="label-text-announcement-modern">Prix</span>
                    </label>
                    <input
                      type="text"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Ex: 500 DH / Gratuit (optionnel)"
                      className="form-input-announcement-modern"
                    />
                  </div>
                  
                  <div className="form-field-announcement-modern">
                    <label htmlFor="image">
                      <span className="label-text-announcement-modern">Image de l'annonce</span>
                      {!editingAnnouncement && <span className="label-required-announcement-modern">*</span>}
                    </label>
                    <div className="image-upload-announcement-modern">
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        required={!editingAnnouncement}
                        className="form-input-file-announcement-modern"
                      />
                      <div className="image-upload-help-announcement-modern">
                        Formats acceptés: JPG, PNG, GIF (max 5MB)
                      </div>
                    </div>

                    {editingAnnouncement && editingAnnouncement.image_url && (
                      <div className="current-image-announcement-modern">
                        <label>Image actuelle:</label>
                        <img
                          src={`${API_URL}${editingAnnouncement.image_url}`}
                          alt="Annonce actuelle"
                          className="preview-image-announcement-modern"
                        />
                      </div>
                    )}

                    {formData.image && (
                      <div className="current-image-announcement-modern">
                        <label>Aperçu de la nouvelle image:</label>
                        <img
                          src={URL.createObjectURL(formData.image) || "/placeholder.svg"}
                          alt="Aperçu"
                          className="preview-image-announcement-modern"
                        />
                      </div>
                    )}
                  </div>

                  <div className="modal-actions-announcement-modern">
                    <button type="button" className="btn-secondary-announcement-modern" onClick={resetForm}>
                      Annuler
                    </button>
                    <button type="submit" className="btn-primary-announcement-modern">
                      {editingAnnouncement ? "Modifier" : "Créer"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Section des annonces */}
        <div className="announcements-section-modern">
          <div className="section-header-announcement-modern">
            <h2>Mes Annonces ({announcements.length})</h2>
            <p>Gérez vos annonces et promotions</p>
          </div>

          {loading ? (
            <div className="announcements-loading-modern">
              <div className="loading-grid-announcement-modern">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="announcement-card-skeleton-modern">
                    <div className="skeleton-image-announcement-modern"></div>
                    <div className="skeleton-content-announcement-modern">
                      <div className="skeleton-title-announcement-modern"></div>
                      <div className="skeleton-text-announcement-modern"></div>
                      <div className="skeleton-actions-announcement-modern"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : announcements.length === 0 ? (
            <div className="empty-state-announcement-modern">
              <div className="empty-illustration-announcement-modern">
                <div className="empty-icon-announcement-modern">📢</div>
                <div className="empty-graphics-announcement-modern"></div>
              </div>
              <div className="empty-content-announcement-modern">
                <h3>Aucune annonce</h3>
                <p>Ajoutez votre première annonce pour promouvoir vos cours</p>
                <button className="btn-primary-announcement-modern" onClick={() => setShowForm(true)}>
                  Créer une annonce
                </button>
              </div>
            </div>
          ) : (
            <div className="announcements-grid-modern">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="announcement-card-modern">
                  <div className="announcement-image-modern">
                    <img src={`${API_URL}/uploads${announcement.image_url}`} alt="Annonce" />
                    <div className="announcement-overlay-modern">
                      <div className={`status-badge-modern ${announcement.is_active ? "active" : "inactive"}`}>
                        {announcement.is_active ? "✅ Actif" : "⏸️ Inactif"}
                      </div>
                    </div>
                  </div>

                  <div className="announcement-content-modern">
                    <h3 className="announcement-title-modern">
                      {announcement.title || announcement.image_filename}
                    </h3>
                    {announcement.description && (
                      <p className="announcement-description-modern">{announcement.description}</p>
                    )}
                    {announcement.price && (
                      <div className="announcement-price-modern">
                        <strong>Prix:</strong> {announcement.price}
                      </div>
                    )}
                    <div className="announcement-date-modern">
                      Créé le {new Date(announcement.created_at).toLocaleDateString("fr-FR")}
                    </div>

                    <div className="announcement-actions-modern">
                      <button 
                        className="btn-action-announcement-modern edit" 
                        onClick={() => handleEdit(announcement)}
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button
                        className={`btn-action-announcement-modern ${announcement.is_active ? "deactivate" : "activate"}`}
                        onClick={() => handleToggleStatus(announcement.id)}
                        title={announcement.is_active ? "Désactiver" : "Activer"}
                      >
                        {announcement.is_active ? "👁️‍🗨️" : "👁️"}
                      </button>
                      <button 
                        className="btn-action-announcement-modern delete" 
                        onClick={() => handleDelete(announcement.id)}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AnnouncementManagement
