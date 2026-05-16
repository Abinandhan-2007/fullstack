import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function FinanceStudentFees({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/finance/student-fees/${searchTerm}`);
      setStudent(res.data);
    } catch (err) {
      setError('Student record not found or payment history unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Student Fee Management</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Individual fee tracking, breakdowns and manual payment entry</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm">
         <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
               <input 
                  type="text"
                  placeholder="Search by Registration Number (e.g., 7376...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl px-12 py-4 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-amber-500/10 transition-all"
               />
               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">🔍</span>
            </div>
            <button type="submit" disabled={loading} className="px-10 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-500/20 transition-all disabled:opacity-50">
               {loading ? 'Searching...' : 'Pull Ledger'}
            </button>
         </form>
         {error && <p className="mt-4 text-rose-600 text-xs font-bold px-4 italic">{error}</p>}
      </div>

      {/* Student Ledger View */}
      {student && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           {/* Summary Sidebar */}
           <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm text-center">
                 <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full flex items-center justify-center text-4xl font-black mx-auto border-4 border-white dark:border-gray-800 shadow-xl mb-6">
                    {student.name?.charAt(0)}
                 </div>
                 <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{student.name}</h2>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{student.regNo} • {student.department?.shortForm}</p>
                 
                 <div className="mt-10 p-6 bg-slate-50 dark:bg-gray-800/50 rounded-3xl border border-slate-100 dark:border-gray-700">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Outstanding</p>
                    <p className="text-3xl font-black text-rose-600 mt-2">₹{(student.pendingFees || 84200).toLocaleString()}</p>
                 </div>

                 <button className="w-full mt-6 py-4 bg-slate-900 dark:bg-amber-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">
                    <span>➕</span> Record Offline Payment
                 </button>
              </div>
           </div>

           {/* Detailed Breakdown */}
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm">
                 <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-8 italic">Current Semester Breakdown</h3>
                 <div className="space-y-4">
                    {[
                      { label: 'Tuition Fee', total: 65000, paid: 45000, color: 'bg-blue-500' },
                      { label: 'Hostel & Mess', total: 42000, paid: 0, color: 'bg-orange-500' },
                      { label: 'Examination Fee', total: 2500, paid: 2500, color: 'bg-emerald-500' },
                    ].map((item, idx) => (
                      <div key={idx} className="p-6 bg-slate-50 dark:bg-gray-800/50 rounded-3xl border border-slate-100 dark:border-gray-700">
                         <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">{item.label}</span>
                            <span className="text-xs font-bold text-slate-400">₹{item.paid.toLocaleString()} / ₹{item.total.toLocaleString()}</span>
                         </div>
                         <div className="h-2 w-full bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className={`h-full ${item.color} rounded-full`} style={{width: `${(item.paid/item.total)*100}%`}}></div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden">
                 <div className="p-8 border-b border-slate-100 dark:border-gray-800">
                    <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Payment History</h3>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="bg-slate-50 dark:bg-gray-800/50">
                             <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                             <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Receipt No</th>
                             <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Mode</th>
                             <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Amount</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50 dark:divide-gray-800">
                          {[1,2].map(i => (
                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
                               <td className="p-4 text-xs font-bold text-slate-500">2026-05-10</td>
                               <td className="p-4 text-xs font-black text-slate-900 dark:text-white uppercase">RCPT-882{i}</td>
                               <td className="p-4"><span className="text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Online</span></td>
                               <td className="p-4 text-right font-black text-slate-800 dark:text-white text-sm">₹22,500</td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        </div>
      )}

      {!student && !loading && (
        <div className="py-20 text-center bg-slate-50 dark:bg-gray-800/30 rounded-[3rem] border border-dashed border-slate-200 dark:border-gray-800">
           <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-3xl mx-auto shadow-sm mb-6">💰</div>
           <p className="text-slate-400 italic font-medium">Enter a student registration number to view the complete financial ledger.</p>
        </div>
      )}
    </div>
  );
}
