import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function FinanceReports({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const reports = [
    { title: 'Annual Financial Statement', category: 'Audit', desc: 'Consolidated balance sheet and income statement for the academic year.', icon: '⚖️' },
    { title: 'Fee Collection Analysis', category: 'Revenue', desc: 'Detailed breakdown of tuition, hostel and other fee collections.', icon: '💰' },
    { title: 'Faculty Payroll Summary', category: 'Expenditure', desc: 'Monthly disbursement details including allowances and deductions.', icon: '💸' },
    { title: 'Vendor Expenditure Log', category: 'Expenditure', desc: 'Complete history of supply-chain and maintenance payments.', icon: '🤝' },
    { title: 'Department Budget Report', category: 'Internal', desc: 'Allocation vs Utilization analysis across academic departments.', icon: '📊' },
    { title: 'Arrear Recovery Status', category: 'Revenue', desc: 'Tracking of late fee payments and outstanding student dues.', icon: '⚠️' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic">Financial Intelligence & Reporting</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Generate and export institutional financial audits</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2rem] p-6 shadow-sm flex flex-wrap gap-6 items-end">
         <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Start Date</label>
            <input type="date" value={dateRange.from} onChange={(e) => setDateRange({...dateRange, from: e.target.value})} className="bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-xl px-4 py-2 text-xs font-bold dark:text-white outline-none" />
         </div>
         <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">End Date</label>
            <input type="date" value={dateRange.to} onChange={(e) => setDateRange({...dateRange, to: e.target.value})} className="bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-xl px-4 py-2 text-xs font-bold dark:text-white outline-none" />
         </div>
         <button className="px-6 py-2.5 bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-700 transition-all shadow-lg shadow-amber-500/20">Apply Range</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((r, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col hover:border-amber-500 transition-all group">
             <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-slate-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                   {r.icon}
                </div>
                <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-amber-100 dark:border-amber-800">
                   {r.category}
                </span>
             </div>
             
             <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2">{r.title}</h3>
             <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed flex-1 italic">
                {r.desc}
             </p>
             
             <div className="mt-8 flex gap-3">
                <button className="flex-1 py-3 bg-slate-900 dark:bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                   <span>📥</span> PDF
                </button>
                <button className="flex-1 py-3 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                   <span>📊</span> Excel
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
