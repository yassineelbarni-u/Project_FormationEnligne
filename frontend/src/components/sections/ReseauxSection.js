import React from "react";
import "./ReseauxSection.css";

const ReseauxSection = () => (
  <section className="reseaux-section">
    <div className="reseaux-container">
      {/* Image à gauche */}
      <div className="reseaux-image">
        <img 
          src="/images/design/Reseux.png" 
          alt="Learning by Ilyas - Rejoignez nos réseaux sociaux"
          className="hero-image"
        />
      </div>
    

      {/* Contenu à droite */}
      <div className="reseaux-content">
        <h2>Rejoignez les réseaux Learning by Ilyas</h2>
        <div className="reseaux-links">
          <a
            href="https://web.facebook.com/groups/740357394887230/?_rdc=1&_rdr#"
            target="_blank"
            rel="noopener noreferrer"
            className="reseaux-link"
            title="Groupe Facebook Préparation Concours 2025"
          >
            <i className="fab fa-facebook-square"></i>
            Groupe Préparation Concours 2025 (bac+2/bac+3)
          </a>
          <a
            href="https://web.facebook.com/e.learning.ilyas"
            target="_blank"
            rel="noopener noreferrer"
            className="reseaux-link"
            title="Page Facebook Learning by Ilyas"
          >
            <i className="fab fa-facebook"></i>
            Page Facebook Learning by Ilyas
          </a>
          <a
            href="https://whatsapp.com/channel/0029Vb5Xh7oJUM2hCtw7Un3U"
            target="_blank"
            rel="noopener noreferrer"
            className="reseaux-link whatsapp"
            title="Groupe WhatsApp Préparation Concours"
          >
            <i className="fab fa-whatsapp"></i>
            Chaîne d'annonce WhatsApp
          </a>
          <a
            href="https://www.instagram.com/elearning.ilyas/?igsh=eWJsZW9udzN5am9n#"
            target="_blank"
            rel="noopener noreferrer"
            className="reseaux-link instagram"
            title="Instagram Learning by Ilyas"
          >
            <i className="fab fa-instagram"></i>
            Instagram Learning by Ilyas
          </a>
          <a
            href="https://www.youtube.com/@e-learning-by-ilyas"
            target="_blank"
            rel="noopener noreferrer"
            className="reseaux-link youtube"
            title="Chaîne YouTube Learning by Ilyas"
          >
            <i className="fab fa-youtube"></i>
            Chaîne YouTube Learning by Ilyas
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default ReseauxSection;
