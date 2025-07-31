import React from "react"
import { Link, useNavigate } from "react-router-dom"
import "./AdminSidebar.css"

const AdminSidebar = ({ isOpen, onClose, currentPath, user, onLogout }) => {
  const navigate = useNavigate()

  // Déterminer si l'utilisateur est un super admin
  const isSuperAdmin = user?.is_super_admin === true

  const menuItems = [
    {
      path: "/admin/dashboard",
      icon: "dashboard",
      label: "Tableau de bord",
      access: "all",
    },
    {
      path: "/admin/courses",
      icon: "school",
      label: "Cours",
      access: "all",
    },
    {
      path: "/admin/videos",
      icon: "movie",
      label: "Vidéos",
      access: "all",
    },
    {
      path: "/admin/students",
      icon: "people",
      label: "Étudiants",
      access: "all",
    },
    {
      path: "/admin/accesses",
      icon: "lock_open",
      label: "Accès",
      access: "all",
    },
    {
      path: "/admin/manage-admins",
      icon: "admin_panel_settings",
      label: "Gestion Admins",
      access: "superadmin", // Réservé aux super admins
    },
  ]

  const filteredItems = menuItems.filter(item => {
    if (item.access === "all") return true
    if (item.access === "superadmin" && isSuperAdmin) return true
    return false
  })

  return (
    <>
      {/* Overlay pour fermer la sidebar sur mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3>Administration</h3>
          <button className="close-sidebar" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="user-info">
          <div className="avatar">
            {user?.name?.charAt(0) || "A"}
          </div>
          <div className="user-details">
            <p className="user-name">{user?.name || "Admin"}</p>
            <p className="user-role">
              {isSuperAdmin ? "Super Administrateur" : "Administrateur"}
            </p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {filteredItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={currentPath === item.path ? "active" : ""}
                  onClick={onClose}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-button" onClick={onLogout}>
            <span className="material-symbols-outlined">logout</span>
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar
