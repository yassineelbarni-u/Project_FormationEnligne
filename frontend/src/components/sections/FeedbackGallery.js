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
