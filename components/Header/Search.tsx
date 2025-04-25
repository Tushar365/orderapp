"use client";
import { useState, useRef } from "react";
// Removed: useEffect, useQuery, api, Link

// Import the FullScreenSearch component
import FullScreenSearch from './FullScreenSearch';
export default function Search() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null); // Keep ref for potential future use or remove if unused

  // Removed: debouncing useEffect
  // Removed: useQuery for searchResults
  // Removed: handleClickOutside useEffect
  // Removed: showResults useEffect

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  return (
    <div className="relative mx-4" ref={searchRef}>
      {/* Search Trigger Button */}
      <button
        onClick={openSearch}
        className="flex items-center w-full px-4 py-2 md:py-3 bg-blue-50 text-gray-500 text-sm md:text-base rounded-full border border-blue-100 shadow hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
        aria-label="Open search"
      >
        <svg
          className="w-5 h-5 md:w-6 md:h-6 mr-3"
          fill="none"
          stroke="currentColor" // Changed stroke to currentColor
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        Search products...
      </button>

      {/* Removed: Search Results Dropdown */}

      {/* Render FullScreenSearch Modal when isSearchOpen is true */}
      {isSearchOpen && <FullScreenSearch onCloseAction={closeSearch} />}
    </div>
  );
}