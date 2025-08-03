"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import "./StudentLayout.css"

const StudentLayout = ({ children }) => {
  const [user, setUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem("student_token")
    const userData = localStorage.getItem("student_user")

    if (!token) {
      navigate("/student/login")
      return
    }

    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("student_token")
    localStorage.removeItem("student_user")
    navigate("/student/login")
  }

  const menuItems = [
    {
      title: "Mes Cours",
      path: "/student/dashboard",
      icon: "📚",
    },
 
  ]

  if (!user) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Chargement...</p>
      </div>
    )
  }

  return (
    <div className="studentLayout">
      {/* Sidebar */}
      <div className={`studentSidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebarHeader">
          <div className="logo">
            <span className="logoIcon">🎓</span>
            <span className="logoText">EduPlatform</span>
          </div>
          <button className="sidebarClose" onClick={() => setSidebarOpen(false)}>
            ✕
          </button>
        </div>

        <div className="userProfile">
          <div className="userAvatar">{user.name?.charAt(0) || "E"}</div>
          <div className="userInfo">
            <h3>{user.name}</h3>
            <p>Étudiant</p>
            <small>{user.email}</small>
          </div>
        </div>

        <nav className="sidebarNav">
          <ul className="navMenu">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`navLink ${location.pathname === item.path ? "active" : ""}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="navIcon">{item.icon}</span>
                  <span className="navText">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebarFooter">
          <button className="logoutBtn" onClick={handleLogout}>
            <span className="navIcon">🚪</span>
            <span className="navText">Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mainContent">
        {/* Top Header */}
        <header className="topHeader">
          <button className="menuToggle" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
          <div className="headerTitle">
            <h2>Espace Étudiant</h2>
          </div>
          <div className="headerActions">
            <button className="notificationBtn">🔔</button>
            <div className="userMenu">
              <img src={`https://ui-avatars.com/api/?name=${user.name}&background=667eea&color=fff`} alt="Avatar" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="pageContent">{children}</main>
      </div>

      {/* Overlay pour mobile */}
      {sidebarOpen && <div className="sidebarOverlay" onClick={() => setSidebarOpen(false)}></div>}
    </div>
  )
}

export default StudentLayout
