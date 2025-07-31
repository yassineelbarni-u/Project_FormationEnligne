"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { FaHome, FaBook, FaVideo, FaUserGraduate, FaKey, FaUsers, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa"
import { useAuth } from "../../contexts/AuthContext"
import "./AdminSidebar.css"

const AdminSidebar = ({ user }) => {
  const location = useLocation()
  const { logout, isSuperAdmin } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [adminName, setAdminName] = useState("Admin")
  const [adminEmail, setAdminEmail] = useState("")

  useEffect(() => {
    if (user) {
      setAdminName(user.name || user.email)
      setAdminEmail(user.email)
    }
  }, [user])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = () => {
    logout()
  }

  const menuItems = [
    {
      title: "Tableau de Bord",
      path: "/admin/dashboard",
      icon: <FaHome />,
    },
    {
      title: "Gestion des Cours",
      path: "/admin/courses",
      icon: <FaBook />,
    },
    {
      title: "Gestion des Vidéos",
      path: "/admin/videos",
      icon: <FaVideo />,
    },
    {
      title: "Gestion des Étudiants",
      path: "/admin/students",
      icon: <FaUserGraduate />,
    },
    {
      title: "Gestion des Accès",
      path: "/admin/accesses",
      icon: <FaKey />,
    },
  ]

  if (isSuperAdmin) {
    menuItems.push({
      title: "Gestion Admins",
      path: "/admin/management",
      icon: <FaUsers />,
    })
  }

  return (
    <>
      <button className="sidebar-toggle-button" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
      <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3>Admin Panel</h3>
          <div className="admin-profile-info">
            <p className="admin-name">{adminName}</p>
            <p className="admin-role">{isSuperAdmin ? "Super Admin" : "Admin"}</p>
            <small className="admin-email">{adminEmail}</small>
          </div>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? "active" : ""}
                  onClick={toggleSidebar}
                >
                  {item.icon} {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            <FaSignOutAlt /> Déconnexion
          </button>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar
