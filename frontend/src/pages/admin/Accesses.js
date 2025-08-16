"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"
import apiService from "../../utils/api"
import "./Accesses.css"

const Accesses = () => {
  const [accesses, setAccesses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchAccesses()
  }, [])

  const fetchAccesses = async () => {
    try {
      setIsLoading(true)
      const data = await apiService.getAccesses()
      setAccesses(data)
    } catch (error) {
      console.error("Erreur lors du chargement des accès:", error)
      alert("Erreur lors du chargement des accès")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccess = async (accessId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet accès ?")) {
      return
    }

    try {
      await apiService.deleteAccess(accessId)
      alert("Accès supprimé avec succès")
      fetchAccesses() // Recharger la liste
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      if (error.message.includes("404")) {
        alert("Accès introuvable. Il a peut-être déjà été supprimé.")
      } else {
        alert("Erreur lors de la suppression de l'accès : " + error.message)
      }
    }
  }

  const handleEditAccess = (accessId) => {
    navigate(`/admin/accesses/${accessId}/edit`)
  }

  return (
    <AdminLayout>
      <div className="accesses-container">
        {/* Header */}
        <div className="page-header">
          <h1>Gestion des Accès</h1>
          <button className="btn-primary" onClick={() => navigate("/admin/accesses/new")}>
            🔑 Ajouter un Accès
          </button>
        </div>

        {/* Contenu principal */}
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Chargement des accès...</p>
          </div>
        ) : (
          <div className="accesses-list">
            {/* Statistiques */}
            <div className="stats-header">
              <div className="access-count">{accesses.length}</div>
              <div className="access-count-label">accès accordé{accesses.length > 1 ? "s" : ""}</div>
            </div>

            {/* Tableau */}
            <div className="table-container">
              <table className="accesses-table">
                <thead>
                  <tr>
                    <th>👤 ÉTUDIANT</th>
                    <th>📚 COURS</th>
                    <th>🔐 TYPE</th>
                    <th>⏰ EXPIRATION</th>
                    <th>📊 STATUT</th>
                    <th>⚙️ ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {accesses.length > 0 ? (
                    accesses.map((access) => (
                      <tr key={access.id}>
                        <td>
                          <div className="student-info">
                            <div className="student-avatar">{access.student_name?.charAt(0)?.toUpperCase() || "?"}</div>
                            <div className="student-details">
                              <span className="student-name">{access.student_name}</span>
                              <span className="student-email">{access.student_email}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="course-title">{access.course_title}</span>
                        </td>
                        <td>
                          <span className={`type-badge type-${access.access_type}`}>{access.access_type}</span>
                        </td>
                        <td>
                          <span className="date-text">
                            {access.expires_at ? new Date(access.expires_at).toLocaleDateString("fr-FR") : "Illimité"}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${access.is_active ? "active" : "inactive"}`}>
                            {access.is_active ? "Actif" : "Inactif"}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-icon edit"
                              onClick={() => handleEditAccess(access.id)}
                              title="Modifier l'accès"
                            >
                              ✏️ Modifier
                            </button>
                            <button
                              className="btn-icon danger"
                              onClick={() => handleDeleteAccess(access.id)}
                              title="Supprimer l'accès"
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
                          <div className="empty-icon">🔑</div>
                          <h3>Aucun accès accordé</h3>
                          <p>Commencez par accorder l'accès à un étudiant</p>
                          <button className="btn-secondary" onClick={() => navigate("/admin/accesses/new")}>
                            Ajouter un accès
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

export default Accesses
