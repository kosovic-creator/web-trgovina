'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

function IzmeniProizvodPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  type ProizvodForm = {
    naziv?: string;
    cena?: number | string;
    opis?: string;
    karakteristike?: string;
    kategorija?: string;
    kolicina?: number | string;
    slika?: string;
    error?: string;
  };

  const [form, setForm] = useState<ProizvodForm | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/proizvodi/${id}`)
        .then(res => res.json())
        .then(data => setForm(data));
    }
  }, [id]);

  if (!form) return <div>Učitavanje...</div>;
  if (form.error) return <div>{form.error}</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/proizvodi', {
      method: 'PUT',
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
      <h2>Izmeni proizvod</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-md">
        <input name="naziv" value={form.naziv || ''} onChange={handleChange} placeholder="Naziv" required />
        <input name="cena" value={form.cena || ''} onChange={handleChange} placeholder="Cena" required type="number" />
        <input name="opis" value={form.opis || ''} onChange={handleChange} placeholder="Opis" />
        <input name="karakteristike" value={form.karakteristike || ''} onChange={handleChange} placeholder="Karakteristike" />
        <input name="kategorija" value={form.kategorija || ''} onChange={handleChange} placeholder="Kategorija" />
        <input name="kolicina" value={form.kolicina || ''} onChange={handleChange} placeholder="Količina" required type="number" />
        <input name="slika" value={form.slika || ''} onChange={handleChange} placeholder="Slika" />
        <button type="submit" className="bg-violet-600 text-white px-4 py-2 rounded">Sačuvaj izmene</button>
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </div>
  );
}

export default IzmeniProizvodPage;