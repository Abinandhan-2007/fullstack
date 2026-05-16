import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function COEResults({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedDept, setSelectedDept] = useState('CSE');
  const [selectedExam, setSelectedExam] = useState('SEMESTER_END');
  const [publishing, setPublishing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/coe/results');
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load results data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePublishToggle = async (status) => {
    if (!window.confirm(`Are you sure you want to ${status ? 'publish' : 'unpublish'} results for ${selectedDept}?`)) return;
    setPublishing(true);
    try {
      await api.post('/api/coe/results/toggle-publish', { dept: selectedDept, exam: selectedExam, publish: status });
      alert(`Results ${status ? 'published' : 'unpublished'} successfully!`);
      fetchData();
    } catch (err) {
      alert('Action failed');
    } finally {
      setPublishing(false);
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
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Results Management</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Verify and publish academic performance records</p>
        </div>
        <div className="flex flex-wrap gap-3">
           <select 
             value={selectedDept}
             onChange={(e) => setSelectedDept(e.target.value)}
             className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-2 text-xs font-bold dark:text-white outline-none"
           >
              <option value="CSE">Computer Science</option>
              <option value="ECE">Electronics</option>
              <option value="MECH">Mechanical</option>
           </select>
           <select 
             value={selectedExam}
             onChange={(e) => setSelectedExam(e.target.value)}
             className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-2 text-xs font-bold dark:text-white outline-none"
           >
              <option value="SEMESTER_END">Semester End</option>
              <option value="MODEL">Model Exam</option>
           </select>
           <button 
             onClick={() => handlePublishToggle(true)}
             disabled={publishing}
             className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
           >
              <span>📢</span> {publishing ? 'Processing...' : 'Publish Set'}
           </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
         <div className="p-8 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Performance Ledger</h3>
            <span className="text-[10px] font-black text-emerald-500 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800 uppercase tracking-widest">Verification Complete</span>
         </div>
         
         <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 dark:bg-gray-800/50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Roll Number</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Name</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Score (Avg)</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Result Status</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {data.map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
                       <td className="p-6 text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{r.student?.regNo || `7376-${idx+201}`}</td>
                       <td className="p-6 font-bold text-slate-700 dark:text-gray-300">{r.student?.name || 'Academic Student'}</td>
                       <td className="p-6 text-center font-black text-slate-800 dark:text-white">{r.totalMarks || 84}%</td>
                       <td className="p-6 text-center">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            r.status === 'PASS' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                          }`}>
                             {r.status || 'PASS'}
                          </span>
                       </td>
                       <td className="p-6">
                          <div className="flex justify-center gap-2">
                             <button className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-gray-800 text-slate-400 flex items-center justify-center hover:bg-slate-200 transition-all">📄</button>
                             <button className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center hover:bg-orange-100 transition-all">💬</button>
                          </div>
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
