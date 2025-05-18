import React from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    {
      title: 'Dashboard',
      icon: <i className="fas fa-tachometer-alt"></i>,
      path: '/admin-dashboard',
    },
    {
      title: 'Employees',
      icon: <i className="fas fa-users"></i>,
      path: '/admin-dashboard/employees',
    },
    {
      title: 'Salary',
      icon: <IndianRupee size={20} />,
      path: '/admin-dashboard/salary',
      submenu: [
        {
          title: 'All Salaries',
          path: '/admin-dashboard/salary'
        },
        {
          title: 'Add Salary',
          path: '/admin-dashboard/salary/add'
        }
      ]
    },
    {
      title: 'Settings',
      icon: <i className="fas fa-cogs"></i>,
      path: '/admin-dashboard/settings',
    },
  ];

  return (
    <div className="sidebar">
      <ul>
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link to={item.path}>
              {item.icon}
              <span>{item.title}</span>
            </Link>
            {item.submenu && (
              <ul>
                {item.submenu.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <Link to={subItem.path}>{subItem.title}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;