"use client"

import { useState } from "react"

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      name: "Sarah Benali",
      role: "Étudiante en Terminale S",
      image: "../assets/sarah.png",
      quote: "J'ai été surprise par la simplicité et rapidité du service.",
      description:
        "Grâce aux cours d'Ilyas, j'ai pu améliorer mes notes en mathématiques de 8 à 16. L'approche personnalisée m'a vraiment aidée à comprendre les concepts difficiles.",
    },
    {
      name: "Ahmed Tazi",
      role: "Étudiant en Licence Physique",
      image: "/placeholder.svg?height=300&width=400&text=Ahmed",
      quote: "Un accompagnement exceptionnel qui m'a permis de réussir.",
      description:
        "Les cours de physique-chimie sont très bien structurés. Ilyas explique clairement et s'adapte parfaitement à mon rythme d'apprentissage.",
    },
    {
      name: "Fatima Alaoui",
      role: "Étudiante en Prépa",
      image: "/placeholder.svg?height=300&width=400&text=Fatima",
      quote: "Une méthode efficace qui donne des résultats concrets.",
      description:
        "Préparation au concours réussie ! Les examens blancs et le suivi personnalisé m'ont donné confiance pour les épreuves.",
    },
  ]

  return (
    <section className="testimonials-section">
      <div className="container">
        <h2 className="section-title">
          Nos étudiants <span className="text-highlight">parlent de nous</span>
        </h2>

        <div className="testimonial-container">
          <div className="testimonial-image">
            <img src={testimonials[currentIndex].image || "/placeholder.svg"} alt={testimonials[currentIndex].name} />
          </div>

          <div className="testimonial-content">
            <div className="quote-mark">"</div>
            <h3>{testimonials[currentIndex].quote}</h3>
            <p>{testimonials[currentIndex].description}</p>

            <div className="testimonial-author">
              <strong>{testimonials[currentIndex].name}</strong>
              <span>{testimonials[currentIndex].role}</span>
            </div>
          </div>

          <div className="testimonial-navigation">
            <button
              onClick={() => setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : testimonials.length - 1)}
              className="nav-btn"
            >
              ‹
            </button>
            <button
              onClick={() => setCurrentIndex(currentIndex < testimonials.length - 1 ? currentIndex + 1 : 0)}
              className="nav-btn"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
