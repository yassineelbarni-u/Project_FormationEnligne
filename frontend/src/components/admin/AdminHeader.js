"use client"

import "./AdminHeader.css"

const AdminHeader = ({ onToggleSidebar, user, onLogout }) => {
  return (
    <header className="admin-header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={onToggleSidebar}>
          ☰
        </button>

        <div className="search-container">
          <input type="text" placeholder="Rechercher..." className="search-input" />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      <div className="header-right">
        <button className="notification-btn">
          <span className="notification-icon">🔔</span>
          <span className="notification-badge">3</span>
        </button>

        <div className="user-menu" onClick={onLogout}>
          <div className="user-info">
            <span className="user-name">{user?.name || "Admin"}</span>
            <span className="user-role">Administrateur</span>
          </div>
          <div className="user-avatar">{user?.name?.charAt(0) || "A"}</div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
