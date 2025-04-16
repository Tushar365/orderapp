"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="relative">
      {/* Hamburger Icon for mobile */}
      <button
        className="md:hidden flex items-center px-2 py-2"
        onClick={() => setOpen(!open)}
        aria-label="Open menu"
      >
        <svg className="w-7 h-7 text-blue-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      </button>
      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="flex flex-col absolute right-0 top-10 bg-white shadow rounded-lg p-4 space-y-4 z-50 md:hidden">
          <Link href="/orders" className="text-gray-700 hover:text-blue-700 font-medium flex items-center" onClick={() => setOpen(false)}>
            Order
          </Link>
          <Link href="/account" className="text-gray-700 hover:text-blue-700 font-medium flex items-center" onClick={() => setOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="8" r="4" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4" />
            </svg>
            Account
          </Link>
          <Link href="/cart" className="text-gray-700 hover:text-blue-700 font-medium flex items-center" onClick={() => setOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            Cart
          </Link>
        </div>
      )}
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6">
        <Link href="/orders" className="text-gray-700 hover:text-blue-700 font-medium flex items-center">
          Order
        </Link>
        <Link href="/account" className="text-gray-700 hover:text-blue-700 font-medium flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="8" r="4" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4" />
          </svg>
          Account
        </Link>
        <Link href="/cart" className="text-gray-700 hover:text-blue-700 font-medium flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
          </svg>
          Cart
        </Link>
      </div>
    </nav>
  );
}