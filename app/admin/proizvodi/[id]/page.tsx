'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

function IzmeniProizvodPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const { t } = useTranslation(['proizvodi']);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
      <div className="admin-container">
          <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-semibold mb-6">Dodaj/Izmeni proizvod</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-md">
                  <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2" htmlFor="naziv">
                          Naziv proizvoda
                      </label>
                      <input
                          id="naziv"
                          name="naziv"
                          value={form.naziv || ''}
                          onChange={handleChange}
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Unesite naziv"
                          required
                      />
                  </div>
                  <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2" htmlFor="cena">
                          Cena
                      </label>
                      <input
                          id="cena"
                          name="cena"
                          value={form.cena || ''}
                          onChange={handleChange}
                          type="number"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Unesite cenu"
                          required
                      />
                  </div>
                  <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2" htmlFor="opis">
                          Opis
                      </label>
                      <textarea
                          id="opis"
                          name="opis"
                          value={form.opis || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Unesite opis"
                      />
                  </div>
                  <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2" htmlFor="karakteristike">
                          Karakteristike
                      </label>
                      <input
                          id="karakteristike"
                          name="karakteristike"
                          value={form.karakteristike || ''}
                          onChange={handleChange}
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Unesite karakteristike"
                      />
                  </div>
                  <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2" htmlFor="kategorija">
                          Kategorija
                      </label>
                      <input
                          id="kategorija"
                          name="kategorija"
                          value={form.kategorija || ''}
                          onChange={handleChange}
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Unesite kategoriju"
                      />
                  </div>
                  <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2" htmlFor="kolicina">
                          Količina
                      </label>
                      <input
                          id="kolicina"
                          name="kolicina"
                          value={form.kolicina || ''}
                          onChange={handleChange}
                          type="number"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Unesite količinu"
                          required
                      />
                  </div>
                  <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2" htmlFor="slika">
                          Slika
                      </label>
                      <input
                          id="slika"
                          name="slika"
                          value={form.slika || ''}
                          onChange={handleChange}
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Unesite URL slike"
                      />
                  </div>
                  <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                      Sačuvaj izmene
                  </button>
                  {error && <div className="text-red-600">{error}</div>}
              </form>
          </div>
    </div>
  );
}

export default IzmeniProizvodPage;