import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import Chart from 'chart.js/auto';
import { useTheme } from '../../context/ThemeContext';

export default function ParentMarks({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const radarRef = useRef(null);
  const radarInstance = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/parent/marks');
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load academic records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredMarks = data.filter(m => m.semester === selectedSemester);

  useEffect(() => {
    if (filteredMarks.length === 0 || !radarRef.current) return;
    if (radarInstance.current) radarInstance.current.destroy();

    radarInstance.current = new Chart(radarRef.current, {
      type: 'radar',
      data: {
        labels: filteredMarks.map(m => m.course?.courseCode || 'SUB'),
        datasets: [{
          label: 'Student Performance',
          data: filteredMarks.map(m => m.marksObtained),
          backgroundColor: 'rgba(244, 63, 94, 0.2)',
          borderColor: '#f43f5e',
          pointBackgroundColor: '#f43f5e',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#f43f5e'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            angleLines: { color: isDark ? '#374151' : '#e2e8f0' },
            grid: { color: isDark ? '#374151' : '#e2e8f0' },
            pointLabels: { color: '#94a3b8', font: { weight: 'bold', size: 10 } },
            ticks: { display: false },
            suggestedMin: 0,
            suggestedMax: 100
          }
        }
      }
    });

    return () => { if (radarInstance.current) radarInstance.current.destroy(); };
  }, [filteredMarks, isDark]);

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic">Academic Performance Ledger</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Comprehensive track record of semester examinations and internal assessments</p>
        </div>
        <div className="flex gap-2">
           {[1,2,3,4,5].map(sem => (
             <button 
               key={sem}
               onClick={() => setSelectedSemester(sem)}
               className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
                 selectedSemester === sem 
                 ? 'bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-500/20' 
                 : 'bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-800 text-slate-400'
               }`}
             >
               SEM {sem}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            <div className="p-8 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center">
               <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic underline decoration-rose-500">Grade Sheet</h3>
               <span className="text-[10px] font-black text-emerald-500 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800 uppercase tracking-widest leading-none">Verified Official</span>
            </div>
            <div className="overflow-x-auto flex-1">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50 dark:bg-gray-800/50">
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Course Code</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Subject Name</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Marks</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Grade</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                     {filteredMarks.map((m, idx) => (
                       <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
                          <td className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest italic">{m.course?.courseCode}</td>
                          <td className="p-6 font-bold text-slate-700 dark:text-gray-300 text-sm italic">{m.course?.name}</td>
                          <td className="p-6 text-center font-black text-slate-900 dark:text-white">{m.marksObtained} / 100</td>
                          <td className="p-6 text-center">
                             <span className="px-3 py-1 rounded-lg text-xs font-black text-rose-600 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 uppercase italic">
                                {m.grade || 'A+'}
                             </span>
                          </td>
                       </tr>
                     ))}
                     {filteredMarks.length === 0 && (
                       <tr><td colSpan="4" className="p-20 text-center text-slate-300 italic font-medium">Results for this semester are not yet finalized.</td></tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         <div className="lg:col-span-1 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-10 shadow-sm flex flex-col items-center h-full">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-10 w-full italic">Knowledge Radar</h3>
            <div className="relative flex-1 w-full flex items-center justify-center">
               <canvas ref={radarRef}></canvas>
            </div>
            <p className="mt-10 text-[10px] font-bold text-slate-400 text-center leading-relaxed uppercase tracking-widest italic">
               Visualization of academic strength across different technical domains.
            </p>
         </div>
      </div>
    </div>
  );
}
