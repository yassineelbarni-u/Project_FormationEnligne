<<<<<<< HEAD
import "./CoursesSection.css"

=======
>>>>>>> c79657081c0335c07b1c654f0d60fb8a6cf4dac1
const CoursesSection = () => {
  const subjects = [
    {
      icon: "💡",
      title: "Contrôle Linguistique et Français",
      description: "Maîtrisez la langue française et les techniques de communication",
    },
    {
      icon: "💻",
      title: "Informatique et Programmation",
      description: "Apprenez les bases de la programmation et de l'informatique",
    },
    {
      icon: "👥",
      title: "Communication et Travail d'équipe",
      description: "Développez vos compétences en communication et collaboration",
    },
  ]

  return (
    <section className="courses-section">
      <div className="container">
        <h2 className="section-title">Qu'est-ce que vous apprendrez dans ce cours</h2>

        <div className="subjects-grid">
          {subjects.map((subject, index) => (
            <div key={index} className="subject-card">
              <div className="subject-icon">{subject.icon}</div>
              <h3>{subject.title}</h3>
              <p>{subject.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CoursesSection
