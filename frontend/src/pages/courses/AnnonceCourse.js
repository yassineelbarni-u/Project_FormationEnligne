"use client"
import Header from "../../components/common/Header"
import Footer from "../../components/common/Footer"
import "./AnnonceCourse.css"

const AnnonceCoursePage = () => {
  // <CHANGE> Suppression de la logique carrousel, ajout d'une grille de cards
  const annonceImages = [
    {
      src: "/images/preparation_examane.png",
      alt: "Préparation aux concours - Cours de soutien",
      title: "Préparation aux concours 2026"
    },
    {
      src: "/advanced-math-class.png",
      alt: "Cours de mathématiques avancées",
      title: "Mathématiques Avancées"
    },
    {
      src: "/cours-physique-chimie.png",
      alt: "Cours de physique et chimie",
      title: "Physique & Chimie"
    },
    {
      src: "/cours-informatique.png",
      alt: "Cours d'informatique",
      title: "Informatique"
    },
  ]

  const handleWhatsAppClick = (courseTitle) => {
    const phoneNumber = "+212631262790"
    const message = `Bonjour, je suis intéressé(e) par le cours "${courseTitle}". Pouvez-vous me donner plus d'informations ?`
    const whatsappUrl = `https://wa.me/${phoneNumber.replace("+", "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="annonce-course-page">
      <Header />

      <section className="annonce-course-section">
        <div className="annonce-course-container">
          {/* <CHANGE> Grille de cards au lieu du carrousel */}
          <div className="annonces-grid">
            {annonceImages.map((annonce, index) => (
              <div key={index} className="annonce-card">
                <div className="annonce-image-wrapper">
                  <img
                    src={annonce.src || "/placeholder.svg"}
                    alt={annonce.alt}
                    className="annonce-image"
                  />
                </div>
                
                <div className="annonce-action">
                  <button 
                    className="whatsapp-button" 
                    onClick={() => handleWhatsAppClick(annonce.title)}
                  >
                    <span className="whatsapp-icon">📱</span>
                    S'inscrire cours
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default AnnonceCoursePage
