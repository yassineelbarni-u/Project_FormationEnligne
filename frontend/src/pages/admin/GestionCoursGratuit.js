"use client"


import { useState, useEffect } from "react"
import { getCoursGratuitsAdmin, createCoursGratuit, updateCoursGratuit, deleteCoursGratuit } from "../../utils/api"
import AdminLayout from "../../components/admin/AdminLayout"
import "./GestionCoursGratuit.css"

const GestionCoursGratuit = () => {
  const [cours, setCours] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCours, setEditingCours] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    category: "cours",
  })

  useEffect(() => {
    fetchCours()
  }, [])

  const fetchCours = async () => {
    try {
      setLoading(true)
  const response = await getCoursGratuitsAdmin()
  console.log('Réponse API cours gratuits:', response)
  setCours(Array.isArray(response) ? response : [])
    } catch (error) {
      console.error("Erreur lors du chargement des cours:", error)
      setCours([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCours) {
        await updateCoursGratuit(editingCours.id, formData)
      } else {
        await createCoursGratuit(formData)
      }

      setShowModal(false)
      setEditingCours(null)
      setFormData({ title: "", url: "", description: "", category: "cours" })
      fetchCours()
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
    }
  }

  const handleEdit = (coursItem) => {
    setEditingCours(coursItem)
    setFormData({
      title: coursItem.title,
      url: coursItem.url,
      description: coursItem.description || "",
      category: coursItem.category,
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) {
      try {
        await deleteCoursGratuit(id)
        fetchCours()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
    }
  }

  const openModal = () => {
    setEditingCours(null)
    setFormData({ title: "", url: "", description: "", category: "cours" })
    setShowModal(true)
  }

  // Définition de filteredCours pour le mapping du tableau
  // Afficher toutes les catégories (cours et concours)
  const filteredCours = cours;
  if (loading) {
    return (
      <AdminLayout>
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Chargement des cours gratuits...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="dashboard-modern">
        <div className="dashboard-content-modern">
          <div className="title-section">
            <div className="title-content">
              <h1>Gestion des Cours Gratuits</h1>
              <p>Ajoutez et gérez vos ressources gratuites pour les étudiants</p>
            </div>
            <div className="action-buttons">
              <button className="btn-primary" onClick={openModal}>
                Ajouter un Cours
              </button>
            </div>
          </div>

          <div className="stats-grid-modern">
            <div className="stat-card-modern border-left-blue" style={{width: '100%'}}>
              <div className="cours-table-container">
                <table className="cours-table">
                  <thead>
                    <tr>
                      <th>Titre</th>
                      <th>Catégorie</th>
                      <th>URL</th>
                      <th>Description</th>
                      <th>Date de création</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCours.length > 0 ? (
                      filteredCours.map((coursItem) => (
                        <tr key={coursItem.id}>
                          <td>{coursItem.title}</td>
                          <td>
                            <span className={`category-badge ${coursItem.category}`}>
                              {coursItem.category === "cours" ? "Cours" : "Concours"}
                            </span>
                          </td>
                          <td>
                            <a href={coursItem.url} target="_blank" rel="noopener noreferrer">
                              Voir le lien
                            </a>
                          </td>
                          <td>{coursItem.description || "Aucune description"}</td>
                          <td>{coursItem.created_at ? new Date(coursItem.created_at).toLocaleDateString() : ""}</td>
                          <td>
                            <button className="btn-edit" onClick={() => handleEdit(coursItem)}>
                              Modifier
                            </button>
                            <button className="btn-delete" onClick={() => handleDelete(coursItem.id)}>
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="no-data">Aucun cours gratuit trouvé. Ajoutez-en un pour commencer.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h2>{editingCours ? "Modifier le Cours" : "Ajouter un Cours"}</h2>
                  <button className="modal-close" onClick={() => setShowModal(false)}>
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                  <div className="form-group">
                    <label>Titre *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>URL Google Drive *</label>
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://drive.google.com/..."
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Catégorie</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="cours">Cours</option>
                      <option value="concours">Concours</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="3"
                    />
                  </div>

                  <div className="modal-actions">
                    <button type="button" onClick={() => setShowModal(false)}>
                      Annuler
                    </button>
                    <button type="submit" className="btn-primary">
                      {editingCours ? "Modifier" : "Ajouter"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default GestionCoursGratuit
