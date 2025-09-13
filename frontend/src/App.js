import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { GoogleOAuthProvider } from '@react-oauth/google'
import "./styles/globals.css"
// import "./styles/recruitment.css"

import "./App.css"

// Ensuite importer les composants
import Home from "./pages/home/Home"
import AnnonceCoursePage from "./pages/courses/AnnonceCourse"
import Login from "./pages/login/Login"
import Dashboard from "./pages/admin/Dashboard"
import Courses from "./pages/admin/Courses"
import CourseForm from "./pages/admin/CourseForm"
import CourseVideos from "./pages/admin/CourseVideos"
import Students from "./pages/admin/Students"
import StudentsInvite from "./pages/admin/StudentsInvite"
import StudentForm from "./pages/admin/StudentForm"
import Accesses from "./pages/admin/Accesses"
import AccessNew from "./pages/admin/AccessNew"
import AccessForm from "./pages/admin/AccessForm"
import AdminManagement from "./pages/admin/AdminManagement"
import AdminTestimonials from "./pages/admin/AdminTestimonials"
import AnnouncementManagement from "./pages/admin/AnnouncementManagement"
import CoursGratuits from "./pages/CoursGratuits/CoursGratuits"
import GestionCoursGratuit from "./pages/admin/GestionCoursGratuit"

import RecruitmentManagement from "./pages/admin/RecruitmentManagement"
import ApplicationsManagement from "./pages/admin/ApplicationsManagement"
import JobOffers from "./pages/recruitment/JobOffers"
import JobApplication from "./pages/recruitment/JobApplication"
import JobApplicationSuccess from "./pages/recruitment/JobApplicationSuccess"

import StudentLogin from "./pages/student/StudentLogin"
import StudentDashboard from "./pages/student/StudentDashboard"
import CourseView from "./pages/student/CourseView"

// Composant de protection des routes admin
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token")
  return token ? children : <Navigate to="/login" />
}

const SuperAdminRoute = ({ children }) => {
  const token = localStorage.getItem("token")
  const userData = localStorage.getItem("user")

  if (!token) {
    return <Navigate to="/login" />
  }

  if (userData) {
    const user = JSON.parse(userData)
    if (!user.is_super_admin) {
      return <Navigate to="/admin/dashboard" />
    }
  }

  return children
}

const ProtectedStudentRoute = ({ children }) => {
  const studentToken = localStorage.getItem("student_token")
  return studentToken ? children : <Navigate to="/student/login" />
}

function App() {
  return (
    <GoogleOAuthProvider clientId="293729859360-8ngho0jc2i0c2bnomus1b6pfrectl157.apps.googleusercontent.com">
      <Router>
        <div className="App">
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<AnnonceCoursePage />} />
            <Route path="/cours-gratuits" element={<CoursGratuits />} />
            <Route path="/login" element={<Login />} />

          <Route path="/recruitment" element={<JobOffers />} />
          <Route path="/recruitment/offer/:jobId" element={<JobOffers />} />
          <Route path="/recruitment/apply/:jobId" element={<JobApplication />} />
          <Route path="/recruitment/application-success" element={<JobApplicationSuccess />} />

          {/* Routes admin protégées */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Gestion des cours */}
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses/new"
            element={
              <ProtectedRoute>
                <CourseForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses/:id/edit"
            element={
              <ProtectedRoute>
                <CourseForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses/:courseId/videos"
            element={
              <ProtectedRoute>
                <CourseVideos />
              </ProtectedRoute>
            }
          />
          
          {/* Gestion des cours gratuits - Réservé aux super admins */}
          <Route
            path="/admin/cours-gratuits"
            element={
              <SuperAdminRoute>
                <GestionCoursGratuit />
              </SuperAdminRoute>
            }
          />

          {/* Gestion des étudiants */}
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute>
                <Students />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students/invite"
            element={
              <ProtectedRoute>
                <StudentsInvite />
              </ProtectedRoute>
            }
          />
          {/* Routes pour le formulaire d'étudiant */}
          <Route
            path="/admin/students/new"
            element={
              <ProtectedRoute>
                <StudentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students/:id/edit"
            element={
              <ProtectedRoute>
                <StudentForm />
              </ProtectedRoute>
            }
          />

          {/* Gestion des accès */}
          <Route
            path="/admin/accesses"
            element={
              <ProtectedRoute>
                <Accesses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/accesses/new"
            element={
              <ProtectedRoute>
                <AccessNew />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/accesses/:id/edit"
            element={
              <ProtectedRoute>
                <AccessForm />
              </ProtectedRoute>
            }
          />

          {/* Gestion des admins aux super admins */}
          <Route
            path="/admin/manage-admins"
            element={
              <SuperAdminRoute>
                <AdminManagement />
              </SuperAdminRoute>
            }
          />
          <Route
            path="/admin/manage-admins/:id/edit"
            element={
              <SuperAdminRoute>
                <AdminManagement />
              </SuperAdminRoute>
            }
          />

          {/* Gestion des témoignages */}
          <Route
            path="/admin/testimonials"
            element={
              <SuperAdminRoute>
                <AdminTestimonials />
              </SuperAdminRoute>
            }
          />

          <Route
            path="/admin/announcements"
            element={
              <SuperAdminRoute>
                <AnnouncementManagement />
              </SuperAdminRoute>
            }
          />

          <Route
            path="/admin/recruitment"
            element={
              <SuperAdminRoute>
                <RecruitmentManagement />
              </SuperAdminRoute>
            }
          />
          <Route
            path="/admin/applications"
            element={
              <SuperAdminRoute>
                <ApplicationsManagement />
              </SuperAdminRoute>
            }
          />

          {/* Routes étudiantes */}
          <Route path="/student/login" element={<StudentLogin />} />
          <Route
            path="/student/dashboard"
            element={
              <ProtectedStudentRoute>
                <StudentDashboard />
              </ProtectedStudentRoute>
            }
          />
          <Route
            path="/student/course/:courseId"
            element={
              <ProtectedStudentRoute>
                <CourseView />
              </ProtectedStudentRoute>
            }
          />

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
    </GoogleOAuthProvider>
  )
}

export default App
