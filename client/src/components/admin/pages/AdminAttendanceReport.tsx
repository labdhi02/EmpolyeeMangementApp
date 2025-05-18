import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminAttendanceReport = () => {
  const [reportData, setReportData] = useState<Array<{ date: string; present: number; absent: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttendanceReport = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/attendance/report', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch attendance report');
        }
        
        setReportData(data.data || []);
      } catch (error) {
        console.error('Error:', error);
        setError(error instanceof Error ? error.message : 'Failed to load attendance report');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAttendanceReport();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Attendance Report</h1>
      
      {reportData.length > 0 ? (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Daily Attendance Overview</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={reportData.map(item => ({
                  ...item,
                  date: new Date(item.date).toLocaleDateString()
                }))}
                margin={{
                  top: 20, right: 30, left: 20, bottom: 60
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" angle={-45} textAnchor="end" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="#4ade80" name="Present" />
                <Bar dataKey="absent" fill="#f87171" name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No attendance data available.</p>
        </div>
      )}
    </div>
  );
};

export default AdminAttendanceReport;
