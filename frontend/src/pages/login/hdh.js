"use client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import apiService from "../../utils/api"
import styles from "./Login.module.css" // Import en tant que module CSS

const Login = () => {
  const [formData, setFormData] = useState({
    email: "admin@ilyasnahi.com",
    password: "admin123",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Utilisation de apiService pour le login
      const data = await apiService.login(formData)
      
      // Stocker le token
      localStorage.setItem("token", data.access_token)
      
      // Récupérer les informations de l'utilisateur avec le token
      const userData = await apiService.request("/api/auth/me", {
        auth: true // Active l'authentification via token
      })
      
      localStorage.setItem("user", JSON.stringify(userData))

      // Rediriger vers le dashboard admin
      navigate("/admin/dashboard")
    } catch (error) {
      if (error.message.includes("Failed to fetch")) {
        setError(`❌ Impossible de se connecter au serveur. Vérifiez que le backend est démarré`)
      } else {
        setError(error.message || "Email ou mot de passe incorrect")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.background}>
        <div className={styles.backgroundPattern}></div>
      </div>

      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <button onClick={() => navigate("/")} style={{marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6" />
              </svg>
              Retour à l'accueil
            </button>

            <div className={styles.logo}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="m2 17 10 5 10-5" />
                <path d="m2 12 10 5 10-5" />
              </svg>
            </div>
            <h