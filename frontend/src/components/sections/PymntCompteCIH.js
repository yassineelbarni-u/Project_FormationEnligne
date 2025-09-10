import React from "react";
import "../../styles/PymntCompteCIH.css";

// Chemins des images
const scanImage = "/images/scanComptes.png";
const logoImage = "/images/LogoCIHbanque.jpg";

const PymntCompteCIH = () => {
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    console.log(`Image non trouvée: ${e.target.src}`);
  };

  return (
    <section className="cih-section" id="cih-payment">
      <div className="container">
        <h2 className="cih-section-title">Compte CIH Banque</h2>
        <p className="cih-section-subtitle">
          Accédez facilement à votre compte CIH avec les informations ci-dessous
        </p>
        
        <div className="cih-container">
          <div className="cih-image-wrapper">
            <div className="cih-badge">CIH Bank</div>
            <img 
              src={scanImage} 
              alt="QR Code pour accès compte CIH - ILYAS NAHI" 
              className="cih-scan-image"
              onError={handleImageError}
              loading="lazy"
            />
          </div>
          
          <div className="cih-info">
            <div className="cih-header">
              <h2>Comptes CIH</h2>
              <img 
                src={logoImage} 
                alt="Logo CIH Banque" 
                className="cih-logo"
                onError={handleImageError}
              />
            </div>
            
            <div className="cih-details">
              <p data-type="name">
                <strong>Nom:</strong> ILYAS NAHI
              </p>
              <p data-type="account">
                <strong>N° de Compte:</strong> 4046294211026600
              </p>
              <p className="scan-instruction-cih">
                Scannez le QR code pour accéder au compte CIH
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PymntCompteCIH;
