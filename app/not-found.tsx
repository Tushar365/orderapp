"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link 
        href="/"
        className="bg-foreground text-background text-sm px-4 py-2 rounded-md"
      >
        Return Home
      </Link>
    </div>
  );
}