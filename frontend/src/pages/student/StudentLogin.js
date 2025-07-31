"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./StudentLogin.module.css" // Import en tant que module CSS

const BACKEND_URL = "http://localhost:8001"

const StudentLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    access_code: "",
  })
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
      const response = await fetch(`${BACKEND_URL}/api/student/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Erreur de connexion")
      }

      const data = await response.json()

      // Stocker le token et les infos utilisateur
      localStorage.setItem("student_token", data.access_token)
      localStorage.setItem("student_user", JSON.stringify(data.user))

      // Rediriger vers l'espace étudiant
      navigate("/student/dashboard")
    } catch (error) {
      if (error.message.includes("Failed to fetch")) {
        setError(`❌ Impossible de se connecter au serveur`)
      } else {
        setError(error.message || "Email ou code d'accès incorrect")
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
            <button onClick={() => navigate("/")} className={styles.backButton}>
              ← Retour à l'accueil
            </button>
            <div className={styles.welcomeSection}>
              <h1>Bienvenue,</h1>
              <p>Se connecter et accéder à votre espace étudiant.</p>
            </div>
          </div>


          {error && <div className={styles.error}>{error}</div>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Votre adresse email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Code d'accès</label>
              <input
                type="text"
                name="access_code"
                placeholder="Code d'accès du cours (ex: PAD22ZUQ)"
                value={formData.access_code}
                onChange={handleChange}
                required
              />
             
            </div>

            <button type="submit" className={styles.button} disabled={isLoading}>
              {isLoading ? "Connexion..." : "Se Connecter"}
            </button>

          
          </form>

          <div className={styles.helpSection}>
            <div className={styles.helpCard}>
              <span className={styles.helpIcon}>❓</span>
              <div>
                <strong>Besoin d'aide ?</strong>
                <p>Contactez votre formateur pour obtenir votre code d'accès</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentLogin
