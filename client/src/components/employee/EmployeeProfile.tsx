import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User2, Building2, Mail, Calendar, IndianRupee, UserCircle2, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/authContext';

interface EmployeeDetails {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  salary: number;
  department: {
    name: string;
  };
  designation: string;
  createdAt: string;
}

export default function EmployeeProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<EmployeeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found. Please log in again.');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        console.log('Fetching employee profile data...');
        
        const response = await fetch('http://localhost:5000/api/employee/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        console.log('Profile response status:', response.status);
        
        // Check content type
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Non-JSON profile response:', text);
          throw new Error('Invalid response format from server');
        }

        const data = await response.json();
        console.log('Profile API response:', data);

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch employee details');
        }

        if (!data.employee) {
          throw new Error('No employee data received from server');
        }

        console.log('Employee data:', data.employee);
        setEmployee(data.employee);
      } catch (error) {
        console.error('Error details:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load employee details';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center">
        <button
          onClick={() => navigate('/admin-dashboard/employee')}
          className="mr-4 p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Employee Details</h1>
      </div>

      {/* Employee Details Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Basic Info Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start">
            <div className="p-3 bg-blue-50 rounded-lg">
              <User2 className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {employee.firstName} {employee.lastName}
              </h2>
              <p className="text-gray-500">{employee.employeeId}</p>
            </div>
          </div>
        </div>

        {/* Detailed Info Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              <Mail className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="font-medium text-gray-900">{employee.email}</p>
            </div>
          </div>

          {/* Department */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-medium text-gray-900">{employee.department.name}</p>
            </div>
          </div>

          {/* Gender */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <UserCircle2 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-medium text-gray-900 capitalize">{employee.gender}</p>
            </div>
          </div>

          {/* Date of Birth */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-medium text-gray-900">
                {new Date(employee.dateOfBirth).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Designation */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <Briefcase className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Designation</p>
              <p className="font-medium text-gray-900">{employee.designation}</p>
            </div>
          </div>

          {/* Salary */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <IndianRupee className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Base Salary</p>
              <p className="font-medium text-gray-900">₹{employee.salary.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        {/* Join Date */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Joined on {new Date(employee.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
