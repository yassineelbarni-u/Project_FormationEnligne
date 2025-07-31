"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"
import "./Dashboard.css"

// Backend sur port 8001
const BACKEND_URL = "http://localhost:8001"

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalVideos: 0,
    totalStudents: 0,
    totalAccesses: 0,
    recentActivity: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${BACKEND_URL}/api/admin/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStats({
          totalCourses: data.total_courses,
          totalVideos: data.total_videos,
          totalStudents: data.total_students,
          totalAccesses: data.total_accesses,
          recentActivity: data.recent_activity,
        })
      }
    } catch (error) {
      console.error("Erreur lors du chargement des stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = [
    {
      title: "Cours Créés",
      value: stats.totalCourses,
      icon: "📚",
      borderColor: "border-left-blue",
      href: "/admin/courses",
    },
    {
      title: "Vidéos Drive",
      value: stats.totalVideos,
      icon: "🎥",
      borderColor: "border-left-red",
      href: "/admin/videos",
    },
    {
      title: "Étudiants Inscrits",
      value: stats.totalStudents,
      icon: "👥",
      borderColor: "border-left-green",
      href: "/admin/students",
    },
    {
      title: "Accès Accordés",
      value: stats.totalAccesses,
      icon: "🔑",
      borderColor: "border-left-purple",
      href: "/admin/accesses",
    },
  ]

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Chargement du dashboard...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="dashboard-modern">
        {/* Header avec recherche et actions */}
        <div className="dashboard-header-modern">
          <div className="header-left">
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Rechercher..." className="search-input" />
            </div>
          </div>

          <div className="header-right">
            <button className="notification-btn">
              <span className="notification-icon">🔔</span>
              <span className="notification-badge">3</span>
            </button>

            <div className="user-profile">
              <div className="user-info">
                <span className="user-name">Ilyas Nahi</span>
                <span className="user-role">Administrateur</span>
              </div>
              <div className="user-avatar">I</div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="dashboard-content-modern">
          {/* Titre et boutons d'action */}
          <div className="title-section">
            <div className="title-content">
              <h1>Dashboard Admin - Système Vidéos</h1>
              <p>Gérez vos cours, vidéos Google Drive et accès étudiants</p>
            </div>

            <div className="action-buttons">
              <button className="btn-primary" onClick={() => navigate("/admin/courses/new")}>
                📚 Nouveau Cours
              </button>
              <button className="btn-secondary" onClick={() => navigate("/admin/videos/add")}>
                🎥 Ajouter Vidéo
              </button>
            </div>
          </div>

          {/* Cartes de statistiques */}
          <div className="stats-grid-modern">
            {statCards.map((card, index) => (
              <div key={index} className={`stat-card-modern ${card.borderColor}`} onClick={() => navigate(card.href)}>
                <div className="stat-content-modern">
                  <div className="stat-info">
                    <p className="stat-title">{card.title}</p>
                    <p className="stat-value">{card.value}</p>
                  </div>
                  <div className="stat-icon">
                    <span>{card.icon}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Activité Récente et Actions Rapides */}
          <div className="bottom-section">
            {/* Activité Récente */}
            <div className="activity-section-modern">
              <div className="section-header">
                <h2>📊 Activité Récente</h2>
              </div>
              <div className="activity-list-modern">
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="activity-item-modern">
                    <div className="activity-info">
                      <div className={`activity-icon-container ${activity.type}`}>
                        <span className="activity-icon">
                          {activity.type === "course" ? "📚" : activity.type === "video" ? "🎥" : "📝"}
                        </span>
                      </div>
                      <div className="activity-details">
                        <p className="activity-title">{activity.title}</p>
                        <p className="activity-date">{activity.date}</p>
                        {activity.subject && <p className="activity-subject">{activity.subject}</p>}
                      </div>
                    </div>
                    <div className="activity-views">
                      {activity.type === "course" ? `${activity.views} étudiants` : `${activity.views} vues`}
                    </div>
                  </div>
                ))}

                {stats.recentActivity.length === 0 && (
                  <div className="no-activity">
                    <p>Aucune activité récente</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Rapides */}
            <div className="actions-section-modern">
              <div className="section-header">
                <h2>⚡ Actions Rapides</h2>
              </div>
              <div className="quick-actions-modern">
                <button className="action-btn-modern" onClick={() => navigate("/admin/courses")}>
                  <div className="action-icon course">📚</div>
                  Gérer les Cours
                </button>

                <button className="action-btn-modern" onClick={() => navigate("/admin/videos")}>
                  <div className="action-icon video">🎥</div>
                  Vidéos Google Drive
                </button>

                <button className="action-btn-modern" onClick={() => navigate("/admin/students")}>
                  <div className="action-icon students">👥</div>
                  Étudiants
                </button>

                <button className="action-btn-modern" onClick={() => navigate("/admin/accesses")}>
                  <div className="action-icon access">🔑</div>
                  Gestion Accès
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Dashboard
