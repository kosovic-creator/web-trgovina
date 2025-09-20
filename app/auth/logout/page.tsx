'use client';
import { useTranslation } from 'react-i18next';
import '@/i18n/config';

export default function LogoutPage() {
  const { t } = useTranslation('logout');

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
      <button className="btn">{t('logout')}</button>
    </div>
  );
}