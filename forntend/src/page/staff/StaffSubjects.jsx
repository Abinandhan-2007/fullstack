import React from 'react';

export default function StaffSubjects() {
  const subjects = [
    { code: 'CS501', name: 'Data Structures', prog: 'B.Tech CSE', sem: 'IV', syl: 65 },
    { code: 'EC204', name: 'Signals & Systems', prog: 'B.Tech ECE', sem: 'IV', syl: 45 }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
         <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Subjects</h1>
         <p className="text-slate-500 font-medium">Syllabus progression and materials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {subjects.map(s => (
             <div key={s.code} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm group">
                 <div className="flex justify-between items-start mb-4">
                     <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">{s.code}</span>
                     <span className="text-xs font-bold text-slate-400">Sem {s.sem}</span>
                 </div>
                 <h3 className="text-xl font-black text-slate-800 mb-1">{s.name}</h3>
                 <p className="text-sm font-bold text-slate-500 mb-6">{s.prog}</p>
                 
                 <div className="mb-2 flex justify-between text-xs font-bold">
                     <span className="text-slate-600">Syllabus Covered</span>
                     <span className="text-indigo-600">{s.syl}%</span>
                 </div>
                 <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-6">
                     <div className="bg-indigo-500 h-full rounded-full" style={{width: `${s.syl}%`}}></div>
                 </div>

                 <div className="flex gap-2">
                     <button className="flex-1 py-2 bg-slate-50 border border-slate-200 font-bold text-slate-600 text-xs rounded-lg hover:bg-slate-100 transition shadow-sm">Materials</button>
                     <button className="flex-1 py-2 bg-slate-50 border border-slate-200 font-bold text-slate-600 text-xs rounded-lg hover:bg-slate-100 transition shadow-sm">Update Progress</button>
                 </div>
             </div>
         ))}
      </div>
    </div>
  );
}
