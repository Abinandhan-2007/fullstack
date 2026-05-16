import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StaffPayslip({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/staff/payroll/payslips');
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load payslips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-48 bg-slate-200 dark:bg-gray-800 rounded-xl"></div>
      <div className="space-y-4">
        {[1,2,3].map(i => <div key={i} className="h-24 bg-slate-200 dark:bg-gray-800 rounded-2xl"></div>)}
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-6 text-center text-rose-600 font-bold">
      {error}
      <button onClick={fetchData} className="block mx-auto mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg font-bold">Retry</button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Payroll & Payslips</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Access and download your monthly salary statements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((p, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2rem] p-8 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[4rem] group-hover:scale-110 transition-transform"></div>
            
            <div className="relative z-10">
               <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner mb-6">
                  🧾
               </div>
               
               <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                  {p.month} {p.year}
               </h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Salary Disbursement</p>
               
               <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-50 dark:border-gray-800 pt-6">
                  <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase">Net Pay</p>
                     <p className="text-lg font-black text-emerald-600">₹{(p.netSalary || 45000).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-black text-slate-400 uppercase">Status</p>
                     <p className="text-xs font-black text-slate-800 dark:text-gray-200 uppercase tracking-widest mt-1">Disbursed</p>
                  </div>
               </div>

               <button className="w-full mt-8 py-4 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2">
                  <span>📥</span> Download PDF
               </button>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-gray-800/30 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-gray-800">
             <p className="text-slate-400 italic font-medium">No payslip records found for the current academic year.</p>
          </div>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 flex gap-4">
        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl shrink-0">ℹ️</div>
        <div>
          <h4 className="font-black text-blue-800 dark:text-blue-300 text-sm uppercase tracking-tight">Payroll Information</h4>
          <p className="text-blue-600 dark:text-blue-400 text-sm mt-1 leading-relaxed">
            Payslips are generated on the 1st of every month. For any queries regarding deductions or allowances, please contact the <strong>Finance Department</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
