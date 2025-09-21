'use client';
import { useTranslation } from 'react-i18next';
import { useSession } from "next-auth/react";
import AdminHome from './admin/page';
import { FaHome, FaUserShield } from "react-icons/fa";

export default function Home() {
  const { t } = useTranslation('home');
  const { data: session } = useSession();

  return (
    <>
      {session?.user?.uloga === 'admin' ? (
        <div className="p-8 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-violet-700">
            <FaUserShield className="text-violet-600" />
            {t('admin_panel')}
          </h1>
          <AdminHome />
        </div>
      ) : (
          <div className="p-8 max-w-2xl mx-auto flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-3 text-violet-700">
              <FaHome className="text-violet-600" />
              {session?.user?.ime
                ? t('welcome_user', { ime: session.user.ime })
                : t('welcome')}
            </h1>
          {/* Dodaj svoj sadržaj ovdje */}
        </div>
      )}
    </>
  );
}
