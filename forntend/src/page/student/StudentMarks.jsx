import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StudentMarks({ apiUrl, token, user, linkedId }) {
  const { isDark } = useTheme();
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSem, setSelectedSem] = useState('ALL');

  const fetchData = async () => {
    if (!linkedId) return;
    setLoading(true);
    try {
      const res = await api.get(`/api/marks/student/${linkedId}`);
      setMarks(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredMarks = selectedSem === 'ALL' ? marks : marks.filter(m => m.semester === selectedSem);
  const semesters = ['ALL', '1', '2', '3', '4', '5', '6', '7', '8'];

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic underline decoration-indigo-500">Academic Attainment Registry</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Longitudinal performance analytics and verified grade descriptors</p>
        </div>
        <div className="flex gap-2">
           <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-xl shadow-indigo-500/20 text-xs uppercase tracking-widest">Download Marksheet</button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
         {semesters.map(s => (
           <button 
             key={s}
             onClick={() => setSelectedSem(s)}
             className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap ${
               selectedSem === s 
               ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20 scale-105' 
               : 'bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-800 text-slate-400'
             }`}
           >
             Semester {s}
           </button>
         ))}
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
         <div className="p-8 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center bg-slate-50/50 dark:bg-gray-800/30">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Verified Assessment Ledger</h3>
            <div className="flex items-center gap-6">
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Semester SGPA</p>
                  <p className="text-xl font-black text-indigo-600 italic leading-none">8.42</p>
               </div>
            </div>
         </div>
         <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 dark:bg-gray-800/50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Course Identification</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Exam Type</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Score</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Percentage</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Academic Standing</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {filteredMarks.map((m, idx) => {
                    const pct = Math.round((m.score / m.maxScore) * 100);
                    return (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors group">
                         <td className="p-6">
                            <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight italic group-hover:text-indigo-600 transition-colors">{m.subjectName || 'Course Title Unavailable'}</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">{m.courseCode}</p>
                         </td>
                         <td className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{m.examType?.replace('_', ' ')}</td>
                         <td className="p-6 text-center">
                            <span className="text-sm font-black text-slate-800 dark:text-white italic">{m.score}</span>
                            <span className="text-[10px] font-bold text-slate-300 italic ml-1">/ {m.maxScore}</span>
                         </td>
                         <td className="p-6 text-center">
                            <div className="flex flex-col items-center gap-1">
                               <div className="w-20 h-1 bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-indigo-500" style={{ width: `${pct}%` }}></div>
                                </div>
                                <span className="text-[9px] font-black text-slate-400 italic">{pct}% Attained</span>
                            </div>
                         </td>
                         <td className="p-6 text-right">
                            <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                              pct >= 40 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                            }`}>
                               {pct >= 40 ? 'CREDIT EARNED' : 'NOT CLEAR'}
                            </span>
                         </td>
                      </tr>
                    );
                  })}
                  {filteredMarks.length === 0 && (
                    <tr>
                       <td colSpan="5" className="p-20 text-center text-slate-300 italic font-medium uppercase tracking-[0.3em] opacity-50">
                          No validated results found for this cycle.
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
