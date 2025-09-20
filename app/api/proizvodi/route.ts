import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
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
  const { naziv, cena, slika, opis, kolicina } = body;
  if (!naziv || !cena) {
    return NextResponse.json({ error: 'Naziv i cena su obavezni.' }, { status: 400 });
  }
  const proizvod = await prisma.proizvod.create({
    data: {
      naziv,
      cena,
      slika,
      opis,
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
  const postoji = await prisma.proizvod.findUnique({ where: { id } });
  if (!postoji) {
    return NextResponse.json({ error: 'Proizvod nije pronađen.' }, { status: 404 });
  }
  const proizvod = await prisma.proizvod.update({
    where: { id },
    data,
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
  return NextResponse.json({ success: true });
}
