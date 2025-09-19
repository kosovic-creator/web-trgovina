import React from 'react';

const Sidebar: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  return (
    <div>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block`}
      >
        <div className="p-4 border-b font-bold text-lg">Sidebar</div>
        <ul className="p-4 space-y-2">
          <li><a href="#" className="block py-2 px-4 rounded hover:bg-gray-100">Home</a></li>
          <li><a href="#" className="block py-2 px-4 rounded hover:bg-gray-100">Shop</a></li>
          <li><a href="#" className="block py-2 px-4 rounded hover:bg-gray-100">Contact</a></li>
        </ul>
      </div>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={onClose}
        />
      )}
    </div>
  );
};

export default Sidebar;
