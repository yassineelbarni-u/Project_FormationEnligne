"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"
import apiService from "../../utils/api"
import "./StudentsInvite.css"


const StudentsInvite = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    level: "",
    course_id: "",
  })
  const [courses, setCourses] = useState([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)


  const fetchCourses = async () => {
  try {
    const data = await apiService.getCourses()
    setCourses(data)
  } catch (error) {
    console.error("Erreur lors du chargement des cours:", error)
  }
}


  useEffect(() => {
    fetchCourses()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  setIsLoading(true)
  setError("")
  setSuccess("")

  try {
    await apiService.createStudent(formData)
    setSuccess("Étudiant invité avec succès!")
    setFormData({
      name: "",
      email: "",
      phone: "",
      level: "",
      course_id: "",
    })

    // Redirection après 2 secondes
    setTimeout(() => {
      navigate("/admin/students")
    }, 2000)
  } catch (error) {
    const msg = error?.message || "Erreur lors de l'invitation de l'étudiant"
    setError(msg)
  } finally {
    setIsLoading(false)
  }
}


  return (
    <AdminLayout>
      <div className="student-form-page">
        <div className="form-header">
          <button className="back-btn" onClick={() => navigate("/admin/students")}>
            ← Retour aux étudiants
          </button>
          <h1>Nouvel Étudiant</h1>
        </div>

        <div className="form-container-single">
          <form onSubmit={handleSubmit} className="student-form">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="form-group">
              <label htmlFor="name">Nom complet *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Jean Dupont"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ex: jean.dupont@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Téléphone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ex: +33 6 12 34 56 78"
              />
            </div>

            <div className="form-group">
              <label htmlFor="level">Niveau</label>
              <select id="level" name="level" value={formData.level} onChange={handleChange}>
                <option value="">Sélectionner un niveau</option>
                <option value="Débutant">Débutant</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Avancé">Avancé</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="course_id">Cours *</label>
              <select id="course_id" name="course_id" value={formData.course_id} onChange={handleChange} required>
                <option value="">Sélectionner un cours</option>
                {courses && courses.length > 0 ? (
                  courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Aucun cours disponible
                  </option>
                )}
              </select>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => navigate("/admin/students")}>
                Annuler
              </button>
              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? "Envoi en cours..." : "Inviter l'Étudiant"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

export default StudentsInvite
