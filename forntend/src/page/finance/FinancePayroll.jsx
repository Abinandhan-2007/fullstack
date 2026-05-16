import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function FinancePayroll({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/finance/payroll');
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load payroll data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProcessBulk = async () => {
    if (!window.confirm('Process payroll for all staff members?')) return;
    setProcessing(true);
    try {
      await api.post('/api/finance/payroll/process-all');
      alert('Payroll processing initiated successfully!');
      fetchData();
    } catch (err) {
      alert('Processing failed: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return (
    <div className="space-y-6 animate-pulse">
       <div className="h-10 w-full bg-slate-200 dark:bg-gray-800 rounded-xl"></div>
       <div className="h-96 bg-slate-200 dark:bg-gray-800 rounded-[2.5rem]"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Institutional Payroll</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Disburse salaries and manage faculty compensation</p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={handleProcessBulk}
             disabled={processing}
             className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2"
           >
              <span>💸</span> {processing ? 'Processing Salaries...' : 'Run Monthly Payroll'}
           </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
         <div className="p-8 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Salary Register - May 2026</h3>
            <div className="flex items-center gap-4">
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Estimated Total</p>
                  <p className="text-lg font-black text-slate-800 dark:text-white leading-none">₹1.25 Cr</p>
               </div>
            </div>
         </div>
         <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 dark:bg-gray-800/50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Employee</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Role / ID</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Gross Pay</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Net Disbursement</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {data.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors group">
                       <td className="p-6">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-slate-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-xs font-black text-slate-400">
                                {p.staff?.name?.charAt(0)}
                             </div>
                             <p className="text-sm font-bold text-slate-800 dark:text-gray-200">{p.staff?.name}</p>
                          </div>
                       </td>
                       <td className="p-6">
                          <p className="text-xs font-bold text-slate-500 uppercase">{p.staff?.designation || 'Faculty'}</p>
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-tight">{p.staff?.staffId || `STF-${idx+100}`}</p>
                       </td>
                       <td className="p-6 text-center text-xs font-black text-slate-400 italic">₹{(p.grossSalary || 55000).toLocaleString()}</td>
                       <td className="p-6 text-center">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            p.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                             {p.status || 'PENDING'}
                          </span>
                       </td>
                       <td className="p-6 text-right">
                          <div className="flex flex-col items-end">
                             <p className="text-sm font-black text-slate-800 dark:text-white">₹{(p.netSalary || 48000).toLocaleString()}</p>
                             <button className="text-[8px] font-black text-blue-600 uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Send Email Slip</button>
                          </div>
                       </td>
                    </tr>
                  ))}
                  {data.length === 0 && !loading && (
                    <tr><td colSpan="5" className="p-20 text-center text-slate-300 italic font-medium">Payroll for this month is not yet initialized.</td></tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
