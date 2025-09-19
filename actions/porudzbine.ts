import prisma from '../lib/prisma';
import { z } from 'zod';

const porudzbinaSchema = z.object({
  korisnikId: z.string().uuid(),
  ukupno: z.number().min(0),
  status: z.string().min(2),
  email: z.string().email().optional().nullable(),
  idPlacanja: z.string().optional().nullable(),
});

export async function getPorudzbine(korisnikId?: string, page: number = 1, pageSize: number = 10) {
  const skip = (page - 1) * pageSize;
  const where = korisnikId ? { korisnikId } : {};
  const [porudzbine, total] = await Promise.all([
    prisma.porudzbina.findMany({ where, skip, take: pageSize, orderBy: { kreiran: 'desc' } }),
    prisma.porudzbina.count({ where })
  ]);
  return { porudzbine, total };
}

export async function createPorudzbina(data: unknown) {
  const parsed = porudzbinaSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error };
  const porudzbina = await prisma.porudzbina.create({ data: parsed.data });
  return { porudzbina };
}

export async function updatePorudzbina(id: string, data: unknown) {
  const parsed = porudzbinaSchema.partial().safeParse(data);
  if (!parsed.success) return { error: parsed.error };
  try {
    const porudzbina = await prisma.porudzbina.update({
      where: { id },
      data: parsed.data,
    });
    return { porudzbina };
  } catch {
    return { error: 'Porudžbina nije pronađena' };
  }
}

export async function deletePorudzbina(id: string) {
  try {
    const porudzbina = await prisma.porudzbina.delete({ where: { id } });
    return { porudzbina };
  } catch {
    return { error: 'Porudžbina nije pronađena' };
  }
}
