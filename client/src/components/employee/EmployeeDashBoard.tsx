import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import { Building2, Mail, User2, IndianRupee } from 'lucide-react';

interface EmployeeDetails {
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  department: {
    name: string;
  };
  salary: number;
}

export default function EmployeeDashBoard() {
  const { user } = useAuth();
  const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        // Store employee ID for future use
        localStorage.setItem('employeeId', data.employee._id);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchEmployeeDetails();
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 bg-white py-3 px-6 rounded-lg shadow-sm border-l-4 border-blue-500 transform transition-all animate-fadeIn">
          Welcome, {user?.name}
        </h1>
        
        {employeeDetails && (
          <div className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-all hover:shadow-xl">
            <div className="border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-700 px-6 py-4">Your Profile</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Employee ID */}
                <div className="flex items-center space-x-4 group">
                  <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-all duration-300">
                    <User2 className="h-7 w-7 text-blue-600" />
                  </div>
                  <div className="border-b border-transparent group-hover:border-blue-200 transition-all pb-1">
                    <p className="text-sm font-medium uppercase text-gray-500">Employee ID</p>
                    <p className="font-semibold text-lg text-gray-900">{employeeDetails.employeeId}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center space-x-4 group">
                  <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-all duration-300">
                    <Mail className="h-7 w-7 text-purple-600" />
                  </div>
                  <div className="border-b border-transparent group-hover:border-purple-200 transition-all pb-1">
                    <p className="text-sm font-medium uppercase text-gray-500">Email</p>
                    <p className="font-semibold text-lg text-gray-900">{employeeDetails.email}</p>
                  </div>
                </div>

                {/* Department */}
                <div className="flex items-center space-x-4 group">
                  <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-all duration-300">
                    <Building2 className="h-7 w-7 text-green-600" />
                  </div>
                  <div className="border-b border-transparent group-hover:border-green-200 transition-all pb-1">
                    <p className="text-sm font-medium uppercase text-gray-500">Department</p>
                    <p className="font-semibold text-lg text-gray-900">{employeeDetails.department.name}</p>
                  </div>
                </div>

                {/* Salary */}
                <div className="flex items-center space-x-4 group">
                  <div className="p-3 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-all duration-300">
                    <IndianRupee className="h-7 w-7 text-amber-600" />
                  </div>
                  <div className="border-b border-transparent group-hover:border-amber-200 transition-all pb-1">
                    <p className="text-sm font-medium uppercase text-gray-500">Base Salary</p>
                    <p className="font-semibold text-lg text-gray-900">₹{employeeDetails.salary.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 text-center text-sm text-gray-600 font-medium">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
