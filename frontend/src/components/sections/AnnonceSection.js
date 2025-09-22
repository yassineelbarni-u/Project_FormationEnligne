"use client"

import { useState, useEffect } from "react"
import apiService from "../../utils/api"
import "./Annonce.css"

const API_URL = process.env.REACT_APP_API_URL;

const AnnonceSection = () => {
  const [announcements, setAnnouncements] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const data = await apiService.getActiveAnnouncements()
      setAnnouncements(data)
    } catch (error) {
      console.error("Erreur lors du chargement des annonces:", error)
    } finally {
      setLoading(false)
    }
  }

  // Auto-play toutes les 4 secondes
  useEffect(() => {
    if (announcements.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex === announcements.length - 1 ? 0 : prevIndex + 1))
      }, 4000)

      return () => clearInterval(interval)
    }
  }, [announcements.length])

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? announcements.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === announcements.length - 1 ? 0 : currentIndex + 1)
  }

  const handleWhatsAppClick = () => {
    const phoneNumber = "+212631262790"
    const message = "Bonjour, je suis intéressé(e) par vos cours. Pouvez-vous me donner plus d'informations ?"
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  if (loading) {
    return (
      <section className="annonce-section">
        <div className="container">
          <div className="annonce-loading">Chargement des annonces...</div>
        </div>
      </section>
    )
  }

  if (announcements.length === 0) {
    return null // Ne pas afficher la section s'il n'y a pas d'annonces
  }

  const currentAnnouncement = announcements[currentIndex]

  return (
    <section className="annonce-section">
      <div className="container">
        <div className="annonce-carousel">
          <div className="annonce-card">
            {announcements.length > 1 && (
              <button className="nav-button prev" onClick={goToPrevious}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
              </button>
            )}

            <div className="annonce-image">
              <img
               src={currentAnnouncement.image_url ? `${API_URL}/uploads${currentAnnouncement.image_url}` : "/placeholder.svg"}
               alt="Annonce de cours"
              />

              {announcements.length > 1 && (
                <div className="slide-counter">
                  {currentIndex + 1} / {announcements.length}
                </div>
              )}
            </div>

            {announcements.length > 1 && (
              <button className="nav-button next" onClick={goToNext}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
                </svg>
              </button>
            )}
          </div>

          {announcements.length > 1 && (
            <div className="pagination-dots">
              {announcements.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentIndex ? "active" : ""}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          )}

          <div className="annonce-cta">
            <button className="cta-button" onClick={handleWhatsAppClick}>
              <span className="material-symbols-outlined">phone</span>
              S'INSCRIRE AUX COURS
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AnnonceSection
