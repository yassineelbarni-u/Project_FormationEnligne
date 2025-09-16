"use client"

import { useState, useEffect } from "react"
import Header from "../../components/common/Header"
import Footer from "../../components/common/Footer"
import apiService from "../../utils/api"
import "./AnnonceCourse.css"

const API_URL = process.env.REACT_APP_API_URL;

const AnnonceCourse = () => {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedCards, setExpandedCards] = useState({})

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

  const toggleDescription = (announcementId) => {
    setExpandedCards(prev => ({
      ...prev,
      [announcementId]: !prev[announcementId]
    }))
  }

  const handleWhatsAppClick = (announcementTitle) => {
    const phoneNumber = "+212631262790"
    const message = `Bonjour, je suis intéressé(e) par "${announcementTitle || 'votre formation'}". Pouvez-vous me donner plus d'informations ?`
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const truncateText = (text, maxLength = 120) => {
    if (!text) return ""
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  return (
    <div className="annonce-course-page-simple">
      <Header />

      <main className="main-content-simple">
        <div className="container-simple">

          {loading ? (
            <div className="loading-state-simple">
              <div className="loading-spinner-simple"></div>
              <p>Chargement de nos formations...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="empty-state-simple">
              <div className="empty-icon-simple">📢</div>
              <h3>Aucune formation disponible</h3>
              <p>Nos meilleurs cours arrivent bientôt !</p>
            </div>
          ) : (
            <div className="announcements-grid-simple">
              {announcements.map((announcement) => {
                const isExpanded = expandedCards[announcement.id]
                const shouldShowReadMore = announcement.description && announcement.description.length > 120

                return (
                  <div key={announcement.id} className="announcement-card-simple">
                    
                    <div className="announcement-image-simple">
                      <img
                        src={announcement.image_url ? `${API_URL}${announcement.image_url}` : "/placeholder.svg"}
                        alt={announcement.title || "Formation disponible"}
                        onLoad={(e) => {
                          if (e.target.naturalHeight > 800) {
                            e.target.style.maxHeight = "800px";
                          }
                        }}
                      />
                      <div className="badge-nouveau-simple">NOUVEAU</div>
                    </div>
                    
                    <div className="announcement-content-simple">
                      {announcement.title && (
                        <h3 className="announcement-title-simple">
                          📚 {announcement.title}
                        </h3>
                      )}
                      
                      {announcement.description && (
                        <div className="description-container-simple">
                          <p className="announcement-description-simple">
                            {isExpanded ? announcement.description : truncateText(announcement.description)}
                          </p>
                          
                          {shouldShowReadMore && (
                            <button 
                              className="read-more-btn-simple"
                              onClick={() => toggleDescription(announcement.id)}
                            >
                              {isExpanded ? 'Voir moins ↑' : 'Voir plus ↓'}
                            </button>
                          )}
                        </div>
                      )}
                      
                      {announcement.price && (
                        <div className="announcement-price-simple">
                          💰 <strong>Prix: {announcement.price}</strong>
                        </div>
                      )}
                    </div>

                    <div className="announcement-footer-simple">
                      <button 
                        className="whatsapp-button-simple" 
                        onClick={() => handleWhatsAppClick(announcement.title || "cette formation")}
                      >
                        📞 S'inscrire maintenant
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default AnnonceCourse
