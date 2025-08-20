"use client"

import { useState, useEffect } from "react"
import AdminLayout from "../../components/admin/AdminLayout"
import apiService from "../../utils/api"
import "./AnnouncementManagement.css"

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
      
      // Ajouter les nouveaux champs au formulaire
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
      <div className="announcement-management">
        <div className="page-header">
          <h1>Gestion des Annonces</h1>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <span className="material-symbols-outlined">add</span>
            Nouvelle Annonce
          </button>
        </div>

        {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

        {showForm && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>{editingAnnouncement ? "Modifier" : "Nouvelle"} Annonce</h2>
                <button className="close-btn" onClick={resetForm}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="announcement-form">
                <div className="form-group">
                  <label htmlFor="title">Titre (optionnel)</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Titre de l'annonce"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Description (optionnel)</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Description du cours"
                    rows="4"
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label htmlFor="price">Prix (optionnel)</label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Ex: 500 DH / Gratuit"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="image">Image de l'annonce</label>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    required={!editingAnnouncement}
                  />
                  <small>Formats acceptés: JPG, PNG, GIF (max 5MB)</small>
                </div>

                {editingAnnouncement && editingAnnouncement.image_url && (
                  <div className="current-image">
                    <label>Image actuelle:</label>
                    <img
                      src={`http://localhost:8001${editingAnnouncement.image_url}`}
                      alt="Annonce actuelle"
                      className="preview-image"
                    />
                  </div>
                )}

                {formData.image && (
                  <div className="current-image">
                    <label>Aperçu de la nouvelle image:</label>
                    <img
                      src={URL.createObjectURL(formData.image) || "/placeholder.svg"}
                      alt="Aperçu"
                      className="preview-image"
                    />
                  </div>
                )}

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingAnnouncement ? "Modifier" : "Créer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="announcements-grid">
          {loading ? (
            <div className="loading">Chargement...</div>
          ) : announcements.length === 0 ? (
            <div className="empty-state">
              <span className="material-symbols-outlined">campaign</span>
              <h3>Aucune annonce</h3>
              <p>Ajoutez votre première image d'annonce</p>
            </div>
          ) : (
            announcements.map((announcement) => (
              <div key={announcement.id} className="announcement-card">
                <div className="announcement-image">
                  <img src={`http://localhost:8001${announcement.image_url}`} alt="Annonce" />
                  <div className={`status-badge ${announcement.is_active ? "active" : "inactive"}`}>
                    {announcement.is_active ? "Actif" : "Inactif"}
                  </div>
                </div>

                <div className="announcement-content">
                  <h3>{announcement.title || announcement.image_filename}</h3>
                  {announcement.description && (
                    <p className="announcement-description">{announcement.description}</p>
                  )}
                  {announcement.price && (
                    <p className="announcement-price"><strong>Prix:</strong> {announcement.price}</p>
                  )}
                  <p className="announcement-date">
                    Créé le {new Date(announcement.created_at).toLocaleDateString("fr-FR")}
                  </p>

                  <div className="announcement-actions">
                    <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(announcement)}>
                      <span className="material-symbols-outlined">edit</span>
                      Modifier
                    </button>

                    <button
                      className={`btn btn-sm ${announcement.is_active ? "btn-warning" : "btn-success"}`}
                      onClick={() => handleToggleStatus(announcement.id)}
                    >
                      <span className="material-symbols-outlined">
                        {announcement.is_active ? "visibility_off" : "visibility"}
                      </span>
                      {announcement.is_active ? "Désactiver" : "Activer"}
                    </button>

                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(announcement.id)}>
                      <span className="material-symbols-outlined">delete</span>
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AnnouncementManagement
