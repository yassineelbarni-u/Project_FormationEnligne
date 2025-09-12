"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { GoogleLogin } from '@react-oauth/google'
import apiService from "../../utils/api"
import styles from "./StudentLogin.module.css" 

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

  // ✅ CORRIGÉ : Gestion du succès Google
  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true)
    setError("")

    try {
      console.log("🔍 Credential reçu:", credentialResponse.credential?.substring(0, 50) + "...")
      
      // ✅ Envoi vers l'API corrigée
      const data = await apiService.studentGoogleLogin(credentialResponse.credential)
      
      console.log("✅ Réponse API:", data)
      
      localStorage.setItem("student_token", data.access_token)
      localStorage.setItem("student_user", JSON.stringify(data.user))

      console.log("✅ Redirection vers dashboard...")
      navigate("/student/dashboard")
      
    } catch (error) {
      console.error("❌ Erreur Google Login:", error)
      
      if (error.message.includes("Failed to fetch")) {
        setError("❌ Impossible de se connecter au serveur. Vérifiez que le backend est démarré.")
      } else if (error.message.includes("Email non autorisé")) {
        setError("❌ Votre email n'est pas autorisé. Contactez votre formateur.")
      } else if (error.message.includes("Aucun cours accessible")) {
        setError("❌ Vous n'avez accès à aucun cours. Contactez votre formateur.")
      } else {
        setError(error.message || "❌ Erreur lors de la connexion Google")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleError = () => {
    console.error("❌ Erreur Google OAuth")
    setError("❌ Échec de la connexion Google. Veuillez réessayer.")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const data = await apiService.studentLogin(formData)

      localStorage.setItem("student_token", data.access_token)
      localStorage.setItem("student_user", JSON.stringify(data.user))

      navigate("/student/dashboard")
    } catch (error) {
      if (error.message.includes("Failed to fetch")) {
        setError("❌ Impossible de se connecter au serveur")
      } else {
        setError(error.message || "❌ Email ou code d'accès incorrect")
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

          {/* Séparateur */}
          <div className={styles.separator}>
            <span>ou</span>
          </div>

          {/* ✅ Bouton Google Sign-In avec gestion d'erreur */}
          <div className={styles.googleSection}>
            {isLoading ? (
              <div className={styles.loadingGoogle}>
                <span>Connexion Google en cours...</span>
              </div>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="continue_with"
                shape="rectangular"
                theme="outline"
                size="large"
                locale="fr"
                useOneTap={false}
                auto_select={false}
              />
            )}
          </div>

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
