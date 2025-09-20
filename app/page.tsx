'use client';
import { useTranslation } from 'react-i18next';
import { useSession } from "next-auth/react";

export default function Home() {
  const { t } = useTranslation('home');
  const { data: session } = useSession();
  return (
    <div>
      {session?.user?.ime ? (
        <h2>{t('welcome_user', { ime: session.user.ime })}</h2>
      ) : (
          <h2>{t('welcome')}</h2>
      )}
      {/* Dodaj svoj sadržaj ovdje */}
    </div>
  );
}
