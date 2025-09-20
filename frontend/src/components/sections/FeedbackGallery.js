import React, { useEffect } from "react"
import "./FeedbackGallery.css"

const feedbackImages = [
  "/images/fedback/feedback1.jpg",
  "/images/fedback/feedback2.jpg",
  "/images/fedback/feedback3.jpg",
  "/images/fedback/feedback4.jpg",
  "/images/fedback/feedback5.jpg",
]

const FeedbackGallery = () => {
  useEffect(() => {
    // Animation au scroll avec IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      { 
        threshold: 0.1, 
        rootMargin: '0px 0px -50px 0px' 
      }
    )

    // Observer le titre et les cartes
    const title = document.querySelector('.section-title')
    const cards = document.querySelectorAll('.feedback-image-card')

    if (title) observer.observe(title)
    cards.forEach((card, index) => {
      card.style.animationDelay = `${0.1 + index * 0.1}s`
      observer.observe(card)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section className="feedback-gallery-section">
      <div className="container">
        <h2 className="section-title">Feedback de nos étudiants</h2>
        <div className="feedback-gallery-container">
          {feedbackImages.map((src, idx) => (
            <div className="feedback-image-card" key={idx}>
              <img src={src} alt={`Feedback ${idx + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeedbackGallery
