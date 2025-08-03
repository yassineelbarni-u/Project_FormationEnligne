"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import AdminSidebar from "./AdminSidebar"
import "./AdminLayout.css"

// Backend sur port 8001
const BACKEND_URL = "http://localhost:8001"

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Vérifier l'authentification
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token) {
      navigate("/login")
      return
    }

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        console.log("User data:", parsedUser) // Pour debug
      } catch (error) {
        console.error("Erreur parsing user data:", error)
        handleLogout()
        return
      }
    }

    // Vérifier la validité du token avec le backend FastAPI
    verifyToken(token)
  }, [navigate])

  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setIsLoading(false)
      } else {
        handleLogout()
      }
    } catch (error) {
      console.error("Erreur vérification token:", error)
      handleLogout()
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Vérification de l'authentification...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="admin-layout-modern">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPath={location.pathname}
        user={user} // 🎯 Passer les infos utilisateur à la sidebar
        onLogout={handleLogout}
      />

      <div className={`admin-main-modern ${sidebarOpen ? "sidebar-open" : ""}`}>
        {/* Bouton de menu mobile */}
        <button className="mobile-menu-button" onClick={toggleSidebar}>
          <span>☰</span>
        </button>
        
        <main className="admin-content-modern">{children}</main>
      </div>

      {/* Overlay pour mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  )
}

export default AdminLayout
