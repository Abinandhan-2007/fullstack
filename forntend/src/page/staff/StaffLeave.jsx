import React from 'react';

export default function StaffLeave() {
  const leaves = [
    { id: 1, type: 'Casual Leave', from: '2026-05-10', to: '2026-05-11', status: 'Approved' },
    { id: 2, type: 'Medical Leave', from: '2026-04-01', to: '2026-04-03', status: 'Rejected' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Leave Management</h1>
            <p className="text-slate-500 font-medium">Apply and track leave requests.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <h3 className="text-lg font-black text-slate-800 mb-6 border-b border-slate-100 pb-2">Apply Leave</h3>
              <form className="space-y-4">
                  <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Leave Type</label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-sm outline-none"><option>Casual Leave (CL)</option><option>Earned Leave (EL)</option><option>On Duty (OD)</option></select>
                  </div>
                  <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">From Date</label>
                      <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-sm outline-none" />
                  </div>
                  <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Reason</label>
                      <textarea rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-sm outline-none"></textarea>
                  </div>
                  <button type="button" className="w-full py-3 bg-indigo-600 font-bold text-white shadow-md rounded-xl hover:bg-indigo-700 transition">Submit Request</button>
              </form>
          </div>

          <div className="md:col-span-2 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm overflow-x-auto">
             <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Leave History</h3>
             <table className="w-full text-left border-collapse min-w-[500px]">
                 <thead><tr className="border-b-2 border-slate-100">
                     <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Type</th>
                     <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Duration</th>
                     <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Status</th>
                 </tr></thead>
                 <tbody>
                     {leaves.map(l => (
                         <tr key={l.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                             <td className="py-4 font-bold text-slate-800">{l.type}</td>
                             <td className="py-4 font-bold text-slate-600">{l.from} to {l.to}</td>
                             <td className="py-4">
                                 <span className={`px-3 py-1 font-black text-xs rounded-lg uppercase tracking-widest ${l.status==='Approved'?'bg-emerald-50 text-emerald-600 border border-emerald-100':l.status==='Rejected'?'bg-rose-50 text-rose-600 border border-rose-100':'bg-amber-50 text-amber-600 border border-amber-100'}`}>{l.status}</span>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
          </div>
      </div>
    </div>
  );
}
