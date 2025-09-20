'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import '@/i18n/config';

export default function RegistracijaPage() {
  const { t } = useTranslation('register');
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [ime, setIme] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/registracija", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lozinka, ime }),
      });
      if (res.ok) router.push("/auth/prijava");
      else setError("Greška pri registraciji");
    } catch {
      setError("Greška pri registraciji");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="email"
          placeholder={t('email')}
          className="border p-2 rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Ime"
          value={ime}
          onChange={e => setIme(e.target.value)}
        />
        <input
          type="password"
          placeholder={t('password')}
          className="border p-2 rounded"
          value={lozinka}
          onChange={e => setLozinka(e.target.value)}
          required
        />
        <button type="submit" className="btn">{t('register')}</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}