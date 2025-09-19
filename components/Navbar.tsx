'use client';
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #eee' }}>
      <Link href="/">Početna</Link>
      {session?.user ? (
        <>
          <Link href="/profil">Profil</Link>
          <button onClick={() => signOut({ callbackUrl: "/auth/prijava" })}>Odjava</button>
        </>
      ) : (
        <>
          <Link href="/auth/prijava">Prijava</Link>
          <Link href="/auth/registracija">Registracija</Link>
        </>
      )}
    </nav>
  );
}
