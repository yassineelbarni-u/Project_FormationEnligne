// Configuration de l'API centralisée
const BACKEND_URL = "http://localhost:8001"

// Fonction utilitaire pour les headers avec token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

// Fonction utilitaire pour les headers avec token étudiant
const getStudentAuthHeaders = () => {
  const studentToken = localStorage.getItem("student_token")
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${studentToken}`,
  }
}

// Gestion des erreurs API
const handleApiError = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || `Erreur ${response.status}`)
  }
  return response
}

// ==================== AUTHENTIFICATION ====================
export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${BACKEND_URL}/api/auth/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })
    await handleApiError(response)
    return response.json()
  },
  verify: async () => {
    const response = await fetch(`${BACKEND_URL}/api/auth/verify`, {
      headers: getAuthHeaders(),
    })
    await handleApiError(response)
    return response.json()
  },
  getAdminMe: async () => {
    const response = await fetch(`${BACKEND_URL}/api/auth/admin/me`, {
      headers: getAuthHeaders(),
    })
    await handleApiError(response)
    return response.json()
  },
  studentLogin: async (credentials) => {
    const response = await fetch(`${BACKEND_URL}/api/auth/student/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })
    await handleApiError(response)
    return response.json()
  },
  verifyStudent: async () => {
    const response = await fetch(`${BACKEND_URL}/api/auth/student/verify`, {
      headers: getStudentAuthHeaders(),
    })
    await handleApiError(response)
    return response.json()
  },
  getStudentMe: async () => {
    const response = await fetch(`${BACKEND_URL}/api/auth/student/me`, {
      headers: getStudentAuthHeaders(),
    })
    await handleApiError(response)
    return response.json()
  },
}

// ==================== GESTION DES ADMINS ====================
export const adminManagementAPI = {
  // Récupérer tous les admins
  getAll: async () => {
    const response = await fetch(`${BACKEND_URL}/api/admin/management/admins`, {
      headers: getAuthHeaders(),
    })
    await handleApiError(response)
    return response.json()
  },
  // Créer un nouvel admin
  create: async (adminData) => {
    const response = await fetch(`${BACKEND_URL}/api/admin/management/admins`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(adminData),
    })
    await handleApiError(response)
    return response.json()
  },
  // Mettre à jour un admin
  update: async (adminId, adminData) => {
    const response = await fetch(`${BACKEND_URL}/api/admin/management/admins/${adminId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(adminData),
    })
    await handleApiError(response)
    return response.json()
  },
  // Supprimer un admin
  delete: async (adminId) => {
    const response = await fetch(`${BACKEND_URL}/api/admin/management/admins/${adminId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    await handleApiError(response)
    return response.json()
  },
  // Activer/Désactiver un admin
  toggleStatus: async (adminId, isActive) => {
    const response = await fetch(`${BACKEND_URL}/api/admin/management/admins/${adminId}/status`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ is_active: isActive }),
    })
    await handleApiError(response)
    return response.json()
  },
}

// ==================== DASHBOARD ====================
export const dashboardAPI = {
  getStats: async () => {
    const response = await fetch(`${BACKEND_URL}/api/admin/dashboard/stats`, {
      headers: getAuthHeaders(),
    })
    await handleApiError(response)
    return response.json()
  },
}

