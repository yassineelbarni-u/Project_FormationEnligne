"use client"

import { useState } from "react"
import "./JobOfferForm.css"

const JobOfferForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    company: initialData?.company || "",
    location: initialData?.location || "",
    description: initialData?.description || "",
    requirements: initialData?.requirements || "",
    benefits: initialData?.benefits || "",
    salary_range: initialData?.salary_range || "",
    application_deadline: initialData?.application_deadline
      ? new Date(initialData.application_deadline).toISOString().split("T")[0]
      : "",
  })

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Le titre est requis"
    }

    if (!formData.company.trim()) {
      newErrors.company = "Le nom de l'entreprise est requis"
    }

    if (!formData.description.trim()) {
      newErrors.description = "La description est requise"
    }

    if (formData.application_deadline) {
      const deadline = new Date(formData.application_deadline)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (deadline < today) {
        newErrors.application_deadline = "La date limite ne peut pas être dans le passé"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setSubmitting(true)

      // Préparer les données pour l'API
      const submitData = {
        ...formData,
        application_deadline: formData.application_deadline
          ? new Date(formData.application_deadline).toISOString()
          : null,
      }

      await onSubmit(submitData)
    } catch (error) {
      console.error("Erreur lors de la soumission:", error)
      setErrors({ submit: error.message || "Erreur lors de la sauvegarde" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="job-offer-form-container">
      <form onSubmit={handleSubmit} className="job-offer-form">
        {errors.submit && <div className="error-message">{errors.submit}</div>}

        <div className="form-section">
          <h3>Informations générales</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Titre du poste *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={errors.title ? "error" : ""}
                placeholder="Ex: Développeur Full Stack"
                required
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="company">Entreprise *</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className={errors.company ? "error" : ""}
                placeholder="Nom de l'entreprise"
                required
              />
              {errors.company && <span className="error-text">{errors.company}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Localisation</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Ex: Casablanca, Maroc"
              />
            </div>

            <div className="form-group">
              <label htmlFor="salary_range">Fourchette salariale</label>
              <input
                type="text"
                id="salary_range"
                name="salary_range"
                value={formData.salary_range}
                onChange={handleInputChange}
                placeholder="Ex: 15 000 - 25 000 MAD"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="application_deadline">Date limite de candidature</label>
            <input
              type="date"
              id="application_deadline"
              name="application_deadline"
              value={formData.application_deadline}
              onChange={handleInputChange}
              className={errors.application_deadline ? "error" : ""}
            />
            {errors.application_deadline && <span className="error-text">{errors.application_deadline}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>Description du poste</h3>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={errors.description ? "error" : ""}
              rows="6"
              placeholder="Décrivez le poste, les missions principales, l'environnement de travail..."
              required
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="requirements">Exigences et qualifications</label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              rows="5"
              placeholder="Listez les compétences requises, formations, expériences..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="benefits">Avantages et bénéfices</label>
            <textarea
              id="benefits"
              name="benefits"
              value={formData.benefits}
              onChange={handleInputChange}
              rows="4"
              placeholder="Décrivez les avantages offerts (assurance, formation, télétravail...)"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-btn" disabled={submitting}>
            Annuler
          </button>
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "Sauvegarde..." : initialData ? "Mettre à jour" : "Créer l'offre"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default JobOfferForm
