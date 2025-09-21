'use client';
import { useTranslation } from 'react-i18next';
import { useSession } from "next-auth/react";
import AdminHome from './admin/page';

export default function Home() {
  const { t } = useTranslation('home');
  const { data: session } = useSession();
  return (
    <>
      {session?.user?.uloga === 'admin' ? (
        <div>
          <AdminHome />
        </div>
      ) : (
        <div>
          {session?.user?.ime ? (
            <h2>{t('welcome_user', { ime: session.user.ime })}</h2>
          ) : (
            <h2>{t('welcome')}</h2>
          )}
          {/* Dodaj svoj sadržaj ovdje */}
        </div>
      )}
    </>
  );
}
