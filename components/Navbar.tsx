/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n/config';
import { useKorpa } from "@/components/KorpaContext";


export default function Navbar({ setSidebarOpen }: { setSidebarOpen?: (open: boolean) => void }) {
  const { t } = useTranslation('navbar');
  const { data: session } = useSession();
  const [brojUKorpi, setBrojUKorpi] = useState(0);
  const { brojStavki } = useKorpa();
  const isAdmin = session?.user?.uloga === 'admin';

  useEffect(() => {
    const broj = Number(localStorage.getItem('brojUKorpi') || 0);
    setBrojUKorpi(broj);
    const handler = () => {
      const broj = Number(localStorage.getItem('brojUKorpi') || 0);
      setBrojUKorpi(broj);
    };
    window.addEventListener('korpaChanged', handler);
    return () => window.removeEventListener('korpaChanged', handler);
  }, []);

  const korisnikId = session?.user?.id;



  return (
    <nav className="flex items-center gap-4 p-4 border-b border-gray-200">
      {!isAdmin && (
        <>
          {/* Hamburger, Home, Korpa */}
          <button
            className="p-2 focus:outline-none"
            onClick={() => setSidebarOpen?.(true)}
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
          <Link href="/">{t('home')}</Link>
          <Link href="/korpa" className="relative flex items-center ml-4">
            <FaShoppingCart size={24} />
            {brojStavki > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2 text-xs">
                {brojStavki}
              </span>
            )}
          </Link>
          {/* Prikaz dugmadi ovisno o prijavi */}
          {!session?.user ? (
            <>
              <Link href="/auth/prijava">{t('login')}</Link>
              <Link href="/auth/registracija">{t('register')}</Link>
            </>
          ) : (
              <button onClick={() => signOut({ callbackUrl: "/auth/prijava" })}>{t('logout')}</button>
          )}
        </>
      )}

      {isAdmin && (
        <>
          {/* Admin link po potrebi */}
          {/* <Link href="/admin" className="ml-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
            Admin
          </Link> */}
          <button onClick={() => signOut({ callbackUrl: "/auth/prijava" })}>{t('logout')}</button>
        </>
      )}
      <div className="flex gap-2 ml-auto">
        <button onClick={() => i18n.changeLanguage('en')} aria-label="English" className="p-1">
          <span role="img" aria-label="English">🇬🇧</span>
        </button>
        <button onClick={() => i18n.changeLanguage('sr')} aria-label="Srpski" className="p-1">
          <span role="img" aria-label="Srpski">🇷🇸</span>
        </button>
      </div>
    </nav>
  );
}


import { SessionProvider } from "next-auth/react";

export function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const korisnikId = session?.user?.id ?? ""; // prilagodi prema svom modelu

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SessionProvider session={session}>
      <div>
        <Navbar setSidebarOpen={setSidebarOpen} />
        {/* ...ostali kod... */}
        {children}
      </div>
    </SessionProvider>
  );
}
