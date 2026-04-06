import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Users, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const { user } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['viewer', 'analyst', 'admin'] },
    { name: 'Records', path: '/records', icon: Receipt, roles: ['viewer', 'analyst', 'admin'] },
    { name: 'Users', path: '/users', icon: Users, roles: ['admin'] },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-64px)] fixed top-16 left-0 p-4 flex flex-col gap-2 z-40 overflow-y-auto">
      <div className="mb-4 px-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Main Menu</p>
      </div>
      {menuItems.map((item) => {
        if (!item.roles.includes(user?.role)) return null;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600'
              }`
            }
          >
            <item.icon size={18} strokeWidth={2.5} />
            {item.name}
          </NavLink>
        );
      })}
    </aside>
  );
};

export default Sidebar;
