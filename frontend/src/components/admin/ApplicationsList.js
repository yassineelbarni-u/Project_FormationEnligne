"use client"

import "./ApplicationsList.css"

const ApplicationsList = ({ applications, onViewDetails, onStatusUpdate, onDownloadCV }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: "En attente", class: "pending" },
      reviewed: { label: "Examinée", class: "reviewed" },
      accepted: { label: "Acceptée", class: "accepted" },
      rejected: { label: "Refusée", class: "rejected" },
    }

    const config = statusConfig[status] || { label: status, class: "unknown" }

    return <span className={`status-badge ${config.class}`}>{config.label}</span>
  }

  const handleQuickStatusChange = (applicationId, newStatus) => {
    onStatusUpdate(applicationId, newStatus)
  }

  if (applications.length === 0) {
    return (
      <div className="no-applications">
        <h3>Aucune candidature</h3>
        <p>Il n'y a actuellement aucune candidature correspondant à vos critères.</p>
      </div>
    )
  }

  return (
    <div className="applications-list">
      <div className="applications-table-container">
        <table className="applications-table">
          <thead>
            <tr>
              <th>Candidat</th>
              <th>Poste</th>
              <th>Entreprise</th>
              <th>Date</th>
              <th>Statut</th>
              <th>CV</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.id} className={`application-row ${application.status}`}>
                <td>
                  <div className="candidate-info">
                    <strong>
                      {application.first_name} {application.last_name}
                    </strong>
                    <div className="candidate-email">{application.email}</div>
                    {application.phone && <div className="candidate-phone">{application.phone}</div>}
                  </div>
                </td>
                <td>
                  <div className="job-info">
                    <strong>{application.job_title}</strong>
                  </div>
                </td>
                <td>{application.company_name}</td>
                <td>
                  <div className="date-info">{formatDate(application.created_at)}</div>
                </td>
                <td>
                  <div className="status-cell">
                    {getStatusBadge(application.status)}
                    <select
                      value={application.status}
                      onChange={(e) => handleQuickStatusChange(application.id, e.target.value)}
                      className={`quick-status-select ${application.status}`}
                    >
                      <option value="pending">En attente</option>
                      <option value="reviewed">Examinée</option>
                      <option value="accepted">Acceptée</option>
                      <option value="rejected">Refusée</option>
                    </select>
                  </div>
                </td>
                <td>
                  {application.cv_url ? (
                    <button
                      onClick={() =>
                        onDownloadCV(application.cv_url, `${application.first_name}_${application.last_name}`)
                      }
                      className="download-cv-btn-small"
                      title="Télécharger le CV"
                    >
                      📄
                    </button>
                  ) : (
                    <span className="no-cv">Aucun CV</span>
                  )}
                </td>
                <td>
                  <div className="actions-buttons">
                    <button
                      onClick={() => onViewDetails(application)}
                      className="view-details-btn"
                      title="Voir les détails"
                    >
                      👁️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ApplicationsList
