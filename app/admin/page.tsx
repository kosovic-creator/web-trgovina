import Link from 'next/link';

export default function AdminHome() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <div className="flex flex-col gap-4">
        <Link href="/admin/korisnici" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Korisnici</Link>
        <Link href="/admin/proizvodi" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Proizvodi</Link>
        <Link href="/admin/porudzbine" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Porudžbine</Link>
      </div>
    </div>
  );
}
