"use client";

import Link from "next/link"; // Keep Link for potential future use or other links
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <main className="flex-1 w-full max-w-6xl p-4 flex flex-col items-center justify-center">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Order Medicines Online</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            Fast, reliable delivery of your essential medications right to your doorstep.
          </p>

          {/* Changed Link to a standard <a> tag with tel: href */}
          <a
            href="tel:6289500338" // Make the entire button initiate a call
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-12 rounded-lg text-2xl shadow-lg transition-all duration-200 transform hover:scale-105 inline-flex items-center"
          >
            {/* You can adjust the text for clarity if needed */}
            <span>Not taking orders - Contact: 6289500338</span>

            {/* Optional but recommended: Change the icon to a phone icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {/* Original arrow icon if you prefer:
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            */}
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-12"> {/* Added margin-top */}
          <FeatureCard
            title="Easy Ordering"
            description="Simple form to quickly order your medications with just a few clicks."
            icon="📝"
            bgColor="bg-gradient-to-br from-green-400 to-green-600"
            textColor="text-white"
          />
          <FeatureCard
            title="20% Off"
            description="Get up to 20% discount on your medicine orders."
            icon="💰"
            bgColor="bg-gradient-to-br from-blue-400 to-blue-600"
            textColor="text-white"
          />
          <FeatureCard
            title="Secure Process"
            description="Your personal and medical information is always kept private and secure."
            icon="🔒"
            bgColor="bg-gradient-to-br from-purple-400 to-purple-600"
            textColor="text-white"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

// FeatureCard component remains the same
function FeatureCard({
  title,
  description,
  icon,
  bgColor = "bg-white",
  textColor = "text-gray-600"
}: {
  title: string;
  description: string;
  icon: string;
  bgColor?: string;
  textColor?: string;
}) {
  return (
    <div className={`${bgColor} rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:scale-105 duration-300`}>
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className={`text-xl font-bold mb-2 ${textColor}`}>{title}</h3>
      <p className={`${textColor} opacity-90`}>{description}</p>
    </div>
  );
}
