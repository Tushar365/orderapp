"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Displays a centered logo with a fade-in animation and tagline.
 *
 * The logo image appears above a blurred circular shadow and gently scales up on hover. After a short delay, both the logo and the tagline "Your Trusted Healthcare Partner" fade in with smooth transitions.
 */
export default function AnimatedLogo() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-[200px] px-4">
      <div 
        className={`
          relative 
          transition-all duration-700 ease-in-out 
          ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <Link href="/" className="block">
          <div className="relative flex justify-center items-center">
            {/* Minimal shadow effect */}
            <div 
              className="absolute inset-0 bg-gray-100 rounded-full"
              style={{
                width: '110%',
                height: '110%',
                left: '-5%',
                top: '-5%',
                filter: 'blur(8px)',
                opacity: 0.3
              }}
            />
            
            {/* Logo image with subtle hover effect */}
            <Image 
              src="/logo.png" 
              alt="MedGhor Logo" 
              width={140} 
              height={140} 
              className="relative z-10 object-contain transition-transform duration-300 hover:scale-[1.02]"
              priority
            />
          </div>
        </Link>
        
        {/* Minimal tagline */}
        <div 
          className={`
            text-center mt-6 font-medium text-gray-700
            transition-all duration-700 delay-200
            ${isVisible ? 'opacity-100' : 'opacity-0'}
          `}
        >
          Your Trusted Healthcare Partner
        </div>
      </div>
    </div>
  );
}