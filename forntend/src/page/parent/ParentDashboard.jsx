import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import Chart from 'chart.js/auto';
import { useTheme } from '../../context/ThemeContext';

export default function ParentDashboard({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const performanceRef = useRef(null);
  const performanceInstance = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mocked parent dashboard data
      setData({
        ward: { name: 'Abinandhan', regNo: '7376211CS101', dept: 'CSE' },
        metrics: {
          attendance: '94%',
          lastGPA: '8.4',
          pendingFees: '₹42,500',
          announcements: 3
        },
        performanceTrend: {
          labels: ['SEM 1', 'SEM 2', 'SEM 3', 'SEM 4', 'SEM 5'],
          gpa: [8.2, 8.5, 7.8, 8.1, 8.4]
        },
        recentNotices: [
          { title: 'Semester Fees Deadline', date: '2026-05-16', category: 'Finance' },
          { title: 'Annual Sports Meet 2026', date: '2026-05-20', category: 'Events' }
        ]
      });
    } catch (err) {
      setError(err.message || 'Failed to load ward overview');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!data || !performanceRef.current) return;
    if (performanceInstance.current) performanceInstance.current.destroy();

    performanceInstance.current = new Chart(performanceRef.current, {
      type: 'line',
      data: {
        labels: data.performanceTrend.labels,
        datasets: [{
          label: 'Semester GPA',
          data: data.performanceTrend.gpa,
          borderColor: '#f43f5e',
          backgroundColor: 'rgba(244, 63, 94, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 6,
          pointBackgroundColor: '#f43f5e'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, max: 10, grid: { color: isDark ? '#1f2937' : '#f1f5f9' }, ticks: { color: '#94a3b8' } },
          x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
        }
      }
    });

    return () => { if (performanceInstance.current) performanceInstance.current.destroy(); };
  }, [data, isDark]);

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-6">
      {/* Ward Info Banner */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col md:flex-row items-center gap-8">
         <div className="w-24 h-24 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-[2rem] flex items-center justify-center text-4xl font-black shadow-inner">
            {data.ward.name.charAt(0)}
         </div>
         <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic underline decoration-rose-500">
               {data.ward.name}
            </h2>
            <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">{data.ward.regNo} • {data.ward.dept} Department</p>
         </div>
         <div className="flex gap-4">
            <button className="px-6 py-3 bg-rose-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-rose-500/20 transition-all hover:scale-105">View Full Profile</button>
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Attendance', value: data.metrics.attendance, color: 'text-emerald-600', icon: '📅' },
          { label: 'Academic GPA', value: data.metrics.lastGPA, color: 'text-blue-600', icon: '📊' },
          { label: 'Outstanding Fees', value: data.metrics.pendingFees, color: 'text-rose-600', icon: '💰' },
          { label: 'New Notices', value: data.metrics.announcements, color: 'text-amber-600', icon: '📢' }
        ].map((m, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
             <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-xl flex items-center justify-center text-xl">{m.icon}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none text-right">{m.label}</span>
             </div>
             <p className={`text-2xl font-black ${m.color} tracking-tight`}>{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-10 shadow-sm flex flex-col h-[400px]">
           <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-8 italic">Semester Performance Trend</h3>
           <div className="relative flex-1"><canvas ref={performanceRef}></canvas></div>
        </div>

        {/* Notices */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col h-[400px]">
           <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-6">Recent School Notices</h3>
           <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar">
              {data.recentNotices.map((n, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-gray-800/50 rounded-2xl border border-slate-100 dark:border-gray-700">
                   <div className="flex justify-between items-start mb-1">
                      <span className="text-[8px] font-black text-rose-600 uppercase tracking-widest">{n.category}</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase">{n.date}</span>
                   </div>
                   <h4 className="text-sm font-black text-slate-800 dark:text-white tracking-tight">{n.title}</h4>
                </div>
              ))}
           </div>
           <button className="w-full mt-6 py-4 bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-600 hover:text-white transition-all">View Notice Board</button>
        </div>
      </div>
    </div>
  );
}
