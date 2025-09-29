import Link from "next/link";

export default function AboutSection() {
  const features = [
    { title: "Certified Technicians", description: "ASE-certified professionals with extensive training" },
    { title: "Quality Guarantee", description: "All work backed by our comprehensive warranty" },
    { title: "Fair Pricing", description: "Transparent pricing with no hidden fees" },
    { title: "Quick Service", description: "Most services completed same-day" }
  ];

  return (
    <section className="py-20 bg-ternary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-primary mb-6">Why Choose Gear Up?</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              With over 15 years of experience in automotive service, Gear Up has built a reputation for excellence, reliability, and customer satisfaction. Our certified technicians use state-of-the-art equipment and genuine parts to ensure your vehicle receives the best care possible.
            </p>
            
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">{feature.title}</h4>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-primary mb-6">Get Started Today</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <span className="text-gray-700">Book your appointment online</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <span className="text-gray-700">Bring your vehicle to our facility</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <span className="text-gray-700">Relax while we handle the rest</span>
                </div>
              </div>
              <Link
                href="/customer"
                className="mt-6 block bg-primary text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-secondary transition-colors"
              >
                Schedule Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}