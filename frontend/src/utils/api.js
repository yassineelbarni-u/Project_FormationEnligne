// Configuration API centralisée
<<<<<<< HEAD
const BACKEND_URL = "http://localhost:8001"
=======
const BACKEND_URL = "http://localhost:8002"
>>>>>>> c79657081c0335c07b1c654f0d60fb8a6cf4dac1

class ApiService {
  constructor() {
    this.baseURL = BACKEND_URL
  }

  // Méthode pour obtenir les headers avec token (admin ou étudiant)
  getHeaders(includeAuth = true, isStudent = false) {
    const headers = {
      "Content-Type": "application/json",
    }
    if (includeAuth) {
      // Choisir le bon token selon le type d'utilisateur
      const tokenKey = isStudent ? "student_token" : "token"
      const token = localStorage.getItem(tokenKey)
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
    }
    return headers
  }

  // Méthode générique pour les requêtes
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: this.getHeaders(options.auth !== false, options.isStudent),
      ...options,
    }
    try {
      const response = await fetch(url, config)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error)
      throw error
    }
  }

  // Méthodes spécifiques
  // Auth
  async login(credentials) {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      auth: false,
    })
  }

  async verifyToken() {
    return this.request("/api/auth/verify")
  }

  // Dashboard
  async getDashboardStats() {
    return this.request("/api/admin/dashboard/stats")
  }

  // Courses
  async getCourses() {
    return this.request("/api/admin/courses/")
  }

  async createCourse(courseData) {
    return this.request("/api/admin/courses/", {
      method: "POST",
      body: JSON.stringify(courseData),
    })
  }

  async getCourse(courseId) {
    return this.request(`/api/admin/courses/${courseId}`)
  }

  async updateCourse(courseId, courseData) {
    return this.request(`/api/admin/courses/${courseId}`, {
      method: "PUT",
      body: JSON.stringify(courseData),
    })
  }

  async deleteCourse(courseId) {
    return this.request(`/api/admin/courses/${courseId}`, {
      method: "DELETE",
    })
  }

  // Videos
  async getVideos() {
    return this.request("/api/admin/videos/")
  }

  async getCourseVideos(courseId) {
    return this.request(`/api/admin/courses/${courseId}/videos`)
  }

  async addVideoToCourse(courseId, videoData) {
    return this.request(`/api/admin/courses/${courseId}/videos`, {
      method: "POST",
      body: JSON.stringify(videoData),
    })
  }

  async deleteVideo(videoId) {
    return this.request(`/api/admin/videos/${videoId}`, {
      method: "DELETE",
    })
  }

  // Students - Méthodes complètes
  async getStudents() {
    return this.request("/api/admin/students/")
  }

  async createStudent(studentData) {
    return this.request("/api/admin/students/", {
      method: "POST",
      body: JSON.stringify(studentData),
    })
  }

  async getStudent(studentId) {
    return this.request(`/api/admin/students/${studentId}`)
  }

  async updateStudent(studentId, studentData) {
    return this.request(`/api/admin/students/${studentId}`, {
      method: "PUT",
      body: JSON.stringify(studentData),
    })
  }

  async deleteStudent(studentId) {
    return this.request(`/api/admin/students/${studentId}`, {
      method: "DELETE",
    })
  }

  // Accesses - Méthodes complètes
  async getAccesses() {
    return this.request("/api/admin/accesses/")
  }

  async createAccess(accessData) {
    return this.request("/api/admin/accesses/", {
      method: "POST",
      body: JSON.stringify(accessData),
    })
  }

  async getAccess(accessId) {
    return this.request(`/api/admin/accesses/${accessId}`)
  }

  async updateAccess(accessId, accessData) {
    return this.request(`/api/admin/accesses/${accessId}`, {
      method: "PUT",
      body: JSON.stringify(accessData),
    })
  }

  async deleteAccess(accessId) {
    return this.request(`/api/admin/accesses/${accessId}`, {
      method: "DELETE",
    })
  }

  async toggleAdminStatus(adminId) {
    return this.request(`/api/admin/management/${adminId}/toggle-status`, {
      method: "PUT",
    })
  }

  // STUDENT API METHODS - Nouvelles méthodes pour les étudiants

  // Connexion étudiant
  async studentLogin(credentials) {
    return this.request("/api/student/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      auth: false,
    })
  }

  // Récupérer les cours de l'étudiant connecté
  async getStudentCourses() {
    return this.request("/api/student/my-courses", {
      isStudent: true,
    })
  }

  // Récupérer un cours spécifique pour l'étudiant
  async getStudentCourse(courseId) {
    return this.request(`/api/student/course/${courseId}`, {
      isStudent: true,
    })
  }

  // Récupérer les vidéos d'un cours pour l'étudiant
  async getStudentCourseVideos(courseId) {
    return this.request(`/api/student/course/${courseId}/videos`, {
      isStudent: true,
    })
  }

  // Vérifier le token étudiant
  async verifyStudentToken() {
    return this.request("/api/student/verify", {
      isStudent: true,
    })
  }

  // ANNOUNCEMENTS API METHODS - Méthodes pour la gestion des annonces

  // Récupérer toutes les annonces (admin)
  async getAnnouncements() {
    return this.request("/api/admin/announcements/admin")
  }

  // Créer une nouvelle annonce
  async createAnnouncement(formData) {
    return this.request("/api/admin/announcements/", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
  }

  // Modifier une annonce
  async updateAnnouncement(announcementId, formData) {
    return this.request(`/api/admin/announcements/${announcementId}`, {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
  }

  // Supprimer une annonce
  async deleteAnnouncement(announcementId) {
    return this.request(`/api/admin/announcements/${announcementId}`, {
      method: "DELETE",
    })
  }

  // Activer/désactiver une annonce
  async toggleAnnouncementStatus(announcementId) {
    return this.request(`/api/admin/announcements/${announcementId}/toggle`, {
      method: "PUT",
    })
  }

  // Récupérer les annonces actives (public, sans authentification)
  async getActiveAnnouncements() {
    return this.request("/api/announcements/?active_only=true", {
      auth: false,
    })
  }
}

// Export d'une instance unique
const apiService = new ApiService()
export default apiService
