import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import Chart from 'chart.js/auto';
import { useTheme } from '../../context/ThemeContext';

export default function COEArrearAnalysis({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const subjectChartRef = useRef(null);
  const subjectChartInstance = useRef(null);
  const deptChartRef = useRef(null);
  const deptChartInstance = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mocked arrear analysis data
      setData({
        topArrearSubjects: [
          { subject: 'Maths II', count: 145 },
          { subject: 'Circuit Theory', count: 98 },
          { subject: 'Data Struct', count: 82 },
          { subject: 'Dynamics', count: 75 },
          { subject: 'Solid Mech', count: 62 }
        ],
        deptArrears: [
          { dept: 'CSE', count: 120 },
          { dept: 'ECE', count: 185 },
          { dept: 'MECH', count: 240 },
          { dept: 'CIVIL', count: 160 }
        ],
        multipleArrears: [
          { name: 'Rajesh Kumar', regNo: '7376...102', count: 4, dept: 'MECH' },
          { name: 'Priya S', regNo: '7376...205', count: 3, dept: 'CSE' },
          { name: 'Suresh V', regNo: '7376...408', count: 3, dept: 'ECE' }
        ]
      });
    } catch (err) {
      setError(err.message || 'Failed to load arrear analysis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!data) return;

    // Subject Arrears Bar Chart
    if (subjectChartRef.current) {
      if (subjectChartInstance.current) subjectChartInstance.current.destroy();
      subjectChartInstance.current = new Chart(subjectChartRef.current, {
        type: 'bar',
        data: {
          labels: data.topArrearSubjects.map(s => s.subject),
          datasets: [{
            label: 'RA Students Count',
            data: data.topArrearSubjects.map(s => s.count),
            backgroundColor: '#f43f5e',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { grid: { color: isDark ? '#1f2937' : '#f1f5f9' }, ticks: { color: '#94a3b8' } },
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
          }
        }
      });
    }

    // Dept Arrears Bar Chart
    if (deptChartRef.current) {
      if (deptChartInstance.current) deptChartInstance.current.destroy();
      deptChartInstance.current = new Chart(deptChartRef.current, {
        type: 'bar',
        data: {
          labels: data.deptArrears.map(d => d.dept),
          datasets: [{
            label: 'Total RA',
            data: data.deptArrears.map(d => d.count),
            backgroundColor: '#f97316',
            borderRadius: 6
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: isDark ? '#1f2937' : '#f1f5f9' }, ticks: { color: '#94a3b8' } },
            y: { grid: { display: false }, ticks: { color: '#94a3b8' } }
          }
        }
      });
    }

    return () => {
      if (subjectChartInstance.current) subjectChartInstance.current.destroy();
      if (deptChartInstance.current) deptChartInstance.current.destroy();
    };
  }, [data, isDark]);

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-80 bg-slate-200 dark:bg-gray-800 rounded-3xl"></div>
        <div className="h-80 bg-slate-200 dark:bg-gray-800 rounded-3xl"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic">Arrear & Re-Appearance Analysis</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Identifying critical failure points and student support needs</p>
        </div>
        <button className="px-6 py-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-black text-[10px] uppercase tracking-widest rounded-xl border border-rose-100 dark:border-rose-800">
           Download Red-Zone Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Failure Subjects */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm h-96 flex flex-col">
          <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-6">Critical Subjects (High RA Count)</h3>
          <div className="relative flex-1"><canvas ref={subjectChartRef}></canvas></div>
        </div>

        {/* Dept RA Comparison */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm h-96 flex flex-col">
          <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-6">Department-wise RA Load</h3>
          <div className="relative flex-1"><canvas ref={deptChartRef}></canvas></div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
         <div className="p-8 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Multiple Arrear Students</h3>
            <span className="text-[10px] font-black text-rose-500 px-3 py-1 bg-rose-50 dark:bg-rose-900/20 rounded-lg border border-rose-100 dark:border-rose-800 uppercase tracking-widest">Action Required</span>
         </div>
         <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 dark:bg-gray-800/50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Name</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Registration No</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Department</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Active RA Count</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Intervention</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {data.multipleArrears.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
                       <td className="p-6 font-bold text-slate-800 dark:text-gray-200">{s.name}</td>
                       <td className="p-6 text-xs font-black text-slate-400 uppercase tracking-tight">{s.regNo}</td>
                       <td className="p-6 text-xs font-bold text-slate-500">{s.dept}</td>
                       <td className="p-6 text-center">
                          <span className="px-3 py-1 bg-rose-600 text-white text-xs font-black rounded-lg shadow-lg shadow-rose-500/20">
                             {s.count} Subjects
                          </span>
                       </td>
                       <td className="p-6 text-center">
                          <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                             Notify Mentor →
                          </button>
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
