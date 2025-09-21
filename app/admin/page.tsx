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
  email?: string;
  idPlacanja?: string;
  korisnikId?: string;
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
  const [porudzbinaForm, setPorudzbinaForm] = useState({ korisnikId: '', korisnik: '', ukupno: 0, status: '', kreiran: '', email: '', idPlacanja: '' });
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

  const handleProizvodEdit = async (id: string) => {
    // Primer: otvori formu za edit, ili direktno izmeni
    // Ovde možeš dodati logiku za editovanje proizvoda
    // npr. setProizvodForm sa podacima proizvoda za edit
    const proizvod = proizvodi.find(p => p.id === id);
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

  const handlePorudzbinaDelete = async (id: string) => {
    await fetch('/api/porudzbine', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetch('/api/porudzbine?page=1&pageSize=10')
      .then(res => res.json())
      .then(data => setPorudzbine(data.porudzbine || []));
  };

  const handlePorudzbinaEdit = (p: Porudzbina) => {
    setPorudzbinaForm({
      korisnikId: p.korisnikId ?? '',
      korisnik: p.korisnik,
      ukupno: p.ukupno,
      status: p.status,
      kreiran: p.kreiran,
      email: p.email ?? '',
      idPlacanja: p.idPlacanja ?? ''
    });
    setEditPorudzbinaId(p.id);
  };

  // Dodaj funkciju za kreiranje nove porudžbine
  const handlePorudzbinaSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch('/api/porudzbine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(porudzbinaForm),
    });
    setPorudzbinaForm({ korisnikId: '', korisnik: '', ukupno: 0, status: '', kreiran: '', email: '', idPlacanja: '' });
    fetch('/api/porudzbine?page=1&pageSize=10')
      .then(res => res.json())
      .then(data => setPorudzbine(data.porudzbine || []));
  };

  const handlePorudzbinaUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editPorudzbinaId) return;
    await fetch('/api/porudzbine', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editPorudzbinaId,
        korisnikId: porudzbinaForm.korisnikId, // dodaj ovo polje!
        ukupno: porudzbinaForm.ukupno,
        status: porudzbinaForm.status,
        email: porudzbinaForm.email, // ako treba
        idPlacanja: porudzbinaForm.idPlacanja, // ako treba
      }),
    });
    setPorudzbinaForm({ korisnikId: '', korisnik: '', ukupno: 0, status: '', kreiran: '', email: '', idPlacanja: '' });
    setEditPorudzbinaId(null);
    fetch('/api/porudzbine?page=1&pageSize=10')
      .then(res => res.json())
      .then(data => setPorudzbine(data.porudzbine || []));
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-violet-700">{t('admin_panel')}</h1>
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setTab('korisnici')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-sm ${tab === 'korisnici'
            ? 'bg-violet-600 text-white'
            : 'bg-white text-violet-700 border border-violet-200 hover:bg-violet-50'
            }`}
        >
          {t('users')}
        </button>
        <button
          onClick={() => setTab('proizvodi')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-sm ${tab === 'proizvodi'
            ? 'bg-violet-600 text-white'
            : 'bg-white text-violet-700 border border-violet-200 hover:bg-violet-50'
            }`}
        >
          {t('products')}
        </button>
        <button
          onClick={() => setTab('porudzbine')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-sm ${tab === 'porudzbine'
            ? 'bg-violet-600 text-white'
            : 'bg-white text-violet-700 border border-violet-200 hover:bg-violet-50'
            }`}
        >
          {t('orders')}
        </button>
      </div>
      {tab === 'korisnici' && (
        <div>
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="font-semibold mb-6 text-xl text-violet-700">{t('add_new_user')}</h2>
            <form
              onSubmit={editKorisnikId ? handleKorisnikUpdate : handleKorisnikSubmit}
              className="flex flex-wrap gap-4 items-center"
            >
              <input
                type="text"
                placeholder={t('name')}
                className="border border-violet-200 p-3 rounded-lg flex-1 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-violet-400"
                required
                value={korisnikForm.ime}
                onChange={e => setKorisnikForm(f => ({ ...f, ime: e.target.value }))}
              />
              <input
                type="email"
                placeholder={t('email')}
                className="border border-violet-200 p-3 rounded-lg flex-1 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-violet-400"
                required
                value={korisnikForm.email}
                onChange={e => setKorisnikForm(f => ({ ...f, email: e.target.value }))}
              />
              <input
                type="lozinka"
                placeholder={t('lozinka')}
                className="border border-violet-200 p-3 rounded-lg flex-1 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-violet-400"
                required
                value={korisnikForm.lozinka}
                onChange={e => setKorisnikForm(f => ({ ...f, lozinka: e.target.value }))}
              />
              <select
                className="border border-violet-200 p-3 rounded-lg flex-1 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-violet-400"
                value={korisnikForm.uloga}
                onChange={e => setKorisnikForm(f => ({ ...f, uloga: e.target.value }))}
              >
                <option value="korisnik">{t('user')}</option>
                <option value="admin">{t('admin')}</option>
              </select>
              <button
                type="submit"
                className="bg-violet-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-violet-700 transition"
              >
                {editKorisnikId ? t('save_changes') : t('add')}
              </button>
            </form>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="font-semibold mb-6 text-xl text-violet-700">{t('user_list')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full border border-violet-100 rounded-lg">
                <thead>
                  <tr className="bg-violet-50">
                    <th className="p-3">{t('image')}</th>
                    <th className="p-3">{t('name')}</th>
                    <th className="p-3">{t('email')}</th>
                    <th className="p-3">{t('role')}</th>
                    <th className="p-3">{t('created')}</th>
                    <th className="p-3">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {korisnici.map((k) => (
                    <tr key={k.id} className="hover:bg-violet-50 transition">
                      <td className="p-3">
                        <span className="inline-block w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M6 20c0-2.2 3.6-4 6-4s6 1.8 6 4" />
                          </svg>
                        </span>
                      </td>
                      <td className="p-3">{k.ime}</td>
                      <td className="p-3">{k.email}</td>
                      <td className="p-3">
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs">{k.uloga}</span>
                      </td>
                      <td className="p-3">{new Date(k.kreiran).toLocaleDateString()}</td>
                      <td className="p-3 flex gap-2">
                        <button className="text-blue-600 hover:underline" onClick={() => handleKorisnikEdit(k)}>{t('edit')}</button>
                        <button className="text-red-600 hover:underline" onClick={() => handleKorisnikDelete(k.id)}>{t('delete')}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {tab === 'proizvodi' && (
        <div>
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="font-semibold mb-6 text-xl text-violet-700">{t('add_new_product')}</h2>
            <form className="flex flex-wrap gap-4 items-center" onSubmit={editPorudzbinaId ? handleProizvodUpdate : handleProizvodSubmit}>
              <input
                type="text"
                placeholder={t('product_name')}
                className="border border-violet-200 p-3 rounded-lg flex-1 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-violet-400"
                required
                value={proizvodForm.naziv}
                onChange={e => setProizvodForm(f => ({ ...f, naziv: e.target.value }))}
              />
              <input
                type="number"
                placeholder={t('price')}
                className="border border-violet-200 p-3 rounded-lg flex-1 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-violet-400"
                required
                value={proizvodForm.cena}
                onChange={e => setProizvodForm(f => ({ ...f, cena: Number(e.target.value) }))}
              />
              <div className="flex flex-col gap-2 flex-1 min-w-[180px]">
                <label className="text-sm text-violet-700">{t('product_image')}</label>
                <input
                  type="text"
                  placeholder={t('image_url')}
                  className="border border-violet-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
                  value={proizvodForm.slika}
                  onChange={e => setProizvodForm(f => ({ ...f, slika: e.target.value }))}
                />
              </div>
              <input
                type="text"
                placeholder={t('description')}
                className="border border-violet-200 p-3 rounded-lg flex-1 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-violet-400"
                value={proizvodForm.opis}
                onChange={e => setProizvodForm(f => ({ ...f, opis: e.target.value }))}
              />
              <input
                type="number"
                placeholder={t('quantity')}
                className="border border-violet-200 p-3 rounded-lg flex-1 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-violet-400"
                required
                value={proizvodForm.kolicina}
                onChange={e => setProizvodForm(f => ({ ...f, kolicina: Number(e.target.value) }))}
              />
              <button
                type="submit"
                className="bg-violet-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-violet-700 transition"
              >
                {editPorudzbinaId ? t('save_changes') : t('add')}
              </button>
            </form>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="font-semibold mb-6 text-xl text-violet-700">{t('product_list')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full border border-violet-100 rounded-lg">
                <thead>
                  <tr className="bg-violet-50">
                    <th className="p-3">{t('image')}</th>
                    <th className="p-3">{t('product_name')}</th>
                    <th className="p-3">{t('price')}</th>
                    <th className="p-3">{t('created')}</th>
                    <th className="p-3">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {proizvodi.map((p) => (
                    <tr key={p.id} className="hover:bg-violet-50 transition">
                      <td className="p-3">{p.slika ? <Image src={p.slika} alt={p.naziv} width={48} height={48} className="object-cover rounded-lg" /> : '-'}</td>
                      <td className="p-3">{p.naziv}</td>
                      <td className="p-3">{p.cena} EUR</td>
                      <td className="p-3">{p.kreiran ? new Date(p.kreiran).toLocaleDateString() : '-'}</td>
                      <td className="p-3 flex gap-2">
                        <button className="text-blue-600 hover:underline" onClick={() => handleProizvodEdit(p.id)}>{t('edit')}</button>
                        <button className="text-red-600 hover:underline" onClick={() => handleProizvodDelete(p.id)}>{t('delete')}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {tab === 'porudzbine' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="font-semibold mb-6 text-xl text-violet-700">{t('order_list')}</h2>
          <form
            onSubmit={editPorudzbinaId ? handlePorudzbinaUpdate : handlePorudzbinaSubmit}
            className="mb-8 flex flex-wrap gap-4 items-center"
          >
            <input
              type="text"
              placeholder={t('user_id')}
              value={porudzbinaForm.korisnikId}
              onChange={e => setPorudzbinaForm(f => ({ ...f, korisnikId: e.target.value }))}
              className="border border-violet-200 p-3 rounded-lg flex-1 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
            <input
              type="number"
              placeholder={t('total')}
              value={porudzbinaForm.ukupno}
              onChange={e => setPorudzbinaForm(f => ({ ...f, ukupno: Number(e.target.value) }))}
              className="border border-violet-200 p-3 rounded-lg flex-1 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
            <input
              type="text"
              placeholder={t('status')}
              value={porudzbinaForm.status}
              onChange={e => setPorudzbinaForm(f => ({ ...f, status: e.target.value }))}
              className="border border-violet-200 p-3 rounded-lg flex-1 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
            <input
              type="email"
              placeholder={t('email')}
              value={porudzbinaForm.email}
              onChange={e => setPorudzbinaForm(f => ({ ...f, email: e.target.value }))}
              className="border border-violet-200 p-3 rounded-lg flex-1 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
            <input
              type="text"
              placeholder={t('payment_id')}
              value={porudzbinaForm.idPlacanja}
              onChange={e => setPorudzbinaForm(f => ({ ...f, idPlacanja: e.target.value }))}
              className="border border-violet-200 p-3 rounded-lg flex-1 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
            <button
              type="submit"
              className="bg-violet-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-violet-700 transition"
            >
              {editPorudzbinaId ? t('save_changes') : t('add')}
            </button>
          </form>
          <div className="overflow-x-auto">
            <table className="w-full border border-violet-100 rounded-lg">
              <thead>
                <tr className="bg-violet-50">
                  <th className="p-3">{t('id')}</th>
                  <th className="p-3">{t('user')}</th>
                  <th className="p-3">{t('total')}</th>
                  <th className="p-3">{t('status')}</th>
                  <th className="p-3">{t('created')}</th>
                  <th className="p-3">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {porudzbine.map((p) => (
                  <tr key={p.id} className="hover:bg-violet-50 transition">
                    <td className="p-3">{p.id}</td>
                    <td className="p-3">{p.korisnik}</td>
                    <td className="p-3">{p.ukupno} EUR</td>
                    <td className="p-3">{p.status}</td>
                    <td className="p-3">{new Date(p.kreiran).toLocaleDateString()}</td>
                    <td className="p-3 flex gap-2">
                      <button className="text-blue-600 hover:underline" onClick={() => handlePorudzbinaEdit(p)}>{t('edit')}</button>
                      <button className="text-red-600 hover:underline" onClick={() => handlePorudzbinaDelete(p.id)}>{t('delete')}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
