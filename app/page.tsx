"use client";

// Keep Link import if used elsewhere, otherwise can be removed if Header/Footer don't use it
// import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <main className="flex-1 w-full max-w-6xl p-4 flex flex-col items-center justify-center">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Order Medicines Online</h2>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl"> {/* Reduced margin-bottom */}
            Fast, reliable delivery of your essential medications right to your doorstep.
          </p>

          {/* Simple text message instead of a button */}
          <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded-lg inline-block">
            <p className="text-lg font-medium text-yellow-800">
              Online ordering is currently unavailable.
            </p>
            <p className="text-lg text-yellow-700 mt-1">
              Please contact us directly at:
              <a href="tel:6289500338" className="font-bold text-blue-600 hover:underline ml-1">
                 6289500338
              </a>
            </p>
          </div>

        </div>

        {/* Feature cards section remains the same */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-12">
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
