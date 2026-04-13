import React from 'react';

export default function StaffAdminAnnouncements() {
  const notices = [
     { id: 1, title: 'Submission of IA Marks', date: '13 Apr 2026', scope: 'Faculty Only', content: 'Please submit Internal Assessment II marks by EOD Friday.', urgent: true },
     { id: 2, title: 'Guest Lecture in Hall 2', date: '10 Apr 2026', scope: 'All Students', content: 'Mandatory attendance for 3rd year CSE.', urgent: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Announcements</h1>
            <p className="text-slate-500 font-medium">Departmental notice board and broadcasts.</p>
         </div>
         <button className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-sm">+ New Notice</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {notices.map(n => (
             <div key={n.id} className={`p-6 rounded-[2rem] border shadow-sm relative ${n.urgent ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200'}`}>
                 {n.urgent && <div className="absolute top-4 right-4 animate-pulse"><span className="bg-rose-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow">Urgent</span></div>}
                 <div className="flex gap-2 mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-black/5 px-2 py-0.5 rounded">{n.date}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">{n.scope}</span>
                 </div>
                 <h3 className={`text-lg font-black mb-2 ${n.urgent ? 'text-rose-900' : 'text-slate-800'}`}>{n.title}</h3>
                 <p className={`text-sm font-medium ${n.urgent ? 'text-rose-700' : 'text-slate-500'}`}>{n.content}</p>
                 <div className="mt-6 flex gap-3">
                    <button className="text-xs font-bold text-slate-400 hover:text-slate-600">Edit</button>
                    <button className="text-xs font-bold text-slate-400 hover:text-rose-600">Delete</button>
                 </div>
             </div>
         ))}
      </div>
    </div>
  );
}
