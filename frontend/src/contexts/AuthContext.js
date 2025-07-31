"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import api from "../utils/api" // Assurez-vous que le chemin est correct

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [loading, setLoading] = useState(true) // Pour gérer l'état de chargement initial

  const login = useCallback(async (token, userData) => {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
    setIsAuthenticated(true)
    setIsSuperAdmin(userData.is_super_admin || false)
  }, [])

  const studentLogin = useCallback(async (token, studentData) => {
    localStorage.setItem("student_token", token)
    localStorage.setItem("student_user", JSON.stringify(studentData))
    setUser(studentData) // Utiliser le même état user pour l'étudiant
    setIsAuthenticated(true)
    setIsSuperAdmin(false) // Les étudiants ne sont pas super admins
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("student_token") // Supprimer aussi le token étudiant
    localStorage.removeItem("student_user") // Supprimer aussi les données étudiant
    setUser(null)
    setIsAuthenticated(false)
    setIsSuperAdmin(false)
  }, [])

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("token")
      const studentToken = localStorage.getItem("student_token")

      if (token) {
        try {
          const response = await api.auth.getAdminMe() // Utiliser la nouvelle API pour récupérer les infos complètes
          if (response) {
            setUser(response)
            setIsAuthenticated(true)
            setIsSuperAdmin(response.is_super_admin || false)
          } else {
            logout()
          }
        } catch (error) {
          console.error("Admin token verification failed:", error)
          logout()
        }
      } else if (studentToken) {
        try {
          const response = await api.auth.getStudentMe()
          if (response) {
            setUser(response)
            setIsAuthenticated(true)
            setIsSuperAdmin(false) // Les étudiants ne sont pas super admins
          } else {
            logout()
          }
        } catch (error) {
          console.error("Student token verification failed:", error)
          logout()
        }
      } else {
        setIsAuthenticated(false)
        setIsSuperAdmin(false)
      }
      setLoading(false)
    }

    verifyAuth()
  }, [logout]) // Dépendance à logout pour éviter les boucles infinies

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isSuperAdmin,
        loading,
        login,
        studentLogin,
        logout,
        setUser, // Permettre de mettre à jour l'utilisateur depuis l'extérieur si nécessaire
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
