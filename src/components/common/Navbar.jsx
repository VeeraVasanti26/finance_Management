import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 h-16 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">₹</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900">FinanceDash</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <UserIcon size={18} />
          <span className="font-medium">{user?.name}</span>
          <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs uppercase font-bold">
            {user?.role}
          </span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
