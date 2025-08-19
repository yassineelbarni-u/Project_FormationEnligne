import Header from "../../components/common/Header"
import HeroSection from "../../components/sections/HeroSection"
import WhyChooseUsSection from "../../components/sections/WhyChooseUsSection"
import ServicesSection from "../../components/sections/ServicesSection"
import TestimonialsSection from "../../components/sections/TestimonialsSection"
import FAQSection from "../../components/sections/FAQSection"
import ContactSection from "../../components/sections/ContactSection"
import VideoSection from "../../components/sections/VideoSection"
import AnnonceSection from "../../components/sections/AnnonceSection"
import Footer from "../../components/common/Footer"

const Home = () => {
  return (
    <div className="home">
      <Header />
      <HeroSection />
      <WhyChooseUsSection />
      <ServicesSection />
      <AnnonceSection />
      <TestimonialsSection />
      <VideoSection />
      <FAQSection />
      <ContactSection />
    
      <Footer />
    </div>
  )
}

export default Home
