import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IndianRupee, Search, Plus, Eye, Calendar, Filter } from 'lucide-react';

interface Salary {
  _id: string;
  employee: {
    _id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
  };
  department: {
    name: string;
  };
  basicSalary: number;
  netSalary: number;
  paymentDate: string;
  month: number;
  year: number;
  status: 'paid' | 'pending' | 'cancelled';
}

const SalaryList: React.FC = () => {
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('http://localhost:5000/api/salary', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.salaries)) {
        setSalaries(data.salaries);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (error) {
      console.error('Error fetching salaries:', error);
      setError(error instanceof Error ? error.message : 'Failed to load salary records');
    } finally {
      setLoading(false);
    }
  };

  const filteredSalaries = salaries
    .filter(salary => 
      statusFilter === 'all' || salary.status === statusFilter
    )
    .filter(salary => 
      salary.employee && 
      `${salary.employee.firstName} ${salary.employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMonthName = (month: number) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month - 1];
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Salary Records</h3>

      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by employee name" 
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <Link 
            to="/admin-dashboard/salary/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
          >
            <Plus className="mr-2" size={20} />
            <span>Add Salary Record</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading salary records...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>Period</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-end space-x-1">
                    <IndianRupee size={14} />
                    <span>Amount</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSalaries.length > 0 ? (
                filteredSalaries.map((salary) => (
                  <tr key={salary._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {`${salary.employee.firstName} ${salary.employee.lastName}`}
                      </div>
                      <div className="text-sm text-gray-500">{salary.employee.employeeId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{salary.department.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {getMonthName(salary.month)} {salary.year}
                      </div>
                      <div className="text-xs text-gray-500">
                        Processed on {new Date(salary.paymentDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{salary.netSalary.toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs text-gray-500">
                        Base: ₹{salary.basicSalary.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${getStatusColor(salary.status)}`}
                      >
                        {salary.status.charAt(0).toUpperCase() + salary.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Link 
                        to={`/admin-dashboard/salary/${salary._id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link 
                        to={`/admin-dashboard/salary/history/${salary.employee.employeeId}`}
                        className="text-blue-600 hover:text-blue-800 ml-2"
                      >
                        View History
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'No salary records match your search criteria' 
                      : 'No salary records found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SalaryList;
