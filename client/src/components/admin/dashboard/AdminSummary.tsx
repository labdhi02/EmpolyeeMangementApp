import React, { useEffect, useState } from 'react'
import { Users, Building2, IndianRupee, CheckCircle, Clock, XCircle, RefreshCcw, PlusCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface SummaryCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  bgColor: string;
  textColor: string;
  onClick?: () => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ icon, title, value, bgColor, textColor, onClick }) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-md border-t border-l border-gray-50 p-6 transition-all duration-300 hover:shadow-lg hover:translate-y-[-3px] ${onClick ? 'cursor-pointer' : ''} group`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3.5 rounded-lg ${bgColor} ${textColor} transform transition-transform group-hover:scale-110`}>
          {icon}
        </div>
      </div>
      <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">{title}</h3>
      <p className="text-2xl font-bold text-gray-800 mt-1 group-hover:text-blue-600 transition-colors">{value}</p>
    </div>
  )
}

const AdminSummary: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    employeeCount: 0,
    departmentCount: 0,
    totalPayroll: 0,
    leaveStats: {
      total: 0,
      approved: 0,
      pending: 0,
      rejected: 0
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, [refreshTrigger]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      console.log('Fetching dashboard data...');
      
      const response = await fetch('http://localhost:5000/api/dashboard/summary', {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      console.log('Dashboard response status:', response.status);
      
      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON dashboard response:', text);
        throw new Error('Invalid response format from server');
      }

      // Parse the response
      const data = await response.json();
      console.log('Dashboard data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard summary');
      }

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch dashboard summary');
      }

      // Set dashboard data with fallbacks for missing values
      setDashboardData({
        employeeCount: data.data?.employeeCount || 0,
        departmentCount: data.data?.departmentCount || 0,
        totalPayroll: data.data?.totalPayroll || 0,
        leaveStats: data.data?.leaveStats || { 
          total: 0, 
          approved: 0, 
          pending: 0, 
          rejected: 0 
        }
      });
      setError('');

    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      const msg = error instanceof Error ? error.message : 'Failed to load dashboard data';
      setError(msg);
      
      // Set fallback data in case of error
      setDashboardData({
        employeeCount: 0,
        departmentCount: 0,
        totalPayroll: 0,
        leaveStats: { total: 0, approved: 0, pending: 0, rejected: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-sm">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {/* Header with refresh button */}
      <div className="flex justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Dashboard Overview</h1>
        <button 
          onClick={handleRefresh} 
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <RefreshCcw size={16} className="mr-1" />
          <span className="font-medium">Refresh</span>
        </button>
      </div>

      {/* Main Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCard
          icon={<Users size={26} />}
          title="Total Employees"
          value={dashboardData.employeeCount}
          bgColor="bg-gradient-to-br from-blue-100 to-blue-50"
          textColor="text-blue-600"
          onClick={() => navigate('/admin-dashboard/employee')}
        />
        <SummaryCard
          icon={<Building2 size={26} />}
          title="Departments"
          value={dashboardData.departmentCount}
          bgColor="bg-gradient-to-br from-purple-100 to-purple-50"
          textColor="text-purple-600"
          onClick={() => navigate('/admin-dashboard/departments')}
        />
        <SummaryCard
          icon={<IndianRupee size={26} />}
          title="Total Payroll"
          value={formatCurrency(dashboardData.totalPayroll)}
          bgColor="bg-gradient-to-br from-green-100 to-green-50"
          textColor="text-green-600"
          onClick={() => navigate('/admin-dashboard/salary')}
        />
      </div>

      {/* Leave Management Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-5 pb-2 border-b border-gray-100">Leave Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard
            icon={<CheckCircle size={26} />}
            title="Approved Leaves"
            value={dashboardData.leaveStats.approved}
            bgColor="bg-gradient-to-br from-green-100 to-green-50"
            textColor="text-green-600"
            onClick={() => navigate('/admin-dashboard/leave-management')}
          />
          <SummaryCard
            icon={<Clock size={26} />}
            title="Pending Leaves"
            value={dashboardData.leaveStats.pending}
            bgColor="bg-gradient-to-br from-amber-100 to-amber-50"
            textColor="text-amber-600"
            onClick={() => navigate('/admin-dashboard/leave-management')}
          />
          <SummaryCard
            icon={<XCircle size={26} />}
            title="Rejected Leaves"
            value={dashboardData.leaveStats.rejected}
            bgColor="bg-gradient-to-br from-red-100 to-red-50"
            textColor="text-red-600"
            onClick={() => navigate('/admin-dashboard/leave-management')}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-5 pb-2 border-b border-gray-100">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/admin-dashboard/employee/add')}
            className="flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-sm border border-blue-100 hover:shadow-md hover:border-blue-300 hover:bg-blue-50 transition-all group"
          >
            <PlusCircle size={20} className="mr-3 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-gray-700 group-hover:text-blue-700 transition-colors">Add Employee</span>
          </button>
          <button
            onClick={() => navigate('/admin-dashboard/add-departments')}
            className="flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-sm border border-purple-100 hover:shadow-md hover:border-purple-300 hover:bg-purple-50 transition-all group"
          >
            <PlusCircle size={20} className="mr-3 text-purple-600 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-gray-700 group-hover:text-purple-700 transition-colors">Add Department</span>
          </button>
          <button
            onClick={() => navigate('/admin-dashboard/salary/add')}
            className="flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-white rounded-xl shadow-sm border border-green-100 hover:shadow-md hover:border-green-300 hover:bg-green-50 transition-all group"
          >
            <PlusCircle size={20} className="mr-3 text-green-600 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-gray-700 group-hover:text-green-700 transition-colors">Add Salary</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;