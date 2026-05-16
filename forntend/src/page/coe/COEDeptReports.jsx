import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function COEDeptReports({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mocked department report data
      setData([
        { name: 'Computer Science', code: 'CSE', students: 450, passPct: 94.2, avgCgpa: 8.4, rank: 1 },
        { name: 'Electronics & Comm', code: 'ECE', students: 420, passPct: 91.5, avgCgpa: 7.9, rank: 2 },
        { name: 'Mechanical Eng', code: 'MECH', students: 380, passPct: 84.8, avgCgpa: 7.2, rank: 4 },
        { name: 'Information Tech', code: 'IT', students: 320, passPct: 89.2, avgCgpa: 8.1, rank: 3 }
      ]);
    } catch (err) {
      setError(err.message || 'Failed to load department reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-48 bg-slate-200 dark:bg-gray-800 rounded-3xl"></div>)}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Department Performance Ledger</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Consolidated academic reports across all institutional faculties</p>
        </div>
        <button className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 transition-all flex items-center gap-2">
           <span>📄</span> Download Master Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((dept, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group hover:border-orange-500 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-bl-[4rem] group-hover:scale-110 transition-transform"></div>
            
            <div className="relative z-10 flex flex-col h-full">
               <div className="flex justify-between items-start mb-6">
                  <div>
                     <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{dept.name}</h3>
                     <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mt-1">Institutional Rank: #{dept.rank}</p>
                  </div>
                  <div className="w-12 h-12 bg-slate-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-xl font-black text-slate-400">
                     {dept.code}
                  </div>
               </div>

               <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-700">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Students</p>
                     <p className="text-lg font-black text-slate-800 dark:text-white">{dept.students}</p>
                  </div>
                  <div className="text-center p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30">
                     <p className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">Pass Rate</p>
                     <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{dept.passPct}%</p>
                  </div>
                  <div className="text-center p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30">
                     <p className="text-[9px] font-black text-blue-500 uppercase tracking-tighter">Avg CGPA</p>
                     <p className="text-lg font-black text-blue-600 dark:text-blue-400">{dept.avgCgpa}</p>
                  </div>
               </div>

               <div className="mt-auto flex gap-3">
                  <button className="flex-1 py-3 bg-slate-900 dark:bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity">View Details</button>
                  <button className="px-4 py-3 bg-slate-100 dark:bg-gray-800 text-slate-500 rounded-xl hover:bg-slate-200 transition-all">📊</button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
