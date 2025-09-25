'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Korisnik {
  id: string;
  email: string;
  ime: string;
  prezime: string;
  telefon: string;
  drzava?: string;
  grad: string;
  postanskiBroj: number;
  adresa: string;
  uloga: string;
  slika?: string;
  error?: string;
}

function KorisnikPage() {
  const params = useParams();
  const id = params ? params['id'] : undefined;
  const router = useRouter();
  const [korisnik, setKorisnik] = useState<Korisnik | null>(null);
  const [form, setForm] = useState<Korisnik | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/korisnici/${id}`)
        .then(res => res.json())
        .then(data => {
          setKorisnik(data);
          setForm(data);
        });
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
    const res = await fetch('/api/korisnici', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const result = await res.json();
    if (!res.ok) {
      setError(result.error || 'Greška!');
      return;
    }
    router.push('/admin?page=korisnici');
  };

  return (
    <div>
      <h2>Izmjena korisnika</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-md">
        <input name="ime" value={form.ime || ''} onChange={handleChange} placeholder="Ime" />
        <input name="prezime" value={form.prezime || ''} onChange={handleChange} placeholder="Prezime" />
        <input name="email" value={form.email || ''} onChange={handleChange} placeholder="Email" />
        <input name="telefon" value={form.telefon || ''} onChange={handleChange} placeholder="Telefon" />
        <input name="drzava" value={form.drzava || ''} onChange={handleChange} placeholder="Država" />
        <input name="grad" value={form.grad || ''} onChange={handleChange} placeholder="Grad" />
        <input name="postanskiBroj" value={form.postanskiBroj || ''} onChange={handleChange} placeholder="Poštanski broj" type="number" />
        <input name="adresa" value={form.adresa || ''} onChange={handleChange} placeholder="Adresa" />
        <input name="uloga" value={form.uloga || ''} onChange={handleChange} placeholder="Uloga" />
        {/* Dodaj ostala polja po potrebi */}
        <button type="submit" className="bg-violet-600 text-white px-4 py-2 rounded">Sačuvaj izmjene</button>
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </div>
  );
}

export default KorisnikPage;
