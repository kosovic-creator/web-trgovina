import { z } from 'zod';
import prisma from '../lib/prisma'; // Pretpostavljam da postoji prisma client

// Zod shema za proizvod
const proizvodSchema = z.object({
  naziv: z.string().min(2),
  cena: z.number().min(0),
  slika: z.string().url().optional().nullable(),
  opis: z.string().optional().nullable(),
  kolicina: z.number().min(0).default(1),
});

// CREATE
export async function createProizvod(data: unknown) {
  const parsed = proizvodSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error };
  const proizvod = await prisma.proizvod.create({ data: parsed.data });
  return { proizvod };
}

// READ s paginacijom
export async function getProizvodi(page: number = 1, pageSize: number = 10) {
  const skip = (page - 1) * pageSize;
  const [proizvodi, total] = await Promise.all([
    prisma.proizvod.findMany({ skip, take: pageSize, orderBy: { kreiran: 'desc' } }),
    prisma.proizvod.count()
  ]);
  return { proizvodi, total };
}

// UPDATE
export async function updateProizvod(id: string, data: unknown) {
  const parsed = proizvodSchema.partial().safeParse(data);
  if (!parsed.success) return { error: parsed.error };
  try {
    const proizvod = await prisma.proizvod.update({
      where: { id },
      data: parsed.data,
    });
    return { proizvod };
  } catch {
    return { error: 'Proizvod nije pronađen' };
  }
}

// DELETE
export async function deleteProizvod(id: string) {
  try {
    const proizvod = await prisma.proizvod.delete({ where: { id } });
    return { proizvod };
  } catch {
    return { error: 'Proizvod nije pronađen' };
  }
}
