import React from 'react';

export default function StaffTimetable() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = ['P1', 'P2', 'P3', 'P4', 'Lunch', 'P5', 'P6'];
  const myTimetable = [
     { day: 'Monday', period: 'P1', sub: 'Data Structures', venue: 'Lab 4' },
     { day: 'Monday', period: 'P3', sub: 'Signals & Systems', venue: 'Room 205' },
     { day: 'Tuesday', period: 'P2', sub: 'AI Systems', venue: 'Room 101' },
     { day: 'Wednesday', period: 'P5', sub: 'Data Structures', venue: 'Lab 4' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex justify-between items-center">
         <div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Timetable</h1>
             <p className="text-slate-500 font-medium">Your weekly schedule overview.</p>
         </div>
      </div>
      
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
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
                                 const cell = myTimetable.find(t => t.day === day && t.period === period);
                                 return (
                                     <td key={period} className={`border border-slate-100 p-2 h-24 align-top transition-colors ${cell ? 'bg-indigo-50/50' : 'bg-white'}`}>
                                         {cell && (
                                             <div className="h-full p-2 rounded-lg border bg-indigo-50 border-indigo-200 text-indigo-900 flex flex-col justify-between shadow-sm hover:-translate-y-0.5 transition">
                                                 <span className="font-black text-xs leading-tight mb-2">{cell.sub}</span>
                                                 <div><p className="text-[9px] font-black uppercase mt-0.5 opacity-60">📍 {cell.venue}</p></div>
                                             </div>
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
    </div>
  );
}
