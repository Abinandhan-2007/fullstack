import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function PlacementStudentTrack({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ minGpa: '', skills: '', dept: 'ALL' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/placement/students');
      setData(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = data.filter(s => {
    const matchesGpa = filters.minGpa === '' || s.gpa >= parseFloat(filters.minGpa);
    const matchesDept = filters.dept === 'ALL' || s.dept === filters.dept;
    return matchesGpa && matchesDept;
  });

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic">Talent Acquisition Matrix</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Filter and identify eligible candidates for institutional recruitment drives</p>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm flex flex-wrap gap-6 items-end">
         <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Technical Skill Tags</label>
            <input type="text" placeholder="e.g. React, Python, AWS..." value={filters.skills} onChange={(e) => setFilters({...filters, skills: e.target.value})} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-bold dark:text-white outline-none" />
         </div>
         <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Min. CGPA</label>
            <input type="number" step="0.1" placeholder="8.0" value={filters.minGpa} onChange={(e) => setFilters({...filters, minGpa: e.target.value})} className="w-24 bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-bold dark:text-white outline-none" />
         </div>
         <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Department</label>
            <select value={filters.dept} onChange={(e) => setFilters({...filters, dept: e.target.value})} className="bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-bold dark:text-white outline-none">
               <option value="ALL">All Departments</option>
               <option value="CSE">CSE</option>
               <option value="IT">IT</option>
               <option value="ECE">ECE</option>
            </select>
         </div>
         <button className="px-8 py-3.5 bg-emerald-600 text-white font-black text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-emerald-500/20">Generate List</button>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic underline decoration-emerald-500">Candidate Pipeline</h3>
            <div className="flex gap-3">
               <button className="px-4 py-2 bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 text-[9px] font-black uppercase tracking-widest rounded-lg">Export CSV</button>
               <button className="px-4 py-2 bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 text-[9px] font-black uppercase tracking-widest rounded-lg">Export PDF</button>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 dark:bg-gray-800/50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Name</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">CGPA</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Backlogs</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {filtered.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors group">
                       <td className="p-6">
                          <p className="text-sm font-black text-slate-800 dark:text-gray-200 uppercase tracking-tight">{s.name}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase italic mt-1">{s.regNo} • {s.dept}</p>
                       </td>
                       <td className="p-6">
                          <span className="text-sm font-black text-emerald-600 italic underline decoration-emerald-200">{s.gpa}</span>
                       </td>
                       <td className="p-6 text-center text-xs font-black text-rose-500">{s.backlogs || 0}</td>
                       <td className="p-6 text-center">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            s.placedStatus === 'PLACED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                          }`}>
                             {s.placedStatus || 'UNPLACED'}
                          </span>
                       </td>
                       <td className="p-6 text-right">
                          <button className="text-[9px] font-black text-emerald-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">View Profile →</button>
                       </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan="5" className="p-20 text-center text-slate-300 italic font-medium">No candidates matching the criteria were found in the registry.</td></tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
