import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function COEPerformanceReports({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    setLoading(true);
    setError(null);
    setStudent(null);
    try {
      // Fetch specific student academic report
      const res = await api.get(`/api/coe/reports/student/${searchTerm}`);
      setStudent(res.data);
    } catch (err) {
      setError('Student not found or failed to fetch report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Grade Sheet Generator</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Generate official academic transcripts and performance reports</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm">
         <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
               <input 
                  type="text"
                  placeholder="Enter Student Registration Number (e.g., 7376...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl px-12 py-4 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-orange-500/10 transition-all"
               />
               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">👤</span>
            </div>
            <button type="submit" disabled={loading} className="px-10 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 transition-all disabled:opacity-50">
               {loading ? 'Searching...' : 'Search Record'}
            </button>
         </form>
         {error && <p className="mt-4 text-rose-600 text-xs font-bold px-4 italic">{error}</p>}
      </div>

      {/* Report View */}
      {student && (
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[3rem] p-10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 dark:border-gray-800 pb-10 mb-10 gap-6">
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-[2rem] flex items-center justify-center text-3xl font-black border-4 border-white dark:border-gray-800 shadow-xl">
                    {student.name?.charAt(0)}
                 </div>
                 <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{student.name}</h2>
                    <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{student.regNo} • {student.department?.name}</p>
                 </div>
              </div>
              <button className="px-8 py-4 bg-slate-900 dark:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2">
                 <span>🖨️</span> Print Official Transcript
              </button>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1 space-y-6">
                 <div className="p-6 bg-slate-50 dark:bg-gray-800/50 rounded-3xl border border-slate-100 dark:border-gray-700">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Current CGPA</p>
                    <p className="text-4xl font-black text-orange-600 mt-2">8.74</p>
                 </div>
                 <div className="p-6 bg-slate-50 dark:bg-gray-800/50 rounded-3xl border border-slate-100 dark:border-gray-700">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Credits</p>
                    <p className="text-4xl font-black text-blue-600 mt-2">128</p>
                 </div>
                 <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-800/30">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Standing</p>
                    <p className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-2 uppercase italic tracking-tight">First Class with Distinction</p>
                 </div>
              </div>

              <div className="lg:col-span-3">
                 <div className="overflow-hidden border border-slate-100 dark:border-gray-800 rounded-3xl bg-white dark:bg-gray-800/30">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="bg-slate-50 dark:bg-gray-800/50">
                             <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Course Code</th>
                             <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Subject Name</th>
                             <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Grade</th>
                             <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Result</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50 dark:divide-gray-800">
                          {[1,2,3,4,5,6].map(i => (
                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
                               <td className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">CS30{i}</td>
                               <td className="p-6 text-sm font-bold text-slate-800 dark:text-gray-200">Subject Name {i}</td>
                               <td className="p-6 text-center text-sm font-black text-orange-600">A+</td>
                               <td className="p-6 text-center">
                                  <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded uppercase">Pass</span>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        </div>
      )}

      {!student && !loading && (
        <div className="py-20 text-center bg-slate-50 dark:bg-gray-800/30 rounded-[3rem] border border-dashed border-slate-200 dark:border-gray-800">
           <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-3xl mx-auto shadow-sm mb-6">📄</div>
           <p className="text-slate-400 italic font-medium">Please enter a registration number above to generate the academic report.</p>
        </div>
      )}
    </div>
  );
}
