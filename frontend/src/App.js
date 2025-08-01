import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

// Importer d'abord les styles globaux pour que les styles spécifiques aux composants puissent les surcharger
import "./styles/globals.css"
import "./App.css"

// Ensuite importer les composants
import Home from "./pages/home/Home"
import Login from "./pages/login/Login"
import Dashboard from "./pages/admin/Dashboard"
import Courses from "./pages/admin/Courses"
import CourseForm from "./pages/admin/CourseForm"
import CourseVideos from "./pages/admin/CourseVideos"
import Videos from "./pages/admin/Videos"
import Students from "./pages/admin/Students"
import StudentsInvite from "./pages/admin/StudentsInvite"
import Accesses from "./pages/admin/Accesses"
import AccessNew from "./pages/admin/AccessNew"
import AdminManagement from "./pages/admin/AdminManagement"

// Import pages étudiantes
import StudentLogin from "./pages/student/StudentLogin"
import StudentDashboard from "./pages/student/StudentDashboard"
import CourseView from "./pages/student/CourseView"

// Composant de protection des routes admin
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token")
  return token ? children : <Navigate to="/login" />
}

// 🆕 Composant de protection pour les super admins uniquement
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

// Composant de protection des routes étudiantes (séparé de l'admin)
const ProtectedStudentRoute = ({ children }) => {
  const studentToken = localStorage.getItem("student_token")
  return studentToken ? children : <Navigate to="/student/login" />
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

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

          {/* 🆕 Gestion des admins - Réservé aux super admins */}
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
  )
}

export default App
