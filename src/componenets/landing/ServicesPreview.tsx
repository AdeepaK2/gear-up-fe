import Link from "next/link";

const services = [
  {
    title: "Engine Diagnostics",
    description: "Advanced computer diagnostics to identify and resolve engine issues quickly and accurately.",
    icon: "🔧"
  },
  {
    title: "Brake Services",
    description: "Complete brake system inspection, repair, and replacement for your safety on the road.",
    icon: "🛡️"
  },
  {
    title: "Oil Changes",
    description: "Regular oil changes with premium lubricants to keep your engine running smoothly.",
    icon: "⚙️"
  },
  {
    title: "Tire Services",
    description: "Tire installation, rotation, balancing, and alignment for optimal performance and safety.",
    icon: "🚗"
  },
  {
    title: "AC Repair",
    description: "Climate control system diagnosis and repair to keep you comfortable year-round.",
    icon: "❄️"
  },
  {
    title: "Battery Services",
    description: "Battery testing, replacement, and electrical system maintenance for reliable starts.",
    icon: "🔋"
  }
];

interface ServicesPreviewProps {
  showAll?: boolean;
  showButton?: boolean;
}

export default function ServicesPreview({ showAll = false, showButton = true }: ServicesPreviewProps) {
  const displayServices = showAll ? services : services.slice(0, 3);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From routine maintenance to complex repairs, we've got your vehicle covered with professional expertise.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map((service, index) => (
            <div key={index} className="bg-custom p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-primary mb-3">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        {showButton && !showAll && (
          <div className="text-center mt-12">
            <Link
              href="/services"
              className="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary transition-colors"
            >
              View All Services
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}