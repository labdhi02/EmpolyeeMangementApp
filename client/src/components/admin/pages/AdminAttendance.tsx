import React, { useEffect, useState } from 'react';

interface Employee {
  _id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  department: {
    name: string;
  };
}

type AttendanceStatus = 'present' | 'absent';

const AdminAttendance = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [error, setError] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [alreadySaved, setAlreadySaved] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [date, employees.length]);

  const fetchEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      console.log('Fetching employees...');
      
      const response = await fetch('http://localhost:5000/api/employee', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Invalid response from server');
      }
      
      const data = await response.json();
      console.log('Employees data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch employees');
      }
      
      setEmployees(data.employees || []);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    if (!date || employees.length === 0) return;
    setLoading(true);
    setError('');
    setAlreadySaved(false);
    setSuccessMsg('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/attendance?date=${date}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success && data.attendance && data.attendance.records && data.attendance.records.length > 0) {
        const att: Record<string, AttendanceStatus> = {};
        data.attendance.records.forEach((rec: any) => {
          att[rec.employee._id] = rec.status;
        });
        setAttendance(att);
        setAlreadySaved(true);
        setSuccessMsg('Attendance for this date has already been saved.');
      } else {
        // Default: all present
        const att: Record<string, AttendanceStatus> = {};
        employees.forEach(emp => { att[emp._id] = 'present'; });
        setAttendance(att);
        setAlreadySaved(false);
        setSuccessMsg('');
      }
    } catch (err) {
      setError('Could not fetch attendance for selected date');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (empId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({ ...prev, [empId]: status }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      const records = employees.map(emp => ({
        employee: emp._id,
        status: attendance[emp._id] || 'present',
      }));
      const response = await fetch('http://localhost:5000/api/attendance', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, records }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to save attendance');
      setSuccessMsg('Attendance saved successfully!');
      setAlreadySaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Attendance Management</h3>
      <div className="mb-4 flex items-center gap-4">
        <label className="font-medium text-gray-700">
          Date:
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="ml-2 px-2 py-1 border rounded"
          />
        </label>
        <button
          onClick={handleSave}
          disabled={saving || loading || alreadySaved}
          className={`ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60 ${alreadySaved ? 'cursor-not-allowed' : ''}`}
        >
          {alreadySaved ? 'Attendance Already Saved' : (saving ? 'Saving...' : 'Save Attendance')}
        </button>
        {successMsg && <span className="ml-4 text-green-600">{successMsg}</span>}
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        {error && <div className="mb-4 text-red-600">{error}</div>}
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading employees...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sr No.</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Employee ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((emp, idx) => (
                  <tr key={emp._id}>
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{emp.employeeId}</td>
                    <td className="px-4 py-2">{emp.firstName} {emp.lastName}</td>
                    <td className="px-4 py-2">{emp.department?.name || '-'}</td>
                    <td className="px-4 py-2">
                      <select
                        value={attendance[emp._id] || 'present'}
                        onChange={e => handleStatusChange(emp._id, e.target.value as AttendanceStatus)}
                        className="border rounded px-2 py-1"
                        disabled={alreadySaved}
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">No employees found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAttendance;
