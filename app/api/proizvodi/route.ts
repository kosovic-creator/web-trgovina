import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') || '1');
  const pageSize = Number(searchParams.get('pageSize') || '10');
  const skip = (page - 1) * pageSize;
  const [proizvodi, total] = await Promise.all([
    prisma.proizvod.findMany({ skip, take: pageSize, orderBy: { kreiran: 'desc' } }),
    prisma.proizvod.count()
  ]);
  return NextResponse.json({ proizvodi, total });
}

export async function POST(request: Request) {
  const data = await request.json();
  const proizvod = await prisma.proizvod.create({ data });
  return NextResponse.json({ proizvod });
}

export async function PUT(request: Request) {
  const data = await request.json();
  const { id, ...rest } = data;
  const proizvod = await prisma.proizvod.update({ where: { id }, data: rest });
  return NextResponse.json({ proizvod });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const proizvod = await prisma.proizvod.delete({ where: { id } });
  return NextResponse.json({ proizvod });
}
