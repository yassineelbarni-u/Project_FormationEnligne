"use client"

import { useState, useEffect } from "react"
import Header from "../../components/common/Header"
import Footer from "../../components/common/Footer"
import apiService from "../../utils/api"
import "./AnnonceCourse.css"

const AnnonceCourse = () => {
  const [announcements, setAnnouncements] = useState([])
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

  const handleWhatsAppClick = (announcementTitle) => {
    const phoneNumber = "+212631262790"
    const message = `Bonjour, je suis intéressé(e) par "${announcementTitle || 'votre formation'}". Pouvez-vous me donner plus d'informations ?`
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="annonce-course-page">
      <Header />

      <main className="main-content">
        <div className="container">
          <div className="page-header">
            <h1>Nos Annonces de Cours</h1>
            <p>Découvrez toutes nos formations disponibles</p>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Chargement des annonces...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <span className="material-symbols-outlined">campaign</span>
              </div>
              <h3>Aucune annonce disponible</h3>
              <p>Revenez bientôt pour découvrir nos nouvelles formations</p>
            </div>
          ) : (
            <div className="announcements-grid">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="announcement-card">
                  <div className="announcement-image">
                    <img
                      src={`http://localhost:8001${announcement.image_url}` || "/placeholder.svg"}
                      alt={announcement.title || "Annonce de cours"}
                      onLoad={(e) => {
                        // Ajuster la taille pour garantir que l'image s'affiche correctement
                        if (e.target.naturalHeight > 800) {
                          e.target.style.maxHeight = "800px";
                        }
                      }}
                    />
                  </div>
                  
                  <div className="announcement-info">
                    {announcement.title && (
                      <h3 className="announcement-title">{announcement.title}</h3>
                    )}
                    
                    {announcement.description && (
                      <p className="announcement-description">{announcement.description}</p>
                    )}
                    
                    {announcement.price && (
                      <p className="announcement-price"><strong>Prix:</strong> {announcement.price}</p>
                    )}
                  </div>

                  <div className="announcement-footer">
                    <button className="whatsapp-button" onClick={() => handleWhatsAppClick(announcement.title || "cette formation")}>
                      <span className="material-symbols-outlined">phone</span>
                      S'inscrire cours
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default AnnonceCourse
