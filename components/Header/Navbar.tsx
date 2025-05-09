"use client";
import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
// import { useUser } from "@clerk/nextjs"; // Remove this line
// import { useState } from "react";

export default function Navbar() {
  // const { isSignedIn } = useUser(); // Remove this line

  return (
    <nav className="relative">
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
        {/* Authentication Buttons */}
        <Unauthenticated>
          <SignInButton mode="modal">
            <button className="px-4 py-1 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors duration-200">
              Sign In
            </button>
          </SignInButton>
        </Unauthenticated>
        <Authenticated>
          <UserButton afterSignOutUrl="/" />
        </Authenticated>
      </div>
    </nav>
  );
}