const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Formation En Ligne</h3>
            <p>La plateforme le choix idéal pour les formations d'ingénieurs au Maroc</p>
          </div>

          <div className="footer-section">
            <h4>Liens Rapides</h4>
            <ul>
              <li>
                <a href="#accueil">Accueil</a>
              </li>
              <li>
                <a href="#formations">Formations</a>
              </li>
              <li>
                <a href="#cours">Cours</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
              <li>
                <a href="/student/login">Espace Étudiant</a>
              </li>
              <li>
                <a href="/login">Espace Admin</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Écoles Partenaires</h4>
            <ul>
              <li>ENSA</li>
              <li>ENSAM</li>
              <li>INPT</li>
              <li>EMI</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <p>📞 +212 6 57883241</p>
            <p>✉️ groupe.ensamaroc@gmail.com</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Formation En Ligne. Tous droits réservés.</p>
        </div>
      </div>

      <div className="whatsapp-float">
        <a href="https://wa.me/212 648-263079" target="_blank" rel="noopener noreferrer">
          <span>💬 Contactez-nous via WhatsApp</span>
        </a>
      </div>
    </footer>
  )
}

export default Footer
