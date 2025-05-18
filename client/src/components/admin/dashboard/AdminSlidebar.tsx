import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2,
  FileText,
  IndianRupee,
  Calendar,
  ClipboardList,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  BarChart
} from 'lucide-react';
import { useAuth } from '../../../context/authContext';

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Updated menu items with verified paths
  const menuItems = [
    { 
      id: 'dashboard', 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/admin-dashboard' 
    },
    { 
      id: 'employees', 
      icon: Users, 
      label: 'Employees', 
      path: '/admin-dashboard/employee' 
    },
    { 
      id: 'departments', 
      icon: Building2, 
      label: 'Departments', 
      path: '/admin-dashboard/departments' 
    },
    { 
      id: 'leave', 
      icon: Calendar, 
      label: 'Leave Management', 
      path: '/admin-dashboard/leave-management' 
    },
    { 
      id: 'attendance', 
      icon: ClipboardList, 
      label: 'Attendance', 
      path: '/admin-dashboard/attendance' 
    },
    { 
      id: 'attendance-report', 
      icon: BarChart, 
      label: 'Attendance Report', 
      path: '/admin-dashboard/attendance-report' 
    },
    { 
      id: 'salary', 
      icon: IndianRupee, 
      label: 'Salary', 
      path: '/admin-dashboard/salary' 
    },
    { 
      id: 'settings', 
      icon: Settings, 
      label: 'Settings', 
      path: '/admin-dashboard/settings' 
    },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div 
      className={`h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      } relative shadow-xl`}
    >
      {/* Logo & Title */}
      <div className="flex items-center p-5 border-b border-gray-700/50">
        {!collapsed ? (
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Users size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">EmployeeEase</h1>
          </div>
        ) : (
          <div className="mx-auto w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Users size={22} className="text-white" />
          </div>
        )}
      </div>

      {/* Collapse button (visible on larger screens) */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full p-1.5 shadow-md hidden md:block transform transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Mobile menu button (visible on small screens) */}
      <button
        onClick={toggleSidebar}
        className="md:hidden absolute top-5 right-5 bg-gray-800 p-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <Menu size={20} />
      </button>

      {/* Menu Items */}
      <div className="py-5 overflow-y-auto max-h-[calc(100vh-9rem)] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <ul className="space-y-1.5">
          {menuItems.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center px-4 py-3 mx-2 my-1 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-md' 
                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'}
                  ${collapsed ? 'justify-center' : ''}
                `}
                end={item.path === '/admin-dashboard'}
              >
                <item.icon size={20} className={`${collapsed ? 'mx-auto' : 'mr-3'} ${!collapsed && 'transform transition-transform group-hover:scale-110'}`} />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout Button */}
      <div className="absolute bottom-0 w-full border-t border-gray-700/50 p-4">
        <button 
          onClick={handleLogout}
          className={`flex items-center text-red-400 hover:text-red-300 px-4 py-2.5 rounded-lg hover:bg-gray-800/50 w-full transition-all ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut size={20} className={`${collapsed ? '' : 'mr-3'} transform transition-transform group-hover:translate-x-1`} />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;