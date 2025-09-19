'use client';
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Sidebar from "./Sidebar";
import React, { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <nav className="flex items-center gap-4 p-4 border-b border-gray-200">
      {/* Hamburger Icon */}
      <button
        className="p-2 focus:outline-none md:hidden"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Link href="/">Početna</Link>
      {session?.user ? (
        <>
          <Link href="/profil">Profil</Link>
          <button onClick={() => signOut({ callbackUrl: "/auth/prijava" })}>Odjava</button>
        </>
      ) : (
        <>
          <Link href="/auth/prijava">Prijava</Link>
          <Link href="/auth/registracija">Registracija</Link>
        </>
      )}
    </nav>
  );
}
