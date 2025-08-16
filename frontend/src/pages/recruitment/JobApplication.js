"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Header from "../../components/common/Header"
import Footer from "../../components/common/Footer"
import apiService from "../../utils/api"
import "./JobApplication.css"

const JobApplication = () => {
  const { jobId } = useParams()
  const navigate = useNavigate()

  const [jobOffer, setJobOffer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    coverLetter: "",
  })

  const [cvFile, setCvFile] = useState(null)
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    fetchJobOffer()
  }, [jobId])

  const fetchJobOffer = async () => {
    try {
      setLoading(true)
      const data = await apiService.getJobOffer(jobId)
      setJobOffer(data)
    } catch (error) {
      console.error("Erreur lors du chargement de l'offre:", error)
      setError("Offre d'emploi non trouvée")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Effacer l'erreur du champ modifié
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Vérifier le type de fichier
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      if (!allowedTypes.includes(file.type)) {
        setFormErrors((prev) => ({
          ...prev,
          cv: "Seuls les fichiers PDF et Word sont acceptés",
        }))
        return
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors((prev) => ({
          ...prev,
          cv: "Le fichier ne doit pas dépasser 5MB",
        }))
        return
      }

      setCvFile(file)
      setFormErrors((prev) => ({
        ...prev,
        cv: "",
      }))
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.firstName.trim()) {
      errors.firstName = "Le prénom est requis"
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Le nom est requis"
    }

    if (!formData.email.trim()) {
      errors.email = "L'email est requis"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Format d'email invalide"
    }

    if (!cvFile) {
      errors.cv = "Le CV est requis"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setSubmitting(true)
      setError("")

      const applicationFormData = new FormData()
      applicationFormData.append("job_offer_id", jobId)
      applicationFormData.append("first_name", formData.firstName)
      applicationFormData.append("last_name", formData.lastName)
      applicationFormData.append("email", formData.email)
      applicationFormData.append("phone", formData.phone)
      applicationFormData.append("cover_letter", formData.coverLetter)
      applicationFormData.append("cv_file", cvFile)

      await apiService.createJobApplication(applicationFormData)

      // Rediriger vers la page de succès
      navigate("/recruitment/application-success")
    } catch (error) {
      console.error("Erreur lors de la soumission:", error)
      setError(error.message || "Erreur lors de l'envoi de votre candidature")
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="page-container">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement de l'offre...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (error && !jobOffer) {
    return (
      <div className="page-container">
        <Header />
        <div className="error-container">
          <h2>Erreur</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/recruitment")} className="back-btn">
            Retour aux offres
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="page-container">
      <Header />

      <main className="job-application-page">
        <div className="container">
          <div className="application-header">
            <button onClick={() => navigate("/recruitment")} className="back-button">
              ← Retour aux offres
            </button>
            <h1>Postuler pour: {jobOffer?.title}</h1>
            <div className="job-summary">
              <span className="company">{jobOffer?.company}</span>
              {jobOffer?.location && <span className="location">📍 {jobOffer.location}</span>}
              <span className={`job-type ${jobOffer?.job_type.toLowerCase()}`}>{jobOffer?.job_type}</span>
            </div>
          </div>

          <div className="application-content">
            <div className="job-details-sidebar">
              <div className="job-info-card">
                <h3>Détails de l'offre</h3>
                <div className="job-meta">
                  <div className="meta-item">
                    <strong>Type:</strong> {jobOffer?.job_type}
                  </div>
                  <div className="meta-item">
                    <strong>Expérience:</strong> {jobOffer?.experience_level}
                  </div>
                  {jobOffer?.salary_range && (
                    <div className="meta-item">
                      <strong>Salaire:</strong> {jobOffer.salary_range}
                    </div>
                  )}
                  {jobOffer?.application_deadline && (
                    <div className="meta-item">
                      <strong>Date limite:</strong> {formatDate(jobOffer.application_deadline)}
                    </div>
                  )}
                </div>

                <div className="job-description">
                  <h4>Description</h4>
                  <p>{jobOffer?.description}</p>
                </div>

                {jobOffer?.requirements && (
                  <div className="job-requirements">
                    <h4>Exigences</h4>
                    <p>{jobOffer.requirements}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="application-form-container">
              <form onSubmit={handleSubmit} className="application-form">
                <h2>Vos informations</h2>

                {error && <div className="error-message">{error}</div>}

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">Prénom *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={formErrors.firstName ? "error" : ""}
                      required
                    />
                    {formErrors.firstName && <span className="error-text">{formErrors.firstName}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Nom *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={formErrors.lastName ? "error" : ""}
                      required
                    />
                    {formErrors.lastName && <span className="error-text">{formErrors.lastName}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={formErrors.email ? "error" : ""}
                      required
                    />
                    {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Téléphone</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="cv">CV * (PDF ou Word, max 5MB)</label>
                  <input
                    type="file"
                    id="cv"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className={formErrors.cv ? "error" : ""}
                    required
                  />
                  {formErrors.cv && <span className="error-text">{formErrors.cv}</span>}
                  {cvFile && <div className="file-info">Fichier sélectionné: {cvFile.name}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="coverLetter">Lettre de motivation</label>
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    rows="6"
                    placeholder="Expliquez pourquoi vous êtes le candidat idéal pour ce poste..."
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => navigate("/recruitment")}
                    className="cancel-btn"
                    disabled={submitting}
                  >
                    Annuler
                  </button>
                  <button type="submit" className="submit-btn" disabled={submitting}>
                    {submitting ? "Envoi en cours..." : "Envoyer ma candidature"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default JobApplication
