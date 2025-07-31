// Configuration API centralisée
const BACKEND_URL = "http://localhost:8001"

class ApiService {
  constructor() {
    this.baseURL = BACKEND_URL
  }

  // Méthode pour obtenir les headers avec token
  getHeaders(includeAuth = true) {
    const headers = {
      "Content-Type": "application/json",
    }

    if (includeAuth) {
      const token = localStorage.getItem("token")
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
      headers: this.getHeaders(options.auth !== false),
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

  // Students
  async getStudents() {
    return this.request("/api/admin/students/")
  }

  async createStudent(studentData) {
    return this.request("/api/admin/students/", {
      method: "POST",
      body: JSON.stringify(studentData),
    })
  }

  // Accesses
  async getAccesses() {
    return this.request("/api/admin/accesses/")
  }

  async createAccess(accessData) {
    return this.request("/api/admin/accesses/", {
      method: "POST",
      body: JSON.stringify(accessData),
    })
  }

  // 🆕 Admin Management (Super Admin only)
  async getAdmins() {
    return this.request("/api/admin/manage-admins/")
  }

  async createAdmin(adminData) {
    return this.request("/api/admin/manage-admins/", {
      method: "POST",
      body: JSON.stringify(adminData),
    })
  }

  async getAdmin(adminId) {
    return this.request(`/api/admin/manage-admins/${adminId}`)
  }

  async updateAdmin(adminId, adminData) {
    return this.request(`/api/admin/manage-admins/${adminId}`, {
      method: "PUT",
      body: JSON.stringify(adminData),
    })
  }

  async deleteAdmin(adminId) {
    return this.request(`/api/admin/manage-admins/${adminId}`, {
      method: "DELETE",
    })
  }

  async toggleAdminStatus(adminId) {
    return this.request(`/api/admin/manage-admins/${adminId}/toggle-status`, {
      method: "PUT",
    })
  }
}

// Export d'une instance unique
const apiService = new ApiService()
export default apiService
