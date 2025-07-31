"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"
import "./Accesses.css"

// Backend sur port 8001
const BACKEND_URL = "http://localhost:8001"

const Accesses = () => {
  const [accesses, setAccesses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchAccesses()
  }, [])

  const fetchAccesses = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${BACKEND_URL}/api/admin/accesses/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAccesses(data)
      } else {
        console.error("Erreur lors du chargement des accès")
      }
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="accesses-container">
        <div className="page-header">
          <h1>Gestion des Accès</h1>
          <button className="btn-primary" onClick={() => navigate("/admin/accesses/new")}>
            Ajouter un Accès
          </button>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Chargement des accès...</p>
          </div>
        ) : (
          <div className="accesses-list">
            <div className="table-container">
              <table className="accesses-table">
                <thead>
                  <tr>
                    <th>Étudiant</th>
                    <th>Cours</th>
                    <th>Type d'accès</th>
                    <th>Date d'expiration</th>
                    <th>Statut</th>
                    <th>Date de création</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accesses.length > 0 ? (
                    accesses.map((access) => (
                      <tr key={access.id}>
                        <td>{access.student_name}</td>
                        <td>{access.course_title}</td>
                        <td>{access.access_type}</td>
                        <td>
                          {access.expires_at 
                            ? new Date(access.expires_at).toLocaleDateString()
                            : "Illimité"
                          }
                        </td>
                        <td>
                          <span className={`status-badge ${access.is_active ? "active" : "inactive"}`}>
                            {access.is_active ? "Actif" : "Inactif"}
                          </span>
                        </td>
                        <td>{new Date(access.created_at).toLocaleDateString()}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-icon"
                              onClick={() => navigate(`/admin/accesses/${access.id}`)}
                            >
                              👁️
                            </button>
                            <button
                              className="btn-icon"
                              onClick={() => navigate(`/admin/accesses/${access.id}/edit`)}
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
                        Aucun accès trouvé
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
