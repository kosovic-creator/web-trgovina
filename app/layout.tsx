"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionLayout from "../components/SessionLayout";
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useState } from 'react';


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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionLayout>
          <div>
            <Navbar setSidebarOpen={setSidebarOpen} />
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div style={{ marginLeft: sidebarOpen ? '14rem' : 0, transition: 'margin-left 0.3s' }}>
              {children}
            </div>
          </div>
        </SessionLayout>
      </body>
    </html>
  );
}
