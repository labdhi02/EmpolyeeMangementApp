import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import { Building2, Mail, User2, IndianRupee, Calendar, Clock, Briefcase, CheckCircle } from 'lucide-react';

interface DashboardStats {
  totalLeaves: number;
  approvedLeaves: number;
  pendingLeaves: number;
  totalAttendance: number;
  attendancePercentage: number;
}


interface EmployeeDetails {
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  department: {
    name: string;
  };
  designation: string;
  salary: number;
  joiningDate: string;
}

export default function EmployeeDashBoard() {
  const { user } = useAuth();
  const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalLeaves: 0,
    approvedLeaves: 0,
    pendingLeaves: 0,
    totalAttendance: 0,
    attendancePercentage: 0,
  });

  const fetchEmployeeDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !user?.id) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`http://localhost:5000/api/employee/profile/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch employee details');
      }

      const data = await response.json();
      setEmployeeDetails(data.employee);
      localStorage.setItem('employeeId', data.employee._id);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/employee/dashboard-stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      Promise.all([fetchEmployeeDetails(), fetchDashboardStats()]);
    }
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {employeeDetails?.firstName || user?.name}</h1>
          <p className="text-blue-100">Here's your dashboard overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            icon={<Calendar className="h-6 w-6" />}
            title="Total Leaves"
            value={stats.totalLeaves}
            color="blue"
          />
          <StatsCard
            icon={<CheckCircle className="h-6 w-6" />}
            title="Approved Leaves"
            value={stats.approvedLeaves}
            color="green"
          />
          <StatsCard
            icon={<Clock className="h-6 w-6" />}
            title="Attendance"
            value={`${stats.attendancePercentage}%`}
            color="purple"
          />
          <StatsCard
            icon={<Calendar className="h-6 w-6" />}
            title="Pending Leaves"
            value={stats.pendingLeaves}
            color="amber"
          />
        </div>

        {/* Profile Card */}
        {employeeDetails && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Employee Profile</h2>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ProfileItem
                  icon={<User2 className="h-5 w-5 text-blue-600" />}
                  label="Employee ID"
                  value={employeeDetails.employeeId}
                />
                <ProfileItem
                  icon={<Mail className="h-5 w-5 text-purple-600" />}
                  label="Email"
                  value={employeeDetails.email}
                />
                <ProfileItem
                  icon={<Building2 className="h-5 w-5 text-green-600" />}
                  label="Department"
                  value={employeeDetails.department.name}
                />
                <ProfileItem
                  icon={<Briefcase className="h-5 w-5 text-amber-600" />}
                  label="Designation"
                  value={employeeDetails.designation}
                />
                <ProfileItem
                  icon={<IndianRupee className="h-5 w-5 text-red-600" />}
                  label="Salary"
                  value={`₹${employeeDetails.salary.toLocaleString('en-IN')}`}
                />
                <ProfileItem
                  icon={<Calendar className="h-5 w-5 text-indigo-600" />}
                  label="Joining Date"
                  value={new Date(employeeDetails.joiningDate).toLocaleDateString()}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const StatsCard = ({ icon, title, value, color }: { icon: React.ReactNode, title: string, value: number | string, color: string }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className={`w-12 h-12 rounded-lg ${colors[color as keyof typeof colors]} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  );
};

const ProfileItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  </div>
);
