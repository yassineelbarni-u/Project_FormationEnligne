"use client"

import { useState, useEffect } from "react"
import { getCoursGratuits } from "../../utils/api"
import "./CoursGratuits.css"

const CoursGratuits = () => {
  const [cours, setCours] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchCours()
  }, [])

  const fetchCours = async () => {
    try {
      setLoading(true)
  const response = await getCoursGratuits()
  setCours(Array.isArray(response) ? response : [])
    } catch (error) {
      console.error("Erreur lors du chargement des cours:", error)
      setCours([])
    } finally {
      setLoading(false)
    }
  }

  const filteredCours = cours.filter((coursItem) => {
    const matchesCategory = selectedCategory === "all" || coursItem.category === selectedCategory
    const matchesSearch =
      coursItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (coursItem.description && coursItem.description.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  if (loading) {
    return (
      <div className="cours-gratuits-page">
        <div className="loading">Chargement des cours gratuits...</div>
      </div>
    )
  }

  return (
    <div className="cours-gratuits-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Cours et Concours Gratuits</h1>
          <p>Découvrez notre collection de ressources éducatives gratuites</p>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher un cours..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filters">
          <button className={selectedCategory === "all" ? "active" : ""} onClick={() => setSelectedCategory("all")}>
            Tous
          </button>
          <button className={selectedCategory === "cours" ? "active" : ""} onClick={() => setSelectedCategory("cours")}>
            Cours
          </button>
          <button
            className={selectedCategory === "concours" ? "active" : ""}
            onClick={() => setSelectedCategory("concours")}
          >
            Concours
          </button>
        </div>
      </div>

      <div className="cours-grid">
        {filteredCours.length > 0 ? (
          filteredCours.map((coursItem) => (
            <div key={coursItem.id} className="cours-card">
              <div className="cours-header">
                <h3>{coursItem.title}</h3>
                <span className={`category-tag ${coursItem.category}`}>
                  {coursItem.category === "cours" ? "Cours" : "Concours"}
                </span>
              </div>

              {coursItem.description && <p className="cours-description">{coursItem.description}</p>}

              <div className="cours-footer">
                <span className="cours-date">Ajouté le {new Date(coursItem.created_at).toLocaleDateString()}</span>
                <a href={coursItem.url} target="_blank" rel="noopener noreferrer" className="access-btn">
                  Accéder au contenu
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            {searchTerm || selectedCategory !== "all"
              ? "Aucun cours ne correspond à vos critères de recherche."
              : "Aucun cours gratuit disponible pour le moment."}
          </div>
        )}
      </div>
    </div>
  )
}

export default CoursGratuits
