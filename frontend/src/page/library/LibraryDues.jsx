import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function LibraryDues({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/library/overdue');
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load overdue records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleClearFine = async (id) => {
    if (!window.confirm('Clear all pending fines for this record?')) return;
    try {
      await api.post(`/api/library/overdue/${id}/clear`);
      fetchData();
    } catch (err) {
      alert('Action failed');
    }
  };

  const handleNotify = async (id) => {
    try {
      await api.post(`/api/library/overdue/${id}/notify`);
      alert('Defaulter notified via email!');
    } catch (err) {
      alert('Notification failed');
    }
  };

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic underline decoration-rose-500">Overdue & Fine Recovery</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Monitor lending violations and manage institutional fine collection</p>
        </div>
        <div className="flex gap-3">
           <button onClick={() => alert('Feature coming soon: Bulk Notification')} className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-xl shadow-rose-500/20 transition-all flex items-center gap-2 text-xs uppercase tracking-widest">
              <span>🔔</span> Notify All Defaulters
           </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner italic font-black">⌛</div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Defaulters</p>
               <p className="text-2xl font-black text-slate-800 dark:text-white mt-1 italic">{data.length}</p>
            </div>
         </div>
         <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner italic font-black">💰</div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Dues</p>
               <p className="text-2xl font-black text-slate-800 dark:text-white mt-1 italic">₹{data.reduce((sum, item) => sum + (item.fine || 0), 0).toLocaleString()}</p>
            </div>
         </div>
         <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm flex items-center gap-5 border-l-4 border-l-rose-500">
            <div className="w-14 h-14 bg-slate-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-2xl shadow-inner italic font-black">⚠️</div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Critical Dues</p>
               <p className="text-2xl font-black text-rose-600 mt-1 italic">{data.filter(i => i.fine > 500).length} Records</p>
            </div>
         </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
         <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 dark:bg-gray-800/50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Patron</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Resource Detail</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Days Overdue</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Fine Amount</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {data.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors group">
                       <td className="p-6">
                          <p className="text-sm font-bold text-slate-800 dark:text-gray-200">{item.student?.name || 'Patron Name'}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{item.student?.regNo || '7376...'}</p>
                       </td>
                       <td className="p-6 max-w-xs">
                          <p className="text-xs font-bold text-slate-700 dark:text-gray-400 italic line-clamp-1">{item.book?.title || 'Book Title'}</p>
                          <p className="text-[9px] font-black text-slate-300 uppercase mt-1">ISBN: {item.book?.isbn || '978...'}</p>
                       </td>
                       <td className="p-6 text-center text-xs font-black text-rose-500">
                          {item.daysOverdue || 5} Days
                       </td>
                       <td className="p-6 text-center">
                          <span className="text-sm font-black text-slate-900 dark:text-white italic underline decoration-amber-500 underline-offset-4">
                             ₹{(item.fine || 150).toLocaleString()}
                          </span>
                       </td>
                       <td className="p-6">
                          <div className="flex justify-center gap-2">
                             <button onClick={() => handleNotify(item.id)} className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm">📧</button>
                             <button onClick={() => handleClearFine(item.id)} className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm">Clear Dues</button>
                          </div>
                       </td>
                    </tr>
                  ))}
                  {data.length === 0 && (
                    <tr><td colSpan="5" className="p-20 text-center text-slate-300 italic font-medium">Clearance achieved! No overdue resources detected.</td></tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
