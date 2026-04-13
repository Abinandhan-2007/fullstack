import React from 'react';

export default function StaffAdminDepartmentStaff() {
  const staff = [
     { id: 'FAC001', name: 'Dr. Alan Turing', role: 'Professor', exp: '15 Yrs', status: 'Active' },
     { id: 'FAC002', name: 'Dr. Grace Hopper', role: 'Assoc. Professor', exp: '12 Yrs', status: 'On Leave' },
     { id: 'FAC003', name: 'Prof. John Doe', role: 'Ad-hoc Faculty', exp: '3 Yrs', status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Department Staff</h1>
            <p className="text-slate-500 font-medium">Directory and faculty profiles.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {staff.map(s => (
             <div key={s.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm group hover:-translate-y-1 transition duration-200">
               <div className="flex justify-between items-start mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-2xl shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-colors">{s.name[0]}</div>
                  <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-md ${s.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>{s.status}</span>
               </div>
               <h3 className="text-xl font-black text-slate-800 tracking-tight mb-1">{s.name}</h3>
               <p className="text-sm font-bold text-slate-500 mb-4">{s.role}</p>
               
               <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 tracking-widest">{s.id}</span>
                  <span className="text-xs font-black text-slate-600 bg-slate-50 px-2 py-1 rounded">{s.exp} Exp</span>
               </div>
               <button className="w-full mt-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-indigo-600 hover:bg-slate-50 transition">View KPI Dashboard</button>
             </div>
         ))}
      </div>
    </div>
  );
}
