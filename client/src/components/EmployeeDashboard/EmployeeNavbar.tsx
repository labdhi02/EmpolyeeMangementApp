import { LogOut, Bell } from 'lucide-react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';

export default function EmployeeNavbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-gray-900 to-gray-800 shadow-md border-b border-gray-700/50">
      <div className="flex items-center justify-between h-[69px] px-6">
        <div className="flex items-center space-x-2">
          <h1 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
            Welcome, {(user && 'email' in user && typeof user.email === 'string') ? user.email.split('@')[0] : 'Employee'}
          </h1>
        </div>

        <div className="flex items-center space-x-5">
          <button className="relative p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-full transition-all">
            <Bell size={20} />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-900/20"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium hidden md:inline-block">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
