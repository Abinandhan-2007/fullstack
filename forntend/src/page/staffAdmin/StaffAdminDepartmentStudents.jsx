import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StaffAdminDepartmentStudents({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/staff-admin/students');
      setData(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = data.filter(s => s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.regNo?.includes(searchTerm));

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic">Student Academic Registry</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Unified repository of department scholars, performance metrics and attendance logs</p>
        </div>
        <div className="flex gap-3">
           <button className="px-6 py-3 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl font-bold shadow-sm text-xs uppercase tracking-widest text-slate-600 dark:text-gray-300">Bulk Import</button>
           <button className="px-6 py-3 bg-sky-600 text-white rounded-xl font-bold shadow-xl shadow-sky-500/20 text-xs uppercase tracking-widest">Add Student</button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-6 shadow-sm">
         <input 
            type="text"
            placeholder="Search by name, roll number or registration ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-sky-500/10"
         />
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
         <div className="p-8 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic underline decoration-sky-500">Scholar Enrollment Ledger</h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Total: {filtered.length} Students</span>
         </div>
         <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 dark:bg-gray-800/50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Identity</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Current Year / Sec</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">CGPA</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Attendance</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {filtered.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors group">
                       <td className="p-6">
                          <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight italic underline decoration-slate-100 dark:decoration-gray-800">{s.name}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">{s.regNo}</p>
                       </td>
                       <td className="p-6 text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">
                          Year {s.year || 3} • Sec {s.section || 'A'}
                       </td>
                       <td className="p-6 text-center">
                          <span className="text-sm font-black text-sky-600 italic">{s.gpa || '8.5'}</span>
                       </td>
                       <td className="p-6 text-center">
                          <div className="flex flex-col items-center gap-1">
                             <div className="w-24 h-1.5 bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: `${s.attendance || 92}%` }}></div>
                             </div>
                             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{s.attendance || 92}% Present</span>
                          </div>
                       </td>
                       <td className="p-6 text-right">
                          <button className="text-[9px] font-black text-sky-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Full Record →</button>
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
