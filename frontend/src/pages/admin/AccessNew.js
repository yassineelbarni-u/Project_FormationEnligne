"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"
import "./AccessNew.css"

// Backend sur port 8001
const BACKEND_URL = "http://localhost:8001"

const AccessNew = () => {
  const [formData, setFormData] = useState({
    student_id: "",
    course_id: "",
    access_type: "standard",
    duration_days: 30,
    is_active: true
  })
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fetchCourses()
    fetchStudents()
  }, [])

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${BACKEND_URL}/api/admin/courses/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCourses(data)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des cours:", error)
    }
  }

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${BACKEND_URL}/api/admin/students/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStudents(data)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des étudiants:", error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${BACKEND_URL}/api/admin/accesses/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSuccess("Accès accordé avec succès!")
        setFormData({
          student_id: "",
          course_id: "",
          access_type: "standard",
          duration_days: 30,
          is_active: true
        })
        
        // Redirection après 2 secondes
        setTimeout(() => {
          navigate("/admin/accesses")
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.detail || "Erreur lors de la création de l'accès")
      }
    } catch (error) {
      setError("Erreur de connexion au serveur")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Aucune date minimale nécessaire pour la durée en jours

  return (
    <AdminLayout>
      <div className="access-new-container">
        <div className="page-header">
          <h1>Ajouter un Accès</h1>
          <button className="btn-secondary" onClick={() => navigate("/admin/accesses")}>
            Retour aux Accès
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="student_id">Étudiant</label>
              <select
                id="student_id"
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner un étudiant</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>{student.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="course_id">Cours</label>
              <select
                id="course_id"
                name="course_id"
                value={formData.course_id}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner un cours</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="access_type">Type d'accès</label>
              <select
                id="access_type"
                name="access_type"
                value={formData.access_type}
                onChange={handleChange}
                required
              >
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
                min="1"
              />
              <small>Nombre de jours d'accès (0 pour un accès sans expiration)</small>
            </div>

            <div className="form-group">
              <label htmlFor="is_active">Statut</label>
              <select
                id="is_active"
                name="is_active"
                value={formData.is_active}
                onChange={handleChange}
              >
                <option value={true}>Actif</option>
                <option value={false}>Inactif</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? "Création en cours..." : "Créer l'Accès"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AccessNew
