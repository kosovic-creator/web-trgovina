'use client';
import { useSession } from 'next-auth/react';
import Image from "next/image";
import { useTranslation } from 'react-i18next';
import '@/i18n/config';

export default function ProfilPage() {
  const { t } = useTranslation('profil');
  const { data: session } = useSession();
  if (!session?.user) {
    return <div>{t('must_login')}</div>;
  }
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('email')}: {session.user.email}</p>
      <p>{t('name')}: {session.user.ime}</p>
      <p>{t('role')}: {session.user.uloga}</p>
      {session.user.slika && (
        <Image src={session.user.slika} alt={t('profile_image')} width={100} height={100} />
      )}
    </div>
  );
}