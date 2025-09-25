import Header from "../../components/common/Header"
import HeroSection from "../../components/sections/HeroSection"
import HeroSchoolsInfo from "../../components/sections/HeroSchoolsInfo"
import AnnonceSection from "../../components/sections/AnnonceSection"
import WhyChooseUsSection from "../../components/sections/WhyChooseUsSection"
// import ServicesSection from "../../components/sections/ServicesSection"
import FeedbackGallery from "../../components/sections/FeedbackGallery"
import VideoSection from "../../components/sections/VideoSection"
import FAQSection from "../../components/sections/FAQSection"
import ContactSection from "../../components/sections/ContactSection"
import Footer from "../../components/common/Footer"
import ReseauxSection from "../../components/sections/ReseauxSection"
import ScreenshotsSection from "../../components/sections/ScreenshotsSection"

import PymntCompteCIH from "../../components/sections/PymntCompteCIH"
import PymentSection from "../../components/sections/PymentSection"
import TestimonialsStudentSection from "../../components/sections/TestimonialsStudentSection"
import VideoSectionInscription from "../../components/sections/VideoSectionInscription"


const Home = () => {
  return (
    <div className="home">
      {/* Ajout du balisage JSON-LD pour le logo */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "E-learning by Ilyas",
          "url": "https://e-learning-by-ilyas.com",
          "logo": "https://e-learning-by-ilyas.com/assets/logo-112.png",
          "sameAs": [
            "https://www.facebook.com/...",
            "https://www.youtube.com/@..."
          ]
        })}
      </script>
      <Header />
      <HeroSection />
      <HeroSchoolsInfo />
      <AnnonceSection />
      <ScreenshotsSection />
      <WhyChooseUsSection />
      <FeedbackGallery />
      <TestimonialsStudentSection />
      {/* <ServicesSection /> */}
      <ReseauxSection />
      <VideoSectionInscription />
      <FAQSection />
      <VideoSection />
      <ContactSection />  
     <PymentSection />
     <PymntCompteCIH />
      <Footer />
    </div>
  )
}

export default Home
