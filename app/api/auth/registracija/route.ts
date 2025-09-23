import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const korisnikSchema = z.object({
  email: z.string().email(),
  lozinka: z.string().min(6),
  ime: z.string().min(1),
  prezime: z.string().min(1),
  telefon: z.string().min(6),
  drzava: z.string().optional(),
  grad: z.string().min(1),
  postanskiBroj: z.coerce.number().int().positive(),
  adresa: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json();
  const result = korisnikSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues.map((e: z.ZodIssue) => e.message).join(", ") }, { status: 400 });
  }
  const { email, lozinka, ime, prezime, telefon, drzava, grad, postanskiBroj, adresa } = result.data;
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
      prezime,
      telefon,
      drzava,
      grad,
      postanskiBroj,
      adresa,
    },
  });
  return NextResponse.json({ uspjesno_placanje: true });
}
