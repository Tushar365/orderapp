import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Header/Navbar';
import Search from './Search';

/**
 * Renders the responsive header section with a logo, search bar, and navigation bar.
 *
 * The header displays a logo linked to the homepage, a centrally positioned search bar, and a navigation bar. Layout and alignment adjust for different screen sizes to ensure optimal usability on both mobile and desktop devices.
 */
export default function Header() {
  return (
    <header className="w-full bg-white shadow-sm py-2 px-2 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center sm:justify-between">
        {/* Logo always at the top on mobile, left on desktop */}
        <div className="w-full flex justify-center sm:justify-start sm:w-auto mb-2 sm:mb-0">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="MedGhor Logo"
              width={120}
              height={25}
              className="object-contain"
              style={{ minWidth: 120, minHeight: 25 }}
            />
          </Link>
        </div>
        {/* Middle section: Search bar - increased width on desktop */}
        <div className="w-full sm:flex-1 md:flex-grow-[2] flex justify-center px-0 sm:px-4 mb-2 sm:mb-0">
          <Search />
        </div>
        {/* Navbar always on the right */}
        <div className="w-full sm:w-auto flex justify-center sm:justify-end">
          <Navbar />
        </div>
      </div>
    </header>
  );
}