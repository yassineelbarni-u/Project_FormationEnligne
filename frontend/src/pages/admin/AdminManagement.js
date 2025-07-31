"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"
import apiService from "../../utils/api"
import "./AdminManagement.css"

const AdminManagement = () => {
  const [admins, setAdmins] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    is_super_admin: false,
  })
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    // Vérifier si l'utilisateur est super admin
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      setCurrentUser(user)

      if (!user.is_super_admin) {
        navigate("/admin/dashboard")
        return
      }
    }

    fetchAdmins()
  }, [navigate])

  const fetchAdmins = async () => {
    try {
      const data = await apiService.getAdmins()
      setAdmins(data)
    } catch (error) {
      console.error("Erreur lors du chargement des admins:", error)
      if (error.message.includes("403")) {
        navigate("/admin/dashboard")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAdmin = async (e) => {
    e.preventDefault()
    setIsCreating(true)
    setError("")

    try {
      const createdAdmin = await apiService.createAdmin(newAdmin)
      setAdmins([...admins, createdAdmin])
      setNewAdmin({
        name: "",
        email: "",
        password: "",
        is_super_admin: false,
      })
      setShowCreateForm(false)
      alert("Administrateur créé avec succès !")
    } catch (error) {
      setError(error.message)
    } finally {
      setIsCreating(false)
    }
  }

  const handleToggleStatus = async (adminId) => {
    try {
      await apiService.toggleAdminStatus(adminId)
      await fetchAdmins() // Recharger la liste
      alert("Statut modifié avec succès !")
    } catch (error) {
      alert("Erreur lors de la modification du statut")
    }
  }

  const handleDeleteAdmin = async (adminId, adminName) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'administrateur "${adminName}" ?`)) {
      return
    }

    try {
      await apiService.deleteAdmin(adminId)
      setAdmins(admins.filter((admin) => admin.id !== adminId))
      alert("Administrateur supprimé avec succès !")
    } catch (error) {
      alert(error.message)
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="admin-management-loading">
          <div className="loading-spinner"></div>
          <p>Chargement des administrateurs...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="admin-management-page">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>👨‍💼 Gestion des Administrateurs</h1>
            <p>Gérez les comptes administrateurs de la plateforme</p>
          </div>
          <button className="btn-primary" onClick={() => setShowCreateForm(true)}>
            ➕ Nouvel Admin
          </button>
        </div>

        {/* Formulaire de création */}
        {showCreateForm && (
          <div className="create-admin-form">
            <div className="form-header">
              <h3>Créer un nouvel administrateur</h3>
              <button className="close-btn" onClick={() => setShowCreateForm(false)}>
                ✕
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleCreateAdmin}>
              <div className="form-row">
                <div className="form-group">
                  <label>Nom complet *</label>
                  <input
                    type="text"
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                    placeholder="Nom de l'administrateur"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    placeholder="email@exemple.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Mot de passe *</label>
                <input
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  placeholder="Mot de passe sécurisé"
                  required
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={newAdmin.is_super_admin}
                    onChange={(e) => setNewAdmin({ ...newAdmin, is_super_admin: e.target.checked })}
                  />
                  Super Administrateur (peut gérer les autres admins)
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowCreateForm(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary" disabled={isCreating}>
                  {isCreating ? "Création..." : "Créer l'Admin"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des administrateurs */}
        <div className="admins-list">
          {admins.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👨‍💼</div>
              <h3>Aucun administrateur</h3>
              <p>Commencez par créer le premier administrateur</p>
            </div>
          ) : (
            <div className="admins-grid">
              {admins.map((admin) => (
                <div key={admin.id} className="admin-card">
                  <div className="admin-header">
                    <div className="admin-avatar">{admin.name.charAt(0)}</div>
                    <div className="admin-info">
                      <h3>{admin.name}</h3>
                      <p>{admin.email}</p>
                      <div className="admin-badges">
                        {admin.is_super_admin && <span className="badge super-admin">Super Admin</span>}
                        <span className={`badge status ${admin.is_active ? "active" : "inactive"}`}>
                          {admin.is_active ? "Actif" : "Inactif"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="admin-meta">
                    <div className="meta-item">
                      <span className="meta-label">Créé le:</span>
                      <span className="meta-value">{new Date(admin.created_at).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>

                  <div className="admin-actions">
                    {admin.id !== currentUser?.id && (
                      <>
                        <button
                          className={`btn-toggle ${admin.is_active ? "deactivate" : "activate"}`}
                          onClick={() => handleToggleStatus(admin.id)}
                          title={admin.is_active ? "Désactiver" : "Activer"}
                        >
                          {admin.is_active ? "🔒" : "🔓"}
                        </button>

                        <button
                          className="btn-edit"
                          onClick={() => navigate(`/admin/manage-admins/${admin.id}/edit`)}
                          title="Modifier"
                        >
                          ✏️
                        </button>

                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </>
                    )}

                    {admin.id === currentUser?.id && <span className="current-user-badge">Vous</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminManagement
