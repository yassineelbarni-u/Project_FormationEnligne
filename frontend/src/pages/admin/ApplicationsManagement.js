"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"
import ApplicationsList from "../../components/admin/ApplicationsList"
import apiService from "../../utils/api"
import "./ApplicationsManagement.css"

const ApplicationsManagement = () => {
  const [searchParams] = useSearchParams()
  const [applications, setApplications] = useState([])
  const [jobOffers, setJobOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filters, setFilters] = useState({
    jobOfferId: searchParams.get("job_offer_id") || "",
    status: "",
  })
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    fetchJobOffers()
    fetchApplications()
  }, [])

  useEffect(() => {
    fetchApplications()
  }, [filters])

  const fetchJobOffers = async () => {
    try {
      const data = await apiService.getJobOffers(false)
      setJobOffers(data)
    } catch (error) {
      console.error("Erreur lors du chargement des offres:", error)
    }
  }

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const data = await apiService.getJobApplications(filters.jobOfferId || null, filters.status || null)
      setApplications(data)
    } catch (error) {
      console.error("Erreur lors du chargement des candidatures:", error)
      setError("Erreur lors du chargement des candidatures")
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleStatusUpdate = async (applicationId, newStatus, notes = "") => {
    try {
      await apiService.updateJobApplication(applicationId, {
        status: newStatus,
        admin_notes: notes,
      })
      fetchApplications()
      if (selectedApplication && selectedApplication.id === applicationId) {
        const updatedApp = await apiService.getJobApplication(applicationId)
        setSelectedApplication(updatedApp)
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
      setError("Erreur lors de la mise à jour du statut")
    }
  }

  const handleViewDetails = async (application) => {
    try {
      const fullApplication = await apiService.getJobApplication(application.id)
      setSelectedApplication(fullApplication)
      setShowDetails(true)
    } catch (error) {
      console.error("Erreur lors du chargement des détails:", error)
      setError("Erreur lors du chargement des détails")
    }
  }

  const handleDownloadCV = async (cvUrl, candidateName) => {
    try {
      const blob = await apiService.downloadCV(cvUrl)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `CV_${candidateName.replace(/\s+/g, "_")}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error)
      setError("Erreur lors du téléchargement du CV")
    }
  }

  const getStatusStats = () => {
    const stats = {
      pending: applications.filter((app) => app.status === "pending").length,
      reviewed: applications.filter((app) => app.status === "reviewed").length,
      accepted: applications.filter((app) => app.status === "accepted").length,
      rejected: applications.filter((app) => app.status === "rejected").length,
    }
    return stats
  }

  const stats = getStatusStats()

  return (
    <AdminLayout>
      <div className="applications-management">
        <div className="page-header">
          <div className="header-content">
            <h1>Gestion des Candidatures</h1>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchApplications} className="retry-btn">
              Réessayer
            </button>
          </div>
        )}

        <div className="stats-cards">
          <div className="stat-card pending">
            <div className="stat-number">{stats.pending}</div>
            <div className="stat-label">En attente</div>
          </div>
          <div className="stat-card reviewed">
            <div className="stat-number">{stats.reviewed}</div>
            <div className="stat-label">Examinées</div>
          </div>
          <div className="stat-card accepted">
            <div className="stat-number">{stats.accepted}</div>
            <div className="stat-label">Acceptées</div>
          </div>
          <div className="stat-card rejected">
            <div className="stat-number">{stats.rejected}</div>
            <div className="stat-label">Refusées</div>
          </div>
        </div>

        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Filtrer par offre</label>
              <select value={filters.jobOfferId} onChange={(e) => handleFilterChange("jobOfferId", e.target.value)}>
                <option value="">Toutes les offres</option>
                {jobOffers.map((offer) => (
                  <option key={offer.id} value={offer.id}>
                    {offer.title} - {offer.company}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Filtrer par statut</label>
              <select value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)}>
                <option value="">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="reviewed">Examinée</option>
                <option value="accepted">Acceptée</option>
                <option value="rejected">Refusée</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Chargement des candidatures...</p>
          </div>
        ) : (
          <ApplicationsList
            applications={applications}
            onViewDetails={handleViewDetails}
            onStatusUpdate={handleStatusUpdate}
            onDownloadCV={handleDownloadCV}
          />
        )}

        {/* Modal des détails de candidature */}
        {showDetails && selectedApplication && (
          <div className="modal-overlay">
            <div className="modal-content application-details-modal">
              <div className="modal-header">
                <h3>Détails de la candidature</h3>
                <button onClick={() => setShowDetails(false)} className="close-btn">
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="candidate-info">
                  <h4>Informations du candidat</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <strong>Nom complet:</strong>
                      <span>
                        {selectedApplication.first_name} {selectedApplication.last_name}
                      </span>
                    </div>
                    <div className="info-item">
                      <strong>Email:</strong>
                      <span>{selectedApplication.email}</span>
                    </div>
                    <div className="info-item">
                      <strong>Téléphone:</strong>
                      <span>{selectedApplication.phone || "Non renseigné"}</span>
                    </div>
                    <div className="info-item">
                      <strong>Poste:</strong>
                      <span>{selectedApplication.job_title}</span>
                    </div>
                    <div className="info-item">
                      <strong>Entreprise:</strong>
                      <span>{selectedApplication.company_name}</span>
                    </div>
                    <div className="info-item">
                      <strong>Date de candidature:</strong>
                      <span>{new Date(selectedApplication.created_at).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>
                </div>

                {selectedApplication.cover_letter && (
                  <div className="cover-letter">
                    <h4>Lettre de motivation</h4>
                    <div className="cover-letter-content">{selectedApplication.cover_letter}</div>
                  </div>
                )}

                <div className="cv-section">
                  <h4>CV</h4>
                  {selectedApplication.cv_url ? (
                    <button
                      onClick={() =>
                        handleDownloadCV(
                          selectedApplication.cv_url,
                          `${selectedApplication.first_name}_${selectedApplication.last_name}`,
                        )
                      }
                      className="download-cv-btn"
                    >
                      📄 Télécharger le CV
                    </button>
                  ) : (
                    <span>Aucun CV disponible</span>
                  )}
                </div>

                <div className="status-section">
                  <h4>Statut et notes</h4>
                  <div className="status-controls">
                    <select
                      value={selectedApplication.status}
                      onChange={(e) => handleStatusUpdate(selectedApplication.id, e.target.value)}
                      className={`status-select ${selectedApplication.status}`}
                    >
                      <option value="pending">En attente</option>
                      <option value="reviewed">Examinée</option>
                      <option value="accepted">Acceptée</option>
                      <option value="rejected">Refusée</option>
                    </select>
                  </div>

                  <div className="admin-notes">
                    <label>Notes administratives:</label>
                    <textarea
                      value={selectedApplication.admin_notes || ""}
                      onChange={(e) => {
                        setSelectedApplication((prev) => ({
                          ...prev,
                          admin_notes: e.target.value,
                        }))
                      }}
                      placeholder="Ajoutez vos notes sur cette candidature..."
                      rows="4"
                    />
                    <button
                      onClick={() =>
                        handleStatusUpdate(
                          selectedApplication.id,
                          selectedApplication.status,
                          selectedApplication.admin_notes,
                        )
                      }
                      className="save-notes-btn"
                    >
                      Sauvegarder les notes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default ApplicationsManagement
