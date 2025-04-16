import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Header/Navbar';
import Search from './Search';

export default function Header() {
  return (
    <header className="w-full bg-white shadow-sm py-2 px-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center h-16">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="MedGhor Logo"
            width={120}
            height={25}
            className="object-contain"
          />
        </Link>
        <Search />
        <Navbar />
      </div>
    </header>
  );
}