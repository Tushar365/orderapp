"use client";

import Link from "next/link";
import Image from "next/image"; // Import the Image component
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import HeroSlider from "@/components/Hero/HeroSlider";
import CategoryCard from "@/components/Category/CategoryCard";
import PromoBanner from "@/components/Banner/PromoBanner";
import DiscountBanner from "@/components/Banner/DiscountBanner";
import ProductSection from "@/components/Product/ProductSection";
import FeaturedBrands from "@/components/Banner/FeaturedBrands";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton } from "@clerk/nextjs"; // Import SignInButton


// Main Homepage Component
export default function HomePage() {
  const featuredProducts = [
    { 
      id: 1, 
      name: "Aveeno Sensitive Skin H/A Skincare", 
      price: 15.99, 
      originalPrice: 19.99, 
      image: "/products/aveeno.png", 
      sale: true,
      rating: 4.8
    },
    { 
      id: 2, 
      name: "First Responder Trauma Bag", 
      price: 89.99, 
      originalPrice: null, 
      image: "/products/trauma-bag.png", 
      sale: false,
      rating: 4.9
    },
    { 
      id: 3, 
      name: "Alfredo Formula Aloe Cleansing Foam", 
      price: 12.50, 
      originalPrice: 15.00, 
      image: "/products/cleansing-foam.png", 
      sale: true,
      rating: 4.5
    },
    { 
      id: 4, 
      name: "Kalmin Baby Diaper Small (8 Pcs 9-16 KG)", 
      price: 9.99, 
      originalPrice: 12.99, 
      image: "/products/diapers.png", 
      sale: false,
      rating: 4.7
    },
  ];

  const hotProducts = [
    { 
      id: 5, 
      name: "Bajaj Almond Drops Hair Oil 300ml", 
      price: 8.99, 
      originalPrice: 10.99, 
      image: "/products/almond-oil.png", 
      sale: true,
      rating: 4.6
    },
    { 
      id: 6, 
      name: "Insulin 30/70 4 ML", 
      price: 22.50, 
      originalPrice: null, 
      image: "/products/insulin.png", 
      sale: false,
      rating: 4.9
    },
    { 
      id: 7, 
      name: "Himalaya Baby Lotion Moisturize & Nourishes", 
      price: 10.99, 
      originalPrice: null, 
      image: "/products/baby-lotion.png", 
      sale: false,
      rating: 4.7
    },
    { 
      id: 8, 
      name: "Optimum Nutrition Gold Standard", 
      price: 59.99, 
      originalPrice: 67.99, 
      image: "/products/protein.png", 
      sale: true,
      rating: 4.8
    },
  ];

  const categories = [
    { id: 1, name: "Ayurvedic Herbal", slug: "ayurvedic-herbal", image: "/categories/ayurvedic.jpg" },
    { id: 2, name: "Baby Care", slug: "baby-care", image: "/categories/baby-care.jpg" },
    { id: 3, name: "Skin Care", slug: "skin-care", image: "/categories/skin-care.jpg" },
    { id: 4, name: "Diabetic Care", slug: "diabetic-care", image: "/categories/diabetic-care.jpg" },
  ];

  return (
    <>
      <Authenticated>
        {/* Consider moving UserButton inside Header for better placement */}
        
        <main className="min-h-screen bg-blue-50/30">
          <Header />
          
          {/* Replace the old Hero Section with the new HeroSlider */}
          <HeroSlider />

          {/* Featured Brands Section */}
          <FeaturedBrands />

          {/* Featured Products Section */}
          <ProductSection
            title="Latest Products"
            products={featuredProducts}
            showSeeAll
            seeAllLink="/products"
          />
          
          {/* Promotional Banners */}
          <section className="py-6 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
              <PromoBanner
                title="Immunity Boosters"
                description="Starting from ₹69"
                link="/shop/immunity"
                linkLabel="Shop Now"
                image="/banner/immunity.png"
              />
              <PromoBanner
                title="Sexual Wellness"
                description="Flat 10% off"
                link="/shop/thermometer"
                linkLabel="Shop Now"
                image="/banner/sexualwellness.png"
              />
              <PromoBanner
                title="Proteins & Supplements"
                description="Start your journey"
                link="/shop/protein"
                linkLabel="Shop Now"
                image="/banner/protein.png"
              />
            </div>
          </section>
          {/* Categories Section */}
          <section className="py-12 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Popular Medicine Categories</h2>
                <Link 
                  href="/categories" 
                  className="text-sm text-gray-600 hover:text-blue-600 flex items-center"
                >
                  See All Products
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map(category => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            </div>
          </section>
          
          {/* Hot Products Section */}
          <ProductSection
            title="Hot Products"
            products={hotProducts}
          />

          {/* Most Selling Products Section */}
          <ProductSection
            title="Most Selling Products"
            products={hotProducts}
          />
          {/* Brand wise Products Section */}
          <ProductSection
            title="Products of Sun Pharma"
            products={hotProducts}
          />
          {/* Brand wise Products Section */}
          <ProductSection
            title="Products of Abbot"
            products={hotProducts}
          />
          {/* Brand wise Products Section */}
          <ProductSection
            title="Products of Mankind"
            products={hotProducts}
          />
          
          {/* Discount Banner */}
          <DiscountBanner />
          {/* Footer */}
          <Footer />
        </main>
      </Authenticated>
      <Unauthenticated>
        {/* Enhanced sign-in prompt with better visuals and CTA */}
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-4">
            <div className="text-center">
              <Image 
                src="/logo.png" 
                alt="MedGhor Logo" 
                width={64} // Set appropriate width
                height={64} // Set appropriate height based on h-16 class
                className="mx-auto mb-6" // Keep other classes, remove h-16 as height is set
              />
              <h1 className="text-3xl font-bold mb-2 text-gray-800">Welcome to MedGhor</h1>
              <p className="text-gray-600 mb-8">Your trusted healthcare partner</p>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Sign in to access exclusive features:
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span> Easy medicine ordering
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span> Track your orders
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span> Personalized recommendations
                  </li>
                </ul>
                <SignInButton mode="modal">
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Sign In to Continue
                  </button>
                </SignInButton>
              </div>
            </div>
          </div>
        </div>
      </Unauthenticated>
      {/* Removed the extra closing </div> and </Unauthenticated> from here */}
    </>
  );
}