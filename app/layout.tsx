"use client";

import "./globals.css";

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useState } from 'react';
import { SessionProvider } from "next-auth/react";
import { KorpaProvider } from "@/components/KorpaContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <body className="w-full bg-gray-50">
        <SessionProvider>
          <KorpaProvider>
            <div className="flex min-h-screen w-full">
              <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
              <div className="flex-1 transition-all duration-300 bg-gray-50">
                <Navbar setSidebarOpen={setSidebarOpen} />
                {children}
              </div>
            </div>
          </KorpaProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
