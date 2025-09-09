import React, { useState } from "react";
import "../../styles/TestimonialsSection.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

const initialTestimonials = [
  {
    comment: "Meilleurs équipe et meilleur site. Site organisé avec pleins de videos des années précédentes et les lives sont enregistrée avec une grande qualité.",
    name: "Chaymae",
    school: "ENSAJ",
    rating: 5
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
      setTestimonials([form, ...testimonials]);
      setForm({ comment: "", name: "", school: "", rating: 5 });
    }
  };

  return (
    <section className="testimonials-section">
      <h2 className="testimonials-title">Témoignage de nos étudiants</h2>
      <Swiper
        modules={[Pagination]}
        spaceBetween={32}
        slidesPerView={1}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 1 },
          900: { slidesPerView: 2 },
          1200: { slidesPerView: 3 },
        }}
        style={{ paddingBottom: '40px' }}
      >
        {testimonials.map((t, idx) => (
          <SwiperSlide key={idx}>
            <div className="testimonial-card">
              <p>{t.comment}</p>
              <div className="testimonial-rating">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} style={{ color: "#f7b731", fontSize: "20px" }}>★</span>
                ))}
              </div>
              <div className="testimonial-author">
                <strong>{t.name}</strong>
                <div className="testimonial-school">{t.school}</div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <form className="testimonial-form" onSubmit={handleSubmit}>
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
          placeholder="École"
          required
        />
        <button type="submit">Commenter</button>
      </form>
    </section>
  );
};

export default TestimonialsStudentSection;
