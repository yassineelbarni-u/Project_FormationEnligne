import React, { useEffect } from 'react';
import Button from "../common/Button"
import imageHero from '../assets/Logo_Elearning.jpeg';
import '../styles/HeroSection.css';


const HeroSection = () => {
  // Fonction pour animer le compteur
  const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-value'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += step;
      if (current < target) {
        element.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };

    updateCounter();
  };

  // Observer pour détecter quand les stats sont visibles
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const numbers = entry.target.querySelectorAll('.stat-number');
          numbers.forEach(animateCounter);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="hero-section">
      {/* Éléments géométriques d'arrière-plan */}
      <div className="geometric-bg-elements">
        <div className="geo-circle circle-1"></div>
        <div className="geo-circle circle-2"></div>
        <div className="geo-square"></div>
        <div className="geo-triangle"></div>
        <div className="geo-dots"></div>
      </div>
      
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              Atteignez <span className="text-highlight dynamic-excellence">l'excellence</span>
              <br />
              avec nos cours <br />
              <span className="text-primary">de soutien universitaire</span>
            </h1>
            {/* Statistiques et boutons conservés */}
            <div className="hero-stats">
              <div className="stat-item animate">
                <span className="stat-number" data-value="5">0</span>
                <span className="stat-label">Ans d'expérience</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item animate">
                <span className="stat-number" data-value="1000">0</span>
                <span className="stat-label">Étudiants formés</span>
              </div>
            </div>
            <div className="hero-buttons">
              <Button variant="primary" to="/courses">Découvrir nos cours</Button>
              <Button variant="outline" to="/student/login">Espace étudiant</Button>
            </div>
          </div>
          <div className="hero-image">
            <div className="geometric-pattern">
              <div className="geometric-shapes"></div>
              <img
                src={imageHero}
                alt="Cours de soutien universitaire"
                className="student-image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection