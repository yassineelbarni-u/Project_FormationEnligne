"use client"

import { useState, useEffect } from "react"
import Header from "../../components/common/Header"
import Footer from "../../components/common/Footer"
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
    const matchesCategory = selectedCategory === "all" || coursItem.category === selectedCategory;
    const matchesSearch =
      coursItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (coursItem.description && coursItem.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="cours-gratuits-page">
      <Header />
      <main className="main-content">
        <div className="container">
          <div className="page-header">
            <h1>Cours et Concours Gratuits</h1>
            <p>Découvrez notre collection de ressources éducatives gratuites</p>
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
              <button className={selectedCategory === "all" ? "active" : ""} onClick={() => setSelectedCategory("all")}>Tous</button>
              <button className={selectedCategory === "cours" ? "active" : ""} onClick={() => setSelectedCategory("cours")}>Cours</button>
              <button className={selectedCategory === "concours" ? "active" : ""} onClick={() => setSelectedCategory("concours")}>Concours</button>
            </div>
          </div>
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Chargement des cours gratuits...</p>
            </div>
          ) : filteredCours.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <span className="material-symbols-outlined">school</span>
              </div>
              <h3>Aucun cours gratuit disponible</h3>
              <p>Revenez bientôt pour découvrir de nouveaux contenus</p>
            </div>
          ) : (
            <div className="cours-grid">
              {filteredCours.map((coursItem) => (
                <div key={coursItem.id} className="cours-card">
                  <div className="cours-header">
                    <h3 className="cours-title">{coursItem.title}</h3>
                    <span className={`category-tag ${coursItem.category}`}>{coursItem.category === "cours" ? "Cours" : "Concours"}</span>
                  </div>
                  {coursItem.description && <p className="cours-description">{coursItem.description}</p>}
                  <div className="cours-footer">
                    <span className="cours-date">Ajouté le {new Date(coursItem.created_at).toLocaleDateString()}</span>
                    <a href={coursItem.url} target="_blank" rel="noopener noreferrer" className="access-btn">Accéder au contenu</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
  
}

export default CoursGratuits
