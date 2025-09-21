'use client';
import Link from "next/link";
import { useTranslation } from "react-i18next";

function NotFound() {
  const { t } = useTranslation('notFound');
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 animate-bounce">
        {t("page_not_found")}
      </h1>
      <Link
        href="/"
        className="inline-block bg-red-500 hover:bg--red-200 text-white px-6 py-3 text-lg rounded-lg shadow transition -transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      >
        {t("back_to_home")}
      </Link>
    </main>
  );
}

export default NotFound;
