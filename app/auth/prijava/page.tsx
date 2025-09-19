'use client'
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function PrijavaPage() {
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      lozinka,
    });
    if (res?.error) setError("Pogrešan email ili lozinka");
  };

  return (
    <div>
      <h1>Prijava</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Lozinka"
          value={lozinka}
          onChange={e => setLozinka(e.target.value)}
          required
        />
        <button type="submit">Prijavi se</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}