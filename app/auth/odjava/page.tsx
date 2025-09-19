'use client'
import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function OdjavaPage() {
  useEffect(() => {
    signOut({ callbackUrl: "/auth/prijava" });
  }, []);
  return <p>Odjavljujem...</p>;
}