import React, { useState, useEffect, useCallback } from "react";
import "../../styles/TestimonialsSection.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import { getActiveTestimonials, submitTestimonial } from "../../utils/api";

const TestimonialsStudentSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState({ comment: "", nom: "", ecole: "", rating: 5 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const loadTestimonials = useCallback(async () => {
    try {
      const data = await getActiveTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error("Backend non accessible, utilisation des données locales:", error);
      // Données locales de secours
      setTestimonials([
        {
          id: 'demo1',
          nom: "Kouatar Lakhder",
          ecole: "ENSA MARRAKECH", 
          comment: "J'ai fait les cours en deuxième année en physique moderne et ondes, je peux dire que c'est la seule équipe qui a ouvert l'inscription uniquement dans ces modules spécifique de l'ENSAKECH, Merci beaucoup.",
          rating: 5,
          created_at: new Date().toISOString()
        },
        {
          id: 'demo2',
          nom: "Aya El Houadar",
          ecole: "ENSA TETOUAN",
          comment: "5/5 Le site est bien organisé avec une équipe est compétente avec des documents de haute qualité et en bref j'ai admiré le travail.",
          rating: 5,
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Charger les témoignages depuis le backend
  useEffect(() => {
    loadTestimonials();
  }, [loadTestimonials]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.comment || !form.nom || !form.ecole) {
      setMessage("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      // Ajouter immédiatement le nouveau témoignage à la liste (pour affichage immédiat)
      const newTestimonial = {
        id: Date.now(),
        nom: form.nom,
        ecole: form.ecole,
        comment: form.comment,
        rating: form.rating,
        created_at: new Date().toISOString()
      };
      
      // Ajouter en tête de liste pour qu'il soit visible immédiatement
      setTestimonials(prev => [newTestimonial, ...prev]);
      setForm({ comment: "", nom: "", ecole: "", rating: 5 });

      try {
        const response = await submitTestimonial({
          nom: newTestimonial.nom,
          ecole: newTestimonial.ecole,
          comment: newTestimonial.comment,
          rating: newTestimonial.rating
        });

        setMessage(response.message || "Témoignage publié avec succès !");
        
        // Mettre à jour l'ID avec celui du backend
        setTestimonials(prev => prev.map(t => 
          t.id === newTestimonial.id 
            ? { ...t, id: response.testimonial_id }
            : t
        ));
        
      } catch (backendError) {
        console.log("Sauvegarde backend échoué, témoignage conservé localement", backendError);
        setMessage("Témoignage ajouté ! (Sauvegarde locale en attendant le serveur)");
      }
      
    } catch (error) {
      setMessage("Erreur lors de l'ajout du témoignage. Veuillez réessayer.");
      console.error("Erreur:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-header">
        <p className="testimonials-subtitle">TESTIMONIALS</p>
        <h2 className="testimonials-title">Témoignage de nos Étudiants</h2>
      </div>

      {isLoading ? (
        <div className="testimonials-loading">
          <div className="loading-spinner"></div>
          <p>Chargement des témoignages...</p>
        </div>
      ) : (
        <div className="testimonials-carousel">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            pagination={{ 
              clickable: true,
              dynamicBullets: true 
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { 
                slidesPerView: 1,
                spaceBetween: 20 
              },
              900: { 
                slidesPerView: 2,
                spaceBetween: 30 
              },
              1200: { 
                slidesPerView: 3,
                spaceBetween: 30 
              },
            }}
            style={{ paddingBottom: '60px' }}
          >
            {testimonials.map((testimonial, idx) => (
              <SwiperSlide key={testimonial.id || idx}>
                <div className="testimonial-card">
                  <div className="testimonial-icon">
                    📚
                  </div>
                  <p className="testimonial-comment">"{testimonial.comment}"</p>
                  <div className="testimonial-rating">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <span key={i} className="star">★</span>
                    ))}
                  </div>
                  <div className="testimonial-author">{testimonial.nom}</div>
                  <div className="testimonial-school">{testimonial.ecole}</div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      <form className="testimonial-form" onSubmit={handleSubmit}>
        <h3>Ajouter votre témoignage</h3>
        
        {message && (
          <div className={`form-message ${message.includes("succès") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        <textarea
          name="comment"
          value={form.comment}
          onChange={handleChange}
          placeholder="Votre commentaire..."
          required
          disabled={isSubmitting}
        />
        <input
          type="text"
          name="nom"
          value={form.nom}
          onChange={handleChange}
          placeholder="Nom et prénom"
          required
          disabled={isSubmitting}
        />
        <input
          type="text"
          name="ecole"
          value={form.ecole}
          onChange={handleChange}
          placeholder="École (ex: ENSA MARRAKECH)"
          required
          disabled={isSubmitting}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Publication en cours..." : "Publier le témoignage"}
        </button>
      </form>
    </section>
  );
};

export default TestimonialsStudentSection;
