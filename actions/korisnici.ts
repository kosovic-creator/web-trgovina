import prisma from '../lib/prisma';
import { z } from 'zod';

const korisnikSchema = z.object({
  email: z.string().email(),
  lozinka: z.string().min(6),
  uloga: z.string().min(3),
  ime: z.string().optional().nullable(),
  slika: z.string().url().optional().nullable(),
});

export async function getKorisnici(page: number = 1, pageSize: number = 10) {
  const skip = (page - 1) * pageSize;
  const [korisnici, total] = await Promise.all([
    prisma.korisnik.findMany({ skip, take: pageSize, orderBy: { kreiran: 'desc' } }),
    prisma.korisnik.count()
  ]);
  return { korisnici, total };
}

export async function createKorisnik(data: unknown) {
  const parsed = korisnikSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error };
  const korisnik = await prisma.korisnik.create({ data: parsed.data });
  return { korisnik };
}

export async function updateKorisnik(id: string, data: unknown) {
  const parsed = korisnikSchema.partial().safeParse(data);
  if (!parsed.success) return { error: parsed.error };
  try {
    const korisnik = await prisma.korisnik.update({
      where: { id },
      data: parsed.data,
    });
    return { korisnik };
  } catch {
    return { error: 'Korisnik nije pronađen' };
  }
}

export async function deleteKorisnik(id: string) {
  try {
    const korisnik = await prisma.korisnik.delete({ where: { id } });
    return { korisnik };
  } catch {
    return { error: 'Korisnik nije pronađen' };
  }
}
