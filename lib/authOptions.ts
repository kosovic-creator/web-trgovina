import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

interface CustomUser {
  id: string;
  email: string;
  uloga?: string;
  ime?: string;
  slika?: string;
}

interface CustomToken {
  id?: string;
  email?: string;
  uloga?: string;
  ime?: string;
  slika?: string;
  [key: string]: unknown;
}

interface CustomSessionUser {
  id?: string;
  email?: string;
  uloga?: string;
  ime?: string;
  slika?: string;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Email i Lozinka",
      credentials: {
        email: { label: "Email", type: "text" },
        lozinka: { label: "Lozinka", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.lozinka) return null;
        const korisnik = await prisma.korisnik.findUnique({
          where: { email: credentials.email },
        });
        if (!korisnik || !korisnik.lozinka) return null;
        const valid = await bcrypt.compare(credentials.lozinka, korisnik.lozinka);
        if (!valid) return null;
        return {
          id: korisnik.id,
          email: korisnik.email,
          uloga: korisnik.uloga,
          ime: korisnik.ime,
          slika: korisnik.slika,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as CustomUser;
        (token as CustomToken).id = u.id;
        (token as CustomToken).uloga = u.uloga;
        (token as CustomToken).ime = u.ime;
        (token as CustomToken).slika = u.slika;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const su = session.user as CustomSessionUser;
        su.id = (token as CustomToken).id;
        su.uloga = (token as CustomToken).uloga;
        su.ime = (token as CustomToken).ime;
        su.slika = (token as CustomToken).slika;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/prijava",
    error: "/auth/prijava",
  },
};
