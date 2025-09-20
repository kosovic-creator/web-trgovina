'use client';
import { useState, useEffect } from 'react';
import { Porudzbina } from '@/types';
import { useTranslation } from 'react-i18next';
import '@/i18n/config';

export default function PorudzbinePage() {
  const { t } = useTranslation('porudzbine');
  const [porudzbine, setPorudzbine] = useState<Porudzbina[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    fetch(`/api/porudzbine?page=${page}&pageSize=${pageSize}`)
      .then(res => res.json())
      .then(data => {
        setPorudzbine(data.porudzbine);
        setTotal(data.total);
      });
  }, [page, pageSize]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
      <table className="w-full border mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">ID</th>
            <th className="p-2">{t('status')}</th>
            <th className="p-2">{t('total')}</th>
            <th className="p-2">{t('date')}</th>
          </tr>
        </thead>
        <tbody>
          {porudzbine.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center text-gray-500">{t('empty')}</td>
            </tr>
          ) : (
            porudzbine.map((p: Porudzbina) => (
              <tr key={p.id}>
                <td className="p-2">{p.id}</td>
                <td className="p-2">{p.status}</td>
                <td className="p-2">{p.ukupno} €</td>
                <td className="p-2">{new Date(p.kreiran).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="flex justify-center items-center gap-2">
        <button className="btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>{t('prethodna')}</button>
        <span>Stranica {page}</span>
        <button className="btn" disabled={page * pageSize >= total} onClick={() => setPage(p => p + 1)}>{t('sljedeca')}</button>
      </div>
    </div>
  );
}
