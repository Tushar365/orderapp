import Image from "next/image";

/**
 * Renders a promotional banner highlighting a discount offer with styled visuals, descriptive text, and a call-to-action button.
 *
 * Displays a visually engaging section featuring a headline, description, and "Shop Now" button alongside a decorative image and background effects.
 */
export default function DiscountBanner() {
  return (
    <section className="py-12 px-6">
      <div className="max-w-6xl mx-auto bg-gradient-to-r from-blue-100 via-blue-50 to-white rounded-2xl overflow-hidden shadow-md relative">
        {/* Decorative Glow/Pattern */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-10 top-10 w-32 h-32 bg-blue-200 opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute right-10 bottom-10 w-24 h-24 bg-blue-100 opacity-10 rounded-full blur-2xl"></div>
        </div>
        <div className="flex flex-col md:flex-row items-center relative z-10">
          <div className="p-8 md:w-2/3 flex flex-col items-start">
            <div className="flex items-center mb-4">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white shadow mr-3">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 3v2M12 19v2M5.22 5.22l1.42 1.42M17.36 17.36l1.42 1.42M3 12h2M19 12h2M5.22 18.78l1.42-1.42M17.36 6.64l1.42-1.42" />
                </svg>
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-blue-800">
                Get up to 40% discount
              </h2>
            </div>
            {/* Added description and CTA */}
            <p className="text-blue-700 mb-4">
              Save big on selected medicines, wellness, and personal care products. Limited time offer!
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow transition">
              Shop Now
            </button>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <Image 
              src="/products/discount-banner.png" 
              alt="Discount Offer" 
              width={220} 
              height={160} 
              className="w-full h-auto"
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}