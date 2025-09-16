"use client"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"
import apiService from "../../utils/api"
import "./CourseForm.css"

const API_URL = process.env.REACT_APP_API_URL;

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
      const response = await fetch(`${API_URL}/api/admin/courses/${courseId}/upload-image`, {
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
      <div className="course-form-page-modern">
        {/* Header moderne */}
        <div className="form-header-modern">
          <div className="header-content-form-modern">
            <button className="back-btn-modern" onClick={() => navigate("/admin/courses")}>
              ← Retour aux cours
            </button>
            <div className="header-title-modern">
              <div className="header-icon-form-modern">
                {isEdit ? "✏️" : "📚"}
              </div>
              <div className="header-text-form-modern">
                <h1>{isEdit ? "Modifier le Cours" : "Nouveau Cours"}</h1>
                <p>{isEdit ? "Modifiez les informations du cours" : "Créez un nouveau cours avec vos vidéos"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Container principal moderne */}
        <div className="form-container-modern">
          {/* Formulaire principal */}
          <div className="form-section-modern">
            <div className="form-card-modern">
              <div className="form-card-header-modern">
                <h2>Informations du cours</h2>
                <p>Remplissez les détails de votre cours</p>
              </div>

              {error && (
                <div className="error-alert-modern">
                  <div className="error-icon-modern">⚠️</div>
                  <div className="error-content-modern">
                    <strong>Erreur</strong>
                    <p>{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="course-form-modern">
                <div className="form-grid-modern">
                  <div className="form-field-modern span-full">
                    <label htmlFor="title">
                      <span className="label-text-modern">Titre du cours</span>
                      <span className="label-required-modern">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Ex: Mathématiques Niveau Terminale"
                      required
                      className="form-input-modern"
                    />
                  </div>

                  <div className="form-field-modern span-full">
                    <label htmlFor="description">
                      <span className="label-text-modern">Description</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Décrivez le contenu et les objectifs de votre cours..."
                      rows="4"
                      className="form-textarea-modern"
                    />
                  </div>

                  <div className="form-field-modern">
                    <label htmlFor="subject">
                      <span className="label-text-modern">Matière</span>
                      <span className="label-required-modern">*</span>
                    </label>
                    <select 
                      id="subject" 
                      name="subject" 
                      value={formData.subject} 
                      onChange={handleChange} 
                      required
                      className="form-select-modern"
                    >
                      <option value="">Sélectionner une matière</option>
                      {subjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field-modern">
                    <label htmlFor="level">
                      <span className="label-text-modern">Niveau</span>
                      <span className="label-required-modern">*</span>
                    </label>
                    <select 
                      id="level" 
                      name="level" 
                      value={formData.level} 
                      onChange={handleChange} 
                      required
                      className="form-select-modern"
                    >
                      <option value="">Sélectionner un niveau</option>
                      {levels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field-modern span-full">
                    <label htmlFor="image">
                      <span className="label-text-modern">Image du cours</span>
                    </label>
                    <div className="image-upload-modern">
                      <input 
                        type="file" 
                        id="image" 
                        name="image" 
                        accept="image/*" 
                        onChange={handleImageChange}
                        className="form-input-file-modern"
                      />
                      <div className="image-upload-help-modern">
                        Sélectionnez une image depuis votre ordinateur (JPG, PNG, GIF)
                      </div>
                      {imagePreview && (
                        <div className="image-preview-modern">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Aperçu du cours"
                            className="preview-image-modern"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-field-modern span-full">
                    <label htmlFor="drive_folder_id">
                      <span className="label-text-modern">ID Dossier Google Drive</span>
                    </label>
                    <input
                      type="text"
                      id="drive_folder_id"
                      name="drive_folder_id"
                      value={formData.drive_folder_id}
                      onChange={handleChange}
                      placeholder="1ABCxyz123... (optionnel)"
                      className="form-input-modern"
                    />
                    <div className="field-hint-modern">
                      L'ID du dossier Google Drive contenant vos vidéos (partie après "/folders/" dans l'URL)
                    </div>
                  </div>
                </div>

                <div className="form-actions-modern">
                  <button 
                    type="button" 
                    className="btn-secondary-modern" 
                    onClick={() => navigate("/admin/courses")}
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary-form-modern" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="btn-spinner-modern"></span>
                        Sauvegarde...
                      </>
                    ) : (
                      isEdit ? "Modifier le cours" : "Créer le cours"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Panneau d'information */}
          {!isEdit && (
            <div className="info-section-modern">
              <div className="info-card-modern">
                <div className="info-header-modern">
                  <div className="info-icon-modern">📋</div>
                  <h3>Étapes suivantes</h3>
                </div>
                <div className="info-content-modern">
                  <div className="steps-modern">
                    <div className="step-modern">
                      <div className="step-number-modern">1</div>
                      <div className="step-content-modern">
                        <strong>Créer le cours</strong>
                        <p>Remplir les informations de base</p>
                      </div>
                    </div>
                    <div className="step-modern">
                      <div className="step-number-modern">2</div>
                      <div className="step-content-modern">
                        <strong>Ajouter des vidéos</strong>
                        <p>Importer vos vidéos Google Drive</p>
                      </div>
                    </div>
                    <div className="step-modern">
                      <div className="step-number-modern">3</div>
                      <div className="step-content-modern">
                        <strong>Gérer les accès</strong>
                        <p>Donner accès aux étudiants</p>
                      </div>
                    </div>
                    <div className="step-modern">
                      <div className="step-number-modern">4</div>
                      <div className="step-content-modern">
                        <strong>Partager</strong>
                        <p>Distribuer le code d'accès</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default CourseForm
