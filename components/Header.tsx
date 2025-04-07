import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-white shadow-sm py-4 px-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-700">
          MedGhor
        </Link>
        <nav className="flex space-x-6">
          <Link href="/" className="text-gray-600 hover:text-blue-700">
            Home
          </Link>
          <Link href="/orders" className="text-gray-600 hover:text-blue-700">
            Order
          </Link>
        </nav>
      </div>
    </header>
  );
}