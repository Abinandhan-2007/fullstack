import React, { useState, useEffect } from 'react';

export default function StaffAdminDashboard({ apiUrl, token }) {
  const [stats, setStats] = useState({ students: 0, staff: 0, activeSessions: 0, attendancePercent: 0 });
  const [defaulters, setDefaulters] = useState([]);
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [todaySessions, setTodaySessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulated fetch
    setTimeout(() => {
      setStats({ students: 450, staff: 42, activeSessions: 18, attendancePercent: 88.5 });
      setDefaulters([
        { id: 1, name: 'Rahul K.', roll: 'CS101', att: '65%' },
        { id: 2, name: 'Priya S.', roll: 'CS055', att: '72%' }
      ]);
      setPendingSubmissions([
        { id: 1, faculty: 'Dr. Alan (CS)', period: 'P1' },
      ]);
      setConflicts([
        { id: 1, msg: 'Dr. Hopper has 2 sessions at P3' }
      ]);
      setTodaySessions([
        { p: 'P1', time: '09:00 AM', sub: 'DS Data Structures', fac: 'Dr. Hopper', loc: 'Room 201', dept: 'CSE', count: 60, col: 'bg-indigo-50 border-indigo-200' },
        { p: 'P2', time: '10:00 AM', sub: 'AI Systems', fac: 'Dr. Alan', loc: 'Lab 4', dept: 'CSE', count: 45, col: 'bg-emerald-50 border-emerald-200' },
        { p: 'P3', time: '11:15 AM', sub: 'Calculus', fac: 'Dr. John', loc: 'Room 101', dept: 'IT', count: 55, col: 'bg-amber-50 border-amber-200' }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
             <div className="flex justify-between items-start mb-2"><div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl shadow-inner">👥</div><span className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-2 py-1 rounded">DEPT</span></div>
             <p className="text-sm font-bold text-slate-500 mb-1">Total Students</p>
             <h3 className="text-3xl font-black text-slate-800">{isLoading ? '...' : stats.students}</h3>
         </div>
         <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
             <div className="flex justify-between items-start mb-2"><div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl shadow-inner">👨‍🏫</div><span className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-2 py-1 rounded">DEPT</span></div>
             <p className="text-sm font-bold text-slate-500 mb-1">Total Staff</p>
             <h3 className="text-3xl font-black text-slate-800">{isLoading ? '...' : stats.staff}</h3>
         </div>
         <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
             <div className="flex justify-between items-start mb-2"><div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-inner">📅</div><span className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-2 py-1 rounded">TODAY</span></div>
             <p className="text-sm font-bold text-slate-500 mb-1">Active Sessions</p>
             <h3 className="text-3xl font-black text-slate-800">{isLoading ? '...' : stats.activeSessions}</h3>
         </div>
         <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 relative overflow-hidden">
             <div className="absolute right-0 bottom-0 w-32 h-32 bg-indigo-50 rounded-tl-full -mr-8 -mb-8 z-0"></div>
             <div className="relative z-10">
               <div className="flex justify-between items-start mb-2"><div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xl shadow-inner">📊</div><span className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-2 py-1 rounded">TODAY</span></div>
               <p className="text-sm font-bold text-slate-500 mb-1">Dept Attendance</p>
               <h3 className="text-3xl font-black text-slate-800">{isLoading ? '...' : `${stats.attendancePercent}%`}</h3>
             </div>
         </div>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-rose-50 border border-rose-200 p-6 rounded-[2rem] shadow-sm">
              <h4 className="text-sm font-black text-rose-800 mb-4 flex items-center gap-2"><span>⚠️</span> Below 75% Attendance ({defaulters.length})</h4>
              <div className="space-y-2">
                 {defaulters.map(d => <div key={d.id} className="bg-white/60 p-2 rounded-lg text-xs font-bold text-rose-900 border border-rose-100 flex justify-between"><span>{d.name} ({d.roll})</span><span>{d.att}</span></div>)}
              </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-[2rem] shadow-sm">
              <h4 className="text-sm font-black text-amber-800 mb-4 flex items-center gap-2"><span>⏳</span> Pending Submissions ({pendingSubmissions.length})</h4>
              <div className="space-y-2">
                 {pendingSubmissions.map(p => <div key={p.id} className="bg-white/60 p-2 rounded-lg text-xs font-bold text-amber-900 border border-amber-100 flex justify-between"><span>{p.faculty}</span><span>{p.period}</span></div>)}
              </div>
          </div>
          <div className="bg-slate-800 border border-slate-900 p-6 rounded-[2rem] shadow-sm text-white">
              <h4 className="text-sm font-black text-slate-200 mb-4 flex items-center gap-2"><span>🚨</span> Timetable Clashes ({conflicts.length})</h4>
              <div className="space-y-2">
                 {conflicts.map(c => <div key={c.id} className="bg-slate-900/50 p-2 rounded-lg text-xs font-bold text-rose-300 border border-slate-700">{c.msg}</div>)}
              </div>
          </div>
      </div>

      {/* Today's Timetable */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
         <div className="flex justify-between items-center mb-6">
            <div><h3 className="text-xl font-black text-slate-800">Today's Department Timetable</h3><p className="text-sm font-medium text-slate-500">Live monitoring of all scheduled sessions</p></div>
            <div className="flex gap-2">
               <button className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg hover:bg-indigo-100 transition shadow-sm">Seat Gen</button>
               <button className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800 transition shadow-sm">Export</button>
            </div>
         </div>
         <div className="overflow-x-auto text-sm">
             <table className="w-full text-left border-collapse min-w-[800px]">
                 <thead><tr className="border-b-2 border-slate-100">
                     <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Period</th>
                     <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Time</th>
                     <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Subject</th>
                     <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Faculty</th>
                     <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Venue</th>
                     <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-right">Students</th>
                 </tr></thead>
                 <tbody>
                    {todaySessions.map((s,i) => (
                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                            <td className="py-4 font-black text-slate-700">{s.p}</td>
                            <td className="py-4 font-bold text-slate-500">{s.time}</td>
                            <td className="py-4 font-bold text-slate-800"><span className={`px-3 py-1 rounded-lg border ${s.col}`}>{s.sub}</span></td>
                            <td className="py-4 font-bold text-slate-600">{s.fac}</td>
                            <td className="py-4 font-bold text-slate-600">📍 {s.loc}</td>
                            <td className="py-4 font-black text-slate-700 text-right">{s.count}</td>
                        </tr>
                    ))}
                 </tbody>
             </table>
         </div>
      </div>

    </div>
  );
}
