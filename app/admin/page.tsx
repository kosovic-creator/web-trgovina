'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '@/i18n/config';
import Image from 'next/image';
import { FaSearch, FaTimes } from "react-icons/fa";
import { Korisnik } from '@/types';
import { Porudzbina } from '@/types';
import { Proizvod } from '@/types';
import { z } from 'zod';


// Zod šeme
const korisnikSchema = (t: (key: string) => string) => z.object({
  ime: z.string().min(2, { message: t('ime_error') }),
  prezime: z.string().min(2, { message: t('prezime_error') }),
  email: z.string().email({ message: t('email_error') }),
  telefon: z.string().min(5, { message: t('telefon_error') }).max(15).regex(/^\+?[0-9\s]*$/, { message: t('telefon_error') }).optional(),
  drzava: z.string().min(2, { message: t('drzava_error') }),
  grad: z.string().min(2, { message: t('grad_error') }).optional(),
  postanskiBroj: z.string().min(2, { message: t('postanskiBroj_error') }).optional(),
  adresa: z.string().min(2, { message: t('adresa_error') }).optional(),
  uloga: z.enum(['korisnik', 'admin'], { message: t('uloga_error') }),
  lozinka: z.string().min(6, { message: t('lozinka_error') }),
});

const proizvodSchema = (t: (key: string) => string) => z.object({
  naziv: z.string().min(2, { message: t('naziv_error') }),
  cena: z.number().min(0, { message: t('cena_error') }),
  slika: z.string().optional(),
  opis: z.string().optional(),
  karakteristike: z.string().optional(),
  kategorija: z.string().optional(),
  kolicina: z.number().min(1, { message: t('kolicina_error') }),
});

const porudzbinaSchema = (t: (key: string) => string) => z.object({
  korisnikId: z.string().min(1, { message: t('korisnikId_error') }),
  ukupno: z.number().min(0, { message: t('ukupno_error') }),
  status: z.string().min(2, { message: t('status_error') }),
  kreiran: z.string().optional(),
  email: z.string().email({ message: t('email_error') }).optional(),
  idPlacanja: z.string().optional(),
});