// ==================== COURS ====================
export const coursesAPI = {
  getAll: async () => {
    const response = await fetch(`${BACKEND_URL}/api/admin/courses/`, {
      headers: getAuthHeaders(),
    })
    await handleApiError(response)
    return response.json()
  },
  getById: async (courseId) => {
    const response = await fetch(`${BACKEND_URL}/api/admin/courses/${courseId}`, {
      headers: getAuthHeaders(),
    })
    await handleApiError(response)
    return response.json()
  },
  create: async (courseData) => {
    const response = await fetch(`${BACKEND_URL}/api/admin/courses/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(courseData),
    })
    await handleApiError(response)
    return response.json()
  },
  update: async (courseId, courseData) => {
    const response = await fetch(`${BACKEND_URL}/api/admin/courses/${courseId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(courseData),
    })
    await handleApiError(response)
    return response.json()
  },
  delete: async (courseId) => {
    const response = await fetch(`${BACKEND_URL}/api/admin/courses/${courseId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    await handleApiError(response)
    return response.json()
  },
  getCourseVideos: async (courseId) => {
    const response = await fetch(`${BACKEND_URL}/api/admin/courses/${courseId}/videos`, {
      headers: getAuthHeaders(),
    })
    await handleApiError(response)
    return response.json()
  },
  addVideoToCourse: async (courseId, videoData) => {
    const response = await fetch(`${BACKEND_URL}/api/admin/courses/${courseId}/videos`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(videoData),
    })
    await handleApiError(response)
    return response.json()
  },
  removeVideoFromCourse: async (courseId, videoId) => {
    const response = await fetch(`${BACKEND_URL}/api/admin/courses/${courseId}/videos/${videoId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    await handleApiError(response)
    return response.json()
  },
}

// ==================== VIDÉOS ====================
export const videosAPI = {
  getAll: async () => {
    const response = await fetch(`${BACKEND_URL}/api/admin/videos/`, {
      headers: getAuthHeaders(),
    })
    await handleApiError(response)
    return response.json()
  },
  create: async (videoData) => {
    const response = await fetch(`${BACKEND_URL}/api/admin/videos/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(videoData),
    })
    await handleApiError(response)
    return response.json()
  },
  update: async (videoId, videoData) => {
    const response = await fetch(`${BACKEND_URL}/api/admin/videos/${videoId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(videoData),
    })
    await handleApiError(response)
    return response.json()
  },
  delete: async (videoId) => {
    const response = await fetch(`${BACKEND_URL}/api/admin/videos/${videoId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    await handleApiError(response)
    return response.json()
  },
}

// ==================== ÉTUDIANTS ====================
export const studentsAPI = {
  getAll: async () => {
    const response = await fetch(`${BACKEND_URL}/api/admin/students/`, {
      headers: getAuthHeaders(),
    })
    await handleApiError(response)
    return response.json()
  },
  create: async (studentData) => {
    const response = await fetch(`${BACKEND_URL}/api/admin/students/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(studentData),
    })
    await handleApiError(response)
    return response.json()
  },
  getById: async (studentId) => {
    const response = await fetch(`${BACKEND_URL}/api/admin/students/${studentId}`, {
      headers: getAuthHeaders(),
    })
    await handleApiError(response)
    return response.json()
  },
  update: async (studentId, studentData) => {
    const response = await fetch(`${BACKEND_URL}/api/admin/students/${studentId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(studentData),
    })
    await handleApiError(response)
    return response.json()
  },
  delete: async (studentId) => {
    const response = await fetch(`${BACKEND_URL}/api/admin/students/${studentId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    await handleApiError(response)
    return response.json()
  },
  invite: async (email) => {
    const response = await fetch(`${BACKEND_URL}/api/admin/students/invite`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ email }),
    })
    await handleApiError(response)
    return response.json()
  },
}

// ==================== ACCÈS ====================
export const accessesAPI = {
  getAll: async () => {
    const response = await fetch(`${BACKEND_URL}/api/admin/accesses/`, {
      headers: getAuthHeaders(),
    })
    await handleApiError(response)
    return response.json()
  },
  create: async (accessData) => {
    const response = await fetch(`${BACKEND_URL}/api/admin/accesses/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(accessData),
    })
    await handleApiError(response)
    return response.json()
  },
  getById: async (accessId) => {
    const response = await fetch(`${BACKEND_URL}/api/admin/accesses/${accessId}`, {
      headers: getAuthHeaders(),
    })
    await handleApiError(response)
    return response.json()
  },
  update: async (accessId, accessData) => {
    const response = await fetch(`${BACKEND_URL}/api/admin/accesses/${accessId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(accessData),
    })
    await handleApiError(response)
    return response.json()
  },
  delete: async (accessId) => {
    const response = await fetch(`${BACKEND_URL}/api/admin/accesses/${accessId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    await handleApiError(response)
    return response.json()
  },
}

export default {
  auth: authAPI,
  adminManagement: adminManagementAPI,
  dashboard: dashboardAPI,
  courses: coursesAPI,
  videos: videosAPI,
  students: studentsAPI,
  accesses: accessesAPI,
}
