import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, DollarSign, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Department {
  _id: string;
  name: string;
}

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
}

export default function AddSalary() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState({
    department: '',
    employee: '',
    basicSalary: '',
    allowances: {
      hra: '',
      da: '',
      medical: '',
      ta: ''
    },
    deductions: {
      pf: '',
      tax: '',
      insurance: ''
    },
    paymentDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

  // Fetch departments and employees
  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (formData.department) {
      fetchEmployees(formData.department);
    } else {
      setEmployees([]);
    }
  }, [formData.department]);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setFormError('Authentication token not found. Please login again.');
        return;
      }

      const response = await fetch('http://localhost:5000/api/department', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setDepartments(data.departments);
      } else {
        throw new Error(data.message || 'Failed to fetch departments');
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      setFormError(error instanceof Error ? error.message : 'Failed to load departments');
    }
  };

  const fetchEmployees = async (departmentId: string) => {
    setIsLoadingEmployees(true);
    setFormError('');
    setEmployees([]);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setFormError('Authentication token not found');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/employee/department/${departmentId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to load employees');
      }

      if (!Array.isArray(data.employees)) {
        throw new Error('Invalid response format: employees data is not an array');
      }

      setEmployees(data.employees);
      
    } catch (error) {
      console.error('Error fetching employees:', error);
      setFormError(error instanceof Error ? error.message : 'Failed to load employees');
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  const validateForm = () => {
    if (!formData.department) {
      setFormError('Please select a department');
      return false;
    }
    
    if (!formData.employee) {
      setFormError('Please select an employee');
      return false;
    }
    
    if (!formData.basicSalary || Number(formData.basicSalary) <= 0) {
      setFormError('Please enter a valid basic salary amount (greater than 0)');
      return false;
    }
    
    if (!formData.paymentDate) {
      setFormError('Please select a payment date');
      return false;
    }
    
    // Validate that payment date is not in the future
    const selectedDate = new Date(formData.paymentDate);
    const today = new Date();
    if (selectedDate > today) {
      setFormError('Payment date cannot be in the future');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setFormError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }
      
      // Calculate payment month and year from the payment date
      const paymentDate = new Date(formData.paymentDate);
      
      const response = await fetch('http://localhost:5000/api/salary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          basicSalary: Number(formData.basicSalary),
          allowances: {
            hra: Number(formData.allowances.hra) || 0,
            da: Number(formData.allowances.da) || 0,
            medical: Number(formData.allowances.medical) || 0,
            ta: Number(formData.allowances.ta) || 0
          },
          deductions: {
            pf: Number(formData.deductions.pf) || 0,
            tax: Number(formData.deductions.tax) || 0,
            insurance: Number(formData.deductions.insurance) || 0
          }
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add salary');
      }

      alert('Salary record added successfully!');
      navigate('/admin-dashboard/salary');
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to add salary record');
      console.error('Error adding salary record:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center">
            <DollarSign className="mr-3 text-blue-600" size={24} />
            <h1 className="text-2xl font-bold text-gray-800">Add Salary Record</h1>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          {formError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>{formError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Department Select */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value, employee: '' })}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
              </select>
            </div>

            {/* Employee Select */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.employee}
                onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={!formData.department || isLoadingEmployees}
              >
                <option value="">
                  {isLoadingEmployees 
                    ? "Loading employees..." 
                    : formData.department 
                      ? "Select Employee" 
                      : "Select a department first"}
                </option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {`${emp.firstName} ${emp.lastName}`}
                  </option>
                ))}
              </select>
              {formData.department && employees.length === 0 && !isLoadingEmployees && (
                <p className="mt-1 text-sm text-amber-600">No employees found in this department</p>
              )}
            </div>

            {/* Basic Salary */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Basic Salary <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.basicSalary}
                onChange={(e) => setFormData({ ...formData, basicSalary: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                min="0"
                step="0.01"
              />
            </div>

            {/* Allowances */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allowances
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">HRA</label>
                  <input
                    type="number"
                    value={formData.allowances.hra}
                    onChange={(e) => setFormData({ ...formData, allowances: { ...formData.allowances, hra: e.target.value } })}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">DA</label>
                  <input
                    type="number"
                    value={formData.allowances.da}
                    onChange={(e) => setFormData({ ...formData, allowances: { ...formData.allowances, da: e.target.value } })}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Medical</label>
                  <input
                    type="number"
                    value={formData.allowances.medical}
                    onChange={(e) => setFormData({ ...formData, allowances: { ...formData.allowances, medical: e.target.value } })}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">TA</label>
                  <input
                    type="number"
                    value={formData.allowances.ta}
                    onChange={(e) => setFormData({ ...formData, allowances: { ...formData.allowances, ta: e.target.value } })}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deductions
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">PF</label>
                  <input
                    type="number"
                    value={formData.deductions.pf}
                    onChange={(e) => setFormData({ ...formData, deductions: { ...formData.deductions, pf: e.target.value } })}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Tax</label>
                  <input
                    type="number"
                    value={formData.deductions.tax}
                    onChange={(e) => setFormData({ ...formData, deductions: { ...formData.deductions, tax: e.target.value } })}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Insurance</label>
                  <input
                    type="number"
                    value={formData.deductions.insurance}
                    onChange={(e) => setFormData({ ...formData, deductions: { ...formData.deductions, insurance: e.target.value } })}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Payment Date */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 rounded-md flex items-center justify-center ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2 inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  <span>Save Salary Record</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
