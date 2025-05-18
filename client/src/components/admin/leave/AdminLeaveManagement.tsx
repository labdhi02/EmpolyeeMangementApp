import React, { useEffect, useState } from 'react';
import { Calendar, Filter, Check, X, AlertCircle } from 'lucide-react';

interface Leave {
  _id: string;
  employee: {
    name: string;
    email: string;
    employeeId: string;
  };
  fromDate: string;
  toDate: string;
  reason: string;
  leaveType: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const AdminLeaveManagement = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    console.log('Fetching leaves...');
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'Found' : 'Not found');

      if (!token) {
        throw new Error('Authentication required');
      }

      // Debug logging
      console.log('API URL:', 'http://localhost:5000/api/leave/all');

      const response = await fetch('http://localhost:5000/api/leave/all', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      // Check response type before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Received non-JSON response:', text);
        throw new Error('Invalid response format from server');
      }

      const data = await response.json();
      console.log('Full Response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch leaves');
      }

      // Add more detailed logging
      console.log('Number of leaves:', data.leaves ? data.leaves.length : 0);
      console.log('First leave (if exists):', data.leaves?.[0]);

      if (Array.isArray(data.leaves)) {
        setLeaves(data.leaves);
      } else {
        console.error('Leaves is not an array:', data.leaves);
        setLeaves([]);
      }
    } catch (error) {
      console.error('Detailed error:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch leaves');
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  const updateLeaveStatus = async (leaveId: string, status: 'approved' | 'rejected') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/leave/${leaveId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        fetchLeaves(); // Refresh the list after update
      }
    } catch (error) {
      console.error('Error updating leave status:', error);
    }
  };

  const filteredLeaves = filter === 'all' 
    ? leaves 
    : leaves.filter(leave => leave.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Leave Management</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={fetchLeaves}
            className="text-blue-600 hover:text-blue-800"
          >
            Refresh
          </button>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1"
            >
              <option value="all">All Leaves</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredLeaves.map((leave) => (
            <div key={leave._id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{leave.employee.name}</h3>
                  <div className="flex items-center space-x-2">
                    <Calendar size={18} className="text-gray-500" />
                    <span className="font-medium">
                      {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">{leave.reason}</p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(leave.status)}`}>
                    {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                  </span>
                  <span className="text-sm font-medium text-gray-500 capitalize">
                    {leave.leaveType} Leave
                  </span>
                  {leave.status === 'pending' && (
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => updateLeaveStatus(leave._id, 'approved')}
                        className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                        title="Approve"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => updateLeaveStatus(leave._id, 'rejected')}
                        className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                        title="Reject"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {filteredLeaves.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No leaves found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminLeaveManagement;
