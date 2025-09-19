'use client';
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Sidebar from "./Sidebar";
import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";

export default function Navbar() {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [brojUKorpi, setBrojUKorpi] = useState(0);
  const isAdmin = session?.user?.uloga === 'admin';

  useEffect(() => {
    // Pretpostavljam da postoji API ili localStorage za broj proizvoda u korpi
    // Ovdje je primjer s localStorage
    const broj = Number(localStorage.getItem('brojUKorpi') || 0);
    setBrojUKorpi(broj);
    // Ako koristiš globalni state, zamijeni s odgovarajućim dohvatom

    // Pretpostavljam da imaš način za dohvat uloge korisnika (npr. iz sessiona)
    // Ovdje je primjer s localStorage
    // const uloga = localStorage.getItem('uloga');
    // Ako koristiš globalni state/session, zamijeni s odgovarajućim dohvatom
  }, []);

  return (
    <nav className="flex items-center gap-4 p-4 border-b border-gray-200">
      {/* Hamburger Icon - uvijek vidljiva */}
      <button
        className="p-2 focus:outline-none"
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
      <Link href="/korpa" className="relative flex items-center ml-4">
        <FaShoppingCart size={24} />
        {brojUKorpi > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
            {brojUKorpi}
          </span>
        )}
      </Link>
      {isAdmin && (
        <Link href="/admin" className="ml-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
          Admin
        </Link>
      )}
    </nav>
  );
}
