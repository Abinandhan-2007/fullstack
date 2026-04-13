import React from 'react';

export default function StaffAdminExamDuty() {
  const duties = [
     { id: 1, date: '15 May 2026', session: 'FN (09:00 - 12:00)', fac: 'Dr. Alan Turing', venue: 'Lab 4', type: 'End Semester' },
     { id: 2, date: '16 May 2026', session: 'AN (01:00 - 04:00)', fac: 'Prof. John Doe', venue: 'Room 205', type: 'End Semester' },
     { id: 3, date: '20 May 2026', session: 'FN (09:00 - 12:00)', fac: 'Dr. Grace Hopper', venue: 'Seminar Hall 2', type: 'Lab Viva' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Exam Duty Roster</h1>
            <p className="text-slate-500 font-medium">Manage invigilation assignments and schedules.</p>
         </div>
         <div className="flex gap-2">
            <button className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition shadow-sm">Auto Generate</button>
            <button className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-sm">Publish</button>
         </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 overflow-x-auto">
         <table className="w-full text-left border-collapse min-w-[800px]">
             <thead><tr className="border-b-2 border-slate-100">
                 <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Date / Session</th>
                 <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Exam Type</th>
                 <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Invigilator</th>
                 <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Venue</th>
                 <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-right">Action</th>
             </tr></thead>
             <tbody>
                  {duties.map(d => (
                      <tr key={d.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                          <td className="py-4 font-bold text-slate-800">{d.date} <br/><span className="text-[10px] font-black text-slate-400 uppercase">{d.session}</span></td>
                          <td className="py-4">
                              <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-md ${d.type === 'Lab Viva' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>{d.type}</span>
                          </td>
                          <td className="py-4 font-bold text-indigo-600">{d.fac}</td>
                          <td className="py-4 font-bold text-slate-600">📍 {d.venue}</td>
                          <td className="py-4 text-right">
                              <button className="text-slate-400 hover:text-indigo-600 font-bold text-sm bg-white border border-slate-200 rounded px-3 py-1 shadow-sm">Swap</button>
                          </td>
                      </tr>
                  ))}
             </tbody>
         </table>
      </div>
    </div>
  );
}
