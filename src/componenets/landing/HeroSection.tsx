"use client";

import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="pt-16 bg-gradient-to-br from-primary to-secondary min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Gear Up Your
              <span className="text-ternary block">Vehicle's Future</span>
            </h1>
            <p className="text-xl mb-8 text-ternary leading-relaxed">
              Professional automotive services with expert technicians, quality parts, and customer satisfaction guaranteed. Your vehicle deserves the best care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/customer"
                className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-ternary transition-colors text-center"
              >
                Book Service Now
              </Link>
              <Link
                href="/services"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary transition-colors text-center"
              >
                Explore Services
              </Link>
            </div>
          </div>
          <div className="relative w-full h-full">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="/hero.png"
                alt="Gear Up Services"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-ternary/30 rounded-full blur-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
}