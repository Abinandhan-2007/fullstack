import React, { useState } from 'react';

export default function StaffAdminTimetable() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = ['P1', 'P2', 'P3', 'P4', 'Lunch', 'P5', 'P6'];
  const [modalOpen, setModalOpen] = useState(false);
  const [timetable, setTimetable] = useState([
     { id: '1', day: 'Monday', period: 'P1', sub: 'DS', fac: 'Dr. Alan', venue: 'R201', dept: 'CSE' }
  ]);

  const [formData, setFormData] = useState({ sub: '', fac: '', venue: '', day: 'Monday', period: 'P1', dept: 'CSE' });

  const isCellOccupied = (day, period) => timetable.find(t => t.day === day && t.period === period);

  const handleCellClick = (day, period) => {
      const existing = isCellOccupied(day, period);
      if(existing) {
          setFormData(existing);
      } else {
          setFormData({ sub: '', fac: '', venue: '', day, period, dept: 'CSE' });
      }
      setModalOpen(true);
  };

  const handleSave = (e) => {
      e.preventDefault();
      // Basic conflict detection
      const facultyClash = timetable.find(t => t.fac === formData.fac && t.day === formData.day && t.period === formData.period && t.id !== formData.id);
      if(facultyClash) return alert(`Clash: ${formData.fac} is already booked at this time.`);
      
      const venueClash = timetable.find(t => t.venue === formData.venue && t.day === formData.day && t.period === formData.period && t.id !== formData.id);
      if(venueClash) return alert(`Clash: ${formData.venue} is already occupied at this time.`);

      setTimetable(prev => {
          const removed = prev.filter(t => t.id !== formData.id && !(t.day === formData.day && t.period === formData.period));
          return [...removed, { ...formData, id: formData.id || Date.now().toString() }];
      });
      setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Timetable Manager</h1>
            <p className="text-slate-500 font-medium">Department scheduling with write access & conflict detection.</p>
         </div>
         <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition text-sm shadow-sm">Clear All</button>
            <button className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition text-sm shadow-sm">Export</button>
         </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-[2rem] overflow-hidden">
         <div className="overflow-x-auto">
             <table className="w-full border-collapse min-w-[800px]">
                 <thead>
                     <tr>
                         <th className="bg-slate-50 border border-slate-100 p-3 w-20 text-[10px] font-black uppercase text-slate-500 tracking-widest text-center">Day</th>
                         {periods.map(p => <th key={p} className="bg-slate-50 border border-slate-100 p-3 text-[10px] font-black uppercase text-slate-500 tracking-widest">{p}</th>)}
                     </tr>
                 </thead>
                 <tbody>
                     {days.map(day => (
                         <tr key={day}>
                             <td className="bg-slate-50 border border-slate-100 p-3 text-xs font-black text-slate-600 uppercase text-center">{day.substring(0,3)}</td>
                             {periods.map(period => {
                                 if(period === 'Lunch') return <td key={period} className="bg-slate-100 border border-slate-200 opacity-50 p-2"></td>;
                                 const cell = isCellOccupied(day, period);
                                 return (
                                     <td key={period} onClick={() => handleCellClick(day, period)} className={`border border-slate-100 p-2 h-24 align-top cursor-pointer transition-colors ${!cell ? 'bg-white hover:bg-indigo-50/30' : 'bg-slate-50 hover:bg-slate-100'}`}>
                                         {cell ? (
                                             <div className="h-full p-2 rounded-lg border bg-indigo-50 border-indigo-200 text-indigo-900 flex flex-col justify-between shadow-sm">
                                                 <span className="font-black text-xs">{cell.sub}</span>
                                                 <div><p className="text-[10px] font-bold opacity-80">{cell.fac}</p><p className="text-[9px] font-black uppercase mt-0.5 opacity-60">📍 {cell.venue}</p></div>
                                             </div>
                                         ) : (
                                             <div className="h-full rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center opacity-0 hover:opacity-100"><span className="text-[10px] font-bold text-slate-400">Add</span></div>
                                         )}
                                     </td>
                                 )
                             })}
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>
      </div>

      {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-[2rem] p-6 max-w-sm w-full shadow-2xl relative">
                  <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 font-bold text-slate-400 hover:text-slate-600">✕</button>
                  <h2 className="text-xl font-black text-slate-800 mb-4">{formData.id ? 'Edit' : 'Add'} Session</h2>
                  <form onSubmit={handleSave} className="space-y-4">
                      <div>
                         <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Subject</label>
                         <input required value={formData.sub} onChange={e=>setFormData({...formData, sub: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold outline-none focus:border-indigo-500" />
                      </div>
                      <div>
                         <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Faculty</label>
                         <input required value={formData.fac} onChange={e=>setFormData({...formData, fac: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold outline-none focus:border-indigo-500" />
                      </div>
                      <div>
                         <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Venue</label>
                         <input required value={formData.venue} onChange={e=>setFormData({...formData, venue: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold outline-none focus:border-indigo-500" />
                      </div>
                      <div className="pt-2">
                         <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-md transition">Save Session</button>
                         {formData.id && <button type="button" onClick={() => {setTimetable(prev => prev.filter(t=>t.id!==formData.id)); setModalOpen(false);}} className="w-full py-3 mt-2 bg-rose-50 text-rose-600 rounded-xl font-bold hover:bg-rose-100 transition">Delete</button>}
                      </div>
                  </form>
              </div>
          </div>
      )}

    </div>
  );
}
