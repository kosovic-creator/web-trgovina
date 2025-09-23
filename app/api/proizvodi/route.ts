import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const proizvodSchema = z.object({
  naziv: z.string().min(1),
  cena: z.coerce.number().positive(),
  slika: z.string().optional(),
  opis: z.string().optional(),
  karakteristike: z.string().optional(),
  kategorija: z.string().min(1),
  kolicina: z.coerce.number().int().nonnegative().optional(),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page')) || 1;
  let pageSize = Number(searchParams.get('pageSize')) || 10;
  pageSize = Math.max(pageSize, 10);
  const skip = (page - 1) * pageSize;
  const [proizvodi, total] = await Promise.all([
    prisma.proizvod.findMany({
      skip,
      take: pageSize,
      orderBy: { kreiran: 'desc' },
    }),
    prisma.proizvod.count(),
  ]);
  return NextResponse.json({ proizvodi, total });
}

export async function POST(req: Request) {
  const body = await req.json();
  const result = proizvodSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues.map(e => e.message).join(', ') }, { status: 400 });
  }
  const { naziv, cena, slika, opis, karakteristike, kategorija, kolicina } = result.data;
  const proizvod = await prisma.proizvod.create({
    data: {
      naziv,
      cena,
      slika,
      opis,
      karakteristike,
      kategorija,
      kolicina,
    },
  });
  return NextResponse.json(proizvod);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) {
    return NextResponse.json({ error: 'ID je obavezan.' }, { status: 400 });
  }
  const result = proizvodSchema.safeParse(data);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues.map(e => e.message).join(', ') }, { status: 400 });
  }
  const postoji = await prisma.proizvod.findUnique({ where: { id } });
  if (!postoji) {
    return NextResponse.json({ error: 'Proizvod nije pronađen.' }, { status: 404 });
  }
  const proizvod = await prisma.proizvod.update({
    where: { id },
    data: result.data,
  });
  return NextResponse.json(proizvod);
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { id } = body;
  if (!id) {
    return NextResponse.json({ error: 'ID je obavezan.' }, { status: 400 });
  }
  const postoji = await prisma.proizvod.findUnique({ where: { id } });
  if (!postoji) {
    return NextResponse.json({ error: 'Proizvod nije pronađen.' }, { status: 404 });
  }
  await prisma.proizvod.delete({ where: { id } });
  return NextResponse.json({ uspjesno_placanje: true });
}
