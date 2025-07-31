const PartnersSection = () => {
  const partners = [
    { name: "ENSAH", logo: "/placeholder.svg?height=80&width=120&text=ENSAH" },
    { name: "ENSA El Jadida", logo: "/placeholder.svg?height=80&width=120&text=ENSA+EJ" },
    { name: "ENSA Fès", logo: "/placeholder.svg?height=80&width=120&text=ENSA+FES" },
    { name: "ENSA Kenitra", logo: "/placeholder.svg?height=80&width=120&text=ENSA+KEN" },
    { name: "ENSA Khouribga", logo: "/placeholder.svg?height=80&width=120&text=ENSA+KH" },
    { name: "ENSA Marrakech", logo: "/placeholder.svg?height=80&width=120&text=ENSA+MAR" },
  ]

  return (
    <section className="partners-section">
      <div className="container">
        <button className="join-btn">Rejoindre L'équipe Be In Sciences</button>

        <h2 className="section-title">
          Nos Étudiants Provient De Toutes <span className="text-orange">Les Écoles D'ingénieurs Au Maroc</span>
        </h2>

        <p className="section-description">
          La plateforme ENSA Maroc est un espace de partage et de collaboration pour les étudiants ingénieurs du Maroc.
          Créée en 2017, elle met à disposition plus de 600 Go de données et la correction de 1500 examens et TDs, dans
          le but d'aider les étudiants à atteindre l'excellence.
        </p>

        <div className="partners-grid">
          {partners.map((partner, index) => (
            <div key={index} className="partner-logo">
              <img src={partner.logo || "/placeholder.svg"} alt={partner.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PartnersSection
