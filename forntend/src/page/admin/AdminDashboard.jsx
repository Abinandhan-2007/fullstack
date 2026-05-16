import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import api from '../../api';

export default function AdminDashboard({ apiUrl, token, user }) {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [marks, setMarks] = useState(null);

  const [loading, setLoading] = useState({
    stats: true,
    activity: true,
    systemHealth: true,
    attendance: true,
    marks: true
  });
  const [errors, setErrors] = useState({});

  const studentChartRef = useRef(null);
  const studentChartInstance = useRef(null);
  
  const attendanceChartRef = useRef(null);
  const attendanceChartInstance = useRef(null);
  
  const marksChartRef = useRef(null);
  const marksChartInstance = useRef(null);

  const fetchData = async (key, endpoint, setter) => {
    setLoading(prev => ({ ...prev, [key]: true }));
    setErrors(prev => ({ ...prev, [key]: null }));
    try {
      const res = await api.get(endpoint);
      setter(res.data);
    } catch (err) {
      setErrors(prev => ({ ...prev, [key]: err.message || 'Failed to fetch data' }));
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const loadAll = () => {
    fetchData('stats', '/admin/stats', setStats);
    fetchData('activity', '/admin/activity', setActivity);
    fetchData('systemHealth', '/admin/system-health', setSystemHealth);
    fetchData('attendance', '/admin/reports/attendance', setAttendance);
    fetchData('marks', '/admin/reports/marks', setMarks);
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Chart setup
  useEffect(() => {
    if (!stats || !studentChartRef.current) return;
    if (studentChartInstance.current) studentChartInstance.current.destroy();

    const ctx = studentChartRef.current.getContext('2d');
    studentChartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: stats.departmentCounts ? Object.keys(stats.departmentCounts) : [],
        datasets: [{
          label: 'Students',
          data: stats.departmentCounts ? Object.values(stats.departmentCounts) : [],
          backgroundColor: '#2563EB',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: '#E2E8F0' }, ticks: { color: '#64748B' }, beginAtZero: true },
          x: { grid: { display: false }, ticks: { color: '#64748B' } }
        }
      }
    });
  }, [stats]);

  useEffect(() => {
    if (!attendance || !attendanceChartRef.current) return;
    if (attendanceChartInstance.current) attendanceChartInstance.current.destroy();

    const ctx = attendanceChartRef.current.getContext('2d');
    attendanceChartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Present', 'Absent'],
        datasets: [{
          data: [attendance.presentCount || 0, attendance.absentCount || 0],
          backgroundColor: ['#10B981', '#EF4444'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: { 
          legend: { position: 'bottom', labels: { color: '#64748B' } }
        }
      }
    });
  }, [attendance]);

  useEffect(() => {
    if (!marks || !marksChartRef.current) return;
    if (marksChartInstance.current) marksChartInstance.current.destroy();

    const ctx = marksChartRef.current.getContext('2d');
    marksChartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: marks.departmentCgpa ? Object.keys(marks.departmentCgpa) : [],
        datasets: [{
          label: 'Average CGPA',
          data: marks.departmentCgpa ? Object.values(marks.departmentCgpa) : [],
          backgroundColor: '#3B82F6',
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { max: 10, grid: { color: '#E2E8F0' }, ticks: { color: '#64748B' }, beginAtZero: true },
          y: { grid: { display: false }, ticks: { color: '#64748B' } }
        }
      }
    });
  }, [marks]);

  const Loader = () => (
    <div className="flex flex-col gap-4 animate-pulse h-full">
      <div className="h-4 bg-slate-200 rounded w-1/3"></div>
      <div className="flex-1 bg-slate-200 rounded w-full min-h-[100px]"></div>
    </div>
  );

  const ErrorCard = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-xl text-center h-full">
      <p className="text-red-500 mb-4">{message}</p>
      <button onClick={onRetry} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold">
        Retry
      </button>
    </div>
  );

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-full space-y-6 text-slate-800">
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: 'Total Students', value: stats?.totalStudents || 0, key: 'stats' },
          { label: 'Total Staff', value: stats?.totalStaff || 0, key: 'stats' },
          { label: 'Total Departments', value: stats?.totalDepartments || 0, key: 'stats' },
          { label: 'Active Courses', value: stats?.activeCourses || 0, key: 'stats' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <span className="text-slate-500 text-sm font-semibold">{stat.label}</span>
            {loading[stat.key] ? (
               <div className="h-8 bg-slate-200 rounded w-16 mt-2 animate-pulse"></div>
            ) : errors[stat.key] ? (
               <span className="text-red-500 text-sm mt-2">Error</span>
            ) : (
               <span className="text-3xl font-black text-slate-800 mt-2">{stat.value}</span>
            )}
          </div>
        ))}
      </div>

      {/* 3 Column Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Dept Wise Student Count */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col xl:col-span-1 h-96">
          <h2 className="text-lg font-bold text-slate-800 mb-6 shrink-0">Students by Department</h2>
          {loading.stats ? <Loader /> : errors.stats ? <ErrorCard message={errors.stats} onRetry={() => fetchData('stats', '/admin/stats', setStats)} /> : (
            <div className="flex-1 relative min-h-0">
              <canvas ref={studentChartRef}></canvas>
            </div>
          )}
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col xl:col-span-1 h-96 overflow-hidden">
          <h2 className="text-lg font-bold text-slate-800 mb-6 shrink-0">Recent Activity</h2>
          {loading.activity ? <Loader /> : errors.activity ? <ErrorCard message={errors.activity} onRetry={() => fetchData('activity', '/admin/activity', setActivity)} /> : (
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {(activity || []).length === 0 ? <p className="text-slate-500 text-sm italic">No recent activity</p> : 
                activity.slice(0, 10).map((act, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs uppercase mt-0.5">
                      {act.user?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{act.action}</p>
                      <p className="text-xs text-slate-500">{act.user} • {new Date(act.timestamp || Date.now()).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>

        {/* System Health */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col xl:col-span-1 h-96">
          <h2 className="text-lg font-bold text-slate-800 mb-6 shrink-0">System Health</h2>
          {loading.systemHealth ? <Loader /> : errors.systemHealth ? <ErrorCard message={errors.systemHealth} onRetry={() => fetchData('systemHealth', '/admin/system-health', setSystemHealth)} /> : (
            <div className="flex-1 space-y-6 overflow-y-auto">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-semibold text-slate-600">Database Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${systemHealth?.dbStatus?.toUpperCase() === 'ONLINE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {systemHealth?.dbStatus?.toUpperCase() || 'ONLINE'}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-semibold text-slate-600">API Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${systemHealth?.apiStatus?.toUpperCase() === 'ONLINE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {systemHealth?.apiStatus?.toUpperCase() || 'ONLINE'}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-semibold text-slate-600">Last Backup</span>
                <span className="text-sm text-slate-800 font-medium">
                  {systemHealth?.lastBackup ? new Date(systemHealth.lastBackup).toLocaleString() : new Date().toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Bottom Row Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Attendance Summary */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-96">
          <h2 className="text-lg font-bold text-slate-800 mb-2 shrink-0">Today's Attendance</h2>
          {loading.attendance ? <Loader /> : errors.attendance ? <ErrorCard message={errors.attendance} onRetry={() => fetchData('attendance', '/admin/reports/attendance', setAttendance)} /> : (
            <div className="flex-1 flex flex-col items-center justify-center relative min-h-0">
              <div className="w-full max-w-[240px] aspect-square relative pb-8">
                <canvas ref={attendanceChartRef}></canvas>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                  <span className="text-3xl font-black text-slate-800">{attendance?.overallPercentage || 0}%</span>
                  <span className="text-xs text-slate-500 font-semibold uppercase">Overall</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Marks Overview */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-96">
          <h2 className="text-lg font-bold text-slate-800 mb-6 shrink-0">Average CGPA by Department</h2>
          {loading.marks ? <Loader /> : errors.marks ? <ErrorCard message={errors.marks} onRetry={() => fetchData('marks', '/admin/reports/marks', setMarks)} /> : (
            <div className="flex-1 relative min-h-0">
              <canvas ref={marksChartRef}></canvas>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
