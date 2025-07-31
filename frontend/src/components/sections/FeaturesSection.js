import Card from "../common/Card"

const FeaturesSection = () => {
  const features = [
    {
      icon: "👩‍🏫",
      title: "Solution conçue par des professeurs",
      description:
        "Appliquez immédiatement vos nouvelles capacités dans le contexte de votre travail. Avec une sélection des meilleurs professeurs",
    },
    {
      icon: "🏛️",
      title: "Contenu qui respectent le programme",
      description:
        "Les cours offerts sont en parfait accord avec les programmes des écoles d'ingénieurs au Maroc (ENSA, ENSAM, INPT, EMI, EHTP, CPGE)",
    },
    {
      icon: "💻",
      title: "Perfectionnez vos skills avec ENSA-Maroc.com",
      description:
        "Apprendre sur la plateforme ENSA MAROC transforme votre façon de penser et ce que vous pouvez faire.",
    },
    {
      icon: "📚",
      title: "Booster vos connaissances avec notre Site",
      description: "Accédez à une bibliothèque complète de ressources pédagogiques adaptées à votre niveau",
    },
    {
      icon: "🔬",
      title: 'Collaborations avec "Be In Sciences"',
      description: "Partenariat exclusif pour vous offrir le meilleur contenu scientifique",
    },
  ]

  return (
    <section className="features-section">
      <div className="container">
        <h2 className="section-title">
          Pourquoi <span className="text-orange">Les Ingénieurs</span>
          <br />
          <span className="text-purple">Aiment Apprendre Sur Notre Plateforme</span>
          <br />
          <span className="text-purple">ENSA -MAROC.</span>
        </h2>

        <div className="features-grid">
          {features.map((feature, index) => (
            <Card key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
