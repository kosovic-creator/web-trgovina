'use client';
import { useState, useEffect } from 'react';
import { Korisnik } from '@/types';

export default function AdminKorisniciPage() {
  const [korisnici, setKorisnici] = useState<Korisnik[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [form, setForm] = useState({ email: '', lozinka: '', uloga: 'korisnik', ime: '', slika: '' });
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/korisnici?page=${page}&pageSize=${pageSize}`)
      .then(res => res.json())
      .then(data => {
        setKorisnici(data.korisnici);
        setTotal(data.total);
      });
  }, [page, pageSize]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editId) {
      await fetch('/api/korisnici', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editId, ...form })
      });
      setEditId(null);
    } else {
      await fetch('/api/korisnici', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
    }
    setForm({ email: '', lozinka: '', uloga: 'korisnik', ime: '', slika: '' });
    fetch(`/api/korisnici?page=${page}&pageSize=${pageSize}`)
      .then(res => res.json())
      .then(data => {
        setKorisnici(data.korisnici);
        setTotal(data.total);
      });
  };

  const handleEdit = (k: Korisnik) => {
    setForm({ email: k.email, lozinka: '', uloga: k.uloga, ime: k.ime || '', slika: k.slika || '' });
    setEditId(k.id);
  };

  const handleDelete = async (id: string) => {
    await fetch('/api/korisnici', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetch(`/api/korisnici?page=${page}&pageSize=${pageSize}`)
      .then(res => res.json())
      .then(data => {
        setKorisnici(data.korisnici);
        setTotal(data.total);
      });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Korisnici</h1>
      <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-2 max-w-md">
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="border p-2 rounded" />
        <input type="password" placeholder="Lozinka" value={form.lozinka} onChange={e => setForm(f => ({ ...f, lozinka: e.target.value }))} required className="border p-2 rounded" />
        <input type="text" placeholder="Ime" value={form.ime} onChange={e => setForm(f => ({ ...f, ime: e.target.value }))} className="border p-2 rounded" />
        <input type="text" placeholder="Slika (URL)" value={form.slika} onChange={e => setForm(f => ({ ...f, slika: e.target.value }))} className="border p-2 rounded" />
        <select value={form.uloga} onChange={e => setForm(f => ({ ...f, uloga: e.target.value }))} className="border p-2 rounded">
          <option value="korisnik">Korisnik</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="btn">{editId ? 'Spremi' : 'Dodaj'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ email: '', lozinka: '', uloga: 'korisnik', ime: '', slika: '' }); }} className="btn">Odustani</button>}
      </form>
      <table className="w-full border mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Email</th>
            <th className="p-2">Ime</th>
            <th className="p-2">Uloga</th>
            <th className="p-2">Akcije</th>
          </tr>
        </thead>
        <tbody>
          {korisnici.map((k: Korisnik) => (
            <tr key={k.id}>
              <td className="p-2">{k.email}</td>
              <td className="p-2">{k.ime}</td>
              <td className="p-2">{k.uloga}</td>
              <td className="p-2">
                <button className="btn mr-2" onClick={() => handleEdit(k)}>Uredi</button>
                <button className="btn" onClick={() => handleDelete(k.id)}>Obriši</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center items-center gap-2">
        <button className="btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prethodna</button>
        <span>Stranica {page}</span>
        <button className="btn" disabled={page * pageSize >= total} onClick={() => setPage(p => p + 1)}>Sljedeća</button>
      </div>
    </div>
  );
}
