'use client'
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <div>
      {session?.user?.ime ? (
        <h2>Dobrodošao, {session.user.ime}!</h2>
      ) : (
        <h2>Dobrodošli!</h2>
      )}
      {/* Dodaj svoj sadržaj ovdje */}
    </div>
  );
}
