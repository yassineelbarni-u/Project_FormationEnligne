const WhyChooseUsSection = () => {
  const reasons = [
    {
      title: "Simplicité",
      description: "Plateforme intuitive et facile d'utilisation. Accédez à vos cours en quelques clics.",
      icon: "📚",
    },
    {
      title: "Rapidité",
      description: "Réponses immédiates à vos questions. Support réactif et accompagnement en temps réel.",
      icon: "⚡",
    },
    {
      title: "Fiabilité",
      description: "Méthodes pédagogiques éprouvées. Résultats garantis avec un suivi personnalisé.",
      icon: "🎯",
    },
  ]

  return (
    <section className="why-choose-section">
      <div className="container">
        <h2 className="section-title">
          Pourquoi les étudiants choisissent <span className="text-primary">Ilyas Nahi</span>
        </h2>

        <div className="reasons-grid">
          {reasons.map((reason, index) => (
            <div key={index} className="reason-card">
              <div className="reason-icon">{reason.icon}</div>
              <h3>{reason.title}</h3>
              <p>{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUsSection
