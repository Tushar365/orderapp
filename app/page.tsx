"use client";

import Link from "next/link";
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
import AnimatedLogo from "@/components/Logo/AnimatedLogo";


/****
 * Renders the main homepage, displaying a full-featured product and category interface for authenticated users and a sign-in prompt for unauthenticated users.
 *
 * For authenticated users, the page includes a hero slider, featured brands, multiple product sections, promotional banners, category cards, a discount banner, and navigation links. For unauthenticated users, a centered card with the logo, welcome message, feature list, and a sign-in button is shown.
 */
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float" style={{animationDelay: '1s'}}></div>
          
          {/* Main content card with enhanced styling */}
          <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full mx-4 relative z-10 border border-blue-50">
            <div className="text-center">
              {/* AnimatedLogo component */}
              <AnimatedLogo />
              
              {/* Welcome text with enhanced styling */}
              <h1 className="text-3xl font-bold mb-2 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-blue-600">Welcome to MedGhor</h1>
              <p className="text-gray-600 mb-8">Your trusted healthcare partner</p>
              
              {/* Feature highlights with improved visual styling */}
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-blue-700 mb-3">
                    Sign in to access exclusive features:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-3">
                    <li className="flex items-center">
                      <span className="flex items-center justify-center mr-3 w-5 h-5 bg-blue-100 rounded-full text-blue-600">✓</span> 
                      <span>Easy medicine ordering</span>
                    </li>
                    <li className="flex items-center">
                      <span className="flex items-center justify-center mr-3 w-5 h-5 bg-blue-100 rounded-full text-blue-600">✓</span> 
                      <span>Track your orders</span>
                    </li>
                    <li className="flex items-center">
                      <span className="flex items-center justify-center mr-3 w-5 h-5 bg-blue-100 rounded-full text-blue-600">✓</span> 
                      <span>Personalized recommendations</span>
                    </li>
                    <li className="flex items-center">
                      <span className="flex items-center justify-center mr-3 w-5 h-5 bg-blue-100 rounded-full text-blue-600">✓</span> 
                      <span>Exclusive discounts & offers</span>
                    </li>
                  </ul>
                </div>
                
                {/* Enhanced sign-in button with animation */}
                <SignInButton mode="modal">
                  <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-[1.02] shadow-md">
                    Sign In to Continue
                  </button>
                </SignInButton>
                
                {/* Additional text */}
                <p className="text-xs text-gray-500 mt-4">
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </Unauthenticated>
      {/* Removed the extra closing </div> and </Unauthenticated> from here */}
    </>
  );
}