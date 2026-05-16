import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function AdminDashboard({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  const studentChartRef = useRef(null);
  const studentChartInstance = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, aRes, hRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/activity'),
        api.get('/api/admin/system-health')
      ]);
      setStats(sRes.data);
      setActivity(aRes.data);
      setHealth(hRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!stats || !studentChartRef.current) return;
    if (studentChartInstance.current) studentChartInstance.current.destroy();

    studentChartInstance.current = new Chart(studentChartRef.current, {
      type: 'bar',
      data: {
        labels: stats.departmentCounts ? Object.keys(stats.departmentCounts) : ['CSE', 'ECE', 'MECH', 'CIVIL', 'IT'],
        datasets: [{
          data: stats.departmentCounts ? Object.values(stats.departmentCounts) : [450, 320, 210, 180, 290],
          backgroundColor: '#3b82f6',
          borderRadius: 12,
          barThickness: 30
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
    return () => { if (studentChartInstance.current) studentChartInstance.current.destroy(); };
  }, [stats, isDark]);

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Scholars', value: stats?.totalStudents || 0, icon: '🎓', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Faculty Active', value: stats?.totalStaff || 0, icon: '👨‍🏫', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Active Courses', value: stats?.activeCourses || 0, icon: '📚', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Dept Count', value: stats?.totalDepartments || 0, icon: '🏢', color: 'text-amber-600', bg: 'bg-amber-50' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm group hover:scale-105 transition-all">
             <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 ${kpi.bg} dark:bg-opacity-10 rounded-xl flex items-center justify-center text-xl shadow-inner`}>{kpi.icon}</div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Global</span>
             </div>
             <p className="text-sm font-bold text-slate-500 mb-1">{kpi.label}</p>
             <h3 className={`text-2xl font-black ${kpi.color} dark:text-white`}>{kpi.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Chart Card */}
         <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm lg:col-span-2">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic underline decoration-blue-500 underline-offset-8">Scholar Distribution</h3>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Departmental Census</span>
            </div>
            <div className="h-72 relative">
               <canvas ref={studentChartRef}></canvas>
            </div>
         </div>

         {/* System Health Card */}
         <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute right-0 top-0 p-8 opacity-10">
               <span className="text-7xl italic font-black text-white">HEALTH</span>
            </div>
            <div className="relative z-10">
               <h3 className="text-sm font-black uppercase tracking-[0.3em] text-blue-400 mb-10 italic">Core System Status</h3>
               <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
                     <span className="text-xs font-black uppercase tracking-widest text-slate-400">Database Cluster</span>
                     <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase rounded-lg border border-emerald-500/30">ONLINE</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
                     <span className="text-xs font-black uppercase tracking-widest text-slate-400">REST API Gateway</span>
                     <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase rounded-lg border border-emerald-500/30">ONLINE</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
                     <span className="text-xs font-black uppercase tracking-widest text-slate-400">Last System Sync</span>
                     <span className="text-[10px] font-black text-slate-300 italic uppercase">2 mins ago</span>
                  </div>
               </div>
            </div>
            <button className="relative z-10 w-full py-4 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-blue-700 transition-all mt-10">System Diagnostics</button>
         </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
         <div className="p-8 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center bg-slate-50/50 dark:bg-gray-800/30">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic underline decoration-blue-500">Institutional Activity Audit</h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Live Transaction Feed</span>
         </div>
         <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 dark:bg-gray-800/50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Actor Identity</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Transactional Action</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Temporal Stamp</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {(activity || []).slice(0, 5).map((act, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors group">
                       <td className="p-6">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center text-xs font-black shadow-inner italic uppercase">
                                {act.user?.charAt(0) || 'A'}
                             </div>
                             <div>
                                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight italic">{act.user}</p>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5 italic">Institutional Admin</p>
                             </div>
                          </div>
                       </td>
                       <td className="p-6 text-sm font-bold text-slate-700 dark:text-gray-300 italic">{act.action}</td>
                       <td className="p-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                          {new Date(act.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
