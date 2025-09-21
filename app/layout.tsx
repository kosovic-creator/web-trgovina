"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useState } from 'react';
import { SessionProvider } from "next-auth/react";
import { KorpaProvider } from "@/components/KorpaContext";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <KorpaProvider>
            <div>
              <Navbar setSidebarOpen={setSidebarOpen} />

              <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
              <div style={{ marginLeft: sidebarOpen ? '14rem' : 0, transition: 'margin-left 0.3s' }}>
                {children}
              </div>
            </div>
          </KorpaProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