export default function AdminHome() {
  const { t } = useTranslation(['home', 'korisnici']);
  const [tab, setTab] = useState<'korisnici' | 'proizvodi' | 'porudzbine'>('korisnici');
  const [porudzbine, setPorudzbine] = useState<Porudzbina[]>([]);
  const [porudzbinaForm, setPorudzbinaForm] = useState({ korisnikId: '', korisnik: '', ukupno: 0, status: '', kreiran: '', email: '', idPlacanja: '' });
  const [editPorudzbinaId, setEditPorudzbinaId] = useState<string | null>(null);
  const [proizvodForm, setProizvodForm] = useState({ naziv: '', cena: 0, slika: '', opis: '', karakteristike: '', kategorija: '', kolicina: 1 });
  const [proizvodi, setProizvodi] = React.useState<Proizvod[]>([]);
  const [korisnici, setKorisnici] = useState<Korisnik[]>([]);
  const [korisnikForm, setKorisnikForm] = useState({
    ime: '',
    prezime: '',
    email: '',
    telefon: '',
    drzava: '',
    grad: '',
    postanskiBroj: '',
    adresa: '',
    uloga: 'korisnik',
    lozinka: ''
  });
  const [editKorisnikId, setEditKorisnikId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [search, setSearch] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
    const parse = proizvodSchema((key) => t(key, { ns: 'proizvodi' })).safeParse(proizvodForm);
    if (!parse.success) {
      const fieldErrors: { [key: string]: string } = {};
      parse.error.issues.forEach(issue => {
        if (issue.path[0]) fieldErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    let slikaUrl = '';
    if (file) {
      const formDataSlika = new FormData();
      formDataSlika.append('slika', file);
      formDataSlika.append('id', proizvodForm.naziv); // ili drugi jedinstveni id

      const resSlika = await fetch('/api/proizvodi/slika', {
        method: 'POST',
        body: formDataSlika,
      });
      const dataSlika = await resSlika.json();
      slikaUrl = dataSlika.slika || '';
    }

    const formData = {
      naziv: proizvodForm.naziv,
      cena: proizvodForm.cena,
      opis: proizvodForm.opis,
      karakteristike: proizvodForm.karakteristike,
      kategorija: proizvodForm.kategorija,
      kolicina: proizvodForm.kolicina,
      slika: slikaUrl,
    };

    await fetch('/api/proizvodi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    setProizvodForm({ naziv: '', cena: 0, slika: '', opis: '', karakteristike: '', kategorija: '', kolicina: 1 });
    setFile(null);

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
        karakteristike: proizvod.karakteristike || '',
        kategorija: proizvod.kategorija || '',
        kolicina: proizvod.kolicina,
      });
      setEditPorudzbinaId(id);
    }
  };

  const handleProizvodUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editPorudzbinaId) return;

    let slikaUrl = proizvodForm.slika || '';
    if (file) {
      const formDataSlika = new FormData();
      formDataSlika.append('slika', file);
      formDataSlika.append('id', proizvodForm.naziv); // ili drugi jedinstveni id

      const resSlika = await fetch('/api/proizvodi/slika', {
        method: 'PUT',
        body: formDataSlika,
      });
      const dataSlika = await resSlika.json();
      slikaUrl = dataSlika.slika || '';
    }

    const formData = {
      id: editPorudzbinaId,
      naziv: proizvodForm.naziv,
      cena: proizvodForm.cena,
      opis: proizvodForm.opis,
      karakteristike: proizvodForm.karakteristike,
      kategorija: proizvodForm.kategorija,
      kolicina: proizvodForm.kolicina,
      slika: slikaUrl,
    };

    await fetch('/api/proizvodi', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    setProizvodForm({ naziv: '', cena: 0, slika: '', opis: '', karakteristike: '', kategorija: '', kolicina: 1 });
    setFile(null);
    setEditPorudzbinaId(null);

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
    const parse = korisnikSchema((key) => t(key, { ns: 'korisnici' })).safeParse(korisnikForm);
    if (!parse.success) {
      // Mapiraj greške po polju
      const fieldErrors: { [key: string]: string } = {};
      parse.error.issues.forEach(issue => {
        if (issue.path[0]) fieldErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    await fetch('/api/korisnici', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(korisnikForm),
    });
    setKorisnikForm({ ime: '', prezime: '', email: '', telefon: '', drzava: '', grad: '', postanskiBroj: '', adresa: '', uloga: 'korisnik', lozinka: '' });
    // Ponovo učitaj korisnike
    fetch('/api/korisnici?page=1&pageSize=10')
      .then(res => res.json())
      .then(data => setKorisnici(data.korisnici || []));
  };

  // Edit korisnika
  const handleKorisnikEdit = (k: Korisnik) => {
    setKorisnikForm({ ime: k.ime ?? '', prezime: k.prezime ?? '', email: k.email ?? '', telefon: k.telefon ?? '', drzava: k.drzava ?? '', grad: k.grad ?? '', postanskiBroj: k.postanskiBroj !== undefined && k.postanskiBroj !== null ? String(k.postanskiBroj) : '', adresa: k.adresa ?? '', uloga: k.uloga ?? '', lozinka: '' });
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
    setKorisnikForm({ ime: '', prezime: '', email: '', telefon: '', drzava: '', grad: '', postanskiBroj: '', adresa: '', uloga: 'korisnik', lozinka: '' });
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
      korisnik: p.korisnikId ?? '',
      ukupno: p.ukupno,
      status: p.status,
      kreiran: p.kreiran as unknown as string,
      email: p.email ?? '',
      idPlacanja: p.idPlacanja ?? ''
    });
    setEditPorudzbinaId(p.id);
  };

  // Dodaj funkciju za kreiranje nove porudžbine
  const handlePorudzbinaSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parse = porudzbinaSchema(t).safeParse(porudzbinaForm);
    if (!parse.success) {
      alert('Greška u validaciji: ' + parse.error.issues.map(e => e.message).join(', '));
      return;
    }
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
    <div className="px-2 bg-gray-50 min-h-screen w-full">

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
        <div className="w-full">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 w-full">
            <h2 className="font-semibold mb-6 text-xl text-violet-700">{t('add_new_user')}</h2>
            <form onSubmit={editKorisnikId ? handleKorisnikUpdate : handleKorisnikSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Ime"
                value={korisnikForm.ime}
                onChange={e => setKorisnikForm(f => ({ ...f, ime: e.target.value }))}
                className="border border-violet-200 p-3 rounded-lg"
              />
              {errors.ime && (
                <span className="text-red-600 text-sm">{errors.ime}</span>
              )}

              <input
                type="text"
                placeholder="Prezime"
                value={korisnikForm.prezime}
                onChange={e => setKorisnikForm(f => ({ ...f, prezime: e.target.value }))}
                className="border border-violet-200 p-3 rounded-lg"
              />
              {errors.prezime && (
                <span className="text-red-600 text-sm">{errors.prezime}</span>
              )}

              <input
                type="email"
                placeholder="Email"
                value={korisnikForm.email}
                onChange={e => setKorisnikForm(f => ({ ...f, email: e.target.value }))}
                className="border border-violet-200 p-3 rounded-lg"
              />
              {errors.email && (
                <span className="text-red-600 text-sm">{errors.email}</span>
              )}

              <input
                type="text"
                placeholder="Telefon"
                value={korisnikForm.telefon}
                onChange={e => setKorisnikForm(f => ({ ...f, telefon: e.target.value }))}
                className="border border-violet-200 p-3 rounded-lg"
              />
              {errors.telefon && (
                <span className="text-red-600 text-sm">{errors.telefon}</span>
              )}

              <input
                type="text"
                placeholder="Država"
                value={korisnikForm.drzava}
                onChange={e => setKorisnikForm(f => ({ ...f, drzava: e.target.value }))}
                className="border border-violet-200 p-3 rounded-lg"
              />
              {errors.drzava && (
                <span className="text-red-600 text-sm">{errors.drzava}</span>
              )}

              <input
                type="text"
                placeholder="Grad"
                value={korisnikForm.grad}
                onChange={e => setKorisnikForm(f => ({ ...f, grad: e.target.value }))}
                className="border border-violet-200 p-3 rounded-lg"
              />
              {errors.grad && (
                <span className="text-red-600 text-sm">{errors.grad}</span>
              )}

              <input
                type="text"
                placeholder="Poštanski broj"
                value={korisnikForm.postanskiBroj}
                onChange={e => setKorisnikForm(f => ({ ...f, postanskiBroj: e.target.value }))}
                className="border border-violet-200 p-3 rounded-lg"
              />
              {errors.postanskiBroj && (
                <span className="text-red-600 text-sm">{errors.postanskiBroj}</span>
              )}

              <input
                type="text"
                placeholder="Adresa"
                value={korisnikForm.adresa}
                onChange={e => setKorisnikForm(f => ({ ...f, adresa: e.target.value }))}
                className="border border-violet-200 p-3 rounded-lg"
              />
              {errors.adresa && (
                <span className="text-red-600 text-sm">{errors.adresa}</span>
              )}

              <select
                value={korisnikForm.uloga}
                onChange={e => setKorisnikForm(f => ({ ...f, uloga: e.target.value }))}
                className="border border-violet-200 p-3 rounded-lg"
              >
                <option value="korisnik">Korisnik</option>
                <option value="admin">Admin</option>
              </select>
              {errors.uloga && (
                <span className="text-red-600 text-sm">{errors.uloga}</span>
              )}

              <input
                type="password"
                placeholder="Lozinka"
                value={korisnikForm.lozinka}
                onChange={e => setKorisnikForm(f => ({ ...f, lozinka: e.target.value }))}
                className="border border-violet-200 p-3 rounded-lg"
              />
              {errors.lozinka && (
                <span className="text-red-600 text-sm">{errors.lozinka}</span>
              )}

              <button type="submit" className="bg-violet-600 text-white px-6 py-2 rounded-lg mt-4">
                {editKorisnikId ? 'Ažuriraj korisnika' : 'Dodaj korisnika'}
              </button>
            </form>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 w-full">
            <h2 className="font-semibold mb-6 text-xl text-violet-700">{t('user_list')}</h2>
            <div className="overflow-x-auto w-full">
              <table className="w-full border border-gray-200 rounded-lg table-auto">
                <thead className="bg-violet-100">
                  <tr>
                    <th className="px-4 py-2 text-left min-w-[140px]">{t('ime', { ns: 'korisnici' })}</th>
                    <th className="px-4 py-2 text-left min-w-[140px]">{t('prezime', { ns: 'korisnici' })}</th>
                    <th className="px-4 py-2 text-left min-w-[200px]">{t('email', { ns: 'korisnici' })}</th>
                    <th className="px-4 py-2 text-left min-w-[140px]">{t('telefon', { ns: 'korisnici' })}</th>
                    <th className="px-4 py-2 text-left min-w-[140px]">{t('drzava', { ns: 'korisnici' })}</th>
                    <th className="px-4 py-2 text-left min-w-[140px]">{t('grad', { ns: 'korisnici' })}</th>
                    <th className="px-4 py-2 text-left min-w-[140px]">{t('postanskiBroj', { ns: 'korisnici' })}</th>
                    <th className="px-4 py-2 text-left min-w-[200px]">{t('adresa', { ns: 'korisnici' })}</th>
                    <th className="px-4 py-2 text-left min-w-[120px]">{t('uloga', { ns: 'korisnici' })}</th>
                    <th className="px-4 py-2 text-left min-w-[160px]">{t('akcije', { ns: 'korisnici' })}</th>
                  </tr>
                </thead>
                <tbody>
                  {korisnici.map((k, idx) => (
                    <tr key={k.id} className={idx % 2 === 0 ? "bg-white" : "bg-violet-50"}>
                      <td className="px-4 py-2">{k.ime}</td>
                      <td className="px-4 py-2">{k.prezime}</td>
                      <td className="px-4 py-2">{k.email}</td>
                      <td className="px-4 py-2">{k.telefon}</td>
                      <td className="px-4 py-2">{k.drzava}</td>
                      <td className="px-4 py-2">{k.grad}</td>
                      <td className="px-4 py-2">{k.postanskiBroj}</td>
                      <td className="px-4 py-2">{k.adresa}</td>
                      <td className="px-4 py-2">{t(k.uloga, { ns: 'korisnici' })}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <button
                          onClick={() => handleKorisnikEdit(k)}
                          className="text-blue-600 hover:underline"
                        >
                          {t('spremi', { ns: 'korisnici' })}
                        </button>
                        <button
                          onClick={() => handleKorisnikDelete(k.id)}
                          className="text-red-600 hover:underline"
                        >
                          {t('obrisi', { ns: 'korisnici' })}
                        </button>
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
        <div className="w-full">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 w-full">
            <h2 className="font-semibold mb-6 text-xl text-violet-700">{t('add_new_product')}</h2>
            {/* Polje za pretragu proizvoda */}
            <div className="mb-6 flex items-center gap-2 max-full">
              <div className="relative w-full">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={t('search_placeholder', { ns: 'proizvodi' })}
                  className="w-full border border-violet-300 rounded-lg p-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400 text-lg" />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-600 focus:outline-none"
                    aria-label="Clear search"
                  >
                    <FaTimes className="text-lg" />
                  </button>
                )}
              </div>
            </div>

            <form className="flex flex-col gap-4" onSubmit={editPorudzbinaId ? handleProizvodUpdate : handleProizvodSubmit}>
              <input
                type="text"
                placeholder={t('product_name')}
                value={proizvodForm.naziv}
                onChange={e => setProizvodForm(f => ({ ...f, naziv: e.target.value }))}
                 className="border border-violet-200 p-3 rounded-lg"
              />
              {errors.naziv && <span className="text-red-600 text-sm">{errors.naziv}</span>}

              <input
                type="number"
                placeholder={t('price')}
                value={proizvodForm.cena}
                onChange={e => setProizvodForm(f => ({ ...f, cena: Number(e.target.value) }))}
                 className="border border-violet-200 p-3 rounded-lg"
              />
              {errors.cena && <span className="text-red-600 text-sm">{errors.cena}</span>}

              <input
                type="text"
                placeholder={t('characteristics')}
                value={proizvodForm.karakteristike}
                onChange={e => setProizvodForm(f => ({ ...f, karakteristike: e.target.value }))}
                 className="border border-violet-200 p-3 rounded-lg"
              />
              {errors.karakteristike && <span className="text-red-600 text-sm">{errors.karakteristike}</span>}

              <input
                type="text"
                placeholder={t('category')}
                value={proizvodForm.kategorija}
                onChange={e => setProizvodForm(f => ({ ...f, kategorija: e.target.value }))}
                 className="border border-violet-200 p-3 rounded-lg"
              />
              {errors.kategorija && <span className="text-red-600 text-sm">{errors.kategorija}</span>}

              <input
                type="text"
                placeholder={t('description')}
                value={proizvodForm.opis}
                onChange={e => setProizvodForm(f => ({ ...f, opis: e.target.value }))}
                 className="border border-violet-200 p-3 rounded-lg"
              />
              {errors.opis && <span className="text-red-600 text-sm">{errors.opis}</span>}

              <input
                type="number"
                placeholder={t('količina')}
                value={proizvodForm.kolicina}
                onChange={e => setProizvodForm(f => ({ ...f, kolicina: Number(e.target.value) }))}
                 className="border border-violet-200 p-3 rounded-lg"
              />
              {errors.kolicina && <span className="text-red-600 text-sm">{errors.kolicina}</span>}

              <button
                type="submit"
               className="bg-violet-600 text-white px-6 py-2 rounded-lg mt-4">

                {editPorudzbinaId ? t('save_changes', { ns: 'proizvodi' }) : t('dodaj', { ns: 'proizvodi' })}
              </button>
            </form>
          </div>
          {/* Filterirani prikaz proizvoda u tabeli */}
          <div className="bg-white rounded-xl shadow-lg p-8 w-full">
            <h2 className="font-semibold mb-6 text-xl text-violet-700">{t('product_list')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full border border-violet-200 rounded-lg shadow-md text-sm">
                <thead>
                  <tr className="bg-violet-100 text-violet-700">
                    <th className="px-8 py-3 text-left align-middle">{t('image')}</th>
                    <th className="px-8 py-3 text-left align-middle">{t('product_name')}</th>
                    <th className="px-8 py-3 text-left align-middle">{t('price')}</th>
                    <th className="px-8 py-3 text-left align-middle">{t('karakteristike') || 'Karakteristike'}</th>
                    <th className="px-8 py-3 text-left align-middle">{t('kategorija') || 'Kategorija'}</th>
                    <th className="px-8 py-3 text-left align-middle">{t('quantity')}</th>
                    <th className="px-8 py-3 text-left align-middle">{t('created')}</th>
                    <th className="px-8 py-3 text-left align-middle">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {proizvodi.filter(p => p.naziv.toLowerCase().includes(search?.toLowerCase() || ""))
                    .map((p) => (
                      <tr key={p.id} className="hover:bg-violet-50 transition">
                        <td className="px-8 py-3 text-left align-middle">{p.slika ? <Image src={p.slika} alt={p.naziv} width={48} height={48} className="object-cover rounded-lg" /> : '-'}</td>
                        <td className="px-8 py-3 text-left align-middle">{p.naziv}</td>
                        <td className="px-8 py-3 text-left align-middle">{p.cena} EUR</td>
                        <td className="px-8 py-3 text-left align-middle">{p.karakteristike}</td>
                        <td className="px-8 py-3 text-left align-middle">{p.kategorija}</td>
                        <td className="px-8 py-3 text-left align-middle">{p.kolicina}</td>
                        <td className="px-8 py-3 text-left align-middle">{p.kreiran ? new Date(p.kreiran).toLocaleDateString() : '-'}</td>
                        <td className="px-8 py-3 text-left align-middle flex gap-2">
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
          <div className="overflow-x-auto">
            <table className="w-full border border-violet-200 rounded-lg shadow-md text-sm">
              <thead>
                <tr className="bg-violet-100 text-violet-700">
                  <th className="px-8 py-3 text-left align-middle">{t('id')}</th>
                  <th className="px-8 py-3 text-left align-middle">{t('user')}</th>
                  <th className="px-8 py-3 text-left align-middle">{t('total')}</th>
                  <th className="px-8 py-3 text-left align-middle">{t('status')}</th>
                  <th className="px-8 py-3 text-left align-middle">{t('created')}</th>
                </tr>
              </thead>
              <tbody>
                {porudzbine.map((p) => (
                  <tr key={p.id} className="hover:bg-violet-50 transition">
                    <td className="px-8 py-3 text-left align-middle">{p.id}</td>
                    <td className="px-8 py-3 text-left align-middle">{p.korisnikId}</td>
                    <td className="px-8 py-3 text-left align-middle">{p.ukupno} EUR</td>
                    <td className="px-8 py-3 text-left align-middle">{p.status}</td>
                    <td className="px-8 py-3 text-left align-middle">{new Date(p.kreiran).toLocaleDateString()}</td>
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
