import React, { useEffect, useState } from 'react'
import { Search, Plus, User, Trash2, PenSquare, Eye, IndianRupee } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

interface Employee {
  _id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: {
    _id: string;
    name: string;
  };
  designation: string;
  createdAt: string;
}

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token missing. Please login again.');
      }
      
      console.log('Fetching employees with token:', token ? 'Token exists' : 'No token');

      const response = await fetch('http://localhost:5000/api/employee', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      // Check response status
      console.log('Response status:', response.status);
      
      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Invalid response from server');
      }
      
      const data = await response.json();
      console.log('Fetched employees:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch employees');
      }
      
      if (data.success && Array.isArray(data.employees)) {
        setEmployees(data.employees);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      // Display error to user
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to load employees'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/employee/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          fetchEmployees();
        } else {
          const data = await response.json();
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee');
      }
    }
  };

  const filteredEmployees = employees.filter(emp =>
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Manage Employees</h3>

      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-1 mr-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name" 
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <Link 
          to="/admin-dashboard/employee/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
          aria-label="Add new employee"
          data-testid="add-employee-button"
        >
          <Plus className="mr-2" size={20} />
          <span>Add Employee</span>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading employees...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <tr key={employee._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{employee.employeeId}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {`${employee.firstName} ${employee.lastName}`}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{employee.department?.name || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{employee.designation}</span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link 
                        to={`/admin-dashboard/employee/view/${employee._id}`}
                        className="text-green-600 hover:text-green-800 inline-flex items-center"
                        title="View Employee Details"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link 
                        to={`/admin-dashboard/employee/edit/${employee._id}`}
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                        title="Edit Employee"
                      >
                        <PenSquare size={18} />
                      </Link>
                      <Link 
                        to={`/admin-dashboard/employee/salary/${employee.employeeId}`}
                        className="text-yellow-600 hover:text-yellow-800 inline-flex items-center"
                        title="Salary"
                      >
                        <IndianRupee size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(employee._id)}
                        className="text-red-600 hover:text-red-800 inline-flex items-center"
                        title="Delete Employee"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
