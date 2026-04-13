import React, { useState, useEffect } from 'react';

export default function AdminTimetable({ apiUrl, token }) {
  const [activeDept, setActiveDept] = useState('CSE');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = ['09:00 AM', '10:00 AM', '11:15 AM', '12:15 PM', '02:00 PM', '03:00 PM'];
  
  const [timetable, setTimetable] = useState([]);
  const [draggedSubject, setDraggedSubject] = useState(null);
  const [conflictAlert, setConflictAlert] = useState(null);

  // Available subjects pool to drag from
  const subjectsPool = [
      { code: 'CS501', name: 'Software Engg', faculty: 'Dr. Alan', type: 'Core', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
      { code: 'CS502', name: 'AI Systems', faculty: 'Dr. Ng', type: 'Core', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
      { code: 'IT404', name: 'Cloud Arch', faculty: 'Prof. Hopper', type: 'Elective', color: 'bg-amber-100 text-amber-700 border-amber-200' },
      { code: 'MA201', name: 'Probability', faculty: 'Dr. Gauss', type: 'Core', color: 'bg-rose-100 text-rose-700 border-rose-200' },
  ];

  useEffect(() => {
    // Generate some mock timetable structure
    const initialGrid = [];
    days.forEach(day => periods.forEach(period => {
        if(Math.random() > 0.6) {
           const s = subjectsPool[Math.floor(Math.random()*subjectsPool.length)];
           initialGrid.push({ id: `${day}-${period}`, day, period, ...s, venue: `Room ${Math.floor(Math.random()*100)+100}` });
        }
    }));
    setTimetable(initialGrid);
  }, []);

  const isCellOccupied = (day, period) => timetable.find(t => t.day === day && t.period === period);

  const printTimetable = () => {
      window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Timetable Manager</h1>
            <p className="text-slate-500 font-medium mt-1">Read-only global view of the university timetable.</p>
         </div>
         <div className="flex gap-3">
             <button onClick={printTimetable} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold shadow-md hover:bg-slate-800 transition flex items-center gap-2"><span>🖨️</span> Print Layout</button>
         </div>
      </div>

      {conflictAlert && (
          <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-xl shadow-sm text-rose-700 font-bold whitespace-pre-wrap animate-in slide-in-from-top-4 flex items-center gap-3">
             <span className="text-xl">🚨</span> {conflictAlert}
          </div>
      )}

      {/* Main Interface Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
         
         {/* Removed Drag Pool for view-only */}

         {/* Weekly Grid */}
         <div className="flex-1 bg-white border border-slate-200 shadow-sm rounded-[2rem] overflow-hidden">
             
             {/* Toolbar */}
             <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-wrap gap-4 justify-between items-center">
                 <select className="bg-white border border-slate-200 text-sm font-bold text-slate-600 rounded-lg px-4 py-2 shadow-sm outline-none" value={activeDept} onChange={e => setActiveDept(e.target.value)}>
                     <option value="CSE">B.Tech - Comp Sci (CSE) - Sem 5</option>
                     <option value="IT">B.Tech - Info Tech (IT) - Sem 5</option>
                 </select>
                 <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Conflict Engine Active</span>
                 </div>
             </div>

             {/* Grid */}
             <div className="overflow-x-auto print:overflow-visible">
                 <table className="w-full border-collapse min-w-[800px]">
                     <thead>
                         <tr>
                             <th className="bg-slate-100 border border-slate-200 p-3 w-24 text-[10px] font-black uppercase text-slate-500 tracking-widest">Time</th>
                             {days.map(d => <th key={d} className="bg-slate-50 border border-slate-200 p-3 text-[10px] font-black uppercase text-slate-500 tracking-widest w-48">{d}</th>)}
                         </tr>
                     </thead>
                     <tbody>
                         {periods.map(period => (
                             <tr key={period}>
                                 <td className="bg-slate-50 border border-slate-100 p-3 text-center align-middle font-bold text-xs text-slate-600 whitespace-nowrap">{period}</td>
                                 {days.map(day => {
                                     const cellData = isCellOccupied(day, period);
                                     return (
                                             <td key={`${day}-${period}`} className={`border border-slate-100 p-2 h-24 align-top transition-colors ${!cellData ? 'bg-white' : 'bg-slate-50'}`}>
                                            {cellData ? (
                                                <div className={`w-full h-full p-2 rounded-lg border shadow-sm group relative flex flex-col justify-between ${cellData.color}`}>
                                                    <div className="flex justify-between items-start">
                                                        <span className="font-black text-xs leading-tight">{cellData.code}</span>
                                                    </div>
                                                    <div className="mt-1">
                                                        <p className="text-[10px] font-bold opacity-90 truncate leading-tight">{cellData.faculty}</p>
                                                        <p className="text-[9px] font-black uppercase tracking-widest mt-0.5 opacity-60">📍 {cellData.venue}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center opacity-30">
                                                    <span className="text-[10px] uppercase font-bold text-slate-400">Free</span>
                                                </div>
                                            )}
                                         </td>
                                     );
                                 })}
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
         </div>
      </div>
    </div>
  );
}
