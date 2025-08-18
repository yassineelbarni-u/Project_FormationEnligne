"use client"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"
import apiService from "../../utils/api"
import "./CourseForm.css"

const CourseForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    level: "",
    drive_folder_id: "",
    image_filename: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState("")

  const subjects = ["Mathématiques", "Physique", "Chimie", "Biologie", "Informatique", "Autre"]
  const levels = ["Débutant", "Intermédiaire", "Avancé"]

  useEffect(() => {
    if (isEdit) {
      fetchCourse()
    }
  }, [id, isEdit])

  const fetchCourse = async () => {
    try {
      const course = await apiService.getCourse(id)
      setFormData({
        title: course.title || "",
        description: course.description || "",
        subject: course.subject || "",
        level: course.level || "",
        drive_folder_id: course.drive_folder_id || "",
        image_filename: course.image_filename || "",
      })
      if (course.image_url) {
        setImagePreview(course.image_url)
      }
    } catch (err) {
      console.error("Erreur lors du chargement du cours:", err)
      setError("Erreur lors du chargement du cours.")
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      setFormData({
        ...formData,
        image_filename: file.name,
      })

      // Créer un aperçu de l'image
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (courseId) => {
    if (!selectedImage) return;
    
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);
      
      const response = await fetch(`http://localhost:8001/api/admin/courses/${courseId}/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement de l\'image');
      }
      
      console.log('Image téléchargée avec succès');
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      let course
      if (isEdit) {
        course = await apiService.updateCourse(id, formData)
        if (selectedImage) {
          await uploadImage(course.id);
        }
        alert("Cours modifié avec succès !")
      } else {
        course = await apiService.createCourse(formData)
        if (selectedImage) {
          await uploadImage(course.id);
        }
        alert("Cours créé avec succès !")
      }

      navigate(`/admin/courses/${course.id}/videos`)
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message || "Erreur lors de la sauvegarde"
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="course-form-page">
        <div className="form-header">
          <button className="back-btn" onClick={() => navigate("/admin/courses")}>
            ← Retour aux cours
          </button>
          <h1>{isEdit ? "Modifier le Cours" : "Nouveau Cours"}</h1>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="course-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="title">Titre du cours *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Mathématiques Niveau 1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description du cours..."
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Image du cours</label>
              <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} />
              <small className="form-help">
                Sélectionnez une image depuis votre dossier local (formats: JPG, PNG, GIF)
              </small>
              {imagePreview && (
                <div className="image-preview">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Aperçu"
                    style={{ maxWidth: "200px", maxHeight: "150px", marginTop: "10px" }}
                  />
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="subject">Matière *</label>
                <select id="subject" name="subject" value={formData.subject} onChange={handleChange} required>
                  <option value="">Sélectionner une matière</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="level">Niveau *</label>
                <select id="level" name="level" value={formData.level} onChange={handleChange} required>
                  <option value="">Sélectionner un niveau</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="drive_folder_id">ID Dossier Google Drive (optionnel)</label>
              <input
                type="text"
                id="drive_folder_id"
                name="drive_folder_id"
                value={formData.drive_folder_id}
                onChange={handleChange}
                placeholder="1ABCxyz123..."
              />
              <small className="form-help">
                L'ID du dossier Google Drive contenant vos vidéos (partie après "/folders/" dans l'URL)
              </small>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => navigate("/admin/courses")}>
                Annuler
              </button>
              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? "Sauvegarde..." : isEdit ? "Modifier" : "Créer le cours"}
              </button>
            </div>
          </form>

          {!isEdit && (
            <div className="form-info">
              <h3>📋 Étapes suivantes :</h3>
              <ol>
                <li>✅ Créer le cours</li>
                <li>🎥 Ajouter des vidéos depuis Google Drive</li>
                <li>👥 Donner accès aux étudiants</li>
                <li>🔗 Partager le lien ou code d'accès</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default CourseForm
