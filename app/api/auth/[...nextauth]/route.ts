/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

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
        token.id = user.id;
        token.uloga = (user as any).uloga;
        token.ime = (user as any).ime;
        token.slika = (user as any).slika;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).uloga = token.uloga;
        (session.user as any).ime = token.ime;
        (session.user as any).slika = token.slika;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/prijava",
    error: "/auth/prijava",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
