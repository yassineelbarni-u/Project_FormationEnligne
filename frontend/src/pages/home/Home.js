import Header from "../../components/common/Header"
import HeroSection from "../../components/sections/HeroSection"
import HeroSchoolsInfo from "../../components/sections/HeroSchoolsInfo"
import AnnonceSection from "../../components/sections/AnnonceSection"
import WhyChooseUsSection from "../../components/sections/WhyChooseUsSection"
// import ServicesSection from "../../components/sections/ServicesSection"
import FeedbackGallery from "../../components/sections/FeedbackGallery"
import FAQSection from "../../components/sections/FAQSection"
import ContactSection from "../../components/sections/ContactSection"
import VideoSection from "../../components/sections/VideoSection"
import Footer from "../../components/common/Footer"
import ReseauxSection from "../../components/sections/ReseauxSection"
import ScreenshotsSection from "../../components/sections/ScreenshotsSection"


const Home = () => {
  return (
    <div className="home">
      <Header />
      <HeroSection />
      <HeroSchoolsInfo />
      <AnnonceSection />
      <ScreenshotsSection />
      <WhyChooseUsSection />
      <FeedbackGallery />
      {/* <ServicesSection /> */}
      <VideoSection />
      <ReseauxSection />
      <FAQSection />
      <ContactSection />
    
      <Footer />
    </div>
  )
}

export default Home
