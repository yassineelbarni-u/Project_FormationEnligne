"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"
import "./StudentsInvite.css"

// Backend sur port 8001
const BACKEND_URL = "http://localhost:8001"

const StudentsInvite = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    level: "",
    course_id: ""
  })
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

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
  
  useEffect(() => {
    fetchCourses()
  }, [])

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
      const response = await fetch(`${BACKEND_URL}/api/admin/students/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSuccess("Étudiant invité avec succès!")
        setFormData({
          name: "",
          email: "",
          phone: "",
          level: "",
          course_id: ""
        })
        
        // Redirection après 2 secondes
        setTimeout(() => {
          navigate("/admin/students")
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.detail || "Erreur lors de l'invitation de l'étudiant")
      }
    } catch (error) {
      setError("Erreur de connexion au serveur")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="student-invite-container">
        <div className="page-header">
          <h1>Inviter un Étudiant</h1>
          <button className="btn-secondary" onClick={() => navigate("/admin/students")}>
            Retour aux Étudiants
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nom Complet</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
              />
            </div>

            <div className="form-group">
              <label htmlFor="level">Niveau</label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
              >
                <option value="">Sélectionner un niveau</option>
                <option value="Débutant">Débutant</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Avancé">Avancé</option>
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

            <div className="form-actions">
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
