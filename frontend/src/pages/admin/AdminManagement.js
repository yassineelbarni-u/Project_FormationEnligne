"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"
import { adminManagementAPI } from "../../utils/api"
import "./AdminManagement.css"

const AdminManagement = () => {
  const [admins, setAdmins] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    is_super_admin: false,
  })

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      setIsLoading(true)
      const data = await adminManagementAPI.getAll()
      setAdmins(data)
    } catch (error) {
      setError("Erreur lors du chargement des administrateurs")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddAdmin = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const admin = await adminManagementAPI.create(newAdmin)
      setAdmins([...admins, admin])
      setNewAdmin({ name: "", email: "", password: "", is_super_admin: false })
      setShowAddForm(false)
      setSuccess("Administrateur créé avec succès !")
    } catch (error) {
      setError(error.message)
    }
  }

  const handleToggleStatus = async (adminId, currentStatus) => {
    try {
      const updatedAdmin = await adminManagementAPI.toggleStatus(adminId, !currentStatus)
      setAdmins(admins.map((admin) => (admin.id === adminId ? updatedAdmin : admin)))
      setSuccess(`Administrateur ${!currentStatus ? "activé" : "désactivé"} avec succès`)
    } catch (error) {
      setError(error.message)
    }
  }

  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet administrateur ?")) return

    try {
      await adminManagementAPI.delete(adminId)
      setAdmins(admins.filter((admin) => admin.id !== adminId))
      setSuccess("Administrateur supprimé avec succès")
    } catch (error) {
      setError(error.message)
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
            <p>Gérez les comptes administrateurs et leurs permissions</p>
          </div>
          <button className="btn-primary" onClick={() => setShowAddForm(true)}>
            ➕ Nouvel Admin
          </button>
        </div>

        {/* Messages */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Formulaire d'ajout */}
        {showAddForm && (
          <div className="add-admin-form">
            <div className="form-header">
              <h3>➕ Ajouter un Administrateur</h3>
              <button className="close-btn" onClick={() => setShowAddForm(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAdmin}>
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

              <div className="form-row">
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
                    Super Administrateur
                  </label>
                  <small>Peut gérer les autres administrateurs</small>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddForm(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Créer l'Admin
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des admins */}
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
                <button
                  className={`btn-toggle ${admin.is_active ? "deactivate" : "activate"}`}
                  onClick={() => handleToggleStatus(admin.id, admin.is_active)}
                >
                  {admin.is_active ? "🔒 Désactiver" : "🔓 Activer"}
                </button>

                <button className="btn-delete" onClick={() => handleDeleteAdmin(admin.id)}>
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>

        {admins.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">👨‍💼</div>
            <h3>Aucun administrateur trouvé</h3>
            <p>Commencez par ajouter votre premier administrateur</p>
            <button className="btn-primary" onClick={() => setShowAddForm(true)}>
              ➕ Ajouter un Admin
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminManagement
