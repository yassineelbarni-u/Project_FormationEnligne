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

// Import pages étudiantes
import StudentLogin from "./pages/student/StudentLogin"
import StudentDashboard from "./pages/student/StudentDashboard"
import CourseView from "./pages/student/CourseView"

// Composant de protection des routes admin
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token")
  return token ? children : <Navigate to="/login" />
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

          {/* Gestion des vidéos (ancienne page) */}
          <Route
            path="/admin/videos"
            element={
              <ProtectedRoute>
                <Videos />
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
