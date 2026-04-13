import React from 'react';

export default function StaffStudentPerformance() {
  const students = [
     { roll: 'CS101', name: 'Rahul K.', cgpa: 8.4, marks: [80, 85, 90, 82], ar: 'Low Risk' },
     { roll: 'CS102', name: 'Priya S.', cgpa: 9.1, marks: [95, 92, 88, 96], ar: 'No Risk' },
     { roll: 'CS103', name: 'Amit P.', cgpa: 6.2, marks: [40, 45, 50, 42], ar: 'High Risk' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
         <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Performance & Mentoring</h1>
         <p className="text-slate-500 font-medium">Track assigned mentees and their risk factor.</p>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 overflow-x-auto">
         <table className="w-full text-left border-collapse min-w-[800px]">
             <thead><tr className="border-b-2 border-slate-100">
                 <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Mentee</th>
                 <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Overall CGPA</th>
                 <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Recent Term Marks</th>
                 <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Academic Risk</th>
                 <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-right">Action</th>
             </tr></thead>
             <tbody>
                  {students.map(s => (
                      <tr key={s.roll} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                          <td className="py-4 font-bold text-slate-800">
                             {s.name} <br/><span className="text-[10px] font-black text-slate-400">{s.roll}</span>
                          </td>
                          <td className="py-4"><span className="font-black text-slate-700 bg-slate-50 p-2 rounded-lg">{s.cgpa}</span></td>
                          <td className="py-4">
                              <div className="flex gap-1">
                                  {s.marks.map((m,i)=> <div key={i} className={`w-8 h-8 rounded flex items-center justify-center text-[10px] font-black ${m<50?'bg-rose-100 text-rose-700':'bg-emerald-100 text-emerald-700'}`}>{m}</div>)}
                              </div>
                          </td>
                          <td className="py-4">
                             <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-md ${s.ar==='High Risk'?'bg-rose-50 text-rose-600':s.ar==='Low Risk'?'bg-amber-50 text-amber-600':'bg-emerald-50 text-emerald-600'}`}>{s.ar}</span>
                          </td>
                          <td className="py-4 text-right">
                             <button className="text-indigo-600 font-bold text-sm bg-indigo-50 border border-indigo-100 rounded px-4 py-1.5 shadow-sm">Log Interaction</button>
                          </td>
                      </tr>
                  ))}
             </tbody>
         </table>
      </div>
    </div>
  );
}
