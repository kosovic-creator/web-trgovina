'use client'
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import '@/i18n/config';

export default function PrijavaPage() {
  const { t } = useTranslation('login');
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      lozinka,
    });
      if (!res?.error) {
          router.push("/");
      } else {
          setError("Pogrešan email ili lozinka");
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
          type="password"
          placeholder={t('password')}
          className="border p-2 rounded"
          value={lozinka}
          onChange={e => setLozinka(e.target.value)}
          required
        />
        <button type="submit" className="btn">{t('login')}</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}