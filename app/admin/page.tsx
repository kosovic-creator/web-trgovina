'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '@/i18n/config';
import Image from 'next/image';

type Porudzbina = {
  id: string;
  korisnik: string;
  ukupno: number;
  status: string;
  kreiran: string;
};

interface Proizvod {
  id: string;
  naziv: string;
  kolicina: number;
  slika?: string;
  cena?: number;
  opis?: string;
  kreiran?: string;
}

type Korisnik = {
  id: string;
  ime: string;
  email: string;
  uloga: string;
  kreiran: string;
};

export default function AdminHome() {
  const { t } = useTranslation('home');
  const [tab, setTab] = useState<'korisnici' | 'proizvodi' | 'porudzbine'>('korisnici');
  const [porudzbine, setPorudzbine] = useState<Porudzbina[]>([]);
  const [porudzbinaForm, setPorudzbinaForm] = useState({ korisnik: '', ukupno: 0, status: '', kreiran: '' });
  const [editPorudzbinaId, setEditPorudzbinaId] = useState<string | null>(null);
  const [proizvodForm, setProizvodForm] = useState({ naziv: '', cena: 0, slika: '', opis: '', kolicina: 1 });
  const [proizvodi, setProizvodi] = React.useState<Proizvod[]>([]);
  const [korisnici, setKorisnici] = useState<Korisnik[]>([]);
  const [korisnikForm, setKorisnikForm] = useState({ ime: '', email: '', uloga: 'korisnik', lozinka: '' });
  const [editKorisnikId, setEditKorisnikId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/korisnici?page=1&pageSize=10')
      .then(res => res.json())
      .then(data => setKorisnici(data.korisnici || []));
  }, []);

  useEffect(() => {
    fetch('/api/porudzbine?page=1&pageSize=10')
      .then(res => res.json())
      .then(data => {
        setPorudzbine(data.porudzbine || []);
      });
  }, []);

  useEffect(() => {
    fetch('/api/proizvodi?page=1&pageSize=10')
      .then(res => res.json())
      .then(data => {
        setProizvodi(data.proizvodi || []);
      });
  }, []);

  const handleEdit = (p: Porudzbina) => {
    setPorudzbinaForm({ korisnik: p.korisnik, ukupno: p.ukupno, status: p.status, kreiran: p.kreiran });
    setEditPorudzbinaId(p.id);
  };

  const handleDelete = async (id: string) => {
    await fetch('/api/porudzbine', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    // Dodaj ponovno učitavanje porudžbina
  };

  const handleProizvodSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch('/api/proizvodi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proizvodForm)
    });
    setProizvodForm({ naziv: '', cena: 0, slika: '', opis: '', kolicina: 1 });
    // Ponovno učitavanje proizvoda
    fetch('/api/proizvodi?page=1&pageSize=10')
      .then(res => res.json())
      .then(data => {
        setProizvodi(data.proizvodi);
      });
  };

  const handleProizvodEdit = async (id: number) => {
    // Primer: otvori formu za edit, ili direktno izmeni
    // Ovde možeš dodati logiku za editovanje proizvoda
    // npr. setProizvodForm sa podacima proizvoda za edit
    const proizvod = proizvodi.find(p => p.id === String(id));
    if (proizvod) {
      setProizvodForm({
        naziv: proizvod.naziv,
        cena: proizvod.cena || 0,
        slika: proizvod.slika || '',
        opis: proizvod.opis || '',
        kolicina: proizvod.kolicina,
      });
      setEditPorudzbinaId(id);
    }
  };

  const handleProizvodUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editPorudzbinaId) return;
    await fetch('/api/proizvodi', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editPorudzbinaId, ...proizvodForm }),
    });
    setProizvodForm({ naziv: '', cena: 0, slika: '', opis: '', kolicina: 1 });
    setEditPorudzbinaId(null);
    // Ponovo učitaj proizvode
    fetch('/api/proizvodi?page=1&pageSize=10')
      .then(res => res.json())
      .then(data => setProizvodi(data.proizvodi || []));
  };

  interface HandleProizvodDeleteParams {
    id: string;
  }

  const handleProizvodDelete = async (id: HandleProizvodDeleteParams['id']): Promise<void> => {
    await fetch('/api/proizvodi', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    // Ponovo učitaj proizvode
    fetch('/api/proizvodi?page=1&pageSize=10')
      .then((res: Response) => res.json())
      .then((data: { proizvodi: Proizvod[] }) => setProizvodi(data.proizvodi || []));
  };

  // Dodavanje korisnika
  const handleKorisnikSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch('/api/korisnici', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(korisnikForm),
    });
    setKorisnikForm({ ime: '', email: '', uloga: 'korisnik', lozinka: '' });
    // Ponovo učitaj korisnike
    fetch('/api/korisnici?page=1&pageSize=10')
      .then(res => res.json())
      .then(data => setKorisnici(data.korisnici || []));
  };

  // Edit korisnika
  const handleKorisnikEdit = (k: Korisnik) => {
    setKorisnikForm({ ime: k.ime, email: k.email, uloga: k.uloga, lozinka: '' });
    setEditKorisnikId(k.id);
  };

  // Update korisnika
  const handleKorisnikUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editKorisnikId) return;
    const res = await fetch('/api/korisnici', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editKorisnikId, ...korisnikForm }),
    });
    const result = await res.json();
    if (!res.ok) {
      alert(result.error || 'Greška!');
      return;
    }
    setKorisnikForm({ ime: '', email: '', uloga: 'korisnik', lozinka: '' });
    setEditKorisnikId(null);
    fetch('/api/korisnici?page=1&pageSize=10')
      .then(res => res.json())
      .then(data => setKorisnici(data.korisnici || []));
  };

  // Delete korisnika
  const handleKorisnikDelete = async (id: string) => {
    await fetch('/api/korisnici', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    // Ponovo učitaj korisnike
    fetch('/api/korisnici?page=1&pageSize=10')
      .then(res => res.json())
      .then(data => setKorisnici(data.korisnici || []));
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">{t('admin_panel')}</h1>
      <div className="flex gap-4 mb-8">
        <button onClick={() => setTab('korisnici')} className={`px-4 py-2 rounded ${tab === 'korisnici' ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{t('users')}</button>
        <button onClick={() => setTab('proizvodi')} className={`px-4 py-2 rounded ${tab === 'proizvodi' ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{t('products')}</button>
        <button onClick={() => setTab('porudzbine')} className={`px-4 py-2 rounded ${tab === 'porudzbine' ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{t('orders')}</button>
      </div>
      {tab === 'korisnici' && (
        <div>
          <div className="bg-white rounded shadow p-6 mb-8">
            <h2 className="font-semibold mb-4">{t('add_new_user')}</h2>
            <form onSubmit={editKorisnikId ? handleKorisnikUpdate : handleKorisnikSubmit}>
              <input type="text" placeholder={t('name')} className="border p-2 rounded flex-1 min-w-[180px]" required value={korisnikForm.ime} onChange={e => setKorisnikForm(f => ({ ...f, ime: e.target.value }))} />
              <input type="email" placeholder={t('email')} className="border p-2 rounded flex-1 min-w-[180px]" required value={korisnikForm.email} onChange={e => setKorisnikForm(f => ({ ...f, email: e.target.value }))} />
              <input type="lozinka" placeholder={t('lozinka')} className="border p-2 rounded flex-1 min-w-[180px]" required value={korisnikForm.lozinka} onChange={e => setKorisnikForm(f => ({ ...f, lozinka: e.target.value }))} />
              <select className="border p-2 rounded flex-1 min-w-[180px]" value={korisnikForm.uloga} onChange={e => setKorisnikForm(f => ({ ...f, uloga: e.target.value }))}>
                <option value="korisnik">{t('user')}</option>
                <option value="admin">{t('admin')}</option>
              </select>
              <button type="submit">
                {editKorisnikId ? 'Sačuvaj izmene' : 'Dodaj'}
              </button>
            </form>
          </div>
          <div className="bg-white rounded shadow p-6">
            <h2 className="font-semibold mb-4">{t('user_list')}</h2>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">{t('image')}</th>
                  <th className="p-2">{t('name')}</th>
                  <th className="p-2">{t('email')}</th>
                  <th className="p-2">{t('role')}</th>
                  <th className="p-2">{t('created')}</th>
                  <th className="p-2">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {korisnici.map((k) => (
                  <tr key={k.id}>
                    <td className="p-2"><span className="inline-block w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M6 20c0-2.2 3.6-4 6-4s6 1.8 6 4" /></svg></span></td>
                    <td className="p-2">{k.ime}</td>
                    <td className="p-2">{k.email}</td>
                    <td className="p-2"><span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs">{k.uloga}</span></td>
                    <td className="p-2">{new Date(k.kreiran).toLocaleDateString()}</td>
                    <td className="p-2">
                      <button className="text-blue-600 cursor-pointer mr-4" onClick={() => handleKorisnikEdit(k)}>{t('edit')}</button>
                      <button className="text-red-600 cursor-pointer" onClick={() => handleKorisnikDelete(k.id)}>{t('delete')}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {tab === 'proizvodi' && (
        <div>
          <div className="bg-white rounded shadow p-6 mb-8">
            <h2 className="font-semibold mb-4">Dodaj novi proizvod</h2>
            <form className="flex flex-wrap gap-4 items-center" onSubmit={editPorudzbinaId ? handleProizvodUpdate : handleProizvodSubmit}>
              <input type="text" placeholder="Naziv proizvoda" className="border p-2 rounded flex-1 min-w-[180px]" required value={proizvodForm.naziv} onChange={e => setProizvodForm(f => ({ ...f, naziv: e.target.value }))} />
              <input type="number" placeholder="Cena" className="border p-2 rounded flex-1 min-w-[180px]" required value={proizvodForm.cena} onChange={e => setProizvodForm(f => ({ ...f, cena: Number(e.target.value) }))} />
              <div className="flex flex-col gap-2 flex-1 min-w-[180px]">
                <label className="text-sm">Slika proizvoda</label>
                <input type="text" placeholder="URL slike" className="border p-2 rounded" value={proizvodForm.slika} onChange={e => setProizvodForm(f => ({ ...f, slika: e.target.value }))} />
              </div>
              <input type="text" placeholder="Opis" className="border p-2 rounded flex-1 min-w-[180px]" value={proizvodForm.opis} onChange={e => setProizvodForm(f => ({ ...f, opis: e.target.value }))} />
              <input type="number" placeholder="Količina" className="border p-2 rounded flex-1 min-w-[180px]" required value={proizvodForm.kolicina} onChange={e => setProizvodForm(f => ({ ...f, kolicina: Number(e.target.value) }))} />
              <button type="submit" className="bg-violet-600 text-white px-6 py-2 rounded">
                {editPorudzbinaId ? 'Sačuvaj izmene' : 'Dodaj'}
              </button>
            </form>
          </div>
          <div className="bg-white rounded shadow p-6">
            <h2 className="font-semibold mb-4">Lista proizvoda</h2>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">SLIKA</th>
                  <th className="p-2">NAZIV PROIZVODA</th>
                  <th className="p-2">CENA</th>
                  <th className="p-2">KREIRAN</th>
                  <th className="p-2">AKCIJE</th>
                </tr>
              </thead>
              <tbody>
                {proizvodi.map((p) => (
                  <tr key={p.id}>
                    <td className="p-2">{p.slika ? <Image src={p.slika} alt={p.naziv} width={48} height={48} className="object-cover" /> : '-'}</td>
                    <td className="p-2">{p.naziv}</td>
                    <td className="p-2">{p.cena} EUR</td>
                    <td className="p-2">{p.kreiran ? new Date(p.kreiran).toLocaleDateString() : '-'}</td>
                    <td className="p-2">
                      <button className="text-blue-600 cursor-pointer mr-4" onClick={() => handleProizvodEdit(p.id)}>Uredi</button>
                      <button className="text-red-600 cursor-pointer" onClick={() => handleProizvodDelete(p.id)}>Obriši</button>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>
      )}
      {tab === 'porudzbine' && (
        <div className="bg-white rounded shadow p-6">
          <h2 className="font-semibold mb-4">Lista porudžbina</h2>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">ID</th>
                <th className="p-2">KORISNIK</th>
                <th className="p-2">UKUPNO</th>
                <th className="p-2">STATUS</th>
                <th className="p-2">KREIRAN</th>
                <th className="p-2">AKCIJE</th>
              </tr>
            </thead>
            <tbody>
              {porudzbine.map((p) => (
                <tr key={p.id}>
                  <td className="p-2">{p.id}</td>
                  <td className="p-2">{p.korisnik}</td>
                  <td className="p-2">{p.ukupno} EUR</td>
                  <td className="p-2">{p.status}</td>
                  <td className="p-2">{new Date(p.kreiran).toLocaleDateString()}</td>
                  <td className="p-2">
                    <button className="text-blue-600 cursor-pointer mr-4" onClick={() => handleEdit(p)}>{t('edit')}</button>
                    <button className="text-red-600 cursor-pointer" onClick={() => handleDelete(p.id)}>{t('delete')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
