'use client';
import { useSession } from 'next-auth/react';
import React from 'react'
import { StavkaKorpe } from '../../types';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '@/i18n/config';
import Image from 'next/image';

export default function KorpaPage() {
    const { t } = useTranslation('korpa');
  const { data: session } = useSession();
  const [stavke, setStavke] = useState<StavkaKorpe[]>([]);
  const [loading, setLoading] = useState(true);

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
          <button className="w-full bg-green-600 text-white py-2 rounded font-bold mb-2">Završi kupovinu</button>
          <button className="w-full bg-gray-200 text-gray-700 py-2 rounded">Nastavi kupovinu</button>
        </div>
      </div>
    </div>
  );
}
