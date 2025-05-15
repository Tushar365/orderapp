"use client";
import Image from "next/image";

const brands = [
  { id: 1, name: "BrandOne", logo: "/brands/brand1.png" },
  { id: 2, name: "BrandTwo", logo: "/brands/brand2.png" },
  { id: 3, name: "BrandThree", logo: "/brands/brand3.png" },
  { id: 4, name: "BrandFour", logo: "/brands/brand4.png" },
  { id: 5, name: "BrandFive", logo: "/brands/brand5.png" },
  { id: 6, name: "BrandSix", logo: "/brands/brand6.png" },
  { id: 7, name: "BrandSeven", logo: "/brands/brand7.png" },
  { id: 8, name: "BrandEight", logo: "/brands/brand8.png" },
  { id: 9, name: "BrandNine", logo: "/brands/brand9.png" },
  { id: 10, name: "BrandTen", logo: "/brands/brand10.png" },
  // ...add more brands as needed
];

/**
 * Displays a horizontally scrolling carousel of featured brand logos with a seamless infinite loop effect.
 *
 * Renders a section containing a heading and a continuously animated row of brand cards, each showing a logo and brand name. The animation is achieved by duplicating the brand list and applying a horizontal sliding CSS animation.
 */
export default function FeaturedBrands() {
  // Duplicate the brands array to create a seamless loop
  const slidingBrands = [...brands, ...brands];

  return (
    <section className="py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Featured Brands</h2>
        <div className="overflow-hidden w-full">
          <div
            className="flex items-center gap-8 animate-slide-horizontal"
            style={{
              width: `${slidingBrands.length * 140}px`, // Adjust width based on brand count and card width
            }}
          >
            {slidingBrands.map((brand, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center bg-white rounded-lg shadow-sm p-4 min-w-[120px] hover:shadow-md transition"
              >
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={80}
                  height={40}
                  className="object-contain mb-2"
                />
                <span className="text-sm text-gray-700">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes slide-horizontal {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-slide-horizontal {
          animation: slide-horizontal 40s linear infinite;
        }
      `}</style>
    </section>
  );
}