import React, { useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import '@/i18n/config';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const { t } = useTranslation('sidebar');

  useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />
      <div
        className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-50 flex flex-col"
      >
        <div className="p-4 border-b font-bold text-lg">{t('sidebar')}</div>
        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            <li>
              <a href="#" className="block py-2 px-4 rounded hover:bg-gray-100">
                {t('home')}
              </a>
            </li>
            {/* <li>
              <a href="#" className="block py-2 px-4 rounded hover:bg-gray-100">
                {t('shop')}
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 px-4 rounded hover:bg-gray-100">
                {t('contact')}
              </a>
            </li> */}
            <li>
              <Link href="/proizvodi" className="block px-4 py-2 hover:bg-gray-100 rounded">
                {t('products')}
              </Link>
            </li>
            <li>
              <Link href="/porudzbine" className="block px-4 py-2 hover:bg-gray-100 rounded">
                {t('orders')}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
