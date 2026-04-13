import React from 'react';

export default function StaffAdminDepartmentStudents() {
  const students = [
     { roll: '737622CS101', name: 'Rahul K.', year: 'II', sec: 'A', att: 85, cgpa: 8.4 },
     { roll: '737622CS102', name: 'Priya S.', year: 'II', sec: 'A', att: 92, cgpa: 9.1 },
     { roll: '737622CS103', name: 'Amit P.', year: 'II', sec: 'B', att: 76, cgpa: 7.8 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Department Students</h1>
            <p className="text-slate-500 font-medium">Manage student profiles, performance, and sections.</p>
         </div>
         <div className="flex gap-2">
            <button className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition shadow-sm">Bulk Import</button>
            <button className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-sm">Add Student</button>
         </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 overflow-x-auto">
         <div className="mb-6 max-w-sm"><input type="text" placeholder="Search by name or roll..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-sm focus:border-indigo-500 outline-none"/></div>
         <table className="w-full text-left border-collapse min-w-[800px]">
             <thead><tr className="border-b-2 border-slate-100">
                 <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Roll No</th>
                 <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Student Name</th>
                 <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Year / Sec</th>
                 <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Attendance</th>
                 <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">CGPA</th>
                 <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-right">Actions</th>
             </tr></thead>
             <tbody>
                  {students.map(s => (
                      <tr key={s.roll} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                          <td className="py-4 font-black tracking-widest text-slate-700">{s.roll}</td>
                          <td className="py-4 font-bold text-slate-800 flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs">{s.name[0]}</div>
                             {s.name}
                          </td>
                          <td className="py-4 font-bold text-slate-500">Year {s.year} • Sec {s.sec}</td>
                          <td className="py-4"><span className={`px-3 py-1 font-black text-xs rounded-lg ${s.att > 75 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{s.att}%</span></td>
                          <td className="py-4 font-black text-slate-600">{s.cgpa}</td>
                          <td className="py-4 text-right">
                             <button className="text-slate-400 hover:text-indigo-600 font-bold text-sm">View Profile</button>
                          </td>
                      </tr>
                  ))}
             </tbody>
         </table>
      </div>
    </div>
  );
}
