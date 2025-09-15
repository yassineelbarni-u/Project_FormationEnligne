"use client"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"
import JobOfferForm from "../../components/admin/JobOfferForm"
import apiService from "../../utils/api"
import "./RecruitmentManagement.css"

const RecruitmentManagement = () => {
  const [jobOffers, setJobOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingOffer, setEditingOffer] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    fetchJobOffers()
  }, [])

  const fetchJobOffers = async () => {
    try {
      setLoading(true)
      const data = await apiService.getJobOffers(false) // Toutes les offres pour l'admin
      setJobOffers(data)
    } catch (error) {
      console.error("Erreur lors du chargement des offres:", error)
      setError("Erreur lors du chargement des offres d'emploi")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateOffer = () => {
    setEditingOffer(null)
    setShowForm(true)
  }

  const handleEditOffer = (offer) => {
    setEditingOffer(offer)
    setShowForm(true)
  }

  const handleFormSubmit = async (offerData) => {
    try {
      if (editingOffer) {
        await apiService.updateJobOffer(editingOffer.id, offerData)
      } else {
        await apiService.createJobOffer(offerData)
      }
      setShowForm(false)
      setEditingOffer(null)
      fetchJobOffers()
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      throw error
    }
  }

  const handleToggleStatus = async (offerId) => {
    try {
      await apiService.toggleJobOfferStatus(offerId)
      fetchJobOffers()
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error)
      setError("Erreur lors du changement de statut")
    }
  }

  const handleDeleteOffer = async (offerId) => {
    try {
      await apiService.deleteJobOffer(offerId)
      setDeleteConfirm(null)
      fetchJobOffers()
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      setError("Erreur lors de la suppression de l'offre")
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (showForm) {
    return (
      <AdminLayout>
        <div className="recruitment-management">
          <div className="page-header">
            <button onClick={() => setShowForm(false)} className="back-button">
              ← Retour à la liste
            </button>
            <h1>{editingOffer ? "Modifier l'offre" : "Nouvelle offre d'emploi"}</h1>
          </div>
          <JobOfferForm initialData={editingOffer} onSubmit={handleFormSubmit} onCancel={() => setShowForm(false)} />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="recruitment-management">
        <div className="page-header">
          <div className="header-content">
            <h1>Gestion du Recrutement</h1>
          </div>
          {/* CHANGÉ: create-btn → btn-primary */}
          <button onClick={handleCreateOffer} className="btn-primary">
            + Nouvelle offre
          </button>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchJobOffers} className="retry-btn">
              Réessayer
            </button>
          </div>
        )}

        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-number">{jobOffers.length}</div>
            <div className="stat-label">Offres totales</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{jobOffers.filter((offer) => offer.is_active).length}</div>
            <div className="stat-label">Offres actives</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {jobOffers.reduce((total, offer) => total + (offer.applications_count || 0), 0)}
            </div>
            <div className="stat-label">Candidatures reçues</div>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Chargement des offres...</p>
          </div>
        ) : (
          <div className="offers-table-container">
            <table className="offers-table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Entreprise</th>
                  <th>Statut</th>
                  <th>Candidatures</th>
                  <th>Date limite</th>
                  <th>Créée le</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobOffers.map((offer) => (
                  <tr key={offer.id}>
                    <td>
                      <div className="offer-title">
                        <strong>{offer.title}</strong>
                        <span className="offer-location">{offer.location}</span>
                      </div>
                    </td>
                    <td>{offer.company}</td>
                    <td>
                      <button
                        onClick={() => handleToggleStatus(offer.id)}
                        className={`status-toggle ${offer.is_active ? "active" : "inactive"}`}
                      >
                        {offer.is_active ? "Actif" : "Inactif"}
                      </button>
                    </td>
                    <td>
                      <Link to={`/admin/applications?job_offer_id=${offer.id}`} className="applications-link">
                        {offer.applications_count || 0} candidature(s)
                      </Link>
                    </td>
                    <td>
                      {offer.application_deadline ? (
                        <span
                          className={
                            new Date(offer.application_deadline) < new Date() ? "deadline-expired" : "deadline-active"
                          }
                        >
                          {formatDate(offer.application_deadline)}
                        </span>
                      ) : (
                        <span className="no-deadline">Aucune</span>
                      )}
                    </td>
                    <td>{formatDate(offer.created_at)}</td>
                    <td>
                      <div className="actions-buttons">
                        <button onClick={() => handleEditOffer(offer)} className="edit-btn" title="Modifier">
                          ✏️
                        </button>
                        <button onClick={() => setDeleteConfirm(offer.id)} className="delete-btn" title="Supprimer">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {jobOffers.length === 0 && !loading && (
              <div className="no-offers">
                <h3>Aucune offre d'emploi</h3>
                <p>Commencez par créer votre première offre d'emploi.</p>
                {/* CHANGÉ: create-first-btn → btn-primary */}
                <button onClick={handleCreateOffer} className="btn-primary">
                  Créer une offre
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal de confirmation de suppression */}
        {deleteConfirm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Confirmer la suppression</h3>
              <p>Êtes-vous sûr de vouloir supprimer cette offre d'emploi ? Cette action est irréversible.</p>
              <div className="modal-actions">
                <button onClick={() => setDeleteConfirm(null)} className="cancel-btn">
                  Annuler
                </button>
                <button onClick={() => handleDeleteOffer(deleteConfirm)} className="confirm-delete-btn">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default RecruitmentManagement
