import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SanityLive } from "@/lib/sanity/live";
import "./globals.css";

// Body font - highly readable
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Heading font - modern, friendly geometric
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

// Mono font for code
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nestwell | Find Your Perfect Home",
    template: "%s | Nestwell",
  },
  description:
    "Making your first home journey simple and stress-free. Browse properties, save favorites, and connect with trusted agents.",
  keywords: [
    "real estate",
    "homes for sale",
    "first-time homebuyer",
    "property listings",
    "houses",
    "apartments",
  ],
  authors: [{ name: "Nestwell" }],
  creator: "Nestwell",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Nestwell",
    title: "Nestwell | Find Your Perfect Home",
    description:
      "Making your first home journey simple and stress-free. Browse properties, save favorites, and connect with trusted agents.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nestwell | Find Your Perfect Home",
    description:
      "Making your first home journey simple and stress-free. Browse properties, save favorites, and connect with trusted agents.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBF9F6" },
    { media: "(prefers-color-scheme: dark)", color: "#2D2824" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* Preconnect to external domains for performance */}
          <link rel="preconnect" href="https://cdn.sanity.io" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
        </head>
        <body
          className={`${inter.variable} ${plusJakarta.variable} ${geistMono.variable} font-body antialiased`}
        >
          {/* Skip link for accessibility */}
          <a href="#main" className="skip-link">
            Skip to main content
          </a>
          {children}
          <Toaster />
          <SanityLive />
        </body>
      </html>
    </ClerkProvider>
  );
}
