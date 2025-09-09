import React from "react";
import "../../styles/PymentSection.css";

// Utilise l'image du QR code (remplacer par le vrai chemin si besoin)
const qrImage = "/images/scanComptes.png";

const PymentSection = () => {
  return (
    <section className="pyment-section">
      <div className="pyment-container">
        <div className="pyment-image-wrapper">
          <img src={qrImage} alt="QR Code Paiement" className="pyment-bank-image" />
        </div>
        <div className="pyment-info">
          <h2>Informations de Paiement</h2>
          <div className="pyment-details">
            <p><strong>Nom:</strong> MONSIEUR ILYAS NAHI</p>
            <p><strong>RIB:</strong> 230 610 4046294211026600 63</p>
            <p><strong>IBAN:</strong> MA64 2306 1040 4629 4211 0266 0063</p>
            <p><strong>Code SWIFT:</strong> CIHMMAMC</p>
            <p style={{color: '#e67e22', fontWeight: 'bold'}}>Scannez le QR code pour faciliter le paiement</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PymentSection;
