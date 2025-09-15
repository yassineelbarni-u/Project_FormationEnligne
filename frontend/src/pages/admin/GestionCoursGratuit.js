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
  const [isSubmitting, setIsSubmitting] = useState(false)
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
    setIsSubmitting(true)
    try {
      if (editingCours) {
        await updateCoursGratuit(editingCours.id, formData)
      } else {
        await createCoursGratuit(formData)
      }

      closeModal()
      fetchCours()
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
    } finally {
      setIsSubmitting(false)
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

  const closeModal = () => {
    setShowModal(false)
    setEditingCours(null)
    setFormData({ title: "", url: "", description: "", category: "cours" })
  }

  const filteredCours = cours

  if (loading) {
    return (
      <AdminLayout>
        <div className="cours-gratuit-loading">
          <div className="loading-spinner"></div>
          <p>Chargement des cours gratuits...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="cours-gratuit-page">
        {/* Header moderne */}
        <div className="page-header-modern">
          <div className="header-content-modern">
            <div className="header-icon">📚</div>
            <div className="header-text">
              <h1>Gestion des Cours Gratuits</h1>
              <p>Ajoutez et gérez vos ressources gratuites pour les étudiants</p>
            </div>
          </div>
          <button className="btn-primary-modern" onClick={openModal}>
            ➕ Ajouter un Cours
          </button>
        </div>

        {/* Statistiques */}
        <div className="stats-section">
          <div className="stat-card-modern">
            <div className="stat-icon">📖</div>
            <div className="stat-content">
              <div className="stat-number">{cours.filter(c => c.category === 'cours').length}</div>
              <div className="stat-label">Cours</div>
            </div>
          </div>
          <div className="stat-card-modern">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <div className="stat-number">{cours.filter(c => c.category === 'concours').length}</div>
              <div className="stat-label">Concours</div>
            </div>
          </div>
          <div className="stat-card-modern">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-number">{cours.length}</div>
              <div className="stat-label">Total</div>
            </div>
          </div>
        </div>

        {/* Tableau des cours */}
        <div className="cours-section">
          <div className="section-header-modern">
            <h2>Liste des Ressources</h2>
            <p>Gérez vos cours et concours gratuits</p>
          </div>

          <div className="table-container-modern">
            {filteredCours.length > 0 ? (
              <table className="cours-table-modern">
                <thead>
                  <tr>
                    <th>📋 Titre</th>
                    <th>🏷️ Catégorie</th>
                    <th>🔗 Lien</th>
                    <th>📝 Description</th>
                    <th>📅 Date</th>
                    <th>⚙️ Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCours.map((coursItem) => (
                    <tr key={coursItem.id} className="table-row-modern">
                      <td>
                        <div className="title-cell">
                          <div className="title-text">{coursItem.title}</div>
                        </div>
                      </td>
                      <td>
                        <span className={`category-badge-modern ${coursItem.category}`}>
                          {coursItem.category === "cours" ? "📖 Cours" : "🏆 Concours"}
                        </span>
                      </td>
                      <td>
                        <a href={coursItem.url} target="_blank" rel="noopener noreferrer" className="link-modern">
                          🔗 Voir le lien
                        </a>
                      </td>
                      <td>
                        <div className="description-cell">
                          {coursItem.description || "Aucune description"}
                        </div>
                      </td>
                      <td>
                        <div className="date-cell">
                          {coursItem.created_at ? new Date(coursItem.created_at).toLocaleDateString('fr-FR') : ""}
                        </div>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button className="btn-action-modern edit" onClick={() => handleEdit(coursItem)} title="Modifier">
                            ✏️
                          </button>
                          <button className="btn-action-modern delete" onClick={() => handleDelete(coursItem.id)} title="Supprimer">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state-modern">
                <div className="empty-illustration">
                  <div className="empty-icon">📚</div>
                  <div className="empty-graphics"></div>
                </div>
                <div className="empty-content">
                  <h3>Aucun cours gratuit</h3>
                  <p>Commencez par ajouter votre première ressource gratuite</p>
                  <button className="btn-primary-modern" onClick={openModal}>
                    Ajouter un cours
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal moderne */}
        {showModal && (
          <div className="modal-overlay-modern" onClick={closeModal}>
            <div className="modal-container-modern" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-modern">
                <div className="modal-title-modern">
                  <div className="modal-icon-modern">
                    {editingCours ? "✏️" : "➕"}
                  </div>
                  <div>
                    <h2>{editingCours ? "Modifier la Ressource" : "Nouvelle Ressource"}</h2>
                    <p>{editingCours ? "Modifiez les informations" : "Ajoutez une nouvelle ressource gratuite"}</p>
                  </div>
                </div>
                <button className="modal-close-btn-modern" onClick={closeModal}>
                  ✕
                </button>
              </div>

              <div className="modal-body-modern">
                <form onSubmit={handleSubmit} className="form-modern">
                  <div className="form-grid-modern">
                    <div className="form-field-modern">
                      <label htmlFor="title">
                        <span className="label-text-modern">Titre</span>
                        <span className="label-required-modern">*</span>
                      </label>
                      <input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Ex: Mathématiques - Niveau Bac"
                        required
                        className="form-input-modern"
                      />
                    </div>

                    <div className="form-field-modern">
                      <label htmlFor="category">
                        <span className="label-text-modern">Catégorie</span>
                        <span className="label-required-modern">*</span>
                      </label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="form-select-modern"
                      >
                        <option value="cours">📖 Cours</option>
                        <option value="concours">🏆 Concours</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-field-modern">
                    <label htmlFor="url">
                      <span className="label-text-modern">URL Google Drive</span>
                      <span className="label-required-modern">*</span>
                    </label>
                    <input
                      id="url"
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://drive.google.com/..."
                      required
                      className="form-input-modern"
                    />
                    <div className="field-hint-modern">Copiez le lien de partage de votre fichier Google Drive</div>
                  </div>

                  <div className="form-field-modern">
                    <label htmlFor="description">
                      <span className="label-text-modern">Description</span>
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Décrivez brièvement le contenu de cette ressource..."
                      rows="4"
                      className="form-textarea-modern"
                    />
                  </div>

                  <div className="modal-actions-modern">
                    <button type="button" className="btn-secondary-modern" onClick={closeModal}>
                      Annuler
                    </button>
                    <button type="submit" className="btn-primary-modern" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <span className="btn-spinner-modern"></span>
                          {editingCours ? "Modification..." : "Ajout..."}
                        </>
                      ) : (
                        editingCours ? "Modifier" : "Ajouter"
                      )}
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

export default GestionCoursGratuit
