import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StudentLibrary({ apiUrl, token, user, linkedId }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!linkedId) return;
    setLoading(true);
    try {
      const res = await api.get(`/api/library/student/${linkedId}`);
      setData(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const borrowed = data.filter(b => !b.returnDate);
  const history = data.filter(b => b.returnDate);
  const totalFine = data.reduce((s, b) => s + (b.fine || 0), 0);

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic underline decoration-indigo-500">Knowledge Resource Repository</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Unified registry of physical circulations, digital manuscripts and archival borrowings</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none">Dues Owed</p>
              <p className="text-2xl font-black text-rose-500 italic mt-1 leading-none">₹{totalFine}</p>
           </div>
           <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-500/20">Clear Fines</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic mb-4">Active Circulations</h3>
            {borrowed.map((b, idx) => {
              const daysLeft = Math.ceil((new Date(b.dueDate) - new Date()) / (86400000));
              return (
                <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm flex gap-6 relative group hover:border-indigo-500 transition-all">
                   <div className="w-20 h-28 bg-slate-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-4xl shadow-inner border border-slate-100 dark:border-gray-700 shrink-0">📖</div>
                   <div className="flex-1">
                      <div className="flex justify-between items-start">
                         <h4 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic group-hover:text-indigo-600 transition-colors">{b.title || 'Institutional Manuscript'}</h4>
                         <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                           daysLeft < 0 ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                         }`}>
                           {daysLeft < 0 ? 'OVERDUE' : `${daysLeft}d Left`}
                         </span>
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">{b.author || 'Scholarly Author'}</p>
                      
                      <div className="mt-8 flex justify-between items-end">
                         <div>
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic mb-1">Temporal Deadline</p>
                            <p className="text-xs font-black text-slate-600 dark:text-gray-400 italic uppercase">{new Date(b.dueDate).toLocaleDateString()}</p>
                         </div>
                         <button className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg">Request Renewal</button>
                      </div>
                   </div>
                </div>
              );
            })}
            {borrowed.length === 0 && (
              <div className="py-20 text-center bg-slate-50 dark:bg-gray-800/30 rounded-[3rem] border border-dashed border-slate-200 dark:border-gray-800 opacity-50 italic">
                 No active circulations detected in the ledger.
              </div>
            )}
         </div>

         <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[3rem] shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-8 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center bg-slate-50/50 dark:bg-gray-800/30">
               <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic underline decoration-indigo-500">Borrowing Chronicle</h3>
            </div>
            <div className="overflow-x-auto flex-1">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50 dark:bg-gray-800/50">
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Resource Title</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Settled On</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Fine Levied</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                     {history.map((b, idx) => (
                       <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors group">
                          <td className="p-6">
                             <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight italic">{b.title}</p>
                          </td>
                          <td className="p-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{new Date(b.returnDate).toLocaleDateString()}</td>
                          <td className={`p-6 text-right text-sm font-black italic ${b.fine > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                             ₹{b.fine || 0}
                          </td>
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
