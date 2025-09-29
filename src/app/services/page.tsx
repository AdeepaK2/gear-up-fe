import Navbar from "../../componenets/landing/Navbar";
import ServicesPreview from "../../componenets/landing/ServicesPreview";
import Footer from "../../componenets/shared/Footer";
import Link from "next/link";

export default function ServicesPage() {
  const additionalServices = [
    {
      title: "Transmission Repair",
      description: "Expert transmission diagnostics, repair, and rebuilding services for all vehicle types.",
      icon: "⚙️",
      price: "Starting at $299"
    },
    {
      title: "Suspension Services",
      description: "Complete suspension system inspection, repair, and replacement for smooth rides.",
      icon: "🔧",
      price: "Starting at $199"
    },
    {
      title: "Electrical Systems",
      description: "Advanced electrical diagnostics and repair for modern vehicle electronics.",
      icon: "⚡",
      price: "Starting at $149"
    },
    {
      title: "Exhaust Services",
      description: "Exhaust system repair, replacement, and performance upgrades.",
      icon: "💨",
      price: "Starting at $129"
    },
    {
      title: "Preventive Maintenance",
      description: "Comprehensive maintenance packages to keep your vehicle running optimally.",
      icon: "🛠️",
      price: "Starting at $89"
    },
    {
      title: "Emergency Roadside",
      description: "24/7 emergency roadside assistance and towing services.",
      icon: "🚨",
      price: "Starting at $79"
    }
  ];

  return (
    <div className="min-h-screen bg-custom">
      <Navbar />
      
      {/* Services Hero */}
      <section className="pt-16 bg-gradient-to-r from-primary to-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">Our Services</h1>
          <p className="text-xl text-ternary max-w-3xl mx-auto">
            Comprehensive automotive services delivered by certified professionals with state-of-the-art equipment
          </p>
        </div>
      </section>

      {/* Main Services */}
      <ServicesPreview showAll={true} showButton={false} />

      {/* Additional Services */}
      <section className="py-20 bg-ternary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Additional Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Extended services to meet all your automotive needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-primary mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-secondary font-semibold">{service.price}</span>
                  <button className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Guarantee */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Our Service Guarantee</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We stand behind our work with comprehensive warranties and guarantees
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">All work backed by our comprehensive warranty</p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-secondary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Fast Service</h3>
              <p className="text-gray-600">Most services completed same-day</p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Fair Pricing</h3>
              <p className="text-gray-600">Transparent pricing with no hidden fees</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/customer"
              className="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary transition-colors"
            >
              Book Your Service Today
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}