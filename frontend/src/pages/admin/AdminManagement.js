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
  const [isEditing, setIsEditing] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState(null)
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
      if (isEditing && editingAdmin) {
        // Modification d'un admin existant
        const updateData = {}
        if (newAdmin.name !== editingAdmin.name) updateData.name = newAdmin.name
        if (newAdmin.email !== editingAdmin.email) updateData.email = newAdmin.email
        if (newAdmin.password) updateData.password = newAdmin.password
        if (newAdmin.is_super_admin !== editingAdmin.is_super_admin) {
          updateData.is_super_admin = newAdmin.is_super_admin
        }

        // Décider quelle méthode utiliser
        if (editingAdmin.id === currentUser?.id) {
          // Modification du profil personnel
          const updatedAdmin = await apiService.updateMyProfile(updateData)
          // Mettre à jour les données utilisateur en local
          const updatedUser = { ...currentUser, ...updatedAdmin }
          localStorage.setItem('user', JSON.stringify(updatedUser))
          setCurrentUser(updatedUser)
        } else {
          // Modification d'un autre admin
          await apiService.updateAdmin(editingAdmin.id, updateData)
        }
        alert("Administrateur modifié avec succès !")
      } else {
        // Création d'un nouvel admin
        const createdAdmin = await apiService.createAdmin(newAdmin)
        setAdmins([...admins, createdAdmin])
        alert("Administrateur créé avec succès !")
      }

      closeModal()
      fetchAdmins()
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

  // Fonction pour ouvrir le modal d'édition d'un admin
  const openEditModal = (admin) => {
    setIsEditing(true)
    setEditingAdmin(admin)
    setNewAdmin({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      password: "", // Laisser vide pour éviter de modifier par défaut
      is_super_admin: admin.is_super_admin,
    })
    setShowCreateForm(true)
    setError("")
  }

  // Fonction pour ouvrir le modal de création
  const openCreateModal = () => {
    setIsEditing(false)
    setEditingAdmin(null)
    setNewAdmin({
      name: "",
      email: "",
      password: "",
      is_super_admin: false,
    })
    setShowCreateForm(true)
    setError("")
  }

  // Fonction pour modifier mon profil personnel
  const handleEditMyProfile = () => {
    if (currentUser) {
      openEditModal(currentUser)
    }
  }

  const closeModal = () => {
    setShowCreateForm(false)
    setError("")
    setIsEditing(false)
    setEditingAdmin(null)
    setNewAdmin({
      name: "",
      email: "",
      password: "",
      is_super_admin: false,
    })
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
            <h1>Gestion des Administrateurs</h1>
          </div>
          <div className="header-actions">
            <button className="btn-secondary" onClick={handleEditMyProfile}>
              👤 Mon Profil
            </button>
            <button className="btn-primary" onClick={openCreateModal}>
              ➕ Nouvel Admin
            </button>
          </div>
        </div>

        {/* Modal de création/modification */}
        {showCreateForm && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">
                  <div className="modal-icon">👨‍💼</div>
                  <div>
                    <h2>
                      {isEditing
                        ? editingAdmin?.id === currentUser?.id
                          ? "Modifier Mon Profil"
                          : "Modifier Administrateur"
                        : "Nouvel Administrateur"
                      }
                    </h2>
                    <p>
                      {isEditing
                        ? editingAdmin?.id === currentUser?.id
                          ? "Modifiez vos informations personnelles"
                          : "Modifier les informations de l'administrateur"
                        : "Créer un nouveau compte administrateur"
                      }
                    </p>
                  </div>
                </div>
                <button className="modal-close-btn" onClick={closeModal}>
                  ✕
                </button>
              </div>
              <div className="modal-body">
                {error && (
                  <div className="error-alert">
                    <div className="error-icon">⚠️</div>
                    <div className="error-content">
                      <strong>Erreur</strong>
                      <p>{error}</p>
                    </div>
                  </div>
                )}
                <form onSubmit={handleCreateAdmin} className="admin-form">
                  <div className="form-grid">
                    <div className="form-field">
                      <label htmlFor="name">
                        <span className="label-text">Nom complet</span>
                        <span className="label-required">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={newAdmin.name}
                        onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                        placeholder="Ex: Jean Dupont"
                        required
                        className="form-input"
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="email">
                        <span className="label-text">Adresse email</span>
                        <span className="label-required">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={newAdmin.email}
                        onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                        placeholder="admin@exemple.com"
                        required
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="form-field">
                    <label htmlFor="password">
                      <span className="label-text">
                        {isEditing ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}
                      </span>
                      {!isEditing && <span className="label-required">*</span>}
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                      placeholder={isEditing ? "Laisser vide pour conserver l'ancien" : "Minimum 8 caractères"}
                      required={!isEditing}
                      className="form-input"
                      minLength="8"
                    />
                    <div className="field-hint">
                      {isEditing 
                        ? "Laissez vide si vous ne souhaitez pas changer le mot de passe"
                        : "Le mot de passe doit contenir au moins 8 caractères"
                      }
                    </div>
                  </div>
                  <div className="form-field">
                    <div className="checkbox-field">
                      <input
                        id="super-admin"
                        type="checkbox"
                        checked={newAdmin.is_super_admin}
                        onChange={(e) => setNewAdmin({ ...newAdmin, is_super_admin: e.target.checked })}
                        className="form-checkbox"
                      />
                      <label htmlFor="super-admin" className="checkbox-label">
                        <span className="checkbox-text">Super Administrateur</span>
                        <span className="checkbox-description">
                          Peut gérer les autres administrateurs et accéder à toutes les fonctionnalités
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="btn-secondary" onClick={closeModal}>
                      Annuler
                    </button>
                    <button type="submit" className="btn-primary" disabled={isCreating}>
                      {isCreating ? (
                        <>
                          <span className="btn-spinner"></span>
                          {isEditing ? "Modification..." : "Création..."}
                        </>
                      ) : (
                        isEditing ? "Modifier" : "Créer l'Admin"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Liste des administrateurs */}
        <div className="admins-section">
          {admins.length === 0 ? (
            <div className="empty-state">
              <div className="empty-illustration">
                <div className="empty-icon">👨‍💼</div>
                <div className="empty-graphics"></div>
              </div>
              <div className="empty-content">
                <h3>Aucun administrateur</h3>
                <p>Commencez par créer le premier administrateur de la plateforme</p>
                <button className="btn-primary" onClick={openCreateModal}>
                  Créer un admin
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="section-header">
                <h2>Administrateurs ({admins.length})</h2>
                <p>Gérez les comptes administrateurs et leurs permissions</p>
              </div>
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
                        className="btn-edit"
                        onClick={() => openEditModal(admin)}
                        title="Modifier"
                      >
                        ✏️
                      </button>
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
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminManagement
