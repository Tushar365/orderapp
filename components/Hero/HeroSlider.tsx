"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

const slides = [
  {
    title: "Blood Pressure Monitor",
    subtitle: "Flat 20% Discount For Limited Time Only",
    image: "/products/pressure.png",
    button: { text: "Buy Now", link: "/products/bp-monitor" },
    bg: "from-blue-100 via-blue-50 to-blue-200",
  },
  {
    title: "Glucon-D",
    subtitle: "For Tasty Glucose Drink | Provides Instant Energy | Vitamin D2 Supports Immunity for summer",
    image: "/products/glucose.png", // Make sure this image exists in your public/products folder
    button: { text: "Shop Glucon-D", link: "/products/glucon-d" },
    bg: "from-blue-100 via-blue-50 to-blue-300",
  },
  // Added Ensure Powder Slide
  {
    title: "Horlicks Classic Malt Flavour",
    subtitle: "500 gm Jar | Support Immunity | Improves Bone & Muscle Health | Healthy Weight Gain",
    image: "/products/horlisk.png", // Ensure this image exists in your public/products folder
    button: { text: "Grab It Now", link: "/products/ensure" },
    bg: "from-blue-50 via-blue-100 to-blue-400",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className={`relative bg-gradient-to-r ${slides[current].bg} py-16 px-4 md:px-8 transition-all duration-500`}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="mb-10 md:mb-0 md:w-1/2">
          <div className="text-blue-400 font-semibold mb-2 tracking-wide">{slides[current].subtitle}</div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-900 mb-6 leading-tight drop-shadow-sm">
            {slides[current].title}
          </h1>
          <a href={slides[current].button.link}>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-7 py-3 rounded-full font-semibold shadow-lg transition-all duration-200 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-300">
              {slides[current].button.text}
            </button>
          </a>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative flex items-center justify-center h-[340px] w-[340px]">
            {/* Soft gradient/blur background for blending */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-80 h-80 bg-gradient-to-br from-blue-200/40 via-white/30 to-blue-400/30 blur-2xl rounded-full"></div>
            </div>
            <Image
              src={slides[current].image}
              alt={slides[current].title}
              width={340}
              height={340}
              className="object-contain h-full w-full drop-shadow-xl z-10"
              priority
            />
          </div>
        </div>
        {/* Decorative subtle blue circles */}
        <div className="absolute left-8 top-16 w-8 h-8 rounded-full bg-blue-100 opacity-40 blur-sm"></div>
        <div className="absolute right-24 bottom-10 w-16 h-16 rounded-full bg-blue-200 opacity-30 blur"></div>
        <div className="absolute left-1/4 bottom-8 w-4 h-4 bg-blue-300 rounded-full opacity-30 blur-sm"></div>
        <div className="absolute right-1/4 top-20 w-4 h-4 bg-blue-400 rounded-full opacity-20 blur-sm"></div>
      </div>
      {/* Slider Controls */}
      {/* Removed prev/next buttons */}
      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full transition-all duration-200 border border-blue-300 ${
              idx === current ? "bg-blue-500 scale-110 shadow" : "bg-blue-100"
            }`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}