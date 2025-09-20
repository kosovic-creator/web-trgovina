import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const skip = (page - 1) * pageSize;
  const [porudzbine, total] = await Promise.all([
    prisma.porudzbina.findMany({
      skip,
      take: pageSize,
      orderBy: { kreiran: 'desc' },
    }),
    prisma.porudzbina.count(),
  ]);
  return NextResponse.json({ porudzbine, total });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { korisnikId, ukupno, status, email, idPlacanja } = body;
  if (!korisnikId || !ukupno || !status) {
    return NextResponse.json({ error: 'Nedostaju obavezna polja.' }, { status: 400 });
  }
  const porudzbina = await prisma.porudzbina.create({
    data: {
      korisnikId,
      ukupno,
      status,
      email,
      idPlacanja,
    },
  });
  return NextResponse.json(porudzbina);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) {
    return NextResponse.json({ error: 'ID je obavezan.' }, { status: 400 });
  }
  const porudzbina = await prisma.porudzbina.update({
    where: { id },
    data,
  });
  return NextResponse.json(porudzbina);
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { id } = body;
  if (!id) {
    return NextResponse.json({ error: 'ID je obavezan.' }, { status: 400 });
  }
  await prisma.porudzbina.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
