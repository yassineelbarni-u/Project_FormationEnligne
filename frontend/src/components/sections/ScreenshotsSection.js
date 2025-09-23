import React from 'react';
import '../../styles/ScreenshotsSection.css';

const ScreenshotsSection = () => {
  const screenshots = [
    {
      image: '/images/screenshots/screen_1.png',
      alt: 'Capture d\'écran de l\'interface'
    },
    {
      image: '/images/screenshots/ScreenPlatform1.png',
      alt: 'Capture d\'écran des cours'
    },
    {
      image: '/images/screenshots/screen_3.jpg',
      alt: 'Capture d\'écran de l\'accueil'
    },
    {
      image: '/images/screenshots/screen_2.jpg',
      alt: 'Capture d\'écran du contenu'
    }
  ];

  return (
    <section className="screenshots-section">
      <div className="container">
        <div className="section-header">
          <h2>Découvrez Notre Plateforme</h2>
          <div className="section-line"></div>
        </div>
        
        <div className="screenshots-grid">
          {screenshots.map((screen, index) => (
            <div key={index} className="screenshot-card" data-aos="fade-up" data-aos-delay={index * 100}>
              <div className="screenshot-wrapper">
                <img 
                  src={screen.image} 
                  alt={screen.alt} 
                  className="screenshot-image"
                  loading="lazy"
                />

                {/*<div className="screenshot-overlay">
                  <div className="zoom-icon">🔍</div>
                </div> */}

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScreenshotsSection;
