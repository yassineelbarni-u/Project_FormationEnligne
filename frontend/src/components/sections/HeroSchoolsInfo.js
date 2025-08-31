import React, { useEffect, useRef } from 'react';
import '../../styles/HeroSchoolsInfo.css';

const schools = [
  'EMI', 'ECC', 'EHTP', 'ENSIAS', 'ENSEM', 'ENSMR', 'INPT', 'ENSAM', 'ENSA', 'ENSET', 'ISEM', 'ENSIASD', 'ENIAD', 'ESITH'
];

const HeroSchoolsInfo = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const top = sectionRef.current.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) {
          sectionRef.current.classList.add('visible');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="hero-schools-info">
      <div className="schools-list">
        <p>
          Cours de soutien en ligne spécialisés en Sciences (Mathématiques, Physique-Chimie, Informatique)
          pour les étudiants des écoles d’ingénieurs et universités au Maroc :
        </p>
        <div className="schools-animation">
          {schools.map((school, idx) => (
            <span key={school} className="school-name">{school}{idx < schools.length - 1 ? ',' : ''} </span>
          ))}
        </div>
      </div>
      <div className="prep-animation">
        <span className="prep-text">Meilleure préparation aux concours d'intégration des grandes écoles d'ingénierie et établissements supérieurs.</span>
      </div>
    </section>
  );
};

export default HeroSchoolsInfo;
