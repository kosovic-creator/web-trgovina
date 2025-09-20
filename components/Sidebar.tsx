import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaHome, FaBoxOpen, FaClipboardList, FaUser, FaSignOutAlt } from 'react-icons/fa';

import '@/i18n/config';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const { t } = useTranslation('sidebar');
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed top-0 left-0 h-screen w-56 bg-white shadow-lg z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b font-bold text-lg">
        <span>{t('sidebar')}</span>
        <button onClick={onClose} className="text-xl">&times;</button>
      </div>
      <nav className="p-4 flex-1 overflow-y-auto">
        <ul className="space-y-2">
          <li>
            <Link
              href="/"
              className={`flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-100 ${pathname === '/' ? 'bg-blue-100 font-bold' : ''
                }`}
            >
              <FaHome /> {t('home')}
            </Link>
          </li>
          <li>
            <Link
              href="/proizvodi"
              className={`flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-100 ${pathname === '/proizvodi' ? 'bg-blue-100 font-bold' : ''
                }`}
            >
              <FaBoxOpen /> {t('products')}
            </Link>
          </li>
          <li>
            <Link
              href="/porudzbine"
              className={`flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-100 ${pathname === '/porudzbine' ? 'bg-blue-100 font-bold' : ''
                }`}
            >
              <FaClipboardList /> {t('orders')}
            </Link>
          </li>
          <li>
            <Link
              href="/profil"
              className={`flex items-center gap-2 py-2 px-4 rounded hover:bg-gray-100 ${pathname === '/profil' ? 'bg-blue-100 font-bold' : ''
                }`}
            >
              <FaUser /> {t('profile')}
            </Link>
          </li>
          <li>
            <button className="flex items-center gap-2 py-2 px-4 rounded text-red-600 hover:bg-gray-100 w-full">
              <FaSignOutAlt /> {t('logout')}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
