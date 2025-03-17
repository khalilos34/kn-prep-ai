import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Footer from "@/components/layout/footer/Footer";
import Navbar from "@/components/layout/header/Navbar";
import HeaderAnnouncement from "@/components/layout/header/HeaderAnnouncement";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kn PrepAi",
  description: "Generated by create Khalil Naoueji",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <HeaderAnnouncement />
          <div className="flex flex-col relative h-screen">
            <Navbar />
            <main className="container mx-auto max-w-7xl px-6 pt-16 flex-grow">
              {children}
            </main>
            <footer className="flex items-center justify-center w-full">
              <Footer />
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
