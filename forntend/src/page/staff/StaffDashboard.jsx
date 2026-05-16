import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import Chart from 'chart.js/auto';
import { useTheme } from '../../context/ThemeContext';

export default function StaffDashboard({ apiUrl, token, user, linkedId }) {
  const { isDark } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const fetchData = async () => {
    if (!linkedId) return;
    setLoading(true);
    setError(null);
    try {
      // Mocked staff dashboard data aggregation
      const [timetableRes, leaveRes, payrollRes] = await Promise.all([
        api.get(`/api/timetable/staff/${linkedId}`),
        api.get(`/api/staff/leave/status/${linkedId}`),
        api.get(`/api/staff/payroll/${linkedId}`)
      ]);

      setData({
        metrics: {
          totalStudents: 150, // Should be fetched from student repo by dept
          classesToday: timetableRes.data.length,
          avgAttendance: 89,
          pendingMarks: 4
        },
        schedule: timetableRes.data.map(s => ({
          time: `P${s.period}`,
          subject: s.subjectName || s.subjectCode,
          class: `${s.year} ${s.section}`,
          room: s.roomNumber
        })),
        recentMarks: [
          { subject: 'Cloud Computing', exam: 'CIA 1', date: '2026-05-10', status: 'Submitted' },
          { subject: 'Network Security', exam: 'Assignment 2', date: '2026-05-14', status: 'Pending' }
        ],
        leaveStatus: {
          available: 12,
          taken: 3,
          pending: 1
        }
      });
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!chartRef.current || !data) return;
    
    if (chartInstance.current) chartInstance.current.destroy();
    
    chartInstance.current = new Chart(chartRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Present', 'Absent'],
        datasets: [{
          data: [data.metrics.avgAttendance, 100 - data.metrics.avgAttendance],
          backgroundColor: ['#10b981', isDark ? '#374151' : '#e2e8f0'],
          borderWidth: 0,
          cutout: '80%'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });

    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [data, isDark]);

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-32 bg-slate-200 dark:bg-gray-800 rounded-3xl"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-24 bg-slate-200 dark:bg-gray-800 rounded-2xl"></div>)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-80 bg-slate-200 dark:bg-gray-800 rounded-3xl"></div>
        <div className="h-80 bg-slate-200 dark:bg-gray-800 rounded-3xl"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-6 text-center">
      <p className="text-rose-600 dark:text-rose-400 font-medium">{error}</p>
      <button onClick={fetchData} className="mt-3 px-4 py-2 bg-rose-600 text-white rounded-lg font-bold">Retry</button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Greeting Header */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-3xl flex items-center justify-center text-3xl font-black shrink-0 shadow-inner border-2 border-white dark:border-gray-800">
           {user.name?.charAt(0) || 'S'}
        </div>
        <div className="flex-1 text-center md:text-left relative z-10">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Welcome back, {user.name}!</h2>
          <p className="text-slate-500 dark:text-gray-400 font-medium mt-1">You have {data.metrics.classesToday} classes scheduled for today.</p>
        </div>
        <div className="flex gap-3 relative z-10">
           <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/20">Mark Attendance</button>
           <button className="px-4 py-2 bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 dark:hover:bg-gray-700 transition-all">My Profile</button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Assigned Students', value: data.metrics.totalStudents, color: 'text-blue-600', icon: '👥' },
          { label: 'Attendance Average', value: `${data.metrics.avgAttendance}%`, color: 'text-emerald-600', icon: '✅' },
          { label: 'Pending Marks', value: data.metrics.pendingMarks, color: 'text-amber-600', icon: '📝' },
          { label: 'Leave Balance', value: data.leaveStatus.available, color: 'text-purple-600', icon: '📋' }
        ].map((m, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</span>
              <span className="text-lg">{m.icon}</span>
            </div>
            <p className={`text-2xl font-black ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2rem] p-6 shadow-sm">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Today's Schedule</h3>
              <span className="text-[10px] font-black text-emerald-500 px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded uppercase tracking-widest">Active Day</span>
           </div>
           <div className="space-y-4">
              {data.schedule.map((s, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-gray-800/50 rounded-2xl border border-slate-100 dark:border-gray-700 group hover:border-emerald-200 dark:hover:border-emerald-800 transition-all">
                  <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-xl flex flex-col items-center justify-center border border-slate-100 dark:border-gray-800 shadow-sm">
                    <span className="text-[8px] font-black text-slate-400 uppercase leading-none">TIME</span>
                    <span className="text-[10px] font-black text-slate-800 dark:text-white mt-1">{s.time.split(' ')[0]}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">{s.subject}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{s.class} • Room {s.room}</p>
                  </div>
                  <button className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </button>
                </div>
              ))}
           </div>
        </div>

        {/* Attendance Analytics Preview */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2rem] p-6 shadow-sm flex flex-col">
           <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-6">Class Attendance</h3>
           <div className="relative flex-1 flex items-center justify-center">
              <div className="h-64 w-64"><canvas ref={chartRef}></canvas></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-4">
                 <span className="text-4xl font-black text-slate-800 dark:text-white">{data.metrics.avgAttendance}%</span>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Average</span>
              </div>
           </div>
           <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-800">
                 <p className="text-[10px] font-black text-emerald-500 uppercase">Above 75%</p>
                 <p className="text-lg font-black text-slate-800 dark:text-white">108 Students</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-800">
                 <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Critical</p>
                 <p className="text-lg font-black text-slate-800 dark:text-white">16 Students</p>
              </div>
           </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2rem] shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Recent Academic Actions</h3>
            <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">View All →</button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 dark:bg-gray-800/50">
                     <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Subject</th>
                     <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Action Type</th>
                     <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                     <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {data.recentMarks.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
                       <td className="p-4 text-xs font-black text-slate-800 dark:text-white uppercase tracking-tight">{m.subject}</td>
                       <td className="p-4 text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">{m.exam}</td>
                       <td className="p-4 text-xs font-bold text-slate-400">{m.date}</td>
                       <td className="p-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            m.status === 'Submitted' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100 dark:border-emerald-800' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100 dark:border-amber-800'
                          }`}>
                            {m.status}
                          </span>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
