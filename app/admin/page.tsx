'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '@/i18n/config';
import Image from 'next/image';

export default function AdminHome() {
  const { t } = useTranslation('home');
  const [tab, setTab] = useState<'korisnici' | 'proizvodi' | 'porudzbine'>('korisnici');

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
            <form className="flex flex-wrap gap-4 items-center">
              <input type="text" placeholder={t('name')} className="border p-2 rounded flex-1 min-w-[180px]" />
              <input type="email" placeholder={t('email')} className="border p-2 rounded flex-1 min-w-[180px]" />
              <input type="password" placeholder={t('password')} className="border p-2 rounded flex-1 min-w-[180px]" />
              <select className="border p-2 rounded flex-1 min-w-[180px]">
                <option value="korisnik">{t('user')}</option>
                <option value="admin">{t('admin')}</option>
              </select>
              <button type="submit" className="bg-violet-600 text-white px-6 py-2 rounded">{t('add')}</button>
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
                <tr>
                  <td className="p-2"><span className="inline-block w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M6 20c0-2.2 3.6-4 6-4s6 1.8 6 4" /></svg></span></td>
                  <td className="p-2">drasko</td>
                  <td className="p-2">drasko.kosovic@gmail.com</td>
                  <td className="p-2"><span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs">admin</span></td>
                  <td className="p-2">9/20/2025</td>
                  <td className="p-2"><span className="text-blue-600 cursor-pointer mr-4">{t('edit')}</span><span className="text-red-600 cursor-pointer">{t('delete')}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      {tab === 'proizvodi' && (
        <div>
          <div className="bg-white rounded shadow p-6 mb-8">
            <h2 className="font-semibold mb-4">Dodaj novi proizvod</h2>
            <form className="flex flex-wrap gap-4 items-center">
              <input type="text" placeholder="Naziv proizvoda" className="border p-2 rounded flex-1 min-w-[180px]" required />
              <input type="number" placeholder="Cena" className="border p-2 rounded flex-1 min-w-[180px]" required />
              <div className="flex flex-col gap-2 flex-1 min-w-[180px]">
                <label className="text-sm">Slika proizvoda</label>
                <input type="file" className="border p-2 rounded" />
                <span className="text-center text-gray-400">ili</span>
                <input type="text" placeholder="URL slike (alternativno)" className="border p-2 rounded" />
              </div>
              <button type="submit" className="bg-violet-600 text-white px-6 py-2 rounded">Dodaj</button>
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
                <tr>
                  <td className="p-2"><Image src="/bike.png" alt="proizvod" width={48} height={48} className="object-contain" /></td>
                  <td className="p-2">Fitnes Biciklo</td>
                  <td className="p-2">220.00 EUR</td>
                  <td className="p-2">9/16/2025</td>
                  <td className="p-2"><span className="text-blue-600 cursor-pointer mr-4">Uredi</span><span className="text-red-600 cursor-pointer">Obriši</span></td>
                </tr>
                <tr>
                  <td className="p-2"><Image src="/bike2.png" alt="proizvod" width={48} height={48} className="object-contain" /></td>
                  <td className="p-2">Caprio SL 12</td>
                  <td className="p-2">120.00 EUR</td>
                  <td className="p-2">9/16/2025</td>
                  <td className="p-2"><span className="text-blue-600 cursor-pointer mr-4">Uredi</span><span className="text-red-600 cursor-pointer">Obriši</span></td>
                </tr>
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
              <tr>
                <td className="p-2">1</td>
                <td className="p-2">drasko</td>
                <td className="p-2">340.00 EUR</td>
                <td className="p-2">Završena</td>
                <td className="p-2">9/20/2025</td>
                <td className="p-2"><span className="text-blue-600 cursor-pointer mr-4">Uredi</span><span className="text-red-600 cursor-pointer">Obriši</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
