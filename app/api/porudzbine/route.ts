import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') || '1');
  const pageSize = Number(searchParams.get('pageSize') || '10');
  const skip = (page - 1) * pageSize;
  const [porudzbine, total] = await Promise.all([
    prisma.porudzbina.findMany({ skip, take: pageSize, orderBy: { kreiran: 'desc' } }),
    prisma.porudzbina.count()
  ]);
  return NextResponse.json({ porudzbine, total });
}

export async function POST(request: Request) {
  const data = await request.json();
  const porudzbina = await prisma.porudzbina.create({ data });
  return NextResponse.json({ porudzbina });
}

export async function PUT(request: Request) {
  const data = await request.json();
  const { id, ...rest } = data;
  const porudzbina = await prisma.porudzbina.update({ where: { id }, data: rest });
  return NextResponse.json({ porudzbina });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const porudzbina = await prisma.porudzbina.delete({ where: { id } });
  return NextResponse.json({ porudzbina });
}
