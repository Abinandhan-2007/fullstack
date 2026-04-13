import React from 'react';

export default function StaffAdminSubjectAllocation() {
  const allocs = [
     { id: 1, type: 'Core', sub: 'Data Structures', code: 'CS501', fac: 'Dr. Alan Turing', sec: 'II Year A & B' },
     { id: 2, type: 'Elective', sub: 'AI Systems', code: 'CS505', fac: 'Dr. Grace Hopper', sec: 'IV Year Open' },
     { id: 3, type: 'Lab', sub: 'Advanced Programming Lab', code: 'CS501L', fac: 'Prof. John Doe', sec: 'II Year A' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Subject Allocation</h1>
            <p className="text-slate-500 font-medium">Assign subjects to faculty workload.</p>
         </div>
         <button className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-sm">New Allocation</button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 overflow-x-auto">
         <table className="w-full text-left border-collapse min-w-[800px]">
             <thead><tr className="border-b-2 border-slate-100">
                 <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Type</th>
                 <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Subject</th>
                 <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Assigned Faculty</th>
                 <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Target Sections</th>
                 <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-right">Action</th>
             </tr></thead>
             <tbody>
                  {allocs.map(a => (
                      <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                          <td className="py-4">
                             <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-md ${a.type==='Core'?'bg-rose-50 text-rose-600':a.type==='Lab'?'bg-emerald-50 text-emerald-600':'bg-indigo-50 text-indigo-600'}`}>{a.type}</span>
                          </td>
                          <td className="py-4 font-bold text-slate-800">
                             {a.sub} <br/><span className="text-[10px] text-slate-400 font-black">{a.code}</span>
                          </td>
                          <td className="py-4 font-bold text-indigo-600">{a.fac}</td>
                          <td className="py-4 font-medium text-slate-500 bg-slate-50 px-2 rounded-lg my-3 inline-block">{a.sec}</td>
                          <td className="py-4 text-right">
                             <button className="text-slate-400 hover:text-slate-700 font-bold text-sm bg-white border border-slate-200 rounded px-3 py-1 shadow-sm">Edit</button>
                          </td>
                      </tr>
                  ))}
             </tbody>
         </table>
      </div>
    </div>
  );
}
