import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import Chart from 'chart.js/auto';
import { useTheme } from '../../context/ThemeContext';

export default function ParentAttendance({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/parent/attendance');
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!data || !chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const subjects = Object.keys(data.subjectWise || {});
    const percentages = Object.values(data.subjectWise || {});

    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: subjects,
        datasets: [{
          label: 'Attendance %',
          data: percentages,
          backgroundColor: isDark ? 'rgba(244, 63, 94, 0.7)' : 'rgba(244, 63, 94, 0.8)',
          borderRadius: 8
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { beginAtZero: true, max: 100, grid: { color: isDark ? '#1f2937' : '#f1f5f9' }, ticks: { color: '#94a3b8' } },
          y: { grid: { display: false }, ticks: { color: '#94a3b8' } }
        }
      }
    });

    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [data, isDark]);

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic">Ward Attendance Tracker</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Real-time monitoring of classroom presence and session participation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-1 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-10 shadow-sm flex flex-col justify-center items-center text-center">
            <div className="relative w-40 h-40 flex items-center justify-center mb-8">
               <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100 dark:text-gray-800" />
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="440" strokeDashoffset={440 - (440 * (data.percentage || 94)) / 100} className="text-rose-600 transition-all duration-1000" strokeLinecap="round" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-slate-800 dark:text-white">{data.percentage || 94}%</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Global Avg</span>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
               <div className="p-4 bg-slate-50 dark:bg-gray-800/50 rounded-2xl border border-slate-100 dark:border-gray-700">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Days</p>
                  <p className="text-xl font-black text-slate-800 dark:text-white mt-1">{data.totalDays || 42}</p>
               </div>
               <div className="p-4 bg-slate-50 dark:bg-gray-800/50 rounded-2xl border border-slate-100 dark:border-gray-700">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Absences</p>
                  <p className="text-xl font-black text-rose-600 mt-1">{data.absentDays || 2}</p>
               </div>
            </div>
         </div>

         <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-10 shadow-sm flex flex-col h-full">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-8 italic">Subject-wise Attendance Distribution</h3>
            <div className="relative flex-1"><canvas ref={chartRef}></canvas></div>
         </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-100 dark:border-gray-800">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic underline decoration-rose-500">Recent Attendance Log</h3>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 dark:bg-gray-800/50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Subject</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Period</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {(data.recentLogs || [1,2,3]).map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
                       <td className="p-6 text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">{log.date || '2026-05-16'}</td>
                       <td className="p-6 font-bold text-slate-600 dark:text-gray-400 italic text-sm">{log.subject || 'Advanced Algorithms'}</td>
                       <td className="p-6 text-center text-xs font-black text-slate-400">P-{log.period || 1}</td>
                       <td className="p-6 text-center">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            log.status === 'ABSENT' ? 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          }`}>
                             {log.status || 'PRESENT'}
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
