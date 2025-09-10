"use client"

import { useState } from "react"
import "./ContactSection.css"

const ContactSection = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const phone = "212631262790"
    const text = `*Nouveau message depuis le site Learning by Ilyas*%0A--------------------%0A*Nom:* ${formData.lastName} ${formData.firstName}%0A*Email:* ${formData.email}%0A*Message:* ${formData.message}`
    const url = `https://wa.me/${phone}?text=${text}`
    window.open(url, "_blank")
  }

  return (
    <section className="contact-section" id="contact">
      <div className="container">
        {/* Titre principal en haut et en couleur principale */}
        <h2 className="contact-section-title">Contactez-nous pour toute question</h2>
        
        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-details">
              {/* Ordre corrigé: Téléphone, Email, Horaires */}
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <h4>Téléphone</h4>
                  <p>+212 6 57883241</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div>
                  <h4>Email</h4>
                  <p>contact.ilyasnahi@gmail.com</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">🕒</div>
                <div>
                  <h4>Horaires</h4>
                  <p>7j/24</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <h3>Envoyez-nous un message</h3>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Prénom</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Votre prénom"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nom</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Votre nom"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Votre adresse email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  placeholder="Votre message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                Envoyer via WhatsApp 📤
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
