import React from 'react';

export default function StaffCommunications() {
  const msgs = [
     { id: 1, sender: 'Dept Admin', role: 'STAFF_ADMIN', content: 'Urgent meeting at 4 PM in Seminar Hall 1.', time: '10:30 AM', unread: true },
     { id: 2, sender: 'Dr. Alan (HOD)', role: 'HOD', content: 'Please review the updated syllabus structure.', time: 'Yesterday', unread: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Internal Communications</h1>
            <p className="text-slate-500 font-medium">Faculty and administration messaging.</p>
         </div>
         <button className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-md">+ Compose Memo</button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex h-[600px]">
          <div className="w-1/3 border-r border-slate-200 bg-slate-50/50 flex flex-col">
              <div className="p-4 border-b border-slate-200 bg-white">
                  <input type="text" placeholder="Search messages..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-indigo-500" />
              </div>
              <div className="flex-1 overflow-y-auto">
                  {msgs.map(m => (
                      <div key={m.id} className={`p-4 border-b border-slate-100 cursor-pointer transition ${m.unread ? 'bg-white border-l-4 border-l-indigo-600' : 'hover:bg-white border-l-4 border-l-transparent'}`}>
                          <div className="flex justify-between items-baseline mb-1">
                              <h4 className={`text-sm ${m.unread ? 'font-black text-slate-900' : 'font-bold text-slate-600'}`}>{m.sender}</h4>
                              <span className="text-[10px] font-bold text-slate-400">{m.time}</span>
                          </div>
                          <p className={`text-xs truncate ${m.unread ? 'font-bold text-slate-700' : 'font-medium text-slate-500'}`}>{m.content}</p>
                      </div>
                  ))}
              </div>
          </div>
          <div className="flex-1 flex flex-col bg-white">
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                  <span className="text-6xl mb-4 opacity-50">✉️</span>
                  <p className="font-bold text-lg">Select a message to read</p>
              </div>
          </div>
      </div>
    </div>
  );
}
