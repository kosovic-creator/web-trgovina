import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { StavkaKorpe } from "@/types";

type KorpaContextType = {
  brojStavki: number;
  refreshKorpa: () => void;
};

const KorpaContext = createContext<KorpaContextType>({ brojStavki: 0, refreshKorpa: () => {} });

export const useKorpa = () => useContext(KorpaContext);

export const KorpaProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [brojStavki, setBrojStavki] = useState(0);

  const fetchBrojStavki = async () => {
    if (!session?.user?.id) {
      setBrojStavki(0);
      return;
    }
    const res = await fetch(`/api/korpa?korisnikId=${session.user.id}`);
    const data = await res.json();
    const broj = data.stavke?.reduce((acc: number, s: StavkaKorpe) => acc + s.kolicina, 0) || 0;
    setBrojStavki(broj);
  };

  useEffect(() => {
    fetchBrojStavki();
    window.addEventListener("korpaChanged", fetchBrojStavki);
    return () => window.removeEventListener("korpaChanged", fetchBrojStavki);
  }, [session?.user?.id]);

  return (
    <KorpaContext.Provider value={{ brojStavki, refreshKorpa: fetchBrojStavki }}>
      {children}
    </KorpaContext.Provider>
  );
};