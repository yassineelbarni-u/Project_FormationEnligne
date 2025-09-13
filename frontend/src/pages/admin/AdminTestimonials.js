import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"
import { 
  getAllTestimonials, 
  updateTestimonial, 
  deleteTestimonial, 
  toggleTestimonialStatus,
  getTestimonialStats
} from "../../utils/api"
import "./AdminTestimonials.css"

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([])
  const [filteredTestimonials, setFilteredTestimonials] = useState([])
  const [stats, setStats] = useState({})
  const [filters, setFilters] = useState({
    status: "all", // all, active, inactive
    search: "",
    sortBy: "created_at",
    sortOrder: "desc"
  })
  const [isLoading, setIsLoading] = useState(true)
  const [editingTestimonial, setEditingTestimonial] = useState(null)
  const [editForm, setEditForm] = useState({
    nom: "",
    ecole: "", 
    comment: "",
    rating: 5
  })
  const navigate = useNavigate()

  useEffect(() => {
    fetchTestimonials()
    fetchStats()
  }, [filters.sortBy, filters.sortOrder])

  useEffect(() => {
    applyFilters()
  }, [testimonials, filters.status, filters.search])

  const fetchTestimonials = async () => {
    try {
      const params = {
        sort_by: filters.sortBy,
        sort_order: filters.sortOrder,
        limit: 100
      }
      const data = await getAllTestimonials(params)
      setTestimonials(data)
    } catch (error) {
      console.error("Erreur lors du chargement des témoignages:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const data = await getTestimonialStats()
      setStats(data)
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error)
    }
  }

  const applyFilters = () => {
    let filtered = testimonials

    // Filtrer par statut
    if (filters.status !== "all") {
      filtered = filtered.filter(t => 
        filters.status === "active" ? t.is_active : !t.is_active
      )
    }

    // Filtrer par recherche
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(t =>
        t.nom.toLowerCase().includes(searchLower) ||
        t.ecole.toLowerCase().includes(searchLower) ||
        t.comment.toLowerCase().includes(searchLower)
      )
    }

    setFilteredTestimonials(filtered)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial.id)
    setEditForm({
      nom: testimonial.nom,
      ecole: testimonial.ecole,
      comment: testimonial.comment,
      rating: testimonial.rating
    })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateTestimonial(editingTestimonial, editForm)
      await fetchTestimonials()
      setEditingTestimonial(null)
      setEditForm({ nom: "", ecole: "", comment: "", rating: 5 })
      alert("Témoignage modifié avec succès !")
    } catch (error) {
      alert("Erreur lors de la modification")
      console.error(error)
    }
  }

  const handleDelete = async (id, name) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le témoignage de "${name}" ?`)) {
      try {
        await deleteTestimonial(id)
        await fetchTestimonials()
        await fetchStats()
        alert("Témoignage supprimé avec succès !")
      } catch (error) {
        alert("Erreur lors de la suppression")
        console.error(error)
      }
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      await toggleTestimonialStatus(id)
      await fetchTestimonials()
      await fetchStats()
      alert("Statut modifié avec succès !")
    } catch (error) {
      alert("Erreur lors du changement de statut")
      console.error(error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="admin-testimonials-loading">
          <div className="loading-spinner"></div>
          <p>Chargement des témoignages...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="admin-testimonials-page">
        {/* Header avec statistiques */}
        <div className="page-header">
          <div className="header-content">
            <h1>Gestion des Témoignages</h1>
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-number">{stats.total_testimonials || 0}</div>
                <div className="stat-label">Total</div>
              </div>
              <div className="stat-card active">
                <div className="stat-number">{stats.active_testimonials || 0}</div>
                <div className="stat-label">Actifs</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.average_rating || 0}</div>
                <div className="stat-label">Note moyenne</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.recent_testimonials || 0}</div>
                <div className="stat-label">Ce mois</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="testimonials-filters">
          <div className="filter-row">
            <div className="search-box">
              <input
                type="text"
                placeholder="Rechercher par nom, école ou commentaire..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
            
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="all">Tous les témoignages</option>
              <option value="active">Actifs seulement</option>
              <option value="inactive">Inactifs seulement</option>
            </select>

            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split("-")
                handleFilterChange("sortBy", sortBy)
                handleFilterChange("sortOrder", sortOrder)
              }}
            >
              <option value="created_at-desc">Plus récents</option>
              <option value="created_at-asc">Plus anciens</option>
              <option value="rating-desc">Meilleures notes</option>
              <option value="nom-asc">Nom A-Z</option>
            </select>
          </div>
        </div>

        {/* Liste des témoignages */}
        <div className="testimonials-list">
          {filteredTestimonials.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h3>Aucun témoignage trouvé</h3>
              <p>
                {filters.search || filters.status !== "all" 
                  ? "Aucun témoignage ne correspond à vos filtres"
                  : "Les témoignages soumis par les utilisateurs apparaîtront ici"
                }
              </p>
            </div>
          ) : (
            <div className="testimonials-grid">
              {filteredTestimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className={`testimonial-card ${!testimonial.is_active ? "inactive" : ""}`}
                >
                  {editingTestimonial === testimonial.id ? (
                    <form className="edit-form" onSubmit={handleEditSubmit}>
                      <div className="form-row">
                        <input
                          type="text"
                          placeholder="Nom"
                          value={editForm.nom}
                          onChange={(e) => setEditForm({...editForm, nom: e.target.value})}
                          required
                        />
                        <input
                          type="text"
                          placeholder="École"
                          value={editForm.ecole}
                          onChange={(e) => setEditForm({...editForm, ecole: e.target.value})}
                          required
                        />
                      </div>
                      <textarea
                        placeholder="Commentaire"
                        value={editForm.comment}
                        onChange={(e) => setEditForm({...editForm, comment: e.target.value})}
                        required
                      />
                      <div className="form-actions">
                        <button type="submit" className="btn-save">💾 Sauvegarder</button>
                        <button 
                          type="button" 
                          className="btn-cancel"
                          onClick={() => setEditingTestimonial(null)}
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="testimonial-content">
                      <div className="testimonial-header">
                        <div className="author-info">
                          <h3>{testimonial.nom}</h3>
                          <p className="school">{testimonial.ecole}</p>
                        </div>
                        <div className="testimonial-badges">
                          <span className={`status-badge ${testimonial.is_active ? "active" : "inactive"}`}>
                            {testimonial.is_active ? "Actif" : "Inactif"}
                          </span>
                          <div className="rating">
                            {Array.from({ length: testimonial.rating }).map((_, i) => (
                              <span key={i} className="star">⭐</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="comment">
                        "{testimonial.comment}"
                      </div>
                      
                      <div className="testimonial-meta">
                        <span>Ajouté le {formatDate(testimonial.created_at)}</span>
                      </div>

                      <div className="testimonial-actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(testimonial)}
                          title="Modifier"
                        >
                          ✏️ Modifier
                        </button>
                        <button
                          className={`btn-toggle ${testimonial.is_active ? "deactivate" : "activate"}`}
                          onClick={() => handleToggleStatus(testimonial.id)}
                          title={testimonial.is_active ? "Désactiver" : "Activer"}
                        >
                          {testimonial.is_active ? "❌ Désactiver" : "✅ Activer"}
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(testimonial.id, testimonial.nom)}
                          title="Supprimer"
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminTestimonials