import prisma from '../lib/prisma';
import { z } from 'zod';

const idSchema = z.string().uuid();
const kolicinaSchema = z.number().min(1);

export async function getKorpa(korisnikId: string) {
  if (!idSchema.safeParse(korisnikId).success) return { stavke: [] };
  const stavke = await prisma.stavkaKorpe.findMany({
    where: { korisnikId },
    include: { proizvod: true },
  });
  return { stavke };
}

export async function updateStavkaKorpe(id: string, kolicina: number) {
  if (!idSchema.safeParse(id).success || !kolicinaSchema.safeParse(kolicina).success) return { error: 'Neispravni podaci' };
  const stavka = await prisma.stavkaKorpe.update({
    where: { id },
    data: { kolicina },
  });
  return { stavka };
}

export async function deleteStavkaKorpe(id: string) {
  if (!idSchema.safeParse(id).success) return { error: 'Neispravan ID' };
  const stavka = await prisma.stavkaKorpe.delete({ where: { id } });
  return { stavka };
}
