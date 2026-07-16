import React, { useState } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StaffAdminAttendanceReports({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('STUDENT');

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500); // Simulated generation
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic underline decoration-sky-500 underline-offset-4">Attendance Audit & Analytics Engine</h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm">Generate comprehensive compliance reports and longitudinal attendance studies</p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[3rem] p-10 shadow-sm space-y-10">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Temporal Range</label>
               <div className="flex gap-2">
                  <input type="date" className="flex-1 bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl px-4 py-3 text-xs font-bold dark:text-white outline-none" />
                  <input type="date" className="flex-1 bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl px-4 py-3 text-xs font-bold dark:text-white outline-none" />
               </div>
            </div>
            
            <div className="space-y-4">
               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Analytical Pivot</label>
               <select 
                  value={reportType} 
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl px-4 py-4 text-xs font-black dark:text-white outline-none appearance-none"
               >
                  <option value="STUDENT">Aggregate By Individual Student</option>
                  <option value="SUBJECT">Aggregate By Academic Module</option>
                  <option value="FACULTY">Aggregate By Faculty Logins</option>
                  <option value="DEPT">Global Departmental Summary</option>
               </select>
            </div>
         </div>

         <div className="p-8 bg-sky-50 dark:bg-sky-900/10 border border-sky-100 dark:border-sky-800/30 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-sky-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg">📈</div>
               <div>
                  <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Live Accuracy Check</h4>
                  <p className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-1">98.4% Matrix Compliance</p>
               </div>
            </div>
            <button 
               onClick={handleGenerate}
               disabled={loading}
               className="px-10 py-4 bg-slate-900 dark:bg-sky-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all disabled:opacity-50"
            >
               {loading ? 'Processing Data...' : 'Compile Audit Report'}
            </button>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="p-8 bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-[2rem] text-center group hover:border-sky-500 transition-all">
               <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform">📄</span>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Export as</p>
               <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase italic">Adobe PDF Document</h4>
            </button>
            <button className="p-8 bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-[2rem] text-center group hover:border-sky-500 transition-all">
               <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform">📊</span>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Export as</p>
               <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase italic">MS Excel Spreadsheet</h4>
            </button>
         </div>
      </div>
    </div>
  );
}
