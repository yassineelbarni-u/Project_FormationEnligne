"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [schoolIndex, setSchoolIndex] = useState(0)
  const schools = ["ENSA", "FST", "FS", "EST", "ENCG", "ENSAM"]
  const navMenuRef = useRef(null)

  // Utiliser la couleur primaire
  const schoolColor = "var(--primary-color, #2563eb)"

  useEffect(() => {
    const interval = setInterval(() => {
      setSchoolIndex((prevIndex) => (prevIndex + 1) % schools.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [schools.length])

  // Fermer le menu quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && navMenuRef.current && !navMenuRef.current.contains(event.target) && 
          !event.target.classList.contains('mobile-menu-btn')) {
        setIsMenuOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  // Fonction pour fermer le menu après avoir cliqué sur un lien
  const closeMenu = () => {
    setIsMenuOpen(false)
  }

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
                <a href="https://wa.me/212648263079" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  📱
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
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

          <div ref={navMenuRef} className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
            <Link to="/" className="nav-link" onClick={closeMenu}>
              Accueil
            </Link>
            <Link to="/courses" className="nav-link" onClick={closeMenu}>
              Nos Cours
            </Link>
            <a href="#services" className="nav-link" onClick={closeMenu}>
              Nos Services
            </a>
            <a href="#faq" className="nav-link" onClick={closeMenu}>
              FAQ
            </a>
            <Link to="/recruitment" className="nav-link recruitment-link" onClick={closeMenu}>
              Recrutement
            </Link>
            <a href="#contact" className="nav-link" onClick={closeMenu}>
              Contact
            </a>
            <Link to="/login" className="btn-primary" onClick={closeMenu}>
              Connexion
            </Link>
          </div>

          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>
    </header>
  )
}

export default Header
