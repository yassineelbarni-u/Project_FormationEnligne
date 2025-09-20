"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "../../components/common/Header"
import Footer from "../../components/common/Footer"
import apiService from "../../utils/api"
import "./JobOffers.css"

const JobOffers = () => {
  const [jobOffers, setJobOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filters, setFilters] = useState({
    location: "",
  })

  useEffect(() => {
    fetchJobOffers()
  }, [])

  const fetchJobOffers = async () => {
    try {
      setLoading(true)
      const data = await apiService.getJobOffers(true) 
      setJobOffers(data)
    } catch (error) {
      console.error("Erreur lors du chargement des offres:", error)
      setError("Erreur lors du chargement des offres d'emploi")
    } finally {
      setLoading(false)
    }
  }

  const filteredOffers = jobOffers.filter((offer) => {
    return !filters.location || offer.location?.toLowerCase().includes(filters.location.toLowerCase())
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const isDeadlineSoon = (deadline) => {
    if (!deadline) return false
    const deadlineDate = new Date(deadline)
    const today = new Date()
    const diffTime = deadlineDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays > 0
  }

  if (loading) {
    return (
      <div className="page-container">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des offres d'emploi...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="page-container">
      <Header />

      <main className="job-offers-page">
        <div className="container">

          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={fetchJobOffers} className="retry-btn">
                Réessayer
              </button>
            </div>
          )}

          {/* Filtres */}
         

          {/* Liste des offres */}
          <div className="job-offers-grid">
            {filteredOffers.length === 0 ? (
              <div className="no-offers">
                <h3>Aucune offre disponible</h3>
                <p>Il n'y a actuellement aucune offre d'emploi correspondant à vos critères.</p>
              </div>
            ) : (
              filteredOffers.map((offer) => (
                <div key={offer.id} className="job-offer-card">
                  <div className="card-header">
                    <h3>{offer.title}</h3>
                    <div className="company-info">
                      <span className="company-name">{offer.company}</span>
                      {offer.location && <span className="location">📍 {offer.location}</span>}
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="job-meta">
                      {offer.salary_range && <span className="salary">💰 {offer.salary_range}</span>}
                    </div>

                    <p className="job-description">
                      {offer.description.length > 150 ? `${offer.description.substring(0, 150)}...` : offer.description}
                    </p>

                    {offer.application_deadline && (
                      <div className={`deadline ${isDeadlineSoon(offer.application_deadline) ? "urgent" : ""}`}>
                        <span>📅 Date limite: {formatDate(offer.application_deadline)}</span>
                        {isDeadlineSoon(offer.application_deadline) && <span className="urgent-badge">Urgent</span>}
                      </div>
                    )}
                  </div>

                  <div className="card-footer">
                    <Link to={`/recruitment/apply/${offer.id}`} className="apply-btn">
                      Postuler
                    </Link>
                    {/* <Link to={`/recruitment/offer/${offer.id}`} className="details-btn">
                      Voir détails
                    </Link> */}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default JobOffers
