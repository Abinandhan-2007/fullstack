import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import Chart from 'chart.js/auto';
import { useTheme } from '../../context/ThemeContext';

export default function StudentAttendance({ apiUrl, token, user, linkedId }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const fetchData = async () => {
    if (!linkedId) return;
    setLoading(true);
    try {
      const res = await api.get(`/api/attendance/student/${linkedId}`);
      setData(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const overallPct = data.length ? Math.round(data.reduce((s, a) => s + (a.present/a.totalClasses)*100, 0) / data.length) : 0;

  useEffect(() => {
    if (!chartRef.current || !data.length) return;
    if (chartInstance.current) chartInstance.current.destroy();
    
    chartInstance.current = new Chart(chartRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Present', 'Absent'],
        datasets: [{
          data: [overallPct, 100 - overallPct],
          backgroundColor: ['#6366f1', isDark ? '#1f2937' : '#f1f5f9'],
          borderWidth: 0,
          cutout: '85%'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [data, isDark, overallPct]);

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[3rem] p-10 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Overall Compliance</span>
            </div>
            <div className="h-64 w-64 relative">
               <canvas ref={chartRef}></canvas>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-4">
                  <span className="text-5xl font-black text-slate-800 dark:text-white italic leading-none">{overallPct}%</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Aggregate</span>
               </div>
            </div>
            <div className="mt-8 flex gap-4 w-full">
               <div className="flex-1 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 text-center">
                  <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Safe Status</p>
                  <p className="text-sm font-black text-slate-800 dark:text-white mt-1 italic">&gt; 75%</p>
               </div>
               <div className="flex-1 p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 text-center">
                  <p className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Total Sesh</p>
                  <p className="text-sm font-black text-slate-800 dark:text-white mt-1 italic">{data.reduce((s,a)=>s+a.totalClasses, 0)}</p>
               </div>
            </div>
         </div>

         <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {data.map((a, idx) => {
              const pct = Math.round((a.present / a.totalClasses) * 100);
              return (
                <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col hover:scale-[1.02] transition-transform group">
                   <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl flex items-center justify-center text-xl font-black shadow-inner">
                         {a.courseCode?.charAt(0)}
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                        pct >= 75 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                         {pct >= 75 ? 'ELIGIBLE' : 'CRITICAL'}
                      </span>
                   </div>
                   <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight italic group-hover:text-indigo-600 transition-colors">{a.subjectName || 'Academic Module'}</h4>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{a.courseCode}</p>
                   
                   <div className="mt-8 flex items-end justify-between">
                      <div>
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Participation</p>
                         <p className="text-2xl font-black text-slate-800 dark:text-white italic leading-none">{pct}%</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Ratio</p>
                         <p className="text-sm font-bold text-slate-500 italic">{a.present} / {a.totalClasses}</p>
                      </div>
                   </div>
                   
                   <div className="mt-6 w-full h-1.5 bg-slate-50 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-1000 ${pct >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${pct}%` }}></div>
                   </div>
                </div>
              );
            })}
         </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-10 shadow-sm">
         <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic mb-8 underline decoration-indigo-500 underline-offset-8">Absence Verification Log</h3>
         <div className="space-y-4">
            {[1, 2].map((_, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-50 dark:bg-gray-800/50 rounded-3xl border border-slate-100 dark:border-gray-700 group hover:border-indigo-500 transition-all">
                 <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-slate-100 dark:border-gray-700">🗓️</div>
                    <div>
                       <h4 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Unexcused Absence</h4>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Session: P{i+1} • 2026-05-1{i+2}</p>
                    </div>
                 </div>
                 <div className="mt-4 md:mt-0 flex gap-3">
                    <button className="px-6 py-3 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm hover:bg-indigo-600 hover:text-white transition-all">Submit OD</button>
                    <button className="px-6 py-3 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm hover:bg-rose-600 hover:text-white transition-all">View Details</button>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
