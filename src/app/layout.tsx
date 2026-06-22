import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "🌊 Wave Report — Surf Spot Rater",
  description: "Rate surf spots, track vibes, and find your next wave. Built with Next.js + GLM 5.2.",
  openGraph: {
    title: '🌊 Wave Report — Surf Spot Rater',
    description: 'Built in 1 hour with GLM 5.2. Live conditions + AI Coach.',
    images: [
      {
        url: 'https://wave-report-ten.vercel.app/api/og.png',
        width: 1200,
        height: 630,
        alt: 'Wave Report — surf spot rater with live conditions and AI coach',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '🌊 Wave Report',
    description: 'Rate the breaks. Track the vibes. Find your next wave.',
    images: ['https://wave-report-ten.vercel.app/api/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
