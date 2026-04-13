import React, { useState } from 'react';

export default function StaffAdminAttendanceMapping() {
  const [selectedSession, setSelectedSession] = useState('');
  
  const sessions = ['CS501 (Period 1)', 'EC204 (Period 3)'];
  const grid = Array.from({length: 30}, (_, i) => ({
      roll: `737622CS${100+i}`, 
      name: `Student ${i}`, 
      status: Math.random() > 0.8 ? 'Absent' : 'Present'
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Attendance Mapping</h1>
            <p className="text-slate-500 font-medium">Override and finalize attendance.</p>
         </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Select Live Session</label>
          <select value={selectedSession} onChange={e=>setSelectedSession(e.target.value)} className="w-full md:w-96 p-3 rounded-xl border border-slate-200 font-bold mb-6 focus:border-indigo-500 outline-none">
              <option value="">-- Choose Session --</option>
              {sessions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {selectedSession && (
              <div>
                  <div className="flex justify-between items-end mb-4 border-b border-slate-100 pb-4">
                     <div className="flex gap-4">
                        <span className="w-3 h-3 rounded bg-emerald-500 mt-1"></span> <span className="text-xs font-bold text-slate-600">Present</span>
                        <span className="w-3 h-3 rounded bg-rose-500 mt-1"></span> <span className="text-xs font-bold text-slate-600">Absent</span>
                     </div>
                     <button className="px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-lg shadow-sm">Lock Attendance</button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {grid.map(s => (
                          <div key={s.roll} className={`p-3 rounded-xl border flex flex-col items-center text-center shadow-sm cursor-pointer hover:border-indigo-500 transition ${s.status==='Present'?'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                              <span className="text-xs font-black">{s.roll}</span>
                              <span className="text-[10px] font-bold opacity-80 mt-1 truncate w-full">{s.name}</span>
                          </div>
                      ))}
                  </div>
              </div>
          )}
      </div>
    </div>
  );
}
