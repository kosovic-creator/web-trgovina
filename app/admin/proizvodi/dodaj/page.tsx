'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

function DodajProizvodPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    naziv: '',
    cena: '',
    opis: '',
    karakteristike: '',
    kategorija: '',
    kolicina: '',
    slika: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/proizvodi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        cena: Number(form.cena),
        kolicina: Number(form.kolicina),
      }),
    });
    const result = await res.json();
    if (!res.ok) {
      setError(result.error || 'Greška!');
      return;
    }
    router.push('/admin?page=proizvodi');
  };

  return (
    <div>
      <h2>Dodaj novi proizvod</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-md">
        <input name="naziv" value={form.naziv} onChange={handleChange} placeholder="Naziv" required />
        <input name="cena" value={form.cena} onChange={handleChange} placeholder="Cena" required type="number" />
        <input name="opis" value={form.opis} onChange={handleChange} placeholder="Opis" />
        <input name="karakteristike" value={form.karakteristike} onChange={handleChange} placeholder="Karakteristike" />
        <input name="kategorija" value={form.kategorija} onChange={handleChange} placeholder="Kategorija" />
        <input name="kolicina" value={form.kolicina} onChange={handleChange} placeholder="Količina" required type="number" />
        <input name="slika" value={form.slika} onChange={handleChange} placeholder="Slika" />
        <button type="submit" className="bg-violet-600 text-white px-4 py-2 rounded">Dodaj proizvod</button>
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </div>
  );
}

export default DodajProizvodPage;