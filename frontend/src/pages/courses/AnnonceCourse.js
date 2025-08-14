"use client"
import { useState, useEffect } from "react"
import Header from "../../components/common/Header"
import Footer from "../../components/common/Footer"
import "./AnnonceCourse.css"

const AnnonceCoursePage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Tableau des images d'annonces - vous pouvez ajouter vos propres images ici
  const annonceImages = [
    {
      src: "/images/preparation_examane.png",
      alt: "Préparation aux concours - Cours de soutien",
    },
    {
      src: "/images/setien.png",
      alt: "Cours de mathématiques avancées",
    },
    {
      src: "/cours-physique-chimie.png",
      alt: "Cours de physique et chimie",
    },
    {
      src: "/cours-informatique.png",
      alt: "Cours d'informatique",
    },
  ]

  // Navigation vers l'image suivante
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === annonceImages.length - 1 ? 0 : prevIndex + 1))
  }

  // Navigation vers l'image précédente
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? annonceImages.length - 1 : prevIndex - 1))
  }

  // Navigation directe vers une image
  const goToImage = (index) => {
    setCurrentImageIndex(index)
  }

  // Auto-play toutes les 5 secondes
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      nextImage()
    }, 5000)

    return () => clearInterval(interval)
  }, [currentImageIndex, isAutoPlaying])

  const handleWhatsAppClick = () => {
    const phoneNumber = "+212631262790"
    const message = "Bonjour, je suis intéressé(e) par vos cours. Pouvez-vous me donner plus d'informations ?"
    const whatsappUrl = `https://wa.me/${phoneNumber.replace("+", "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="annonce-course-page">
      <Header />

      <section className="annonce-course-section">
        <div className="annonce-course-container">
          <div
            className="carousel-wrapper"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div className="annonce-image-wrapper">
              <button className="carousel-btn carousel-btn-prev" onClick={prevImage}>
                &#8249;
              </button>

              <img
                src={annonceImages[currentImageIndex].src || "/placeholder.svg"}
                alt={annonceImages[currentImageIndex].alt}
                className="annonce-image"
              />

              <button className="carousel-btn carousel-btn-next" onClick={nextImage}>
                &#8250;
              </button>
            </div>

            {/* Indicateurs de pagination */}
            <div className="carousel-indicators">
              {annonceImages.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentImageIndex ? "active" : ""}`}
                  onClick={() => goToImage(index)}
                />
              ))}
            </div>

            {/* Compteur d'images */}
            <div className="image-counter">
              {currentImageIndex + 1} / {annonceImages.length}
            </div>
          </div>

          <div className="annonce-action">
            <button className="whatsapp-button" onClick={handleWhatsAppClick}>
              <span className="whatsapp-icon">📱</span>
              S'inscrire cours
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default AnnonceCoursePage
