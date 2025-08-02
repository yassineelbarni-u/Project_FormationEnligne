"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"
import apiService from "../../utils/api" // Garder votre import existant
import "./StudentForm.css"

const StudentForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    level: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const levels = ["Débutant", "Intermédiaire", "Avancé"]

  useEffect(() => {
    if (isEdit) {
      fetchStudent()
    }
  }, [id, isEdit])

  const fetchStudent = async () => {
    try {
      setIsLoading(true)
      const student = await apiService.getStudent(id)
      setFormData({
        name: student.name || "",
        email: student.email || "",
        phone: student.phone || "",
        level: student.level || "",
      })
    } catch (error) {
      console.error("Erreur lors du chargement de l'étudiant:", error)
      setError("Erreur lors du chargement de l'étudiant")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (isEdit) {
        await apiService.updateStudent(id, formData)
        alert("Étudiant modifié avec succès !")
      } else {
        await apiService.createStudent(formData)
        alert("Étudiant créé avec succès !")
      }
      navigate("/admin/students")
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      setError(error.message || "Erreur lors de la sauvegarde")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && isEdit) {
    return (
      <AdminLayout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="student-form-page">
        <div className="form-header">
          <button className="back-btn" onClick={() => navigate("/admin/students")}>
            ← Retour aux étudiants
          </button>
          <h1>{isEdit ? "Modifier l'Étudiant" : "Nouvel Étudiant"}</h1>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="student-form">
            {error && <div className="error-message">{error}</div>}

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
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => navigate("/admin/students")}>
                Annuler
              </button>
              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? "Sauvegarde..." : isEdit ? "Modifier" : "Créer l'étudiant"}
              </button>
            </div>
          </form>

        </div>
      </div>
    </AdminLayout>
  )
}

export default StudentForm
