import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, IndianRupee } from 'lucide-react';

interface SalaryDetails {
  _id: string;
  employee: {
    firstName: string;
    lastName: string;
    employeeId: string;
  };
  department: {
    name: string;
  };
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
  month?: number;
  year?: number;
}

interface SalaryHistoryItem {
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
  month?: number;
  year?: number;
}

export default function ViewSalary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salary, setSalary] = useState<SalaryDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [salaryHistory, setSalaryHistory] = useState<SalaryHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Add a helper function to get month name
  const getMonthName = (month: number) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month - 1];
  };

  useEffect(() => {
    if (!id) {
      setError('Salary record ID is missing in the URL.');
      setLoading(false);
      return;
    }
    fetchSalaryDetails();
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (salary && salary.employee && salary.employee.employeeId) {
      fetchSalaryHistory(salary.employee.employeeId);
    }
    // eslint-disable-next-line
  }, [salary]);

  const fetchSalaryDetails = async () => {
    try {
      if (!id) {
        setError('Salary record ID is missing.');
        setLoading(false);
        return;
      }
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/salary/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch salary details');
      }

      setSalary(data.salary);
      setError('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load salary details');
    } finally {
      setLoading(false);
    }
  };

  const fetchSalaryHistory = async (employeeId: string) => {
    setHistoryLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/salary/employee/${employeeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch salary history');
      }
      setSalaryHistory(Array.isArray(data.salaries) ? data.salaries : []);
    } catch (err) {
      setSalaryHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !salary) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          {error || 'Failed to load salary details'}
        </div>
        <button
          onClick={() => navigate('/admin-dashboard/salary/add')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6"
        >
          Add Salary Record
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center">
        <button
          onClick={() => navigate('/admin-dashboard/salary')}
          className="mr-4 p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Salary Details</h1>
      </div>

      {/* Salary Details Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Employee Info */}
        <div className="mb-6 pb-6 border-b">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Employee Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{`${salary.employee.firstName} ${salary.employee.lastName}`}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Department</p>
              <p className="font-medium">{salary.department.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Date</p>
              <p className="font-medium">{new Date(salary.paymentDate).toLocaleDateString()}</p>
            </div>
            {salary.month && salary.year && (
              <div className="mb-2">
                <p className="text-sm text-gray-600">Payment Period</p>
                <p className="font-medium">{getMonthName(salary.month)} {salary.year}</p>
              </div>
            )}
          </div>
        </div>

        {/* Salary Breakdown */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Salary Breakdown</h2>
          
          {/* Basic Salary */}
          <div className="mb-6">
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
              <span className="font-medium">Basic Salary</span>
              <span className="font-semibold">₹{salary.basicSalary.toFixed(2)}</span>
            </div>
          </div>

          {/* Allowances */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-700 mb-2">Allowances</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>HRA</span>
                <span>₹{salary.allowances.hra.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>DA</span>
                <span>₹{salary.allowances.da.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Medical</span>
                <span>₹{salary.allowances.medical.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>TA</span>
                <span>₹{salary.allowances.ta.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Total Allowances</span>
                <span>₹{salary.allowances.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-700 mb-2">Deductions</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>PF</span>
                <span>₹{salary.deductions.pf.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>₹{salary.deductions.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Insurance</span>
                <span>₹{salary.deductions.insurance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Total Deductions</span>
                <span>₹{salary.deductions.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Net Salary */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <IndianRupee className="text-blue-600 mr-2" size={24} />
                <span className="text-lg font-semibold">Net Salary</span>
              </div>
              <span className="text-xl font-bold text-blue-600">₹{salary.netSalary.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium
              ${salary.status === 'paid' ? 'bg-green-100 text-green-800' : 
                salary.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'}`}>
              {salary.status.charAt(0).toUpperCase() + salary.status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* View Salary History Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={() => navigate(`/admin-dashboard/salary/history/${salary.employee.employeeId}`)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          View Full Salary History
        </button>
      </div>
    </div>
  );
}
