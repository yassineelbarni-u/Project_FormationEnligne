"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [schoolIndex, setSchoolIndex] = useState(0)
  const schools = ["ENSA", "FST", "FS", "EST", "ENCG", "ENSAM"]

  // Couleur rouge cramoisi fixe
  const schoolColor = "#DC143C" 

  useEffect(() => {
    const interval = setInterval(() => {
      setSchoolIndex((prevIndex) => (prevIndex + 1) % schools.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [schools.length])

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="header-info">
            <span>
              Cours de soutien en ligne{" "}
              <span
                style={{
                  color: schoolColor,
                  fontWeight: "bold",
                }}
              >
                {schools[schoolIndex]}
              </span>
            </span>
            <div className="contact-info">
              <span>📞 +212 648-263079</span>
              <div className="social-links">
                <a href="#" aria-label="WhatsApp">
                  📱
                </a>
                <a href="#" aria-label="Facebook">
                  📘
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav className="navbar">
        <div className="container">
          <div className="nav-brand">
            <Link to="/">
              <h2>El-earning by Ilyas</h2>
            </Link>
          </div>

          <div className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
            <Link to="/" className="nav-link">
              Accueil
            </Link>
            <Link to="/courses" className="nav-link">
              Nos Cours
            </Link>
            <a href="#services" className="nav-link">
              Nos Services
            </a>
            <a href="#faq" className="nav-link">
              FAQ
            </a>
            <a href="#contact" className="nav-link">
              Contact
            </a>
            <Link to="/login" className="btn-primary">
              Connexion
            </Link>
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>
      </nav>
    </header>
  )
}

export default Header
