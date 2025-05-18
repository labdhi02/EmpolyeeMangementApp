import { NavLink } from 'react-router-dom';
import { IndianRupee } from 'lucide-react';

const AdminSidebar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="flex flex-col py-4">
        {/* ...existing sidebar items... */}
        
        <NavLink
          to="/admin-dashboard/salary"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
              isActive ? 'bg-blue-50 text-blue-600' : ''
            }`
          }
        >
          <IndianRupee className="w-5 h-5 mr-3" />
          <span>Salary Management</span>
        </NavLink>
        
        {/* ...existing sidebar items... */}
      </div>
    </nav>
  );
};

export default AdminSidebar;
