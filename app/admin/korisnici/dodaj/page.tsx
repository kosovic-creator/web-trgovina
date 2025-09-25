'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

function DodajKorisnikaPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    ime: '',
    prezime: '',
    telefon: '',
    drzava: '',
    grad: '',
    postanskiBroj: '',
    adresa: '',
    uloga: 'korisnik',
    lozinka: '',
    slika: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/korisnici', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        postanskiBroj: Number(form.postanskiBroj),
      }),
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
      <h2>Dodaj novog korisnika</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-md">
        <input name="ime" value={form.ime} onChange={handleChange} placeholder="Ime" required />
        <input name="prezime" value={form.prezime} onChange={handleChange} placeholder="Prezime" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required type="email" />
        <input name="telefon" value={form.telefon} onChange={handleChange} placeholder="Telefon" required />
        <input name="drzava" value={form.drzava} onChange={handleChange} placeholder="Država" />
        <input name="grad" value={form.grad} onChange={handleChange} placeholder="Grad" required />
        <input name="postanskiBroj" value={form.postanskiBroj} onChange={handleChange} placeholder="Poštanski broj" required type="number" />
        <input name="adresa" value={form.adresa} onChange={handleChange} placeholder="Adresa" required />
        <input name="lozinka" value={form.lozinka} onChange={handleChange} placeholder="Lozinka" required type="password" />
        <input name="slika" value={form.slika} onChange={handleChange} placeholder="Slika" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Dodaj korisnika
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
}

export default DodajKorisnikaPage;
