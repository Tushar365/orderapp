"use client";
import Link from "next/link";
// import { useState } from "react";

export default function Navbar() {
  // Removed: const [open, setOpen] = useState(false);

  return (
    <nav className="relative">
      {/* Remove Hamburger Icon and Mobile Dropdown Menu */}
      <div className="flex items-center space-x-6">
        <Link
          href="/quickorder"
          className="px-4 py-1 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors duration-200"
        >
          Quick Order
        </Link>
        <Link href="/cart" className="text-gray-700 hover:text-blue-700 font-medium flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
          </svg>
          Cart
        </Link>
        <Link href="/orders" className="text-gray-700 hover:text-blue-700 font-medium flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" stroke="currentColor" />
          </svg>
          Orders
        </Link>
        <Link href="/account" className="text-gray-700 hover:text-blue-700 font-medium flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="8" r="4" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4" />
          </svg>
          Account
        </Link>
      </div>
    </nav>
  );
}