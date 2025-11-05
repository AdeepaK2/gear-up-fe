import Navbar from "../componenets/landing/Navbar";
import HeroSection from "../componenets/landing/HeroSection";
import ServicesPreview from "../componenets/landing/ServicesPreview";
import AboutSection from "../componenets/landing/AboutSection";
import Footer from "../componenets/shared/Footer";
import ChatbotPopup from "@/components/shared/ChatbotPopup";

export default function Home() {
  return (
    <div className="min-h-screen bg-custom">
      <Navbar />
      <HeroSection />
      <ServicesPreview />
      <AboutSection />
      
      {/* Contact Preview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600">
              Ready to give your vehicle the care it deserves? Contact us today!
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Phone</h3>
              <p className="text-gray-600">(555) 123-4567</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Email</h3>
              <p className="text-gray-600">info@gearup.com</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Location</h3>
              <p className="text-gray-600">123 Auto Service St<br />Your City, ST 12345</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <a
              href="/contact"
              className="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary transition-colors"
            >
              Get Full Contact Info
            </a>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* AI Chatbot Popup */}
      <ChatbotPopup />
    </div>
  );
}
