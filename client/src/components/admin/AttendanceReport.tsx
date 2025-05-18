import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

interface AttendanceRecord {
  date: string;
  present: number;
  absent: number;
}

const AttendanceReport = () => {
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAttendanceReport();
  }, []);

  const fetchAttendanceReport = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      console.log('Fetching attendance report...');
      
      const response = await fetch('http://localhost:5000/api/attendance/report', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);

      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Invalid response from server');
      }

      const result = await response.json();
      console.log('Attendance report data:', result);
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch attendance report');
      }
      
      // Transform data for chart
      const chartData = (result.data || []).map((item: any) => ({
        date: item.date,
        present: item.present,
        absent: item.absent,
      }));
      setData(chartData);
    } catch (err) {
      console.error('Error fetching attendance report:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch attendance report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Attendance Report</h3>
      <div className="bg-white rounded-lg shadow p-6">
        {error && <div className="mb-4 text-red-600">{error}</div>}
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading attendance report...</p>
          </div>
        ) : (
          data.length === 0 ? (
            <div className="text-center text-gray-500 py-10">No attendance data available.</div>
          ) : (
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: '#4b5563' }} 
                    tickLine={{ stroke: '#e5e7eb' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis 
                    allowDecimals={false} 
                    tick={{ fontSize: 12, fill: '#4b5563' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickFormatter={(value) => `${value}`}
                    label={{ value: 'Count', angle: -90, position: 'insideLeft', fill: '#6b7280', fontSize: 14 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      borderRadius: '6px', 
                      border: 'none', 
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
                    }}
                    formatter={(value, name) => [`${value} employees`, name]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span style={{ color: '#4b5563', fontWeight: 'bold' }}>{value}</span>}
                  />
                  <Bar 
                    dataKey="present" 
                    fill="#3b82f6" 
                    name="Present" 
                    radius={[8, 8, 0, 0]} 
                    animationDuration={1500}
                    label={{ 
                      position: 'top', 
                      fill: '#3b82f6', 
                      fontSize: 12,
                      formatter: (value: number) => value > 0 ? value : '',
                    }}
                  />
                  <Bar 
                    dataKey="absent" 
                    fill="#f59e0b" 
                    name="Absent" 
                    radius={[8, 8, 0, 0]} 
                    animationDuration={1500} 
                    animationBegin={300}
                    label={{ 
                      position: 'top', 
                      fill: '#f59e0b', 
                      fontSize: 12,
                      formatter: (value: number) => value > 0 ? value : '',
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AttendanceReport;
