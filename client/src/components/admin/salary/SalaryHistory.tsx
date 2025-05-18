import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, IndianRupee, Building2, User, Calendar } from 'lucide-react';

interface SalaryHistory {
  _id: string;
  basicSalary: number;
  allowances: {
    hra: number;
    da: number;
    medical: number;
    ta: number;
    total: number;
  };
  deductions: {
    pf: number;
    tax: number;
    insurance: number;
    total: number;
  };
  netSalary: number;
  paymentDate: string;
  status: string;
  month: number;
  year: number;
}

interface EmployeeDetails {
  firstName: string;
  lastName: string;
  employeeId: string;
  department: {
    name: string;
  };
}

export default function SalaryHistory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [salaryHistory, setSalaryHistory] = useState<SalaryHistory[]>([]);
  const [employee, setEmployee] = useState<EmployeeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getMonthName = (month: number) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month - 1];
  };

  useEffect(() => {
    console.log('URL Parameters id:', id); // Debug log
    if (!id || id === 'undefined') {
      console.error('Invalid or missing ID:', id);
      setError('Employee ID is missing or invalid.');
      setLoading(false);
      return;
    }
    fetchSalaryHistory();
  }, [id]);

  const fetchSalaryHistory = async () => {
    try {
      if (!id || id === 'undefined') {
        throw new Error('Valid employee ID is required');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Clean and encode the ID
      const cleanId = id.trim();
      console.log('Fetching salary history for:', cleanId); // Debug log

      const response = await fetch(`http://localhost:5000/api/salary/employee/${cleanId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch salary history');
      }

      const data = await response.json();
      setSalaryHistory(data.salaries || []);
      setEmployee(data.employee || null);
      setError('');
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to load salary history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Salary History</h1>
        </div>

        {employee && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employee Name</p>
                  <p className="font-medium text-gray-900">
                    {employee.firstName} {employee.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employee ID</p>
                  <p className="font-medium text-gray-900">{employee.employeeId}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium text-gray-900">{employee.department.name}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Salary History Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Payment Period</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Basic Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allowances</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salaryHistory.map((salary, index) => (
                <tr key={salary._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{index + 1}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {salary.month && salary.year ? 
                          `${getMonthName(salary.month)} ${salary.year}` : 
                          new Date(salary.paymentDate).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric'
                          })
                        }
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ₹{salary.basicSalary.toLocaleString('en-IN')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">₹{salary.allowances.total.toLocaleString('en-IN')}</div>
                    <div className="mt-1 text-xs text-gray-500">
                      <div>HRA: ₹{salary.allowances.hra.toLocaleString('en-IN')}</div>
                      <div>DA: ₹{salary.allowances.da.toLocaleString('en-IN')}</div>
                      <div>Medical: ₹{salary.allowances.medical.toLocaleString('en-IN')}</div>
                      <div>TA: ₹{salary.allowances.ta.toLocaleString('en-IN')}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">₹{salary.deductions.total.toLocaleString('en-IN')}</div>
                    <div className="mt-1 text-xs text-gray-500">
                      <div>PF: ₹{salary.deductions.pf.toLocaleString('en-IN')}</div>
                      <div>Tax: ₹{salary.deductions.tax.toLocaleString('en-IN')}</div>
                      <div>Insurance: ₹{salary.deductions.insurance.toLocaleString('en-IN')}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      ₹{salary.netSalary.toLocaleString('en-IN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${salary.status === 'paid' ? 'bg-green-100 text-green-800' : 
                      salary.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}
                    >
                      {salary.status.charAt(0).toUpperCase() + salary.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
              {salaryHistory.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center py-8">
                      <IndianRupee className="h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-gray-500 text-sm">No salary records found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
