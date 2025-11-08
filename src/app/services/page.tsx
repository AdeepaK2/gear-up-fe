"use client";

import Navbar from "../../componenets/landing/Navbar";
import ServicesPreview from "../../componenets/landing/ServicesPreview";
import Footer from "../../componenets/shared/Footer";
import ShopStatusBanner from "@/components/shared/ShopStatusBanner";
import Link from "next/link";
import { useState } from "react";

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<any>(null);

  const additionalServices = [
    {
      title: "Transmission Repair",
      description:
        "Expert transmission diagnostics, repair, and rebuilding services for all vehicle types.",
      icon: "⚙️",
      price: "Starting at LKR 29,900",
      details:
        "Our transmission repair service includes comprehensive diagnostics using state-of-the-art equipment, complete transmission fluid service, clutch repairs and replacements, transmission rebuilding for automatic and manual transmissions, and torque converter services.",
      symptoms: [
        "Delayed or rough gear shifting",
        "Slipping gears or grinding noises",
        "Burning smell or fluid leaks",
        "Check engine light is on",
        "Unusual whining or clunking sounds",
      ],
      services: [
        "Transmission fluid flush and replacement",
        "Clutch repair and replacement",
        "Automatic and manual transmission rebuild",
        "Torque converter repair",
        "Transmission diagnostics",
      ],
    },
    {
      title: "Suspension Services",
      description:
        "Complete suspension system inspection, repair, and replacement for smooth rides.",
      icon: "🔧",
      price: "Starting at LKR 19,900",
      details:
        "Our suspension services ensure optimal ride quality, handling, and safety. We inspect and repair all suspension components to keep your vehicle stable and comfortable on the road.",
      symptoms: [
        "Bumpy or uncomfortable ride",
        "Vehicle pulls to one side",
        "Uneven tire wear",
        "Nose dives when braking",
        "Excessive bouncing after bumps",
      ],
      services: [
        "Shock absorber replacement",
        "Strut replacement and repair",
        "Ball joint replacement",
        "Control arm repair",
        "Wheel alignment and balancing",
      ],
    },
    {
      title: "Electrical Systems",
      description:
        "Advanced electrical diagnostics and repair for modern vehicle electronics.",
      icon: "⚡",
      price: "Starting at LKR 14,900",
      details:
        "We specialize in modern vehicle electrical systems with advanced diagnostic tools to identify and fix electrical issues quickly and accurately.",
      symptoms: [
        "Difficulty starting the engine",
        "Dimming or flickering lights",
        "Battery keeps dying",
        "Electrical accessories not working",
        "Dashboard warning lights on",
      ],
      services: [
        "Battery testing and replacement",
        "Alternator repair and replacement",
        "Starter motor service",
        "Wiring harness repair",
        "Sensor diagnostics and replacement",
      ],
    },
    {
      title: "Exhaust Services",
      description:
        "Exhaust system repair, replacement, and performance upgrades.",
      icon: "💨",
      price: "Starting at LKR 12,900",
      details:
        "Complete exhaust system services to ensure your vehicle meets environmental standards while maintaining optimal performance and fuel efficiency.",
      symptoms: [
        "Loud rumbling or hissing noises",
        "Decreased fuel efficiency",
        "Vibrations in steering wheel or pedals",
        "Smell of exhaust inside cabin",
        "Visible rust or holes in exhaust",
      ],
      services: [
        "Muffler replacement",
        "Catalytic converter service",
        "Exhaust pipe repair",
        "Performance exhaust upgrades",
        "Emission testing and repairs",
      ],
    },
    {
      title: "Preventive Maintenance",
      description:
        "Comprehensive maintenance packages to keep your vehicle running optimally.",
      icon: "🛠️",
      price: "Starting at LKR 8,900",
      details:
        "Regular preventive maintenance keeps your vehicle in peak condition and helps prevent costly repairs. Our comprehensive packages include all essential checks and services.",
      symptoms: [
        "Mileage intervals reached (5,000-10,000 km)",
        "Engine performance feels sluggish",
        "Unusual noises or vibrations",
        "Scheduled service reminder on dashboard",
        "It's been 6+ months since last service",
      ],
      services: [
        "Engine oil and filter change",
        "Brake system inspection",
        "Tire rotation and pressure check",
        "Fluid level checks and top-up",
        "Battery and charging system test",
      ],
    },
    {
      title: "Emergency Roadside",
      description: "24/7 emergency roadside assistance and towing services.",
      icon: "🚨",
      price: "Starting at LKR 7,900",
      details:
        "Round-the-clock emergency assistance for when you need help on the road. We're available 24/7 to get you back on track or safely tow your vehicle.",
      symptoms: [
        "Vehicle won't start",
        "Flat tire or tire blowout",
        "Ran out of fuel",
        "Locked keys inside vehicle",
        "Accident or breakdown on road",
      ],
      services: [
        "Emergency towing service",
        "Jump start service",
        "Flat tire change",
        "Fuel delivery",
        "Lockout assistance",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-custom">
      <Navbar />
      <ShopStatusBanner />

      {/* Services Hero */}
      <section className="pt-16 bg-gradient-to-r from-primary to-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">Our Services</h1>
          <p className="text-xl text-ternary max-w-3xl mx-auto">
            Comprehensive automotive services delivered by certified
            professionals with state-of-the-art equipment
          </p>
        </div>
      </section>

      {/* Main Services */}
      <ServicesPreview showAll={true} showButton={false} />

      {/* Additional Services */}
      <section className="py-20 bg-ternary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">
              Additional Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Extended services to meet all your automotive needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-primary mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {service.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-secondary font-semibold">
                    {service.price}
                  </span>
                  <button
                    onClick={() => setSelectedService(service)}
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-colors"
                  >
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
            <h2 className="text-4xl font-bold text-primary mb-4">
              Our Service Guarantee
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We stand behind our work with comprehensive warranties and
              guarantees
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                Quality Guarantee
              </h3>
              <p className="text-gray-600">
                All work backed by our comprehensive warranty
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-secondary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                Fast Service
              </h3>
              <p className="text-gray-600">Most services completed same-day</p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path
                    fillRule="evenodd"
                    d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                Fair Pricing
              </h3>
              <p className="text-gray-600">
                Transparent pricing with no hidden fees
              </p>
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

      {/* Service Details Modal */}
      {selectedService && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{selectedService.icon}</div>
                  <div>
                    <h2 className="text-3xl font-bold text-primary">
                      {selectedService.title}
                    </h2>
                    <p className="text-2xl text-secondary font-semibold mt-2">
                      {selectedService.price}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-3">
                    About This Service
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedService.details}
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-red-700 mb-3 flex items-center gap-2">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Warning Signs - When You Need This Service
                  </h3>
                  <ul className="space-y-2">
                    {selectedService.symptoms.map(
                      (symptom: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-red-600 font-bold mt-1">•</span>
                          <span className="text-gray-800">{symptom}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-primary mb-3">
                    Services Included
                  </h3>
                  <ul className="space-y-2">
                    {selectedService.services.map(
                      (service: string, index: number) => (
                        <li key={index} className="flex items-center gap-3">
                          <svg
                            className="w-5 h-5 text-secondary flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-gray-700">{service}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="flex gap-4 pt-4">
                  <Link href="/register" className="flex-1">
                    <button className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition-colors">
                      Book This Service
                    </button>
                  </Link>
                  <Link href="/contact" className="flex-1">
                    <button className="w-full bg-white text-primary border-2 border-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                      Contact Us
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
