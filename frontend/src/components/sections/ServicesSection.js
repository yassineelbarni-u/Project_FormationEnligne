const ServicesSection = () => {
  const services = [
    {
      title: "Mathématiques",
      description: "Analyse, algèbre, probabilités, géométrie. Tous niveaux du lycée à l'université.",
      image: "/placeholder.svg?height=200&width=300&text=Mathématiques",
      features: ["Cours particuliers", "Exercices corrigés", "Préparation examens"],
    },
    {
      title: "Physique-Chimie",
      description: "Mécanique, thermodynamique, chimie organique. Approche pratique et théorique.",
      image: "/placeholder.svg?height=200&width=300&text=Physique-Chimie",
      features: ["Expériences virtuelles", "Résolution de problèmes", "Méthodologie"],
    },
    {
      title: "Informatique",
      description: "Programmation, algorithmique, bases de données. Formation complète et moderne.",
      image: "/placeholder.svg?height=200&width=300&text=Informatique",
      features: ["Langages de programmation", "Projets pratiques", "Certification"],
    },
    {
      title: "Préparation Examens",
      description: "Bac, concours, partiels. Stages intensifs et examens blancs personnalisés.",
      image: "/placeholder.svg?height=200&width=300&text=Examens",
      features: ["Examens blancs", "Stages intensifs", "Suivi personnalisé"],
    },
  ]

  return (
    <section className="services-section">
      <div className="container">
        <h2 className="section-title">
          Lancez votre réussite avec <span className="text-highlight">la bonne méthode</span>, dès le départ
        </h2>
        <p className="section-subtitle">Choisissez la formation adaptée à votre niveau et vos objectifs.</p>

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-image">
                <img src={service.image || "/placeholder.svg"} alt={service.title} />
              </div>
              <div className="service-content">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
                <button className="btn-outline">En savoir plus</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesSection
