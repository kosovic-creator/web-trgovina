'use client';
import { useState, useEffect } from 'react';
import { Porudzbina } from '@/types';
import { useTranslation } from 'react-i18next';
import { FaClipboardList } from "react-icons/fa";
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
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaClipboardList className="text-violet-600" />
        {t('title')}
      </h1>
      <table className="w-full border border-gray-300 mb-4 rounded shadow overflow-hidden">
        <thead>
          <tr className="bg-gradient-to-r from-violet-100 to-pink-100 text-violet-700">
            {/* <th className="p-4 text-left border-b border-gray-300">ID</th> */}
            <th className="p-4 text-left border-b border-gray-300">{t('status')}</th>
            <th className="p-4 text-left border-b border-gray-300">{t('total')}</th>
            <th className="p-4 text-left border-b border-gray-300">{t('date')}</th>
          </tr>
        </thead>
        <tbody>
          {porudzbine.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center text-gray-500 p-6 border-b border-gray-300">{t('empty')}</td>
            </tr>
          ) : (
            porudzbine.map((p: Porudzbina) => (
              <tr key={p.id} className="hover:bg-violet-50 transition border-b border-gray-300">
                {/* <td className="p-4 text-left border-b border-gray-300">{p.id}</td> */}
                <td className="p-4 text-left border-b border-gray-300">{p.status}</td>
                <td className="p-4 text-left border-b border-gray-300">{p.ukupno} €</td>
                <td className="p-4 text-left border-b border-gray-300">{new Date(p.kreiran).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Paginacija prikaz samo ako ima više od 10 stavki */}
      {total > 10 && (
        <div className="flex justify-center items-center gap-2">
          <button className="bg-violet-600 text-white px-3 py-1 rounded shadow hover:bg-violet-700 transition"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            {t('prethodna')}
          </button>
          <span>Stranica {page}</span>
          <button className="bg-violet-600 text-white px-3 py-1 rounded shadow hover:bg-violet-700 transition"
            disabled={page * pageSize >= total}
            onClick={() => setPage(p => p + 1)}
          >
            {t('sljedeca')}
          </button>
        </div>
      )}
    </div>
  );
}
