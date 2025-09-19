'use client';
import { useSession } from 'next-auth/react';
import { authOptions } from '@/lib/authOptions';
import { StavkaKorpe, Proizvod } from '../../types';
import { useState, useEffect } from 'react';
import { getKorpa, updateStavkaKorpe, deleteStavkaKorpe } from '../../actions/korpa';

export default function KorpaPage() {
  const { data: session } = useSession();
  const [stavke, setStavke] = useState<StavkaKorpe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchKorpa() {
      setLoading(true);
      const korisnikId = session?.user?.id;
      if (!korisnikId) return setLoading(false);
      const res = await fetch(`/api/korpa?korisnikId=${korisnikId}`);
      const data = await res.json();
      setStavke(data.stavke);
      setLoading(false);
    }
    fetchKorpa();
  }, [session]);

  const handleKolicina = async (id: string, kolicina: number) => {
    await updateStavkaKorpe(id, kolicina);
    const korisnikId = session?.user?.id;
    if (!korisnikId) return;
    const res = await fetch(`/api/korpa?korisnikId=${korisnikId}`);
    const data = await res.json();
    setStavke(data.stavke);
  };

  const handleDelete = async (id: string) => {
    await deleteStavkaKorpe(id);
    const korisnikId = session?.user?.id;
    if (!korisnikId) return;
    const res = await fetch(`/api/korpa?korisnikId=${korisnikId}`);
    const data = await res.json();
    setStavke(data.stavke);
  };

  if (loading) return <div className="p-4">Učitavanje...</div>;

  if (!stavke.length) return <div className="p-4">Vaša korpa je prazna.</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Vaša korpa</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Proizvod</th>
            <th className="p-2">Količina</th>
            <th className="p-2">Cena</th>
            <th className="p-2">Akcije</th>
          </tr>
        </thead>
        <tbody>
          {stavke.map((s) => (
            <tr key={s.id}>
              <td className="p-2">{s.proizvod?.naziv}</td>
              <td className="p-2">
                <input type="number" min={1} value={s.kolicina} onChange={e => handleKolicina(s.id, Number(e.target.value))} className="w-16 border rounded" />
              </td>
              <td className="p-2">{s.proizvod?.cena} €</td>
              <td className="p-2">
                <button className="btn" onClick={() => handleDelete(s.id)}>Obriši</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
