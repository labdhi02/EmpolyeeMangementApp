import React, { useState } from 'react';
import { Plus, Send } from 'lucide-react';
import ViewLeave from '../EmployeeDashboard/pages/ViewLeave';

const LeaveForm = ({ onSuccess, onClose }: { onSuccess: () => void; onClose: () => void }) => {
  const [error, setError] = useState('');
  const [leaveData, setLeaveData] = useState({
    fromDate: '',
    toDate: '',
    reason: '',
    leaveType: 'sick'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not logged in. Please login again.');
        setIsSubmitting(false);
        return;
      }
      const response = await fetch('http://localhost:5000/api/leave/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fromDate: leaveData.fromDate,
          toDate: leaveData.toDate,
          reason: leaveData.reason,
          leaveType: leaveData.leaveType
        })
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Failed to submit leave request');
        setIsSubmitting(false);
        return;
      }

      onSuccess();
      onClose();
    } catch (error) {
      setError('Failed to submit leave request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Submit Sick Leave Request</h2>
        {error && (
          <div className="mb-4 text-red-600">{error}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                required
                value={leaveData.fromDate}
                onChange={(e) => setLeaveData({...leaveData, fromDate: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                required
                value={leaveData.toDate}
                onChange={(e) => setLeaveData({...leaveData, toDate: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <textarea
                required
                value={leaveData.reason}
                onChange={(e) => setLeaveData({...leaveData, reason: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EmployeeLeave = () => {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const handleLeaveSuccess = () => {
    setShowForm(false);
    setRefreshKey(prev => prev + 1);
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Leave Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} className="mr-2" />
          Request Leave
        </button>
      </div>

      {showForm && (
        <LeaveForm 
          onSuccess={handleLeaveSuccess} 
          onClose={() => setShowForm(false)}
        />
      )}
      <ViewLeave key={refreshKey} />
    </div>
  );
};

export default EmployeeLeave;

