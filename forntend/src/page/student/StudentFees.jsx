import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StudentFees({ apiUrl, token, user, linkedId }) {
  const { isDark } = useTheme();
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!linkedId) return;
    setLoading(true);
    try {
      const res = await api.get(`/api/fees/student/${linkedId}`);
      setFees(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const totalDue = fees.filter(f => f.status === 'PENDING' || f.status === 'OVERDUE').reduce((s, f) => s + f.amount, 0);
  const totalPaid = fees.filter(f => f.status === 'PAID').reduce((s, f) => s + f.amount, 0);

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-500/30 relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10 flex justify-between items-start mb-10">
               <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-200 mb-1">Outstanding Balance</h3>
                  <p className="text-5xl font-black italic tracking-tighter">₹{totalDue.toLocaleString()}</p>
               </div>
               <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl shadow-xl">💳</div>
            </div>
            <button className="relative z-10 w-full py-4 bg-white text-indigo-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-50 transition-colors shadow-lg">Initiate Secure Payment</button>
         </div>

         <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[3rem] p-10 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
               <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-1 italic">Contribution Summary</h3>
                  <p className="text-3xl font-black text-slate-800 dark:text-white italic">₹{totalPaid.toLocaleString()}</p>
               </div>
               <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-[10px] font-black uppercase rounded-xl border border-emerald-100 dark:border-emerald-800">Verified Paid</div>
            </div>
            <div className="space-y-4">
               <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-gray-400 italic"><span>Semester Tuition</span><span>₹45,000</span></div>
               <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-gray-400 italic"><span>Exam Fee Ledger</span><span>₹2,500</span></div>
               <div className="pt-4 border-t border-slate-50 dark:border-gray-800 flex justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Receipts</span>
                  <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline italic">Export Audit PDF →</button>
               </div>
            </div>
         </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[3rem] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
         <div className="p-8 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center bg-slate-50/50 dark:bg-gray-800/30">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Fee Allocation Ledger</h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Academic Cycle 2025-26</span>
         </div>
         <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 dark:bg-gray-800/50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Head of Account</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Assessment Value</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Temporal Deadline</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Settlement Status</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {fees.map((f, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors group">
                       <td className="p-6">
                          <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight italic group-hover:text-indigo-600 transition-colors">{f.feeType || 'Institutional Fee'}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">REF: FE-{200+idx}</p>
                       </td>
                       <td className="p-6 text-sm font-black text-slate-800 dark:text-white italic">₹{f.amount.toLocaleString()}</td>
                       <td className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{f.dueDate || '2026-06-01'}</td>
                       <td className="p-6 text-center">
                          <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                            f.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                          }`}>
                             {f.status || 'PENDING'}
                          </span>
                       </td>
                       <td className="p-6 text-right">
                          <button className="px-5 py-2.5 bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                             {f.status === 'PAID' ? 'View Receipt' : 'Resolve Dues'}
                          </button>
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
