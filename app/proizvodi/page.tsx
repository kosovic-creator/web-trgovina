'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Proizvod } from '@/types';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import '@/i18n/config';

export default function ProizvodiPage() {
  const { t } = useTranslation('proizvodi');
  const { data: session } = useSession();
  const [proizvodi, setProizvodi] = useState<Proizvod[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    fetch(`/api/proizvodi?page=${page}&pageSize=${pageSize}`)
      .then(res => res.json())
      .then(data => {
        setProizvodi(data.proizvodi);
        setTotal(data.total);
      });
  }, [page, pageSize]);

  const handleDodajUKorpu = async (proizvod: Proizvod) => {
    const korisnikId = session?.user?.id;
    if (!korisnikId) {
      alert('Morate biti prijavljeni za dodavanje u korpu!');
      return;
    }
    await fetch('/api/korpa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ korisnikId, proizvodId: proizvod.id, kolicina: 1 })
    });
    // Dohvati broj stavki iz korpe
    const res = await fetch(`/api/korpa?korisnikId=${korisnikId}`);
    const data = await res.json();
    const broj = data.stavke.reduce((acc: number, s: { kolicina: number }) => acc + s.kolicina, 0);
    localStorage.setItem('brojUKorpi', broj.toString());
    window.dispatchEvent(new Event('korpaChanged'));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {proizvodi.length === 0 ? (
          <div className="col-span-3 text-center text-gray-500">{t('empty')}</div>
        ) : (
          proizvodi.map((p: Proizvod) => (
            <div key={p.id} className="border rounded p-4 flex flex-col items-center">
              {p.slika && <Image src={p.slika} alt={p.naziv} width={80} height={80} className="object-cover mb-2" />}
              <div className="font-semibold">{p.naziv}</div>
              <div className="text-gray-600">{p.opis}</div>
              <div className="mt-2 font-bold">{p.cena} €</div>
              <div className="text-xs text-gray-400 mt-1">{t('kolicina')}: {p.kolicina}</div>
              <button className="btn mt-2" onClick={() => handleDodajUKorpu(p)}>{t('add_to_cart')}</button>
            </div>
          ))
        )}
      </div>
      <div className="flex justify-center items-center gap-2">
        <button className="btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>{t('prethodna')}</button>
        <span>Stranica {page}</span>
        <button className="btn" disabled={page * pageSize >= total} onClick={() => setPage(p => p + 1)}>{t('sljedeca')}</button>
      </div>
    </div>
  );
}
