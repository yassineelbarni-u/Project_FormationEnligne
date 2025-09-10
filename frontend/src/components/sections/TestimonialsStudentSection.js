import React, { useState } from "react";
import "../../styles/TestimonialsSection.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';

const initialTestimonials = [
  {
    comment: "J'ai fait les cours en deuxième année en physique moderne et ondes, je peux dire que c'est la seule équipe qui a ouvert l'inscription uniquement dans ces modules spécifique de l'ENSAKECH, Merci beaucoup.",
    name: "Kouatar Lakhder",
    school: "ENSA MARRAKECH",
    rating: 5,
    icon: "👨‍🚀"
  },
  {
    comment: "5/5 Le site est bien organisé avec une équipe est compétente avec des documents de haute qualité et en bref j'ai admiré le travail.",
    name: "Aya El Houadar", 
    school: "ENSA TETOUAN",
    rating: 5,
    icon: "👩‍💻"
  },
  {
    comment: "Meilleurs équipe et meilleur site. Site organisé avec pleins de videos des années précédentes et les lives sont enregistrée avec une grande qualité.",
    name: "Chaymae",
    school: "ENSAJ",
    rating: 5,
    icon: "👩‍🎓"
  }
];

const TestimonialsStudentSection = () => {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [form, setForm] = useState({ comment: "", name: "", school: "", rating: 5 });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.comment && form.name && form.school) {
      const newTestimonial = {
        ...form,
        icon: "👤"
      };
      setTestimonials([newTestimonial, ...testimonials]);
      setForm({ comment: "", name: "", school: "", rating: 5 });
    }
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-header">
        <p className="testimonials-subtitle">TESTIMONIALS</p>
        <h2 className="testimonials-title">Témoignage de nos Étudiants</h2>
      </div>

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
            <SwiperSlide key={idx}>
              <div className="testimonial-card">
                <div className="testimonial-icon">
                  {testimonial.icon}
                </div>
                <p className="testimonial-comment">"{testimonial.comment}"</p>
                <div className="testimonial-rating">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="star">★</span>
                  ))}
                </div>
                <div className="testimonial-author">{testimonial.name}</div>
                <div className="testimonial-school">{testimonial.school}</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <form className="testimonial-form" onSubmit={handleSubmit}>
        <h3>Ajouter votre témoignage</h3>
        <textarea
          name="comment"
          value={form.comment}
          onChange={handleChange}
          placeholder="Votre commentaire..."
          required
        />
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nom et prénom"
          required
        />
        <input
          type="text"
          name="school"
          value={form.school}
          onChange={handleChange}
          placeholder="École (ex: ENSA MARRAKECH)"
          required
        />
        <button type="submit">Publier le témoignage</button>
      </form>
    </section>
  );
};

export default TestimonialsStudentSection;
