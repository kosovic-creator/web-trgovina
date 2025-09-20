'use client';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import '@/i18n/config';

export default function AdminHome() {
    const { t } = useTranslation('home');

  return (
    <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">{t('admin_panel')}</h1>
      <div className="flex flex-col gap-4">
              <Link href="/admin/korisnici" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{t('users')}</Link>
              <Link href="/admin/proizvodi" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{t('products')}</Link>
              <Link href="/admin/porudzbine" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{t('orders')}</Link>
      </div>
    </div>
  );
}
