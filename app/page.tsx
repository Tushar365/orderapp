"use client";

import Link from "next/link";
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
          
          <Link 
            href="/order" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-12 rounded-lg text-2xl shadow-lg transition-all duration-200 transform hover:scale-105 inline-flex items-center"
          >
            <span>not taking orders contact here : 6289500338</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
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
