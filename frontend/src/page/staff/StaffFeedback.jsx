import React from 'react';

export default function StaffFeedback() {
  const feedbacks = [
     { id: 1, type: 'Course Feedback', sub: 'CS501', rating: 4.8, comment: 'Pacing is perfect. Could use more lab examples.', date: '10 May 2026' },
     { id: 2, type: 'General', sub: '-', rating: 3.5, comment: 'Please upload the previous year question papers.', date: '12 May 2026' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Complaints & Feedback</h1>
            <p className="text-slate-500 font-medium">Review anonymous student feedback.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="md:col-span-1 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center">
             <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Overall Rating</h3>
             <div className="text-6xl font-black text-indigo-600 mb-2">4.5</div>
             <div className="text-amber-400 text-2xl tracking-widest">★★★★☆</div>
             <p className="text-sm font-bold text-slate-500 mt-4">Based on 145 reviews this semester.</p>
         </div>
         <div className="md:col-span-3 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
             <div className="space-y-4">
                 {feedbacks.map(f => (
                     <div key={f.id} className="p-4 border border-slate-100 bg-slate-50 rounded-xl relative">
                         <div className="flex justify-between items-start mb-2">
                             <div className="flex gap-2 items-center">
                                 <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">{f.type}</span>
                                 {f.sub !== '-' && <span className="bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">{f.sub}</span>}
                             </div>
                             <span className="text-xs font-bold text-slate-400">{f.date}</span>
                         </div>
                         <div className="flex items-center gap-3">
                             <div className="bg-white border border-amber-200 text-amber-500 font-black px-2 py-1 rounded shadow-sm text-sm">★ {f.rating}</div>
                             <p className="text-sm font-medium text-slate-700">"{f.comment}"</p>
                         </div>
                     </div>
                 ))}
             </div>
         </div>
      </div>
    </div>
  );
}
