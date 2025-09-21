'use client';
import { useSession } from 'next-auth/react';
import React from 'react'
import { StavkaKorpe } from '../../types';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '@/i18n/config';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import StripeButton from '@/components/Stripe Checkout';

export default function KorpaPage() {
  const { t } = useTranslation('korpa');
  const { data: session } = useSession();
  const [stavke, setStavke] = useState<StavkaKorpe[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchKorpa() {
      setLoading(true);
      const korisnikId = session?.user?.id;
      if (!korisnikId) return setLoading(false);
      const res = await fetch(`/api/korpa?korisnikId=${korisnikId}`);
      const data = await res.json();
      setStavke(data.stavke);
      setLoading(false);
    }
    fetchKorpa();
  }, [session]);

  const handleKolicina = async (id: string, kolicina: number) => {
    await fetch('/api/korpa', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, kolicina })
    });
    const korisnikId = session?.user?.id;
    if (!korisnikId) return;
    const res = await fetch(`/api/korpa?korisnikId=${korisnikId}`);
    const data = await res.json();
    setStavke(data.stavke);
  };

  const handleDelete = async (id: string) => {
    await fetch('/api/korpa', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const korisnikId = session?.user?.id;
    if (!korisnikId) return;
    const res = await fetch(`/api/korpa?korisnikId=${korisnikId}`);
    const data = await res.json();
    setStavke(data.stavke);
  };

  const potvrdiPorudzbinu = async () => {
    try {
      const response = await fetch('/api/porudzbine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          korisnikId: session?.user?.id,
          ukupno: stavke.reduce((acc, s) => acc + (s.proizvod ? s.proizvod.cena * s.kolicina : 0), 0),
          status: 'Na čekanju', // ili drugi status
          email: session?.user?.email, // ako treba
          idPlacanja: crypto.randomUUID(), // generiši jedinstven ID
        }),
      });
      if (response.ok) {
        alert('Porudžbina uspešno poslata!');
      } else {
        alert('Greška pri slanju porudžbine.');
      }
    } catch {
      alert('Greška pri slanju porudžbine.');
    }
  };

  const handleZavrsiKupovinu = () => {
    potvrdiPorudzbinu(); // prvo unesi stavke u Porudžbine
    router.push('/placanje'); // zatim preusmjeri na Placanje
  };

    if (loading) return <div className="p-4">{t('loading')}</div>;

    if (!stavke.length) return <div className="p-4">{t('empty')}</div>;

  return (
    <div className="p-4 flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
        <div className="bg-white rounded shadow p-4 mb-4">
          <h2 className="font-semibold mb-2">Stavke u korpi</h2>
          {stavke.length === 0 ? (
            <div className="text-gray-500">{t('empty')}</div>
          ) : (
            stavke.map((s) => (
              <div key={s.id} className="flex items-center justify-between border-b py-4">
                <div className="flex items-center gap-4">
                  {s.proizvod?.slika && (
                    <Image src={s.proizvod.slika} alt={s.proizvod.naziv || ''} width={64} height={64} className="object-contain" />
                  )}
                  <div>
                    <div className="font-semibold">{s.proizvod?.naziv}</div>
                    <div className="text-green-600 font-bold">{s.proizvod?.cena} EUR</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-2 py-1 border rounded" onClick={() => handleKolicina(s.id, s.kolicina - 1)} disabled={s.kolicina <= 1}>-</button>
                  <span className="px-2">{s.kolicina}</span>
                  <button className="px-2 py-1 border rounded" onClick={() => handleKolicina(s.id, s.kolicina + 1)}>+</button>
                </div>
                <div className="font-bold">{s.proizvod ? (s.proizvod.cena * s.kolicina).toFixed(2) : '0.00'} EUR</div>
                <button className="text-red-600 ml-4" onClick={() => handleDelete(s.id)}>Ukloni</button>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="w-full md:w-96">
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2">Rezime narudžbe</h2>
          <div className="flex justify-between mb-1">
            <span>Ukupno stavki:</span>
            <span>{stavke.reduce((acc, s) => acc + s.kolicina, 0)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Subtotal</span>
            <span>{stavke.reduce((acc, s) => acc + (s.proizvod ? s.proizvod.cena * s.kolicina : 0), 0).toFixed(2)} EUR</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Dostava</span>
            <span>0.00 EUR</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2 mb-4">
            <span>Ukupno</span>
            <span>{stavke.reduce((acc, s) => acc + (s.proizvod ? s.proizvod.cena * s.kolicina : 0), 0).toFixed(2)} EUR</span>
          </div>

          <button className="w-full flex items-center justify-center gap-2 bg-yellow-400 text-gray-900 py-2 rounded font-bold mb-2" onClick={() => window.location.href = '/placanje/paypal'}>
            {/* PayPal dugme */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="6" fill="#fff" />
              <path d="M10 22L12 10H18C21 10 22 12 21.5 14.5C21 17 19 18 16.5 18H14.5L14 22H10Z" fill="#003087" />
              <path d="M14 22L14.5 18H16.5C19 18 21 17 21.5 14.5C22 12 21 10 18 10H12L10 22H14Z" fill="#009CDE" fillOpacity={0.7} />
              <path d="M14.5 18L15 14H17C18.5 14 19 15 18.5 16C18 17 17 18 15.5 18H14.5Z" fill="#012169" />
            </svg>
            PayPal
          </button>
          {/* Stripe dugme */}
          <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded font-bold mb-2" onClick={() => window.location.href = '/placanje/stripe'}>
            {/* Stripe logo SVG */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="6" fill="#fff" />
              <text x="16" y="21" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#635BFF">Stripe</text>
            </svg>
            Stripe
          </button>
          {/* <button className="w-full bg-gray-200 text-gray-700 py-2 rounded" onClick={handlePotvrdi}>Potvrdi</button> */}
          <button className="w-full bg-green-600 text-white py-2 rounded font-bold" onClick={handleZavrsiKupovinu}>Završi kupovinu</button>
        </div>
        <StripeButton />
      </div>
    </div>
  );
}
