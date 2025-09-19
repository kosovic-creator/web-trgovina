import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const { korisnikId, proizvodId, kolicina } = await request.json();
  // Dodaj ili ažuriraj stavku u korpi
  const existing = await prisma.stavkaKorpe.findUnique({
    where: { korisnikId_proizvodId: { korisnikId, proizvodId } }
  });
  let stavka;
  if (existing) {
    stavka = await prisma.stavkaKorpe.update({
      where: { id: existing.id },
      data: { kolicina: existing.kolicina + (kolicina || 1) }
    });
  } else {
    stavka = await prisma.stavkaKorpe.create({
      data: { korisnikId, proizvodId, kolicina: kolicina || 1 }
    });
  }
  return NextResponse.json({ stavka });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const korisnikId = searchParams.get('korisnikId');
  if (!korisnikId) return NextResponse.json({ stavke: [] });
  const stavke = await prisma.stavkaKorpe.findMany({
    where: { korisnikId },
    include: { proizvod: true },
  });
  return NextResponse.json({ stavke });
}
