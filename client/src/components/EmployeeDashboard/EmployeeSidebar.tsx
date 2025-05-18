import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Calendar,
  ClipboardList,
  Settings, 
  LogOut, 
  Menu,
  IndianRupee
} from 'lucide-react';
import { useAuth } from '../../context/authContext';

export default function EmployeeSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/employee-dashboard' },
    { id: 'profile', icon: User, label: 'Profile', path: '/employee-dashboard/profile' },
    { id: 'leave', icon: Calendar, label: 'Leave Requests', path: '/employee-dashboard/leave' },
    { id: 'attendance', icon: ClipboardList, label: 'Attendance', path: '/employee-dashboard/attendance' },
    { id: 'salary', icon: IndianRupee, label: 'Salary', path: '/employee-dashboard/salary' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/employee-dashboard/settings' },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className={`h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} shadow-xl`}>
      <div className="block md:hidden absolute top-4 right-4">
        <button onClick={toggleSidebar} className="p-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
          <Menu size={20} />
        </button>
      </div>
      
      <div className="flex items-center p-4 border-b border-gray-700/50">
        {!collapsed ? (
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 rounded-lg shadow-lg">
              <User size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">EMS Portal</span>
          </div>
        ) : (
          <div className="mx-auto bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 rounded-lg shadow-lg">
            <User size={20} className="text-white" />
          </div>
        )}
      </div>
      
      <div className="py-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className="mb-1.5 px-2">
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800/60 hover:text-white'} 
                  ${collapsed ? 'justify-center' : ''}
                  group
                `}
                end={item.id === 'dashboard'}
              >
                <item.icon size={20} className={`${collapsed ? 'mx-auto' : 'mr-3'} transition-transform group-hover:scale-110`} />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="absolute bottom-0 w-full border-t border-gray-700/50 p-4">
        <button 
          onClick={handleLogout}
          className={`flex items-center text-red-400 hover:text-red-300 px-4 py-2.5 rounded-lg hover:bg-red-900/20 w-full transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={20} className={`${collapsed ? '' : 'mr-3'} group-hover:translate-x-1 transition-transform`} />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}
