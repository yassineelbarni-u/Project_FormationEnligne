"use client"

import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"
import apiService from "../../utils/api"
import "./Accesses.css"

const Accesses = () => {
  const [accesses, setAccesses] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Filtre étudiant: valeur sélectionnée + texte de recherche pour l’auto-complétion
  const [studentQuery, setStudentQuery] = useState("")
  const [studentSelected, setStudentSelected] = useState("") // email (clé unique de préférence)

  const [showSuggestions, setShowSuggestions] = useState(false)
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
      fetchAccesses()
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

  // Dictionnaire des étudiants uniques pour l’auto-complétion (nom + email)
  const students = useMemo(() => {
    const map = new Map()
    for (const a of accesses) {
      const key = (a.student_email || "").toLowerCase()
      if (!key) continue
      if (!map.has(key)) {
        map.set(key, {
          email: a.student_email || "",
          name: a.student_name || "",
          label:
            (a.student_name || "").trim()
              ? `${a.student_name} — ${a.student_email}`
              : a.student_email,
        })
      }
    }
    return Array.from(map.values()).sort((x, y) =>
      x.name.localeCompare(y.name || "")
    )
  }, [accesses])

  // Suggestions filtrées selon la saisie
  const suggestions = useMemo(() => {
    const q = studentQuery.trim().toLowerCase()
    if (!q) return students.slice(0, 10)
    return students
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
      )
      .slice(0, 10)
  }, [students, studentQuery])

  // Dataset filtré pour le tableau
  const filteredAccesses = useMemo(() => {
    // Si un étudiant est sélectionné, on filtre strictement sur son email
    if (studentSelected) {
      return accesses.filter(
        (a) =>
          (a.student_email || "").toLowerCase() ===
          studentSelected.toLowerCase()
      )
    }
    // Sinon, on applique la recherche libre (nom/email)
    const q = studentQuery.trim().toLowerCase()
    if (!q) return accesses
    return accesses.filter((a) => {
      const name = (a.student_name || "").toLowerCase()
      const email = (a.student_email || "").toLowerCase()
      return name.includes(q) || email.includes(q)
    })
  }, [accesses, studentSelected, studentQuery])

  // Sélection d’un étudiant dans la liste
  const pickStudent = (email, name) => {
    setStudentSelected(email)
    setStudentQuery(name ? `${name} — ${email}` : email)
    setShowSuggestions(false)
  }

  // Effacer le filtre
  const clearFilter = () => {
    setStudentSelected("")
    setStudentQuery("")
    setShowSuggestions(false)
  }

  return (
    <AdminLayout>
      <div className="accesses-container">
        {/* En-tête principal */}
        <div className="page-header">
          <h1>Gestion des Accès</h1>
          <button className="btn-primary" onClick={() => navigate("/admin/accesses/new")}>
            🔑 Ajouter un Accès
          </button>
        </div>

        {/* Carte liste + stats + tableau */}
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Chargement des accès...</p>
          </div>
        ) : (
          <div className="accesses-list">
            {/* Statistiques */}
            <div className="stats-header">
              <div className="access-count">{filteredAccesses.length}</div>
              <div className="access-count-label">
                accès affiché{filteredAccesses.length > 1 ? "s" : ""}{studentSelected || studentQuery ? " (filtrés)" : ""}
              </div>
            </div>

            {/* Tableau */}
            <div className="table-container">
              <table className="accesses-table">
                <thead>
                  <tr>
                    <th className="student-col">
                      <div className="student-filter">
                        <span className="student-filter-label">👤 Étudiant</span>
                        <div className="student-filter-inputwrap">
                          <input
                            id="studentFilter"
                            className="student-filter-input"
                            type="text"
                            placeholder="Rechercher / sélectionner…"
                            value={studentQuery}
                            onChange={(e) => {
                              setStudentQuery(e.target.value)
                              setStudentSelected("")
                              setShowSuggestions(true)
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            autoComplete="off"
                          />
                          {studentSelected || studentQuery ? (
                            <button
                              type="button"
                              className="student-filter-clear"
                              onClick={clearFilter}
                              aria-label="Effacer le filtre"
                              title="Effacer le filtre"
                            >
                              ✖
                            </button>
                          ) : null}
                          {showSuggestions && suggestions.length > 0 && (
                            <ul
                              className="student-suggestions"
                              onMouseDown={(e) => e.preventDefault()}
                            >
                              {suggestions.map((s) => (
                                <li
                                  key={s.email}
                                  className="student-suggestion-item"
                                  onClick={() => pickStudent(s.email, s.name)}
                                  title={s.email}
                                >
                                  <span className="suggestion-avatar">
                                    {(s.name || s.email).charAt(0).toUpperCase()}
                                  </span>
                                  <span className="suggestion-text">
                                    <span className="suggestion-name">{s.name || "—"}</span>
                                    <span className="suggestion-email">{s.email}</span>
                                  </span>
                                </li>
                              ))}
                              {students.length > suggestions.length && (
                                <li className="student-suggestion-more" aria-hidden>
                                  Affichage de {suggestions.length}/{students.length}
                                </li>
                              )}
                            </ul>
                          )}
                        </div>
                      </div>
                    </th>
                    <th>📚 COURS</th>
                    <th>🔐 TYPE</th>
                    <th>⏰ EXPIRATION</th>
                    <th>📊 STATUT</th>
                    <th>⚙️ ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAccesses.length > 0 ? (
                    filteredAccesses.map((access) => (
                      <tr key={access.id}>
                        <td>
                          <div className="student-info">
                            <div className="student-avatar">
                              {access.student_name?.charAt(0)?.toUpperCase() || "?"}
                            </div>
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
                            {access.expires_at
                              ? new Date(access.expires_at).toLocaleDateString("fr-FR")
                              : "Illimité"}
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
                          <div className="empty-icon">🔎</div>
                          <h3>Aucun accès correspondant</h3>
                          <p>
                            {studentSelected || studentQuery
                              ? "Modifiez ou effacez le filtre pour voir tous les accès."
                              : "Commencez par accorder l'accès à un étudiant."}
                          </p>
                          {!studentSelected && !studentQuery && (
                            <button className="btn-secondary" onClick={() => navigate("/admin/accesses/new")}>
                              Ajouter un accès
                            </button>
                          )}
                          {(studentSelected || studentQuery) && (
                            <button className="btn-secondary" onClick={clearFilter}>
                              Effacer le filtre
                            </button>
                          )}
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
