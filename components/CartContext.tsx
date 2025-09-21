"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface korpaItem {
  id: string;
  korisnikId :   string
  proizvodId:    string
  kolicina :     number
  kreiran:       string
  azuriran:      string
  product: {
    id: string;
    naziv: string;
    cijena: number;
    slika: string;
  };

}

interface korpaData {
  items: korpaItem[];
  total: number;
  itemCount: number;
}

interface korpaContextType {
  korpa: korpaData;
  loading: boolean;
  addTokorpa: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromkorpa: (itemId: string) => Promise<void>;
  clearkorpa: () => void;
  fetchkorpa: () => Promise<void>;
  refreshkorpa: () => Promise<void>;
}

const korpaContext = createContext<korpaContextType | undefined>(undefined);

export function KorpaProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [korpa, setkorpa] = useState<korpaData>({
    items: [],
    total: 0,
    itemCount: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchkorpa = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    const res = await fetch(`/api/korpa?korisnikId=${session.user.id}`);
    const data = await res.json();
    setkorpa(data);
    console.log(session?.user?.id);
    setLoading(false);
  };

  const addTokorpa = async (productId: string, quantity = 1) => {
    if (!session) return;

    try {
      const response = await fetch("/api/korpa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      if (response.ok) {
        await fetchkorpa();
      }
    } catch (error) {
      console.error("Error adding to korpa:", error);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!session) return;

    try {
      const response = await fetch(`/api/korpa/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) {
        await fetchkorpa();
      }
    } catch (error) {
      console.error("Error updating korpa:", error);
    }
  };

  const removeFromkorpa = async (itemId: string) => {
    if (!session) return;

    try {
      const response = await fetch(`/api/korpa/${itemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchkorpa();
      }
    } catch (error) {
      console.error("Error removing from korpa:", error);
    }
  };

  const clearkorpa = () => {
    setkorpa({ items: [], total: 0, itemCount: 0 });
  };

  useEffect(() => {
    if (session) {
      fetchkorpa();
    } else {
      clearkorpa();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <korpaContext.Provider
      value={{
        korpa,
        loading,
        addTokorpa,
        updateQuantity,
        removeFromkorpa,
        clearkorpa,
        fetchkorpa,
        refreshkorpa: fetchkorpa,
      }}
    >
      {children}
    </korpaContext.Provider>
  );
}

export function useKorpa() {
  const context = useContext(korpaContext);
  if (context === undefined) {
    throw new Error("useKorpa must be used within a KorpaProvider");
  }
  return context;
}
