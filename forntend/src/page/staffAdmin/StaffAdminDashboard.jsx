import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StaffAdminDashboard({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [stats, setStats] = useState({ students: 0, staff: 0, activeSessions: 0, attendancePercent: 0 });
  const [defaulters, setDefaulters] = useState([]);
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [todaySessions, setTodaySessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Mocked departmental analytics
      setStats({ students: 450, staff: 42, activeSessions: 18, attendancePercent: 88.5 });
      setDefaulters([
        { id: 1, name: 'Rahul K.', roll: 'CS101', att: '65%' },
        { id: 2, name: 'Priya S.', roll: 'CS055', att: '72%' }
      ]);
      setPendingSubmissions([
        { id: 1, faculty: 'Dr. Alan (CS)', period: 'P1' },
        { id: 2, faculty: 'Dr. John (IT)', period: 'P2' }
      ]);
      setConflicts([
        { id: 1, msg: 'Dr. Hopper has 2 sessions at P3' }
      ]);
      setTodaySessions([
        { p: 'P1', time: '09:00 AM', sub: 'DS Data Structures', fac: 'Dr. Hopper', loc: 'Room 201', dept: 'CSE', count: 60, col: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
        { p: 'P2', time: '10:00 AM', sub: 'AI Systems', fac: 'Dr. Alan', loc: 'Lab 4', dept: 'CSE', count: 45, col: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
        { p: 'P3', time: '11:15 AM', sub: 'Calculus', fac: 'Dr. John', loc: 'Room 101', dept: 'IT', count: 55, col: 'bg-amber-50 border-amber-200 text-amber-700' }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-gray-800 rounded-3xl"></div>)}
      </div>
      <div className="h-96 bg-slate-200 dark:bg-gray-800 rounded-[2.5rem]"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Dept Students', value: stats.students, icon: '👥', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Faculty Members', value: stats.staff, icon: '👨‍🏫', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Active Today', value: stats.activeSessions, icon: '📅', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Attendance %', value: stats.attendancePercent + '%', icon: '📊', color: 'text-amber-600', bg: 'bg-amber-50' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:scale-105 transition-all group">
             <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 ${kpi.bg} dark:bg-opacity-10 rounded-xl flex items-center justify-center text-xl shadow-inner`}>{kpi.icon}</div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Analytics</span>
             </div>
             <p className="text-sm font-bold text-slate-500 mb-1">{kpi.label}</p>
             <h3 className={`text-2xl font-black ${kpi.color} dark:text-white`}>{kpi.value}</h3>
          </div>
        ))}
      </div>

      {/* Alert Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 p-8 rounded-[2.5rem] shadow-sm">
            <h4 className="text-sm font-black text-rose-800 dark:text-rose-400 mb-6 flex items-center gap-2 italic uppercase tracking-tight">
               <span>⚠️</span> Attendance Defaulters ({defaulters.length})
            </h4>
            <div className="space-y-3">
               {defaulters.map(d => (
                 <div key={d.id} className="bg-white dark:bg-gray-900/50 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/30 flex justify-between items-center group">
                    <span className="text-xs font-black text-slate-700 dark:text-gray-300 uppercase tracking-tighter">{d.name}</span>
                    <span className="text-[10px] font-black text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-lg">{d.att}</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-8 rounded-[2.5rem] shadow-sm">
            <h4 className="text-sm font-black text-amber-800 dark:text-amber-400 mb-6 flex items-center gap-2 italic uppercase tracking-tight">
               <span>⏳</span> Pending Submissions ({pendingSubmissions.length})
            </h4>
            <div className="space-y-3">
               {pendingSubmissions.map(p => (
                 <div key={p.id} className="bg-white dark:bg-gray-900/50 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/30 flex justify-between items-center">
                    <span className="text-xs font-black text-slate-700 dark:text-gray-300 uppercase tracking-tighter">{p.faculty}</span>
                    <span className="text-[10px] font-black text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">{p.period}</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-slate-900 dark:bg-black border border-slate-800 p-8 rounded-[2.5rem] shadow-sm text-white">
            <h4 className="text-sm font-black text-slate-200 mb-6 flex items-center gap-2 italic uppercase tracking-tight">
               <span>🚨</span> Timetable Clashes ({conflicts.length})
            </h4>
            <div className="space-y-3">
               {conflicts.map(c => (
                 <div key={c.id} className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 text-[10px] font-bold text-rose-300 leading-relaxed italic">
                    {c.msg}
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Today's Timetable */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center">
            <div>
               <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic underline decoration-sky-500">Master Dept Timetable</h3>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time Session Monitoring</p>
            </div>
            <div className="flex gap-3">
               <button className="px-6 py-2 bg-sky-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-sky-500/20 hover:scale-105 transition-all">Export Report</button>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 dark:bg-gray-800/50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Period</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Time</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Subject / Module</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Lead Faculty</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Venue</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {todaySessions.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors group">
                       <td className="p-6 text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{s.p}</td>
                       <td className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">{s.time}</td>
                       <td className="p-6">
                          <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter border ${s.col}`}>
                             {s.sub}
                          </span>
                       </td>
                       <td className="p-6 text-sm font-black text-slate-700 dark:text-gray-300 italic">{s.fac}</td>
                       <td className="p-6 text-right">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">📍 {s.loc}</span>
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
