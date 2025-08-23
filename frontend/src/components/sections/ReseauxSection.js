import React from "react";
import "./ReseauxSection.css";

const ReseauxSection = () => (
  <section className="reseaux-section">
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
        href="https://chat.whatsapp.com/H2wlZMoGfGeCAwRlTVOelp?mode=r_t"
        target="_blank"
        rel="noopener noreferrer"
        className="reseaux-link whatsapp"
        title="Groupe WhatsApp Préparation Concours"
      >
        <i className="fab fa-whatsapp"></i>
        Groupe WhatsApp Préparation Concours
      </a>
    </div>
  </section>
);

export default ReseauxSection;