import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Proizvod {
  id: string;
  naziv: string;
  cena: number;
  slika?: string;
}

export default function ProizvodiBanner() {
  const [proizvodi, setProizvodi] = useState<Proizvod[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch('/api/proizvodi?page=1&pageSize=10')
      .then(res => res.json())
      .then(data => setProizvodi(data.proizvodi));
  }, []);

  useEffect(() => {
    if (proizvodi.length > 1) {
      const timer = setInterval(() => {
        setCurrent((prev) => (prev + 1) % proizvodi.length);
      }, 3500);
      return () => clearInterval(timer);
    }
  }, [proizvodi]);

  if (proizvodi.length === 0) return null;

  const p = proizvodi[current];

  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      <div className="flex items-center bg-gradient-to-r from-violet-600 to-pink-500 text-white rounded-xl shadow-lg p-4 gap-4 animate-slide-in">
        {p.slika && (
          <Image src={p.slika} alt={p.naziv} width={80} height={80} className="rounded-lg object-cover" />
        )}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-1">{p.naziv}</h2>
          <div className="text-lg font-semibold">{p.cena} €</div>
        </div>
      </div>
    </div>
  );
}
