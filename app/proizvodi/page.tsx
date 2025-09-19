'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Proizvod } from '@/types';
import Image from 'next/image';

export default function ProizvodiPage() {
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
    // Po želji: osvježi brojUKorpi ili prikaz poruke
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Proizvodi</h1>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {proizvodi.map((p: Proizvod) => (
          <div key={p.id} className="border rounded p-4 flex flex-col items-center">
            {p.slika && <Image src={p.slika} alt={p.naziv} width={80} height={80} className="object-cover mb-2" />}
            <div className="font-semibold">{p.naziv}</div>
            <div className="text-gray-600">{p.opis}</div>
            <div className="mt-2 font-bold">{p.cena} €</div>
            <div className="text-xs text-gray-400 mt-1">Količina: {p.kolicina}</div>
            <button className="btn mt-2" onClick={() => handleDodajUKorpu(p)}>Dodaj u korpu</button>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center gap-2">
        <button className="btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prethodna</button>
        <span>Stranica {page}</span>
        <button className="btn" disabled={page * pageSize >= total} onClick={() => setPage(p => p + 1)}>Sljedeća</button>
      </div>
    </div>
  );
}
