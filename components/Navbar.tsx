'use client';
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n/config';

export default function Navbar({ setSidebarOpen = () => { } }: { setSidebarOpen?: (open: boolean) => void }) {
  const { t } = useTranslation('navbar');
  const { data: session } = useSession();
  const [brojUKorpi, setBrojUKorpi] = useState(0);
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
      <Link href="/">{t('home')}</Link>
      {session?.user ? (
        <>
          <Link href="/profil">{t('profile')}</Link>
          <button onClick={() => signOut({ callbackUrl: "/auth/prijava" })}>{t('logout')}</button>
        </>
      ) : (
        <>
            <Link href="/auth/prijava">{t('login')}</Link>
            <Link href="/auth/registracija">{t('register')}</Link>
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
