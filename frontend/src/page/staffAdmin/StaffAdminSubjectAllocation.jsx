import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StaffAdminSubjectAllocation({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [courses, setCourses] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cRes, sRes] = await Promise.all([
        api.get('/api/staff-admin/courses'),
        api.get('/api/staff-admin/staff')
      ]);
      setCourses(cRes.data);
      setStaff(sRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic">Curriculum & Resource Allocation</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Assign faculty expertise to academic modules and laboratory cycles</p>
        </div>
        <button className="px-6 py-3 bg-sky-600 text-white rounded-xl font-bold shadow-xl flex items-center gap-2">
           <span>📚</span> Map New Course
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
         <div className="p-8 border-b border-slate-100 dark:border-gray-800">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic underline decoration-sky-500 underline-offset-8">Faculty Mapping Ledger</h3>
         </div>
         <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 dark:bg-gray-800/50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Course Code</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Subject Name</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned Faculty</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Load</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {courses.map((c, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors group">
                       <td className="p-6 text-xs font-black text-sky-600 dark:text-sky-400 uppercase tracking-widest">{c.courseCode}</td>
                       <td className="p-6 text-sm font-bold text-slate-700 dark:text-gray-300 italic">{c.name}</td>
                       <td className="p-6">
                          {c.assignedStaff ? (
                            <div className="flex items-center gap-2">
                               <div className="w-8 h-8 bg-sky-100 dark:bg-sky-900/20 rounded-full flex items-center justify-center text-[10px] font-black text-sky-600">
                                  {c.assignedStaff.name?.charAt(0)}
                               </div>
                               <span className="text-xs font-black text-slate-800 dark:text-white italic">{c.assignedStaff.name}</span>
                            </div>
                          ) : (
                            <span className="text-[10px] font-black text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-3 py-1 rounded-lg border border-rose-100 dark:border-rose-800/30">UNALLOCATED</span>
                          )}
                       </td>
                       <td className="p-6 text-center text-xs font-black text-slate-400">{c.hoursPerWeek || 4} Hrs/Wk</td>
                       <td className="p-6 text-right">
                          <button className="px-4 py-2 bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-sky-600 hover:text-white transition-all shadow-sm">Modify Mapping</button>
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
