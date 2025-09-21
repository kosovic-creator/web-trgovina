import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // prilagodi putanju do svog Prisma klijenta

export async function GET(req: NextRequest) {
  const korisnikId = req.nextUrl.searchParams.get('korisnikId');
  if (!korisnikId) {
    return NextResponse.json({ broj: 0 });
  }

  // Saberi sve kolicine za korisnika
  const stavke = await prisma.stavkaKorpe.findMany({
    where: { korisnikId },
    select: { kolicina: true },
  });

  const broj = stavke.reduce((sum, s) => sum + s.kolicina, 0);

  return NextResponse.json({ broj });
}