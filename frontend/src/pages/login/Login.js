"use client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import apiService from "../../utils/api"
import styles from "./Login.module.css" 



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
      const data = await apiService.login(formData)
      
      localStorage.setItem("token", data.access_token)
      
      // Récupérer les informations de l'utilisateur avec le token
      const userData = await apiService.request("/api/auth/me", {
        auth: true 
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
            <h1 className={styles.title}>El-earning by Ilyas</h1>
            <p className={styles.subtitle}>Connectez-vous pour accéder au tableau de bord</p>
          </div>
          
          {error && (
            <div className={styles.error}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {error}
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="email">Adresse email</label>
              <div className={styles.inputWrapper}>
                <svg
                  className={styles.inputIcon}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  className={styles.input}
                  id="email"
                  type="email"
                  name="email"
                  placeholder="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="password">Mot de passe</label>
              <div className={styles.inputWrapper}>
                <svg
                  className={styles.inputIcon}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <circle cx="12" cy="16" r="1" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  className={styles.input}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                
              </div>
            </div>

            <button type="submit" className={styles.button} disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg
                    style={{ animation: 'spin 1s linear infinite' }}
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 12a9 9 0 11-6.219-8.56" />
                  </svg>
                  Connexion en cours...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10,17 15,12 10,7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  Se connecter
                </>
              )}
            </button>

          </form>

          {/* <div className={styles.forgotLink}>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Fonctionnalité en développement'); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Mot de passe oublié ?
            </a>
          </div> */}

          {/* <div className={styles.testCredentials}>
            <h3>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              Identifiants de test
            </h3>
            <div className={styles.credentialRow}>
              <span className={styles.credentialLabel}>Email:</span>
              <span className={styles.credentialValue}>admin@ilyasnahi.com</span>
            </div>
            <div className={styles.credentialRow}>
              <span className={styles.credentialLabel}>Mot de passe:</span>
              <span className={styles.credentialValue}>admin123</span>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default Login
