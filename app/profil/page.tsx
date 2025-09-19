import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Image from "next/image";

export default async function ProfilPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return <div>Morate biti prijavljeni za pristup profilu.</div>;
  }
  return (
    <div>
      <h1>Profil</h1>
      <p>Email: {session.user.email}</p>
      <p>Ime: {session.user.ime}</p>
      <p>Uloga: {session.user.uloga}</p>
      {session.user.slika && (
        <Image src={session.user.slika} alt="Profilna slika" width={100} height={100} />
      )}
    </div>
  );
}