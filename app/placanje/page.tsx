'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function PlacanjePage() {
  const [nacin, setNacin] = useState('paypal');
  const { data: session } = useSession();

  interface Stavka {
    proizvod?: {
      cena: number;
      // add other fields if needed
    };
    kolicina: number;
    // add other fields if needed
  }

  const handlePotvrdi = async (e: React.FormEvent) => {
    e.preventDefault();
    const korisnikId = session?.user?.id;
    if (!korisnikId) return;
    // Dohvati stavke iz korpe
    const res = await fetch(`/api/korpa?korisnikId=${korisnikId}`);
    const data = await res.json();
    const stavke: Stavka[] = data.stavke;
    // Izračunaj ukupno
    const ukupno = stavke.reduce((acc: number, s: Stavka) => acc + (s.proizvod ? s.proizvod.cena * s.kolicina : 0), 0);
    // Dodaj porudžbinu
    await fetch('/api/porudzbine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ korisnikId, stavke, ukupno, nacinPlacanja: nacin })
    });
    // Po želji: isprazni korpu
    localStorage.setItem('brojUKorpi', '0');
    window.dispatchEvent(new Event('korpaChanged'));
    // Redirect ili poruka
    window.location.href = '/porudzbine';
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-sm">
        <h2 className="text-center mb-6 font-semibold">Odaberite način plaćanja</h2>
        <form className="flex flex-col gap-4" onSubmit={handlePotvrdi}>
          <label className="flex items-center gap-2">
            <input type="radio" name="nacin" value="paypal" checked={nacin === 'paypal'} onChange={() => setNacin('paypal')} />
            <span className="flex items-center gap-1"><Image src="/paypal.png" alt="PayPal" width={24} height={24} /> PayPal</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="nacin" value="stripe" checked={nacin === 'stripe'} onChange={() => setNacin('stripe')} />
            <span className="flex items-center gap-1"><Image src="/visa.png" alt="Visa" width={24} height={24} /><Image src="/mastercard.png" alt="Mastercard" width={24} height={24} /> Stripe</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="nacin" value="pouzece" checked={nacin === 'pouzece'} onChange={() => setNacin('pouzece')} />
            Plaćanje po uručenju
          </label>
          <button type="submit" className="bg-blue-600 text-white py-2 rounded font-bold mt-4">Potvrdi</button>
        </form>
      </div>
    </div>
  );
}
