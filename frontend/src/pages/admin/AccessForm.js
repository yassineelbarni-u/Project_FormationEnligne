"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"
import apiService from "../../utils/api"
import "./AccessForm.css"

const AccessForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState({
    student_id: "",
    course_id: "",
    access_type: "standard",
    duration_days: 30,
    is_active: true,
  })

  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchCourses()
    fetchStudents()
    if (isEditing) {
      fetchAccess()
    }
  }, [id, isEditing])

  const fetchAccess = async () => {
    try {
      setIsLoading(true)
      const access = await apiService.getAccess(id)
      setFormData({
        student_id: access.student_id || "",
        course_id: access.course_id || "",
        access_type: access.access_type || "standard",
        duration_days: access.duration_days || 30,
        is_active: access.is_active,
      })
    } catch (error) {
      console.error("Erreur lors du chargement de l'accès:", error)
      setError("Erreur lors du chargement de l'accès")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCourses = async () => {
    try {
      const data = await apiService.getCourses()
      setCourses(data)
    } catch (error) {
      console.error("Erreur lors du chargement des cours:", error)
    }
  }

  const fetchStudents = async () => {
    try {
      const data = await apiService.getStudents()
      setStudents(data)
    } catch (error) {
      console.error("Erreur lors du chargement des étudiants:", error)
    }
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      if (isEditing) {
        await apiService.updateAccess(id, formData)
        setSuccess("Accès modifié avec succès!")
      } else {
        await apiService.createAccess(formData)
        setSuccess("Accès créé avec succès!")
      }

      setTimeout(() => {
        navigate("/admin/accesses")
      }, 1500)
    } catch (error) {
      setError(error.message || "Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && isEditing) {
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
      <div className="access-form-page">
        <div className="form-header">
          <button className="back-btn" onClick={() => navigate("/admin/accesses")}>
            ← Retour aux accès
          </button>
          <h1>{isEditing ? "Modifier l'Accès" : "Nouvel Accès"}</h1>
        </div>

        <div className="form-container-single">
          <form onSubmit={handleSubmit} className="access-form">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="form-group">
              <label htmlFor="student_id">Étudiant *</label>
              <select
                id="student_id"
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                required
                disabled={isEditing}
              >
                <option value="">Sélectionner un étudiant</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="course_id">Cours *</label>
              <select
                id="course_id"
                name="course_id"
                value={formData.course_id}
                onChange={handleChange}
                required
                disabled={isEditing}
              >
                <option value="">Sélectionner un cours</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="access_type">Type d'accès</label>
              <select id="access_type" name="access_type" value={formData.access_type} onChange={handleChange}>
                <option value="standard">Standard</option>
                <option value="full">Accès complet</option>
                <option value="partial">Accès partiel</option>
                <option value="trial">Accès d'essai</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="duration_days">Durée d'accès (jours)</label>
              <input
                type="number"
                id="duration_days"
                name="duration_days"
                value={formData.duration_days}
                onChange={handleChange}
                min="0"
                placeholder="0 pour un accès illimité"
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
                <span className="checkbox-text">Accès actif</span>
              </label>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => navigate("/admin/accesses")}>
                Annuler
              </button>
              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? "Sauvegarde..." : isEditing ? "Modifier" : "Créer l'accès"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AccessForm
