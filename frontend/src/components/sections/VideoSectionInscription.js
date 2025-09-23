import "./VideoSection.css"

const VideoSection = () => {
  // Remplacez cette URL par votre lien YouTube
  const youtubeVideoId = "2YaJJIvpIrs";
  return (
    <section className="video-section">
      <div className="container">
        <div className="video-content">
          <div className="video-header">
            <h2 className="section-title">Comment accéder aux cours sur le site web</h2>
            {/* <p className="video-description">
              Regardez cette vidéo pour comprendre notre mission et comment nous pouvons vous aider à atteindre vos
              objectifs.
            </p> */}
          </div>

          <div className="video-container">
            <div className="video-wrapper">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0&showinfo=0&modestbranding=1`}
                title="Vidéo de présentation"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VideoSection
