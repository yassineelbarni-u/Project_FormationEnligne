import { Link } from "react-router-dom"
import Header from "../../components/common/Header"
import Footer from "../../components/common/Footer"
import "./JobApplicationSuccess.css"

const JobApplicationSuccess = () => {
  return (
    <div className="page-container">
      <Header />

      <main className="success-page">
        <div className="container">
          <div className="success-content">
            <div className="success-icon">✅</div>

            <h1>Candidature envoyée avec succès !</h1>

            <div className="success-message">
              <p>
                Merci pour votre candidature. Nous avons bien reçu votre dossier et nous vous contacterons dans les plus
                brefs délais si votre profil correspond à nos attentes.
              </p>

              <div className="next-steps">
                <h3>Prochaines étapes :</h3>
                <ul>
                  <li>Nous examinerons votre candidature dans les 48h</li>
                  <li>Si votre profil nous intéresse, nous vous contacterons par email</li>
                  <li>Un entretien pourra être organisé selon le poste</li>
                </ul>
              </div>
            </div>

            <div className="success-actions">
              <Link to="/recruitment" className="btn-primary">
                Voir d'autres offres
              </Link>
              <Link to="/" className="btn-secondary">
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default JobApplicationSuccess
