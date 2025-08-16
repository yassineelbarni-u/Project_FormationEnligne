import "./VideoSection.css"

const VideoSection = () => {
  return (
    <section className="video-section">
      <div className="video-container">
        <div className="video-content">
          <h2 className="video-title">Découvrez nos objectifs</h2>
          <p className="video-description">
            Regardez cette vidéo pour comprendre notre mission et comment nous aidons les étudiants à réussir leur
            parcours d'apprentissage.
          </p>
          <div className="video-wrapper">
            <video className="objective-video" controls poster="/images/video-thumbnail.png" preload="metadata">
              <source src="/videos/test.mp4" type="video/mp4" />
              <source src="/videos/test.webm" type="video/webm" />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VideoSection
