"use client";
import { useState } from "react";

export default function Search() {
  const [query, setQuery] = useState("");

  return (
    <form
      className="relative flex items-center w-full max-w-md mx-4 bg-blue-50 rounded-full border border-blue-100 shadow"
      onSubmit={e => {
        e.preventDefault();
        // You can handle the search logic here
      }}
    >
      
      <input
        type="text"
        className="w-full pl-10 pr-4 py-2 bg-blue-50 text-black text-sm focus:outline-none rounded-l-full border-0"
        placeholder="Search products..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-50 text-black px-5 py-2 rounded-r-full transition-colors duration-200 flex items-center justify-center border-0 focus:outline-none focus:ring-2 focus:ring-blue-300"
        aria-label="Search"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="black"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </form>
  );
}