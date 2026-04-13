import React, { useState, useEffect } from 'react';

export default function StaffDashboard({ apiUrl }) {
  const [stats, setStats] = useState({ lectures: 0, pendingAtt: 0, approvals: 0 });

  useEffect(() => {
     // Fetch mock stats
     setTimeout(() => setStats({ lectures: 3, pendingAtt: 1, approvals: 2 }), 800);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Classes Today</p>
               <h3 className="text-3xl font-black text-slate-800">{stats.lectures}</h3>
            </div>
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl shadow-inner">📅</div>
         </div>
         <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Pending Attendance</p>
               <h3 className="text-3xl font-black text-slate-800">{stats.pendingAtt}</h3>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-xl shadow-inner">⚠️</div>
         </div>
         <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Pending Approvals</p>
               <h3 className="text-3xl font-black text-slate-800">{stats.approvals}</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl shadow-inner">✅</div>
         </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-sky-500"></div>
         <h2 className="text-2xl font-black text-slate-800 mb-2">Welcome Back!</h2>
         <p className="text-slate-500 font-medium">You have {stats.lectures} lectures scheduled for today. Don't forget to submit your internal assessment marks by the end of the week.</p>
         
         <div className="mt-6 flex gap-3">
             <button className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 transition w-full md:w-auto text-sm">View Schedule</button>
         </div>
      </div>
    </div>
  );
}
