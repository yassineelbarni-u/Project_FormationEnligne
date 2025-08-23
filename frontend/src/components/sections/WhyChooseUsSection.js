const GoogleMeetIcon = () => (
  <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:'2.7em',height:'2.7em',background:'#eaf3fe',borderRadius:'50%',boxShadow:'0 2px 8px rgba(37,99,235,0.07)'}}>
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="16" fill="#eaf3fe"/>
      <path d="M10 12v8a2 2 0 002 2h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2zm2 0h8v8h-8v-8zm10 4l4 3.5V14.5L22 16z" fill="#2AB472"/>
      <circle cx="16" cy="16" r="5" fill="#4285F4"/>
    </svg>
  </span>
);

const SoloIcon = () => (
  <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:'2.7em',height:'2.7em',background:'#fef6e4',borderRadius:'50%',boxShadow:'0 2px 8px rgba(255,193,7,0.07)'}}>
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="12" r="6" fill="#FFC107"/>
      <rect x="8" y="20" width="16" height="6" rx="3" fill="#FFD966"/>
    </svg>
  </span>
);

const CommunityIcon = () => (
  <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:'2.7em',height:'2.7em',background:'#e0f7fa',borderRadius:'50%',boxShadow:'0 2px 8px rgba(0,188,212,0.07)'}}>
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#e0f7fa"/>
      <circle cx="10" cy="14" r="4" fill="#00BCD4"/>
      <circle cx="22" cy="14" r="4" fill="#00BCD4"/>
      <rect x="8" y="20" width="16" height="4" rx="2" fill="#4DD0E1"/>
    </svg>
  </span>
);

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
    {
      title: "Cours en direct Google Meet",
      description: "Travaillez en direct via Google Meet avec votre enseignant. Toutes les séances sont enregistrées et accessibles à tout moment.",
      icon: <GoogleMeetIcon />,
    },
    {
      title: "Travail individuel (solo)",
      description: "Bénéficiez de séances personnalisées en solo pour progresser à votre rythme et selon vos besoins.",
      icon: <SoloIcon />,
    },
    {
      title: "Communauté et accompagnement",
      description: "Rejoignez une communauté active d'étudiants et bénéficiez d'un accompagnement continu pour réussir vos objectifs.",
      icon: <CommunityIcon />,
    },
  ];

  return (
    <section className="why-choose-section">
      <div className="container">
        <h2 className="section-title">
          Pourquoi les étudiants choisissent <span className="text-primary">El-earning by Ilyas</span>
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
  );
};

export default WhyChooseUsSection
