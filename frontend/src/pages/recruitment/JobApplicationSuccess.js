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
