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
    status: "all",
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

    if (filters.status !== "all") {
      filtered = filtered.filter(t => 
        filters.status === "active" ? t.is_active : !t.is_active
      )
    }

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
        <div className="admin-testimonials-loading-modern">
          <div className="loading-spinner-testimonials-modern"></div>
          <div className="loading-dots-testimonials-modern">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>Chargement des témoignages...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="admin-testimonials-page-modern">
        {/* Header moderne avec statistiques */}
        <div className="page-header-testimonials-modern">
          <div className="header-content-testimonials-modern">
            <div className="header-icon-testimonials-modern">💬</div>
            <div className="header-text-testimonials-modern">
              <h1>Gestion des Témoignages</h1>
              <p>Gérez les avis et témoignages de vos étudiants</p>
            </div>
          </div>
        </div>

        {/* Statistiques modernes */}
        <div className="stats-section-testimonials-modern">
          <div className="stat-card-testimonials-modern total">
            <div className="stat-icon-testimonials-modern">📊</div>
            <div className="stat-content-testimonials-modern">
              <div className="stat-number-testimonials-modern">{stats.total_testimonials || 0}</div>
              <div className="stat-label-testimonials-modern">Total</div>
            </div>
          </div>
          <div className="stat-card-testimonials-modern active">
            <div className="stat-icon-testimonials-modern">✅</div>
            <div className="stat-content-testimonials-modern">
              <div className="stat-number-testimonials-modern">{stats.active_testimonials || 0}</div>
              <div className="stat-label-testimonials-modern">Actifs</div>
            </div>
          </div>
          <div className="stat-card-testimonials-modern rating">
            <div className="stat-icon-testimonials-modern">⭐</div>
            <div className="stat-content-testimonials-modern">
              <div className="stat-number-testimonials-modern">{stats.average_rating || 0}</div>
              <div className="stat-label-testimonials-modern">Note moyenne</div>
            </div>
          </div>
          <div className="stat-card-testimonials-modern recent">
            <div className="stat-icon-testimonials-modern">📅</div>
            <div className="stat-content-testimonials-modern">
              <div className="stat-number-testimonials-modern">{stats.recent_testimonials || 0}</div>
              <div className="stat-label-testimonials-modern">Ce mois</div>
            </div>
          </div>
        </div>

        {/* Filtres modernes */}
        <div className="testimonials-filters-modern">
          <div className="filters-container-modern">
            <div className="search-field-testimonials-modern">
              <span className="search-icon-testimonials-modern">🔍</span>
              <input
                type="text"
                placeholder="Rechercher par nom, école ou commentaire..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="search-input-testimonials-modern"
              />
            </div>
            
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="filter-select-testimonials-modern"
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
              className="filter-select-testimonials-modern"
            >
              <option value="created_at-desc">Plus récents</option>
              <option value="created_at-asc">Plus anciens</option>
              <option value="rating-desc">Meilleures notes</option>
              <option value="nom-asc">Nom A-Z</option>
            </select>
          </div>
        </div>

        {/* Section des témoignages */}
        <div className="testimonials-section-modern">
          <div className="section-header-testimonials-modern">
            <h2>Témoignages ({filteredTestimonials.length})</h2>
            <p>Gérez et modérez les avis de vos étudiants</p>
          </div>

          {filteredTestimonials.length === 0 ? (
            <div className="empty-state-testimonials-modern">
              <div className="empty-illustration-testimonials-modern">
                <div className="empty-icon-testimonials-modern">💬</div>
                <div className="empty-graphics-testimonials-modern"></div>
              </div>
              <div className="empty-content-testimonials-modern">
                <h3>
                  {filters.search || filters.status !== "all" 
                    ? "Aucun témoignage trouvé" 
                    : "Aucun témoignage disponible"}
                </h3>
                <p>
                  {filters.search || filters.status !== "all" 
                    ? "Aucun témoignage ne correspond à vos critères de recherche"
                    : "Les témoignages soumis par les utilisateurs apparaîtront ici"}
                </p>
              </div>
            </div>
          ) : (
            <div className="testimonials-grid-modern">
              {filteredTestimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.id} 
                  className={`testimonial-card-modern ${!testimonial.is_active ? "inactive" : ""}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {editingTestimonial === testimonial.id ? (
                    <div className="edit-form-modern">
                      <div className="edit-header-modern">
                        <h4>✏️ Modifier le témoignage</h4>
                      </div>
                      <form onSubmit={handleEditSubmit}>
                        <div className="form-grid-testimonials-modern">
                          <input
                            type="text"
                            placeholder="Nom"
                            value={editForm.nom}
                            onChange={(e) => setEditForm({...editForm, nom: e.target.value})}
                            required
                            className="form-input-testimonials-modern"
                          />
                          <input
                            type="text"
                            placeholder="École"
                            value={editForm.ecole}
                            onChange={(e) => setEditForm({...editForm, ecole: e.target.value})}
                            required
                            className="form-input-testimonials-modern"
                          />
                        </div>
                        <textarea
                          placeholder="Commentaire"
                          value={editForm.comment}
                          onChange={(e) => setEditForm({...editForm, comment: e.target.value})}
                          required
                          className="form-textarea-testimonials-modern"
                        />
                        <div className="form-actions-testimonials-modern">
                          <button type="submit" className="btn-save-testimonials-modern">
                            💾 Sauvegarder
                          </button>
                          <button 
                            type="button" 
                            className="btn-cancel-testimonials-modern"
                            onClick={() => setEditingTestimonial(null)}
                          >
                            Annuler
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="testimonial-content-modern">
                      <div className="testimonial-header-modern">
                        <div className="author-info-modern">
                          <h3 className="author-name-modern">{testimonial.nom}</h3>
                          <p className="author-school-modern">🎓 {testimonial.ecole}</p>
                        </div>
                        <div className="testimonial-badges-modern">
                          <div className="rating-modern">
                            {Array.from({ length: testimonial.rating }).map((_, i) => (
                              <span key={i} className="star-modern">⭐</span>
                            ))}
                          </div>
                          <span className={`status-badge-testimonials-modern ${testimonial.is_active ? "active" : "inactive"}`}>
                            {testimonial.is_active ? "✅ Actif" : "❌ Inactif"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="comment-modern">
                        <span className="quote-icon-modern">💭</span>
                        {testimonial.comment}
                      </div>
                      
                      <div className="testimonial-meta-modern">
                        <span className="date-modern">📅 {formatDate(testimonial.created_at)}</span>
                      </div>

                      <div className="testimonial-actions-modern">
                        <button
                          className="btn-action-testimonials-modern edit"
                          onClick={() => handleEdit(testimonial)}
                          title="Modifier"
                        >
                          ✏️
                        </button>
                        <button
                          className={`btn-action-testimonials-modern ${testimonial.is_active ? "deactivate" : "activate"}`}
                          onClick={() => handleToggleStatus(testimonial.id)}
                          title={testimonial.is_active ? "Désactiver" : "Activer"}
                        >
                          {testimonial.is_active ? "👁️‍🗨️" : "👁️"}
                        </button>
                        <button
                          className="btn-action-testimonials-modern delete"
                          onClick={() => handleDelete(testimonial.id, testimonial.nom)}
                          title="Supprimer"
                        >
                          🗑️
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
