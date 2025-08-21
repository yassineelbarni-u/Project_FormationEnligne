import Button from "../common/Button"
import imageHero from '../assets/hero.png.png';
import '../styles/HeroSection.css';


const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              Atteignez <span className="text-highlight">l'excellence</span>
              <br />
              grâce à nos cours 
              <br />
              <span className="text-primary">de soutien universitaire</span>
            </h1>
            <p>
              Cours de soutien en ligne spécialisés en Sciences. Mathématiques, Physique-Chimie, Informatique pour les étudiants 
              des écoles d'ingénieurs ENSA, ENSAM, FST et FS au Maroc.
            </p>
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
