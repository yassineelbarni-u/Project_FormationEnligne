import Button from "../common/Button"
import imageHero from '../assets/image_hero.png';


const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              Réussissez <span className="text-highlight">vos études</span>
              <br />
              avec un accompagnement
              <br />
              <span className="text-primary">personnalisé</span>
            </h1>
            <p>
              Cours de soutien en ligne avec Ilyas . Mathématiques, Physique-Chimie, Informatique. Du lycée à
              l'université, bénéficiez d'un suivi adapté à votre rythme.
            </p>
            <div className="hero-buttons">
              <Button variant="primary" to="/">Commencer maintenant</Button>
              <Button variant="secondary" to="/">Découvrir nos cours</Button>
              <Button variant="outline" to="/student/login">Accéder à mon espace étudiant</Button>
            </div>
          </div>
          <div className="hero-image">
            <div className="geometric-pattern">

              <img
                src={imageHero}
                alt="E-Learning by Ilyas"
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
