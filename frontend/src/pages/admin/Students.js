"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"
import apiService from "../../utils/api"
import "./Students.css"

const Students = () => {
  const [students, setStudents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setIsLoading(true)
      const data = await apiService.getStudents()
      setStudents(data)
    } catch (error) {
      console.error("Erreur lors du chargement des étudiants:", error)
      alert("Erreur lors du chargement des étudiants")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet étudiant ?")) {
      return
    }

    try {
      await apiService.deleteStudent(studentId)
      alert("Étudiant supprimé avec succès")
      fetchStudents() // Recharger la liste
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)

      // Gestion d'erreur améliorée
      if (error.message.includes("Étudiant non associé à vos cours")) {
        alert(
          "Impossible de supprimer cet étudiant : il n'est pas associé à vos cours ou vous n'avez pas les permissions nécessaires.",
        )
      } else if (error.message.includes("404")) {
        alert("Étudiant introuvable. Il a peut-être déjà été supprimé.")
      } else {
        alert("Erreur lors de la suppression de l'étudiant : " + error.message)
      }
    }
  }

  const handleEditStudent = (studentId) => {
    navigate(`/admin/students/${studentId}/edit`)
  }

  return (
    <AdminLayout>
      <div className="students-container">
        {/* Header */}
        <div className="page-header">
          <h1>Gestion des Étudiants</h1>
          <button className="btn-primary" onClick={() => navigate("/admin/students/invite")}>
            👥 Inviter un Étudiant
          </button>
        </div>

        {/* Contenu principal */}
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Chargement des étudiants...</p>
          </div>
        ) : (
          <div className="students-list">
            {/* Statistiques */}
            <div className="stats-header">
              <div className="student-count">{students.length}</div>
              <div className="student-count-label">
                étudiant{students.length > 1 ? "s" : ""} inscrit{students.length > 1 ? "s" : ""}
              </div>
            </div>

            {/* Tableau */}
            <div className="table-container">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>👤 NOM</th>
                    <th>📧 EMAIL</th>
                    <th>📱 TÉLÉPHONE</th>
                    <th>📊 NIVEAU</th>
                    <th>📅 INSCRIPTION</th>
                    <th>⚙️ ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length > 0 ? (
                    students.map((student) => (
                      <tr key={student.id}>
                        <td>
                          <div className="student-info">
                            <div className="student-avatar">{student.name?.charAt(0)?.toUpperCase() || "?"}</div>
                            <span className="student-name">{student.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="email-text">{student.email}</span>
                        </td>
                        <td>
                          <span className="phone-text">{student.phone || "-"}</span>
                        </td>
                        <td>
                          <span className={`level-badge level-${student.level?.toLowerCase() || "unknown"}`}>
                            {student.level || "Non défini"}
                          </span>
                        </td>
                        <td>
                          <span className="date-text">{new Date(student.created_at).toLocaleDateString("fr-FR")}</span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-icon edit"
                              onClick={() => handleEditStudent(student.id)}
                              title="Modifier l'étudiant"
                            >
                              ✏️ Modifier
                            </button>
                            <button
                              className="btn-icon danger"
                              onClick={() => handleDeleteStudent(student.id)}
                              title="Supprimer l'étudiant"
                            >
                              🗑️ Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="no-data">
                        <div className="empty-state">
                          <div className="empty-icon">👥</div>
                          <h3>Aucun étudiant inscrit</h3>
                          <p>Commencez par inviter votre premier étudiant</p>
                          <button className="btn-secondary" onClick={() => navigate("/admin/students/invite")}>
                            Inviter un étudiant
                          </button>
                        </div>
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
