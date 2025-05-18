import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  const menuItems = [
    { path: '/admin-dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin-dashboard/employee', label: 'Employees', icon: '👥' },
    { path: '/admin-dashboard/departments', label: 'Departments', icon: '🏢' },
    { path: '/admin-dashboard/salary', label: 'Salary', icon: '💰' },
    { path: '/admin-dashboard/leave-management', label: 'Leave Management', icon: '📅' },
    { path: '/admin-dashboard/attendance', label: 'Attendance', icon: '⏰' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen">
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded-lg ${
                  isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar; 