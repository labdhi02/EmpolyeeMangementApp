import React, { useEffect, useState } from 'react';
import { Calendar, Filter } from 'lucide-react';

interface Leave {
  _id: string;
  fromDate: string;
  toDate: string;
  reason: string;
  leaveType: string;
  status: 'pending' | 'approved' | 'rejected';
}

const ViewLeave = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLeaves();
  }, []); // The empty dependency array ensures it only runs once on mount

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to view leaves');
      }

      // Include console logging for debugging
      console.log('Fetching employee leaves with token:', token ? 'Token exists' : 'No token');

      const response = await fetch('http://localhost:5000/api/leave/employee-leaves', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      // Log the response status
      console.log('Response status:', response.status);
      
      // Check if the response is valid JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Invalid response from server');
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch leaves');
      }

      console.log('Leaves data:', data);
      setLeaves(data.leaves || []); // Access the leaves array from the response
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error instanceof Error ? error.message : 'Error fetching leaves');
      setLeaves([]); // Reset leaves on error
    } finally {
      setLoading(false);
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
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Leave History</h2>
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid gap-4">
        {filteredLeaves.map((leave) => (
          <div key={leave._id} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-start">
              <div>
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
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && filteredLeaves.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No leaves found</p>
      )}
    </div>
  );
};

export default ViewLeave;
