import React from "react";
import "../../styles/PymentSection.css";

// Utilise l'image du QR code
const qrImage = "/images/scanComptes.png";

const PymentSection = () => {
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    console.log(`Image QR code non trouvée: ${e.target.src}`);
  };

  return (
    <section className="pyment-section" id="payment">
      <div className="container">
        <h2 className="pyment-section-title">Informations de Paiement</h2>
        <p className="pyment-section-subtitle">
          Effectuez vos paiements facilement avec les informations bancaires ci-dessous
        </p>
        
        <div className="pyment-container">
          <div className="pyment-image-wrapper">
            <div className="qr-badge">QR Code</div>
            <img 
              src={qrImage} 
              alt="QR Code pour paiement bancaire - MONSIEUR ILYAS NAHI" 
              className="pyment-bank-image"
              onError={handleImageError}
              loading="lazy"
            />
          </div>
          
          <div className="pyment-info">
            <h2>Détails Bancaires</h2>
            <div className="pyment-details">
              <p data-type="name">
                <strong>Nom:</strong> MONSIEUR ILYAS NAHI
              </p>
              <p data-type="rib">
                <strong>RIB:</strong> 230 610 4046294211026600 63
              </p>
              <p data-type="iban">
                <strong>IBAN:</strong> MA64 2306 1040 4629 4211 0266 0063
              </p>
              <p data-type="swift">
                <strong>Code SWIFT:</strong> CIHMMAMC
              </p>
              <p className="scan-instruction">
                Scannez le QR code pour faciliter le paiement
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PymentSection;
