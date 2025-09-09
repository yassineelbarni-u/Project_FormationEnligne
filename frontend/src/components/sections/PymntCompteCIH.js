import React from "react";
import "../../styles/PymntCompteCIH.css";

// Remplacez par le chemin de votre scan QR code CIH
const scanImage = "/images/scanComptes.png";

const PymntCompteCIH = () => {
  return (
    <section className="cih-section">
      <div className="cih-container">
        <div className="cih-image-wrapper">
          <img src={scanImage} alt="Scan QR CIH" className="cih-scan-image" />
        </div>
        <div className="cih-info">
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
              <h2 style={{margin: 0}}>Comptes CIH</h2>
              <img src="/images/LogoCIHbanque.jpg" alt="Logo CIH Banque" style={{height: '40px', marginLeft: '8px'}} />
            </div>
          <div className="cih-details">
            <p><strong>Nom:</strong> ILYAS NAHI</p>
            <p><strong>N° de Compte:</strong> 4046294211026600</p>
            <p style={{color: '#e67e22', fontWeight: 'bold'}}>Scannez le QR code pour accéder au compte CIH</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PymntCompteCIH;
