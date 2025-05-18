import { useAuth } from '../../../context/authContext'
import AdminSidebar from '../dashboard/AdminSlidebar'
import Navbar from '../dashboard/Navbar'
import AdminSummary from '../dashboard/AdminSummary';
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isMainDashboard = location.pathname === '/admin-dashboard';
  const [apiError, setApiError] = useState('');

  // Verify API connectivity on dashboard load
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/health');
        if (!response.ok) {
          setApiError('API server is not responding properly. Some features may not work.');
        } else {
          setApiError('');
        }
      } catch (error) {
        console.error('API health check failed:', error);
        setApiError('Cannot connect to the API server. Please check your server connection.');
      }
    };
    
    checkApiHealth();
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <div className="sticky top-0 h-screen">
        <AdminSidebar />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10">
          <Navbar />
        </div>
        
        {apiError && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 m-4 rounded-lg shadow-sm animate-fadeIn">
            <p className="font-bold">API Connection Error</p>
            <p>{apiError}</p>
          </div>
        )}
        
        <main className="p-5 md:p-8 max-w-7xl mx-auto">
          {/* Only show AdminSummary on the main dashboard path */}
          {isMainDashboard ? (
            <AdminSummary />
          ) : (
            <div className="animate-fadeIn">
              <Outlet />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
