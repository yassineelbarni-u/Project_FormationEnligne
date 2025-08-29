// Configuration API centralisée
const BACKEND_URL = "http://localhost:8001"

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

    // Si custom headers est fourni, utilisez-les, sinon utilisez les headers par défaut
    let headers = options.headers || this.getHeaders(options.auth !== false, options.isStudent)

    // Ne pas ajouter Content-Type pour FormData car le navigateur le définit automatiquement avec la boundary
    if (options.body instanceof FormData) {
      // Supprimez Content-Type pour FormData pour laisser le navigateur le définir
      const { "Content-Type": _, ...headersWithoutContentType } = headers
      headers = headersWithoutContentType
    }

    const config = {
      headers,
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
  
  // Admin Management API METHODS - Méthodes pour la gestion des administrateurs
  async getAdmins() {
    return this.request("/api/admin/management/")
  }
  
  async createAdmin(adminData) {
    return this.request("/api/admin/management/", {
      method: "POST",
      body: JSON.stringify(adminData),
    })
  }
  
  async getAdmin(adminId) {
    return this.request(`/api/admin/management/${adminId}`)
  }
  
  async updateAdmin(adminId, adminData) {
    return this.request(`/api/admin/management/${adminId}`, {
      method: "PUT",
      body: JSON.stringify(adminData),
    })
  }
  
  async deleteAdmin(adminId) {
    return this.request(`/api/admin/management/${adminId}`, {
      method: "DELETE",
    })
  }


  // Connexion étudiant
  async studentLogin(credentials) {
    return this.request("/api/student/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      auth: false,
    })
  }

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


  // Récupérer toutes les annonces (admin)
  async getAnnouncements() {
    return this.request("/api/admin/announcements/admin")
  }

  // Créer une nouvelle annonce
  async createAnnouncement(formData) {
    return this.request("/api/admin/announcements/", {
      method: "POST",
      body: formData,
    })
  }

  // Modifier une annonce
  async updateAnnouncement(announcementId, formData) {
    return this.request(`/api/admin/announcements/${announcementId}`, {
      method: "PUT",
      body: formData,
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

  // RECRUITMENT API METHODS - Méthodes pour la gestion du recrutement

  // Récupérer toutes les offres d'emploi (public)
  async getJobOffers(activeOnly = false) {
    const endpoint = activeOnly ? "/api/recruitment/?active_only=true" : "/api/recruitment/"
    return this.request(endpoint, {
      auth: false,
    })
  }

  // Récupérer une offre d'emploi spécifique (public)
  async getJobOffer(jobOfferId) {
    return this.request(`/api/recruitment/${jobOfferId}`, {
      auth: false,
    })
  }

  // Créer une nouvelle offre d'emploi (admin)
  async createJobOffer(jobOfferData) {
    return this.request("/api/admin/recruitment/", {
      method: "POST",
      body: JSON.stringify(jobOfferData),
    })
  }

  // Modifier une offre d'emploi (admin)
  async updateJobOffer(jobOfferId, jobOfferData) {
    return this.request(`/api/admin/recruitment/${jobOfferId}`, {
      method: "PUT",
      body: JSON.stringify(jobOfferData),
    })
  }

  // Supprimer une offre d'emploi (admin)
  async deleteJobOffer(jobOfferId) {
    return this.request(`/api/admin/recruitment/${jobOfferId}`, {
      method: "DELETE",
    })
  }

  // Activer/désactiver une offre d'emploi (admin)
  async toggleJobOfferStatus(jobOfferId) {
    return this.request(`/api/admin/recruitment/${jobOfferId}/toggle`, {
      method: "PUT",
    })
  }

  // Récupérer toutes les offres d'emploi pour l'admin
  async getAdminJobOffers() {
    return this.request("/api/admin/recruitment/")
  }

  // JOB APPLICATIONS API METHODS - Méthodes pour la gestion des candidatures

  // Créer une nouvelle candidature (public)
  async createJobApplication(applicationData) {
    return this.request("/api/applications/", {
      method: "POST",
      body: applicationData, // FormData avec fichier CV
      headers: {
        // Ne pas définir Content-Type pour FormData
        Authorization: localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : undefined,
      },
      auth: false,
    })
  }

  // Récupérer toutes les candidatures (admin)
  async getJobApplications(jobOfferId = null, status = null) {
    let endpoint = "/api/admin/applications/"
    const params = new URLSearchParams()

    if (jobOfferId) params.append("job_offer_id", jobOfferId)
    if (status) params.append("status", status)

    if (params.toString()) {
      endpoint += `?${params.toString()}`
    }

    return this.request(endpoint)
  }

  // Récupérer une candidature spécifique (admin)
  async getJobApplication(applicationId) {
    return this.request(`/api/admin/applications/${applicationId}`)
  }

  // Modifier une candidature (admin)
  async updateJobApplication(applicationId, applicationData) {
    return this.request(`/api/admin/applications/${applicationId}`, {
      method: "PUT",
      body: JSON.stringify(applicationData),
    })
  }

  // Supprimer une candidature (admin)
  async deleteJobApplication(applicationId) {
    return this.request(`/api/admin/applications/${applicationId}`, {
      method: "DELETE",
    })
  }

  // Télécharger un CV (admin)
  async downloadCV(cvUrl) {
    const url = `${this.baseURL}${cvUrl}`
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    if (!response.ok) {
      throw new Error("Erreur lors du téléchargement du CV")
    }

    return response.blob()
  }

  // Exporter les candidatures en CSV (admin)
  async exportApplicationsCSV(jobOfferId = null) {
    let endpoint = "/api/admin/applications/export"
    if (jobOfferId) {
      endpoint += `?job_offer_id=${jobOfferId}`
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    if (!response.ok) {
      throw new Error("Erreur lors de l'export des candidatures")
    }

    return response.blob()
  }

  // Obtenir les statistiques de recrutement
  async getRecruitmentStats() {
    return this.request("/api/admin/recruitment/stats")
  }

}

const apiService = new ApiService()
export default apiService
