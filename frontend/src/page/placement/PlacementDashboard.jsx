import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import Chart from 'chart.js/auto';
import { useTheme } from '../../context/ThemeContext';

export default function PlacementDashboard({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sectorRef = useRef(null);
  const sectorInstance = useRef(null);
  const deptRef = useRef(null);
  const deptInstance = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mocked placement dashboard data
      setData({
        metrics: {
          placementRate: '88%',
          avgPackage: '6.4 LPA',
          highestPackage: '42 LPA',
          companiesToday: 4
        },
        sectorStats: {
          labels: ['IT Services', 'Product', 'Core', 'Analytics', 'FinTech'],
          data: [45, 25, 15, 10, 5]
        },
        deptStats: {
          labels: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'],
          data: [96, 94, 88, 82, 75, 68]
        },
        upcomingDrives: [
          { company: 'Google', date: '2026-05-20', roles: 'Software Engineer', salary: '32 LPA' },
          { company: 'Goldman Sachs', date: '2026-05-22', roles: 'Analyst', salary: '22 LPA' },
          { company: 'Tesla Core', date: '2026-05-25', roles: 'Embedded Engineer', salary: '18 LPA' }
        ]
      });
    } catch (err) {
      setError(err.message || 'Failed to load placement metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!data) return;

    // Sector Donut
    if (sectorRef.current) {
      if (sectorInstance.current) sectorInstance.current.destroy();
      sectorInstance.current = new Chart(sectorRef.current, {
        type: 'doughnut',
        data: {
          labels: data.sectorStats.labels,
          datasets: [{
            data: data.sectorStats.data,
            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#6366f1', '#f43f5e'],
            borderWidth: 0,
            cutout: '75%'
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
      });
    }

    // Dept Bar
    if (deptRef.current) {
      if (deptInstance.current) deptInstance.current.destroy();
      deptInstance.current = new Chart(deptRef.current, {
        type: 'bar',
        data: {
          labels: data.deptStats.labels,
          datasets: [{
            label: 'Placed %',
            data: data.deptStats.data,
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, max: 100, grid: { color: isDark ? '#1f2937' : '#f1f5f9' }, ticks: { color: '#94a3b8' } },
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
          }
        }
      });
    }

    return () => {
      if (sectorInstance.current) sectorInstance.current.destroy();
      if (deptInstance.current) deptInstance.current.destroy();
    };
  }, [data, isDark]);

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Current Placement', value: data.metrics.placementRate, color: 'text-emerald-600', icon: '🎯' },
          { label: 'Average CTC', value: data.metrics.avgPackage, color: 'text-blue-600', icon: '💰' },
          { label: 'Top Tier Offer', value: data.metrics.highestPackage, color: 'text-amber-600', icon: '🚀' },
          { label: 'Live Drives', value: data.metrics.companiesToday, color: 'text-violet-600', icon: '🏢' }
        ].map((m, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:scale-105 transition-all">
             <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex items-center justify-center text-xl">{m.icon}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</span>
             </div>
             <p className={`text-2xl font-black ${m.color} tracking-tight`}>{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sector Breakdown */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center h-96 relative">
           <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8 w-full italic underline decoration-emerald-500">Corporate Sector Mix</h3>
           <div className="relative w-48 h-48">
              <canvas ref={sectorRef}></canvas>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-4">
                 <span className="text-4xl font-black text-slate-800 dark:text-white">5</span>
                 <span className="text-[10px] font-black text-emerald-500 uppercase mt-1">Clusters</span>
              </div>
           </div>
           <div className="mt-8 flex flex-wrap gap-4 justify-center">
              {data.sectorStats.labels.slice(0,3).map((l, i) => (
                <div key={i} className="flex items-center gap-1.5">
                   <span className="w-2 h-2 rounded-full" style={{backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'][i]}}></span>
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{l}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Dept Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col h-96">
           <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8 italic">Departmental Success Ratio</h3>
           <div className="relative flex-1"><canvas ref={deptRef}></canvas></div>
        </div>
      </div>

      {/* Upcoming Campus Drives */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic underline decoration-emerald-500">Live Campus Drive Pipeline</h3>
            <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Full Recruitment Calendar →</button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 dark:bg-gray-800/50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Corporate Partner</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Target Roles</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Date</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Potential CTC</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {data.upcomingDrives.map((d, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors group">
                       <td className="p-6">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-slate-100 dark:bg-gray-800 rounded-xl flex items-center justify-center font-black text-emerald-600 shadow-inner italic uppercase">
                                {d.company.charAt(0)}
                             </div>
                             <p className="text-sm font-black text-slate-800 dark:text-gray-200">{d.company}</p>
                          </div>
                       </td>
                       <td className="p-6 text-xs font-bold text-slate-500 uppercase tracking-widest">{d.roles}</td>
                       <td className="p-6 text-center text-xs font-black text-slate-400">{d.date}</td>
                       <td className="p-6 text-right">
                          <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-100 dark:border-emerald-800">
                             {d.salary}
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
