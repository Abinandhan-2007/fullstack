import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import Chart from 'chart.js/auto';
import { useTheme } from '../../context/ThemeContext';

export default function LibraryDashboard({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryRef = useRef(null);
  const categoryInstance = useRef(null);
  const trendRef = useRef(null);
  const trendInstance = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mocked library dashboard data
      setData({
        metrics: {
          totalBooks: '42,500',
          booksIssued: 840,
          overdueCount: 45,
          finesToday: '₹1,250'
        },
        categoryStats: {
          labels: ['CS', 'IT', 'ECE', 'Mech', 'Math', 'Gen'],
          data: [12000, 8500, 7200, 6800, 4500, 3500]
        },
        circulationTrend: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          data: [450, 520, 610, 580, 720, 840]
        },
        recentActivity: [
          { id: 'ISS-101', student: 'Abinandhan', book: 'Clean Code', type: 'ISSUE', date: '10:15 AM' },
          { id: 'RET-102', student: 'Rajesh K', book: 'Intro to Algorithms', type: 'RETURN', date: '11:30 AM' },
          { id: 'ISS-103', student: 'Priya S', book: 'Pragmatic Programmer', type: 'ISSUE', date: '12:00 PM' }
        ]
      });
    } catch (err) {
      setError(err.message || 'Failed to load library dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!data) return;

    // Category Donut
    if (categoryRef.current) {
      if (categoryInstance.current) categoryInstance.current.destroy();
      categoryInstance.current = new Chart(categoryRef.current, {
        type: 'doughnut',
        data: {
          labels: data.categoryStats.labels,
          datasets: [{
            data: data.categoryStats.data,
            backgroundColor: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#64748b'],
            borderWidth: 0,
            cutout: '75%'
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
      });
    }

    // Circulation Trend Line
    if (trendRef.current) {
      if (trendInstance.current) trendInstance.current.destroy();
      trendInstance.current = new Chart(trendRef.current, {
        type: 'line',
        data: {
          labels: data.circulationTrend.labels,
          datasets: [{
            label: 'Books Issued',
            data: data.circulationTrend.data,
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4
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
      if (categoryInstance.current) categoryInstance.current.destroy();
      if (trendInstance.current) trendInstance.current.destroy();
    };
  }, [data, isDark]);

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Catalog Size', value: data.metrics.totalBooks, color: 'text-violet-600', icon: '📚' },
          { label: 'Books In Circulation', value: data.metrics.booksIssued, color: 'text-blue-600', icon: '🔄' },
          { label: 'Overdue Returns', value: data.metrics.overdueCount, color: 'text-rose-600', icon: '⏳' },
          { label: 'Fine Collection', value: data.metrics.finesToday, color: 'text-emerald-600', icon: '💰' }
        ].map((m, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:scale-105 transition-all">
             <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 bg-violet-50 dark:bg-violet-900/20 text-violet-600 rounded-xl flex items-center justify-center text-xl">{m.icon}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</span>
             </div>
             <p className={`text-2xl font-black ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center h-96 relative">
           <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8 w-full">Inventory by Domain</h3>
           <div className="relative w-48 h-48">
              <canvas ref={categoryRef}></canvas>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-4">
                 <span className="text-4xl font-black text-slate-800 dark:text-white">6</span>
                 <span className="text-[10px] font-black text-violet-500 uppercase mt-1">Disciplines</span>
              </div>
           </div>
           <div className="mt-8 flex flex-wrap gap-4 justify-center">
              {data.categoryStats.labels.slice(0,4).map((l, i) => (
                <div key={i} className="flex items-center gap-1.5">
                   <span className="w-2 h-2 rounded-full" style={{backgroundColor: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'][i]}}></span>
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{l}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Circulation Trend */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col h-96">
           <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Monthly Circulation Trend</h3>
           <div className="relative flex-1"><canvas ref={trendRef}></canvas></div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic underline decoration-violet-500">Circulation Audit Trail</h3>
            <button className="text-[10px] font-black text-violet-600 uppercase tracking-widest hover:underline">Download Day Sheet →</button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 dark:bg-gray-800/50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Activity ID</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Patron</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Resource</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Operation</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Time</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {data.recentActivity.map((a, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors group">
                       <td className="p-6 text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{a.id}</td>
                       <td className="p-6">
                          <p className="text-sm font-bold text-slate-800 dark:text-gray-200">{a.student}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Library Member</p>
                       </td>
                       <td className="p-6 text-sm font-bold text-slate-600 dark:text-gray-400 italic line-clamp-1">{a.book}</td>
                       <td className="p-6 text-center">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            a.type === 'ISSUE' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          }`}>
                             {a.type}
                          </span>
                       </td>
                       <td className="p-6 text-right text-xs font-bold text-slate-400">{a.date}</td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
