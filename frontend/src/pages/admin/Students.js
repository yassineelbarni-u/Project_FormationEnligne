"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"
import "./Students.css"

// Backend sur port 8001
const BACKEND_URL = "http://localhost:8001"

const Students = () => {
  const [students, setStudents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchStudents()
  }, [])

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
      } else {
        console.error("Erreur lors du chargement des étudiants")
      }
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="students-container">
        <div className="page-header">
          <h1>Gestion des Étudiants</h1>
          <button className="btn-primary" onClick={() => navigate("/admin/students/invite")}>
            Inviter un Étudiant
          </button>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Chargement des étudiants...</p>
          </div>
        ) : (
          <div className="students-list">
            <div className="table-container">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Niveau</th>
                    <th>Date d'inscription</th>
                    <th>Cours</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length > 0 ? (
                    students.map((student) => (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>{student.phone || "-"}</td>
                        <td>{student.level || "-"}</td>
                        <td>{new Date(student.created_at).toLocaleDateString()}</td>
                        <td>{student.courses_count || 0}</td>
                        <td>
                          <div className="action-buttons">
                          
                            <button
                              className="btn-icon"
                              onClick={() => navigate(`/admin/students/${student.id}/edit`)}
                            >
                              ✏️
                            </button>
                            <button
                              className="btn-icon danger"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="no-data">
                        Aucun étudiant trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default Students
