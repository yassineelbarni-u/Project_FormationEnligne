// Configuration API centralisée
const BACKEND_URL = process.env.REACT_APP_API_URL

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

    let headers = options.headers || this.getHeaders(options.auth !== false, options.isStudent)

    if (options.body instanceof FormData) {
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
      // console.error(`API Error (${endpoint}):`, error)
      throw error
    }
  }

  // Méthodes spécifiques
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

  async updateVideo(videoId, videoData) {
    return this.request(`/api/admin/videos/${videoId}`, {
      method: "PUT",
      body: JSON.stringify(videoData),
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

  // Méthode pour modifier son propre profil
  async updateMyProfile(adminData) {
    return this.request("/api/admin/management/profile/me", {
      method: "PUT",
      body: JSON.stringify(adminData),
    })
  }
  
  async deleteAdmin(adminId) {
    return this.request(`/api/admin/management/${adminId}`, {
      method: "DELETE",
    })
  }

  // Connexion étudiant classique
  async studentLogin(credentials) {
    if (process.env.NODE_ENV === 'development') {
      console.log("🔍 Student Login pour:", credentials.email)
    }
    return this.request("/api/student/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      auth: false,
    })
  }

  // Connexion étudiant via Google
  async studentGoogleLogin(credential) {
    if (process.env.NODE_ENV === 'development') {
      console.log("🔍 Connexion Google OAuth en cours...")
    }
    return this.request("/api/auth/google-login", {
      method: "POST",
      body: JSON.stringify({ credential }),
      auth: false,
    })
  }

  // ========== TÉMOIGNAGES ==========
  // Méthodes publiques (sans authentification)
  async getActiveTestimonials() {
    return await this.request("/api/testimonials/active", {
      method: "GET",
      auth: false,
    })
  }

  async getFeaturedTestimonials(limit = 10) {
    return await this.request(`/api/testimonials/featured?limit=${limit}`, {
      method: "GET",
      auth: false,
    })
  }

  async submitTestimonial(testimonialData) {
    return await this.request("/api/testimonials/submit", {
      method: "POST",
      body: JSON.stringify(testimonialData),
      auth: false,
    })
  }

  // Méthodes admin (avec authentification)
  async getAllTestimonials(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    return await this.request(`/api/admin/testimonials/?${queryParams}`, {
      method: "GET",
    })
  }

  async updateTestimonial(testimonialId, testimonialData) {
    return await this.request(`/api/admin/testimonials/${testimonialId}`, {
      method: "PUT",
      body: JSON.stringify(testimonialData),
    })
  }

  async deleteTestimonial(testimonialId) {
    return await this.request(`/api/admin/testimonials/${testimonialId}`, {
      method: "DELETE",
    })
  }

  async toggleTestimonialStatus(testimonialId) {
    return await this.request(`/api/admin/testimonials/${testimonialId}/toggle-status`, {
      method: "PUT",
    })
  }

  async getTestimonialStats() {
    return await this.request("/api/admin/testimonials/stats", {
      method: "GET",
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
    
  // Récupérer tous les cours gratuits (public)
  async getCoursGratuits() {
    return this.request("/api/cours-gratuits/", {
      auth: false,
    })
  }
  
  // Récupérer tous les cours gratuits (admin)
  async getCoursGratuitsAdmin() {
    return this.request("/api/admin/cours-gratuits/")
  }
  
  // Créer un nouveau cours gratuit (admin)
  async createCoursGratuit(coursData) {
    return this.request("/api/admin/cours-gratuits/", {
      method: "POST",
      body: JSON.stringify(coursData),
    })
  }
  
  // Modifier un cours gratuit (admin)
  async updateCoursGratuit(coursId, coursData) {
    return this.request(`/api/admin/cours-gratuits/${coursId}`, {
      method: "PUT",
      body: JSON.stringify(coursData),
    })
  }
  
  // Supprimer un cours gratuit (admin)
  async deleteCoursGratuit(coursId) {
    return this.request(`/api/admin/cours-gratuits/${coursId}`, {
      method: "DELETE",
    })
  }
}

const apiService = new ApiService()

export default apiService

// Méthodes d'authentification
export const login = apiService.login.bind(apiService)
export const verifyToken = apiService.verifyToken.bind(apiService)

// Méthodes pour les cours
export const getCourses = apiService.getCourses.bind(apiService)
export const createCourse = apiService.createCourse.bind(apiService)
export const getCourse = apiService.getCourse.bind(apiService)
export const updateCourse = apiService.updateCourse.bind(apiService)
export const deleteCourse = apiService.deleteCourse.bind(apiService)

// Méthodes pour les vidéos
export const getVideos = apiService.getVideos.bind(apiService)
export const getCourseVideos = apiService.getCourseVideos.bind(apiService)
export const addVideoToCourse = apiService.addVideoToCourse.bind(apiService)
export const deleteVideo = apiService.deleteVideo.bind(apiService)
export const updateVideo = apiService.updateVideo.bind(apiService)

// Méthodes pour les étudiants
export const getStudents = apiService.getStudents.bind(apiService)
export const createStudent = apiService.createStudent.bind(apiService)
export const getStudent = apiService.getStudent.bind(apiService)
export const updateStudent = apiService.updateStudent.bind(apiService)
export const deleteStudent = apiService.deleteStudent.bind(apiService)

// Méthodes pour les accès
export const getAccesses = apiService.getAccesses.bind(apiService)
export const createAccess = apiService.createAccess.bind(apiService)
export const getAccess = apiService.getAccess.bind(apiService)
export const updateAccess = apiService.updateAccess.bind(apiService)
export const deleteAccess = apiService.deleteAccess.bind(apiService)

// Méthodes pour la gestion des administrateurs
export const getAdmins = apiService.getAdmins.bind(apiService)
export const createAdmin = apiService.createAdmin.bind(apiService)
export const getAdmin = apiService.getAdmin.bind(apiService)
export const updateAdmin = apiService.updateAdmin.bind(apiService)
export const updateMyProfile = apiService.updateMyProfile.bind(apiService)
export const deleteAdmin = apiService.deleteAdmin.bind(apiService)
export const toggleAdminStatus = apiService.toggleAdminStatus.bind(apiService)

// Méthodes pour les annonces
export const getAnnouncements = apiService.getAnnouncements.bind(apiService)
export const createAnnouncement = apiService.createAnnouncement.bind(apiService)
export const updateAnnouncement = apiService.updateAnnouncement.bind(apiService)
export const deleteAnnouncement = apiService.deleteAnnouncement.bind(apiService)
export const toggleAnnouncementStatus = apiService.toggleAnnouncementStatus.bind(apiService)
export const getActiveAnnouncements = apiService.getActiveAnnouncements.bind(apiService)

// Méthodes pour les étudiants (côté étudiant)
export const studentLogin = apiService.studentLogin.bind(apiService)
export const getStudentCourses = apiService.getStudentCourses.bind(apiService)
export const getStudentCourse = apiService.getStudentCourse.bind(apiService)
export const getStudentCourseVideos = apiService.getStudentCourseVideos.bind(apiService)
export const verifyStudentToken = apiService.verifyStudentToken.bind(apiService)

// Méthodes pour les offres d'emploi
export const getJobOffers = apiService.getJobOffers.bind(apiService)
export const getJobOffer = apiService.getJobOffer.bind(apiService)
export const createJobOffer = apiService.createJobOffer.bind(apiService)
export const updateJobOffer = apiService.updateJobOffer.bind(apiService)
export const deleteJobOffer = apiService.deleteJobOffer.bind(apiService)
export const toggleJobOfferStatus = apiService.toggleJobOfferStatus.bind(apiService)
export const getAdminJobOffers = apiService.getAdminJobOffers.bind(apiService)

// Méthodes pour les candidatures
export const createJobApplication = apiService.createJobApplication.bind(apiService)
export const getJobApplications = apiService.getJobApplications.bind(apiService)
export const getJobApplication = apiService.getJobApplication.bind(apiService)
export const updateJobApplication = apiService.updateJobApplication.bind(apiService)
export const deleteJobApplication = apiService.deleteJobApplication.bind(apiService)
export const downloadCV = apiService.downloadCV.bind(apiService)
export const exportApplicationsCSV = apiService.exportApplicationsCSV.bind(apiService)
export const getRecruitmentStats = apiService.getRecruitmentStats.bind(apiService)

// Méthodes pour les cours gratuits
export const getCoursGratuits = apiService.getCoursGratuits.bind(apiService)
export const getCoursGratuitsAdmin = apiService.getCoursGratuitsAdmin.bind(apiService)
export const createCoursGratuit = apiService.createCoursGratuit.bind(apiService)
export const updateCoursGratuit = apiService.updateCoursGratuit.bind(apiService)
export const deleteCoursGratuit = apiService.deleteCoursGratuit.bind(apiService)

// Méthode pour Google Login étudiant
export const studentGoogleLogin = apiService.studentGoogleLogin.bind(apiService)

// Exports pour les témoignages
export const getActiveTestimonials = apiService.getActiveTestimonials.bind(apiService)
export const getFeaturedTestimonials = apiService.getFeaturedTestimonials.bind(apiService)
export const submitTestimonial = apiService.submitTestimonial.bind(apiService)
export const getAllTestimonials = apiService.getAllTestimonials.bind(apiService)
export const updateTestimonial = apiService.updateTestimonial.bind(apiService)
export const deleteTestimonial = apiService.deleteTestimonial.bind(apiService)
export const toggleTestimonialStatus = apiService.toggleTestimonialStatus.bind(apiService)
export const getTestimonialStats = apiService.getTestimonialStats.bind(apiService)
