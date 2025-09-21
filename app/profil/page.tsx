'use client';
import { useSession } from 'next-auth/react';
import Image from "next/image";
import { useTranslation } from 'react-i18next';
import { FaUser } from "react-icons/fa";
import '@/i18n/config';

export default function ProfilPage() {
  const { t } = useTranslation('profil');
  const { data: session } = useSession();
  if (!session?.user) {
    return (
      <div className="flex items-center gap-2 text-red-600 mt-8">
        <FaUser />
        <span>{t('must_login') || "Morate se prijaviti"}</span>
      </div>
    );
  }
  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaUser className="text-violet-600" />
        {t('title')}
      </h1>
      <div className="flex flex-col gap-2">
        <p><span className="font-semibold">{t('email')}:</span> {session.user.email}</p>
        <p><span className="font-semibold">{t('name')}:</span> {session.user.ime}</p>
        <p><span className="font-semibold">{t('role')}:</span> {session.user.uloga}</p>
        {session.user.slika && (
          <Image src={session.user.slika} alt={t('profile_image') || "Profil"} width={100} height={100} className="rounded-full mt-2" />
        )}
      </div>
    </div>
  );
}