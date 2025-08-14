"use client"
import { useState, useEffect } from "react"
import "./Annonce.css"

const AnnonceSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Tableau des images d'annonces
  const annonceImages = [
    {
      src: "/images/preparation_examane.png",
      alt: "Préparation aux concours - Cours de soutien",
    },
    {
      src: "/images/setien.png",
      alt: "Cours de mathématiques avancées",
    }
   
  ]

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === annonceImages.length - 1 ? 0 : prevIndex + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? annonceImages.length - 1 : prevIndex - 1))
  }

  const goToImage = (index) => {
    setCurrentImageIndex(index)
  }

  // Auto-play toutes les 4 secondes
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex === annonceImages.length - 1 ? 0 : prevIndex + 1))
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, annonceImages.length])

  const handleWhatsAppClick = () => {
    const phoneNumber = "+212631262790"
    const message = "Bonjour, je suis intéressé(e) par vos cours. Pouvez-vous me donner plus d'informations ?"
    const whatsappUrl = `https://wa.me/${phoneNumber.replace("+", "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <section className="annonce-section" id="annonces">
      <div className="container">
        <div className="annonce-header">
          <h2>Nos Cours Disponibles</h2>
          <p>Découvrez notre sélection de cours de soutien scolaire et universitaire</p>
        </div>

        <div className="annonce-content">
          <div
            className="carousel-wrapper"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div className="annonce-image-wrapper">
              <button className="carousel-btn carousel-btn-prev" onClick={prevImage} aria-label="Image précédente">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M15 18L9 12L15 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div className="image-container">
                <img
                  src={annonceImages[currentImageIndex].src || "/placeholder.svg"}
                  alt={annonceImages[currentImageIndex].alt}
                  className="annonce-image"
                />

                {/* Compteur d'images */}
                <div className="image-counter">
                  {currentImageIndex + 1} / {annonceImages.length}
                </div>
              </div>

              <button className="carousel-btn carousel-btn-next" onClick={nextImage} aria-label="Image suivante">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Indicateurs de pagination */}
            <div className="carousel-indicators">
              {annonceImages.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentImageIndex ? "active" : ""}`}
                  onClick={() => goToImage(index)}
                  aria-label={`Aller à l'image ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="annonce-action">
            <button className="whatsapp-button" onClick={handleWhatsAppClick}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.704"
                  fill="currentColor"
                />
              </svg>
              S'inscrire aux cours
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AnnonceSection
