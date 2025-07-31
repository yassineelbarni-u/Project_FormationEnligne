"use client"

/**
 * Hook personnalisé pour l'authentification
 */

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { authAPI } from "../utils/api"

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token")
      const userData = localStorage.getItem("user")

      if (!token) {
        setIsLoading(false)
        return
      }

      if (userData) {
        setUser(JSON.parse(userData))
      }

      // Vérifier avec le backend
      await authAPI.verify()
    } catch (error) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password)
      if (data.access_token) {
        localStorage.setItem("token", data.access_token)
        localStorage.setItem("user", JSON.stringify(data.user))
        setUser(data.user)
        return { success: true }
      }
      return { success: false, error: data.detail }
    } catch (error) {
      return { success: false, error: "Erreur de connexion" }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    navigate("/login")
  }

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  }
}

// Ajouter après le hook useAuth
export const AuthProvider = ({ children }) => {
  return <>{children}</>
}
