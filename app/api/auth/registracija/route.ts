import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, lozinka, ime } = await req.json();
  if (!email || !lozinka) {
    return NextResponse.json({ error: "Email i lozinka su obavezni." }, { status: 400 });
  }
  const postoji = await prisma.korisnik.findUnique({ where: { email } });
  if (postoji) {
    return NextResponse.json({ error: "Email već postoji." }, { status: 400 });
  }
  const hash = await bcrypt.hash(lozinka, 10);
  await prisma.korisnik.create({
    data: {
      email,
      lozinka: hash,
      ime,
    },
  });
  return NextResponse.json({ uspjesno_placanje: true });
}
