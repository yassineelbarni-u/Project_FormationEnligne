<<<<<<< HEAD
import "./VideoSection.css"
=======
import React from 'react';
import './VideoSection.css';
>>>>>>> c79657081c0335c07b1c654f0d60fb8a6cf4dac1

const VideoSection = () => {
  return (
    <section className="video-section">
      <div className="video-container">
        <div className="video-content">
          <h2 className="video-title">Découvrez nos objectifs</h2>
          <p className="video-description">
<<<<<<< HEAD
            Regardez cette vidéo pour comprendre notre mission et comment nous aidons les étudiants à réussir leur
            parcours d'apprentissage.
          </p>
          <div className="video-wrapper">
            <video className="objective-video" controls poster="/images/video-thumbnail.png" preload="metadata">
              <source src="/videos/test.mp4" type="video/mp4" />
              <source src="/videos/test.webm" type="video/webm" />
=======
            Regardez cette vidéo pour comprendre notre mission et comment nous aidons 
            les étudiants à réussir leur parcours d'apprentissage.
          </p>
          <div className="video-wrapper">
            <video 
              className="objective-video"
              controls
              poster="/images/video-thumbnail.jpg"
              preload="metadata"
            >
              <source src="/videos/objectif-video.mp4" type="video/mp4" />
              <source src="/videos/objectif-video.webm" type="video/webm" />
>>>>>>> c79657081c0335c07b1c654f0d60fb8a6cf4dac1
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
          </div>
        </div>
      </div>
    </section>
<<<<<<< HEAD
  )
}

export default VideoSection
=======
  );
};

export default VideoSection;
>>>>>>> c79657081c0335c07b1c654f0d60fb8a6cf4dac1
