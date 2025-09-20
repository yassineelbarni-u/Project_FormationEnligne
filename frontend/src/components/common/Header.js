"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import '../../styles/Header.css'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    } else if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } })
    }
  }

  // Gérer le défilement après la navigation
  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        const section = document.getElementById(location.state.scrollTo)
        if (section) {
          section.scrollIntoView({ behavior: "smooth" })
          // Nettoyer l'état après le défilement
          navigate(location.pathname, { replace: true, state: {} })
        }
      }, 100) 
    }
  }, [location.state, navigate, location.pathname])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [schoolIndex, setSchoolIndex] = useState(0)
  const schools = ["ENSA", "FST", "FS", "EST", "ENCG", "ENSAM", "BTS", "DTS"]
  const navMenuRef = useRef(null)

  const getSchoolColor = (school) => {
    const colors = {
      ENSA: "#de34d6ff",
      FST: "#10b981",
      FS: "#8b5cf6",
      EST: "#e11d48",
      ENCG: "#ea580c",
      ENSAM: "#0ea5e9",
      BTS : "#2563eb",
      DTS : "#4f46e5",
  
    }
    return colors[school] || "#2563eb"
  }

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
            <div className="header-content">
              <span>Cours de soutien en ligne </span>
              <span style={{ 
                color: getSchoolColor(schools[schoolIndex]),
                fontWeight: "bold",
                fontSize: "1.1rem",
                transition: "color 0.3s ease"
              }}>
                {schools[schoolIndex]}
              </span>
            </div>
            <div className="contact-info">
              <span>📞 +212 631-262790</span>
              <div className="social-links">
                <a href="https://wa.me/212631262790" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  📱
                </a>
               
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav className="navbar">
        <div className="container">
          <div className="nav-brand">
            <Link to="/" style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
              <img src="/images/logo/logo.png" alt="Logo" style={{height: '40px', width: '40px', objectFit: 'contain'}} />
              <h2 style={{margin: 0}}>E-learning by Ilyas</h2>
            </Link>
          </div>

          <div ref={navMenuRef} className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
            <Link to="/" className="nav-link" onClick={closeMenu}>
              Accueil
            </Link>
            <Link to="/courses" className="nav-link" onClick={closeMenu}>
              Nos Cours
            </Link>
            <button
              className="nav-link"
              onClick={(e) => {
                e.preventDefault()
                closeMenu()
                scrollToSection("services")
              }}
            >
              Nos Services
            </button>
            <button 
              className="nav-link"
              onClick={(e) => {
                e.preventDefault()
                closeMenu()
                scrollToSection("faq")
              }}
            >
              FAQ
            </button>
            <Link to="/recruitment" className="nav-link recruitment-link" onClick={closeMenu}>
              Recrutement
            </Link>
            <Link to="/cours-gratuits" className="nav-link" onClick={closeMenu}>
              Cours et Concours Gratuit
            </Link>

            <button
              className="nav-link"
              onClick={(e) => {
                e.preventDefault()
                closeMenu()
                scrollToSection("contact")
              }}
            >
              Contact
            </button>
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
