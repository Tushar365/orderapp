import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from 'next/script';
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { CartProvider } from '@/context/CartContext';
import { Analytics } from '@vercel/analytics/react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MedGhor",
  description: "Online Medicine Retail Store",
  icons: {
    icon: "/Home Remedy.png",
  },
};

/**
 * Root layout component that sets up global HTML structure, fonts, metadata, context providers, and analytics for the application.
 *
 * Wraps all pages with authentication, backend client, cart state, and analytics providers, and injects Google Tag Manager and Analytics scripts.
 *
 * @param children - The content to be rendered within the layout.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-Y5Q51KND07"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-Y5Q51KND07');
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ClerkProvider>
          <ConvexClientProvider>
            <CartProvider>
              {children}
              <Analytics />
            </CartProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}