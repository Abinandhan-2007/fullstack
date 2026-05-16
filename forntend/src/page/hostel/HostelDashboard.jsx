import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import Chart from 'chart.js/auto';
import { useTheme } from '../../context/ThemeContext';

export default function HostelDashboard({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const occupancyRef = useRef(null);
  const occupancyInstance = useRef(null);
  const messRef = useRef(null);
  const messInstance = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mocked hostel dashboard data
      setData({
        metrics: {
          occupancy: '92%',
          pendingComplaints: 14,
          stockAlerts: 3,
          todayVisitors: 28
        },
        occupancyStats: { occupied: 460, available: 40 },
        messAttendance: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [420, 435, 410, 445, 430, 380, 350]
        },
        urgentComplaints: [
          { id: 'CMP-401', room: 'B-204', category: 'Electrical', desc: 'Ceiling fan not working', date: '2026-05-16' },
          { id: 'CMP-402', room: 'A-108', category: 'Plumbing', desc: 'Tap leakage in washroom', date: '2026-05-15' },
          { id: 'CMP-403', room: 'C-302', category: 'Carpentry', desc: 'Study table leg broken', date: '2026-05-15' }
        ]
      });
    } catch (err) {
      setError(err.message || 'Failed to load hostel dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!data) return;

    // Occupancy Donut
    if (occupancyRef.current) {
      if (occupancyInstance.current) occupancyInstance.current.destroy();
      occupancyInstance.current = new Chart(occupancyRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Occupied', 'Available'],
          datasets: [{
            data: [data.occupancyStats.occupied, data.occupancyStats.available],
            backgroundColor: ['#6366f1', isDark ? '#374151' : '#f1f5f9'],
            borderWidth: 0,
            cutout: '80%'
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
      });
    }

    // Mess Attendance Bar
    if (messRef.current) {
      if (messInstance.current) messInstance.current.destroy();
      messInstance.current = new Chart(messRef.current, {
        type: 'bar',
        data: {
          labels: data.messAttendance.labels,
          datasets: [{
            label: 'Students',
            data: data.messAttendance.data,
            backgroundColor: 'rgba(99, 102, 241, 0.7)',
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { grid: { color: isDark ? '#1f2937' : '#f1f5f9' }, ticks: { color: '#94a3b8' } },
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
          }
        }
      });
    }

    return () => {
      if (occupancyInstance.current) occupancyInstance.current.destroy();
      if (messInstance.current) messInstance.current.destroy();
    };
  }, [data, isDark]);

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-28 bg-slate-200 dark:bg-gray-800 rounded-3xl"></div>)}
      </div>
      <div className="h-96 bg-slate-200 dark:bg-gray-800 rounded-[2.5rem]"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Occupancy', value: data.metrics.occupancy, color: 'text-indigo-600', icon: '🛏️' },
          { label: 'Pending Repairs', value: data.metrics.pendingComplaints, color: 'text-rose-600', icon: '🛠️' },
          { label: 'Low Stock Items', value: data.metrics.stockAlerts, color: 'text-amber-600', icon: '📦' },
          { label: 'Visitor Entries', value: data.metrics.todayVisitors, color: 'text-emerald-600', icon: '📋' }
        ].map((m, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:scale-105 transition-all">
             <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl flex items-center justify-center text-xl">{m.icon}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</span>
             </div>
             <p className={`text-2xl font-black ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Occupancy Donut */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center h-96 relative">
           <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8 w-full">Room Occupancy</h3>
           <div className="relative w-48 h-48">
              <canvas ref={occupancyRef}></canvas>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-4">
                 <span className="text-4xl font-black text-slate-800 dark:text-white">{data.metrics.occupancy}</span>
                 <span className="text-[10px] font-black text-indigo-500 uppercase mt-1">Full</span>
              </div>
           </div>
           <div className="mt-8 flex gap-6 w-full justify-center">
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                 <span className="text-[10px] font-black text-slate-400 uppercase">Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-gray-800"></span>
                 <span className="text-[10px] font-black text-slate-400 uppercase">Empty</span>
              </div>
           </div>
        </div>

        {/* Mess Attendance Bar */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col h-96">
           <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Weekly Mess Attendance</h3>
           <div className="relative flex-1"><canvas ref={messRef}></canvas></div>
        </div>
      </div>

      {/* Urgent Complaints */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Urgent Maintenance Requests</h3>
            <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View All Tickets →</button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 dark:bg-gray-800/50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Request ID</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Room No</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Description</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {data.urgentComplaints.map((c, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
                       <td className="p-6 text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{c.id}</td>
                       <td className="p-6 font-bold text-indigo-600">{c.room}</td>
                       <td className="p-6 text-xs font-bold text-slate-500 uppercase">{c.category}</td>
                       <td className="p-6 text-sm text-slate-600 dark:text-gray-400 italic line-clamp-1">{c.desc}</td>
                       <td className="p-6 text-center">
                          <button className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-indigo-600 hover:text-white transition-all">Assign Staff</button>
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
