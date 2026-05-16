import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StaffAdminExamDuty({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/staff-admin/exams');
      setData(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic underline decoration-sky-500">Examination Invigilation Roster</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Orchestrate faculty duty cycles for institutional summative assessments</p>
        </div>
        <button className="px-6 py-3 bg-sky-600 text-white rounded-xl font-bold shadow-xl flex items-center gap-2">
           <span>📝</span> Generate Duty Cycle
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
         <div className="p-8 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic underline decoration-sky-500">Upcoming Duties</h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none italic">Semester Final Exams 2026</span>
         </div>
         <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 dark:bg-gray-800/50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Date & Session</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Assessment Module</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned Invigilator</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Duty Count</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {data.map((exam, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors group">
                       <td className="p-6">
                          <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{exam.date || '2026-05-20'}</p>
                          <p className="text-[9px] font-black text-sky-500 uppercase tracking-widest mt-1 italic">{exam.session || 'FN (10:00 AM)'}</p>
                       </td>
                       <td className="p-6 text-sm font-bold text-slate-700 dark:text-gray-300 italic">{exam.subjectName || 'Advanced Database Systems'}</td>
                       <td className="p-6">
                          <div className="flex items-center gap-2">
                             <div className="w-8 h-8 bg-sky-100 dark:bg-sky-900/20 rounded-full flex items-center justify-center text-[10px] font-black text-sky-600">👤</div>
                             <span className="text-xs font-black text-slate-800 dark:text-white italic">{exam.assignedStaff || 'Assign Member'}</span>
                          </div>
                       </td>
                       <td className="p-6 text-center text-xs font-black text-slate-400">{exam.dutyNo || 1}/5</td>
                       <td className="p-6 text-right">
                          <button className="px-4 py-2 bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-sky-600 hover:text-white transition-all shadow-sm">Remap Duty</button>
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
