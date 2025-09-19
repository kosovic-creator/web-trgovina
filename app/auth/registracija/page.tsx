'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegistracijaPage() {
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
    <div>
      <h1>Registracija</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
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
          placeholder="Lozinka"
          value={lozinka}
          onChange={e => setLozinka(e.target.value)}
          required
        />
        <button type="submit">Registriraj se</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}