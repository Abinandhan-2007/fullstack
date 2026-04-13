import React from 'react';

export default function StaffAdminAttendanceReports() {
  const reports = [
     { id: 1, title: 'Defaulters List (Below 75%)', count: 42, color: 'bg-rose-50 text-rose-700 border-rose-200' },
     { id: 2, title: 'Perfect Attendance (100%)', count: 18, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
     { id: 3, title: 'Borderline (75% - 80%)', count: 65, color: 'bg-amber-50 text-amber-700 border-amber-200' },
     { id: 4, title: 'Faculty Subject Tracking', count: 12, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Attendance Reports</h1>
            <p className="text-slate-500 font-medium">Departmental analytics and PDF generation.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {reports.map(r => (
             <div key={r.id} className={`p-6 rounded-[2rem] border shadow-sm ${r.color} flex flex-col justify-between`}>
                 <h3 className="text-sm font-black uppercase tracking-widest mb-4 opacity-80">{r.title}</h3>
                 <div className="flex justify-between items-end">
                    <span className="text-4xl font-black">{r.count}</span>
                    <button className="px-3 py-1.5 bg-white/50 hover:bg-white rounded-lg text-xs font-bold transition">Export CSV</button>
                 </div>
             </div>
         ))}
      </div>

      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
         <h2 className="text-xl font-black text-slate-800 mb-6">Generate Custom Report</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
             <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-2">Semester</label>
                <select className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold"><option>Even Semester (Current)</option><option>Odd Semester</option></select>
             </div>
             <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-2">Subject</label>
                <select className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold"><option>All Subjects</option><option>Data Structures</option></select>
             </div>
             <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-2">Date Range</label>
                <select className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold"><option>Last 30 Days</option><option>This Semester</option></select>
             </div>
         </div>
         <button className="w-full md:w-auto px-8 py-3 bg-indigo-600 font-bold text-white shadow-md rounded-xl hover:bg-indigo-700 transition">📥 Download Full PDF Report</button>
      </div>
    </div>
  );
}
