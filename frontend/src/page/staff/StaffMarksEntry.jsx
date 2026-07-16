import React from 'react';

export default function StaffMarksEntry() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Marks Entry</h1>
            <p className="text-slate-500 font-medium">Internal assessments and assignments.</p>
         </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
             <div>
                 <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">Subject</label>
                 <select className="w-full border border-slate-200 p-3 rounded-xl font-bold bg-slate-50 outline-none focus:border-indigo-500"><option>CS501 - Data Structures</option></select>
             </div>
             <div>
                 <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">Assessment Type</label>
                 <select className="w-full border border-slate-200 p-3 rounded-xl font-bold bg-slate-50 outline-none focus:border-indigo-500"><option>Internal Assessment 1</option><option>Internal Assessment 2</option><option>Assignment</option></select>
             </div>
             <div>
                 <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">Max Marks</label>
                 <input type="number" defaultValue="50" className="w-full border border-slate-200 p-3 rounded-xl font-bold bg-slate-50 outline-none focus:border-indigo-500" />
             </div>
             <div className="flex items-end">
                 <button className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl shadow-md hover:bg-slate-800 transition">Fetch Class List</button>
             </div>
         </div>

         <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 relative">
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                 <span className="text-5xl opacity-50 mb-4 block">📝</span>
                 <p className="text-slate-500 font-bold">Select subject and fetch list to enter marks</p>
             </div>
         </div>
      </div>
    </div>
  );
}
