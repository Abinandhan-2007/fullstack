import React, { useState } from 'react';

export default function AdminCalendar() {
  const [viewMode, setViewMode] = useState('monthly'); // monthly, weekly
  
  const [events, setEvents] = useState([
      { id: 1, title: 'Spring Semester Begins', date: 2, type: 'Academic', color: 'bg-blue-100 text-blue-700 border-blue-200' },
      { id: 2, title: 'Mid-Sem Examinations', date: 15, type: 'Exam', color: 'bg-rose-100 text-rose-700 border-rose-200' },
      { id: 3, title: 'National Holiday', date: 24, type: 'Holiday', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
      { id: 4, title: 'Tech Fest Day 1', date: 28, type: 'Fest', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  ]);

  const [addModal, setAddModal] = useState(false);

  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm print:hidden">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Academic Calendar</h1>
            <p className="text-slate-500 font-medium mt-1">Manage university holidays, exams, deadlines, and fests.</p>
         </div>
         <div className="flex gap-3">
             <button onClick={() => window.print()} className="px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-bold shadow-sm hover:bg-slate-100 transition flex items-center gap-2"><span>📥</span> Export PDF</button>
             <button onClick={() => setAddModal(true)} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-md shadow-indigo-500/20 hover:bg-indigo-700 transition flex items-center gap-2">➕ Add Event</button>
         </div>
      </div>

      {/* Main Board */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-4">
                  <button className="text-slate-400 hover:text-slate-700 text-2xl font-black">&lt;</button>
                  <h2 className="text-2xl font-black text-slate-800">April 2026</h2>
                  <button className="text-slate-400 hover:text-slate-700 text-2xl font-black">&gt;</button>
              </div>
              <div className="bg-white border border-slate-200 p-1 flex rounded-lg">
                  <button onClick={() => setViewMode('monthly')} className={`px-4 py-1.5 rounded-md text-xs font-bold ${viewMode === 'monthly' ? 'bg-slate-100 text-slate-800 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-50'}`}>Monthly</button>
                  <button onClick={() => setViewMode('weekly')} className={`px-4 py-1.5 rounded-md text-xs font-bold ${viewMode === 'weekly' ? 'bg-slate-100 text-slate-800 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-50'}`}>Weekly</button>
              </div>
          </div>

          <div className="p-6 overflow-x-auto">
             <div className="min-w-[800px]">
                 
                 {/* Weekday Headers */}
                 <div className="grid grid-cols-7 gap-4 mb-4">
                     {weekDays.map(d => (
                         <div key={d} className="text-center font-black uppercase tracking-widest text-[10px] text-slate-400">{d}</div>
                     ))}
                 </div>

                 {/* Grid */}
                 <div className="grid grid-cols-7 gap-4 auto-rows-fr">
                     {/* Padding for start of month */}
                     <div className="col-span-3 min-h-[120px] rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/50"></div>
                     
                     {daysInMonth.map(day => {
                         const todaysEvents = events.filter(e => e.date === day);
                         return (
                             <div key={day} className="min-h-[120px] rounded-2xl border border-slate-200 bg-white shadow-sm p-3 hover:border-indigo-300 transition group relative">
                                 <span className={`text-sm font-black ${day === new Date().getDate() ? 'bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-slate-600'}`}>{day}</span>
                                 
                                 <div className="mt-2 space-y-1.5">
                                     {todaysEvents.map(ev => (
                                         <div key={ev.id} className={`px-2 py-1.5 border rounded-lg shadow-sm text-[10px] font-bold leading-tight ${ev.color}`}>
                                             <div className="uppercase tracking-widest opacity-60 text-[8px] mb-0.5">{ev.type}</div>
                                             {ev.title}
                                         </div>
                                     ))}
                                 </div>
                                 
                                 {/* Hover Add Button */}
                                 <button onClick={() => setAddModal(true)} className="absolute top-2 right-2 w-6 h-6 bg-slate-100 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition font-black text-sm">+</button>
                             </div>
                         );
                     })}
                 </div>
             </div>
          </div>
      </div>

      {addModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 border border-slate-200">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-black text-slate-800">Add Calendar Event</h3>
                      <button onClick={() => setAddModal(false)} className="bg-slate-100 w-8 h-8 rounded-full font-bold text-slate-500 hover:bg-slate-200">&times;</button>
                  </div>
                  <div className="space-y-4">
                      <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Event Title</label><input type="text" className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 text-sm font-bold" /></div>
                      <div className="flex gap-4">
                          <div className="flex-1"><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Date</label><input type="date" className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 text-sm font-bold text-slate-700" /></div>
                          <div className="flex-1"><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Event Type</label><select className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 text-sm font-bold text-slate-700"><option>Holiday</option><option>Exam</option><option>Fest</option><option>Academic</option></select></div>
                      </div>
                      <div className="pt-4 flex items-center gap-3"><input type="checkbox" id="remind" className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" /><label htmlFor="remind" className="text-sm font-bold text-slate-700">Set automated reminder for students</label></div>
                  </div>
                  <button onClick={() => setAddModal(false)} className="w-full mt-8 bg-indigo-600 text-white font-black py-3.5 rounded-xl shadow-md hover:bg-indigo-700 transition">Save Event</button>
              </div>
          </div>
      )}

    </div>
  );
}
