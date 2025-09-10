import React from "react"
import "./FeedbackGallery.css"

const feedbackImages = [
  "/images/fedback/feedback1.jpg",
  "/images/fedback/feedback2.jpg",
  "/images/fedback/feedback3.jpg",
  "/images/fedback/feedback4.jpg",
  "/images/fedback/feedback5.jpg",
  "/images/fedback/feedback6.png",
  "/images/fedback/feedback7.png"
]

const FeedbackGallery = () => {
  return (
    <section className="feedback-gallery-section">
      <div className="container">
        <h2 className="feedback-section-title">Feedback de nos étudiants</h2>
        <p className="feedback-section-subtitle">
          Découvrez les témoignages authentiques de nos étudiants qui ont réussi grâce à notre accompagnement personnalisé.
        </p>
        
        <div className="feedback-gallery-container">
          {feedbackImages.map((src, idx) => (
            <div className="feedback-image-card" key={idx}>
              <div className="feedback-badge">{idx + 1}</div>
              <div className="feedback-image-wrapper">
                <img 
                  src={src} 
                  alt={`Feedback étudiant ${idx + 1}`} 
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    console.log(`Image non trouvée: ${src}`);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeedbackGallery
