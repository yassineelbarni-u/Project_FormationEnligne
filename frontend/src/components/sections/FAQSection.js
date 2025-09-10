"use client"

import { useState } from "react"
import "./FAQSection.css"  // Import du fichier CSS

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      question: "Comment se déroulent les cours de soutien ?",
      answer:
        "Nos cours se font en direct avec un enseignant, via une plateforme interactive. L'élève peut poser ses questions en temps réel, partager son écran et recevoir un accompagnement personnalisé.",
    },
    {
      question: "Quels sont les niveaux pris en charge ?",
      answer:
        "Nous accompagnons les élèves de niveau lycée (Seconde à Terminale, toutes filières) jusqu'au niveau universitaire (Licence, DUT, BTS, Prépas). Nos modules sont adaptés à chaque programme.",
    },
    {
      question: "Quels modules sont proposés ?",
      answer:
        "Nous proposons un soutien spécialisé en : Mathématiques (analyse, algèbre, probabilités…), Physique-Chimie, Informatique et d'autres matières sur demande.",
    },
    {
      question: "Est-ce que les cours sont adaptés à mon rythme ?",
      answer:
        "Oui ! Chaque élève bénéficie d'un suivi personnalisé. L'emploi du temps, le niveau, et les objectifs sont définis selon ses besoins spécifiques.",
    },
    {
      question: "Peut-on suivre les cours à distance ?",
      answer:
        "Absolument. Tous nos cours sont accessibles en ligne, depuis un ordinateur ou une tablette, avec une simple connexion Internet.",
    },
    {
      question: "Y a-t-il un accompagnement pour la préparation au Bac ou aux examens ?",
      answer:
        "Oui. Nous proposons des stages intensifs, des séances de révision, et des examens blancs pour aider les élèves à réussir leurs examens dans les meilleures conditions.",
    },
    {
      question: "Comment puis-je commencer ?",
      answer:
        "Il suffit de nous contacter via notre formulaire. Nous vous recontacterons rapidement pour organiser une première séance gratuite d'évaluation.",
    },
  ]

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <h2 className="section-title">
          Questions <span className="text-highlight">fréquentes</span>
        </h2>

        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button
                className={`faq-question ${openIndex === index ? "active" : ""}`}
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              >
                {faq.question}
                <span className="faq-icon">{openIndex === index ? "−" : "+"}</span>
              </button>
              {openIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQSection
