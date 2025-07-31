"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import AdminSidebar from "./AdminSidebar"
import { useAuth } from "../../contexts/AuthContext" // Importer useAuth
import "./AdminLayout.css"

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, isAuthenticated, loading, logout, setUser } = useAuth() // Utiliser useAuth
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login")
    }
  }, [isAuthenticated, loading, navigate])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Vérification de l'authentification...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Ne rien rendre si pas authentifié (la redirection est gérée par useEffect)
  }

  return (
    <div className="admin-layout-modern">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPath={location.pathname}
        user={user}
        onLogout={handleLogout}
      />
      <div className={`admin-main-modern ${sidebarOpen ? "sidebar-open" : ""}`}>
        <main className="admin-content-modern">{children}</main>
      </div>
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  )
}

export default AdminLayout
