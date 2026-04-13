import React, { useState, useEffect } from 'react';

export default function AdminPerformance({ apiUrl, token }) {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview'); // Overview, Top Performers, At-Risk

  // Data states
  const [toppers, setToppers] = useState([]);
  const [atRisk, setAtRisk] = useState([]);
  const [subjectPassRates, setSubjectPassRates] = useState([]);

  useEffect(() => {
    // Simulated fetch of performance metrics
    setTimeout(() => {
        setToppers([
            { roll: '737622CS101', name: 'Alice Smith', cgpa: 9.8, rank: 1, trend: 'up' },
            { roll: '737622IT204', name: 'Bob Jones', cgpa: 9.5, rank: 2, trend: 'stable' },
            { roll: '737622EC055', name: 'Charlie Day', cgpa: 9.4, rank: 3, trend: 'up' },
        ]);
        setAtRisk([
            { roll: '737622ME089', name: 'John Doe', failCount: 3, cgpa: 4.2 },
            { roll: '737622EE112', name: 'Jane Smith', failCount: 2, cgpa: 4.8 },
        ]);
        setSubjectPassRates([
            { code: 'CS501', pass: 92, gradeDist: { A: 40, B: 30, C: 20, F: 10 } },
            { code: 'CS502', pass: 85, gradeDist: { A: 25, B: 40, C: 20, F: 15 } },
            { code: 'IT503', pass: 98, gradeDist: { A: 60, B: 30, C: 8, F: 2 } },
        ]);
        setIsLoading(false);
    }, 600);
  }, []);

  const handleNotifyParents = () => {
     alert("System Action: Automated Emails and SMS dispatched to parents of at-risk students.");
  };

  const exportExcel = () => {
     alert("Performance metrics exported to Excel successfully.");
  };

  if (isLoading) return <div className="py-20 flex justify-center"><div className="animate-spin h-10 w-10 border-b-2 border-slate-900 rounded-full"></div></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Marks & Performance</h1>
            <p className="text-slate-500 font-medium mt-1">Track CGPAs, analyze subject pass rates, and monitor at-risk students.</p>
         </div>
         <div className="flex gap-3">
             <button onClick={exportExcel} className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm flex items-center gap-2 transition"><span>📥</span> Export Excel</button>
             <button onClick={handleNotifyParents} className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-sm font-bold shadow-sm hover:bg-rose-100 flex items-center gap-2 transition"><span>⚠️</span> Alert Parents</button>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
          {['Overview', 'Rankings & Toppers', 'At-Risk Analysis'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm border ${activeTab === tab ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>{tab}</button>
          ))}
      </div>

      {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Internal vs External Comparison */}
              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
                  <h3 className="text-lg font-black text-slate-800 mb-6">Internal vs External Scoring Average</h3>
                  <div className="flex h-40 items-end gap-6 justify-center">
                      <div className="flex flex-col items-center gap-2 group">
                          <div className="w-16 h-28 bg-indigo-500 rounded-t-xl group-hover:bg-indigo-400 transition-colors"></div>
                          <span className="text-xs font-bold text-slate-500">Internal (78%)</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 group">
                          <div className="w-16 h-24 bg-blue-400 rounded-t-xl group-hover:bg-blue-300 transition-colors"></div>
                          <span className="text-xs font-bold text-slate-500">External (65%)</span>
                      </div>
                  </div>
              </div>

              {/* Subject Grade Distribution Pie Simulation */}
              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 w-full text-center md:text-left">
                     <h3 className="text-lg font-black text-slate-800 mb-2">Subject Grade Distribution</h3>
                     <p className="text-xs font-medium text-slate-500 mb-6">Analyzing {subjectPassRates[0].code} algorithmically.</p>
                     <ul className="space-y-2 text-sm font-bold text-slate-600">
                         <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Grade A (40%)</li>
                         <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Grade B (30%)</li>
                         <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Grade C (20%)</li>
                         <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-rose-500"></span> Fail (10%)</li>
                     </ul>
                  </div>
                  {/* Tailwind Conic Gradient for Pie Chart */}
                  <div className="w-40 h-40 rounded-full shadow-inner border border-slate-100" style={{background: `conic-gradient(#10b981 0% 40%, #3b82f6 40% 70%, #f59e0b 70% 90%, #f43f5e 90% 100%)`}}></div>
              </div>

              {/* Pass Rates Horizontal Bars */}
              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 md:col-span-2">
                  <h3 className="text-lg font-black text-slate-800 mb-6">Subject Pass Percentages</h3>
                  <div className="space-y-4">
                     {subjectPassRates.map((sub, i) => (
                         <div key={i} className="flex justify-between items-center gap-4">
                             <span className="font-bold text-slate-700 w-16">{sub.code}</span>
                             <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                                 <div className={`h-full rounded-full ${sub.pass > 85 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{width: `${sub.pass}%`}}></div>
                             </div>
                             <span className="font-black text-slate-800 w-12 text-right">{sub.pass}%</span>
                         </div>
                     ))}
                  </div>
              </div>
          </div>
      )}

      {activeTab === 'Rankings & Toppers' && (
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400"><tr><th className="px-6 py-4">Batch Rank</th><th className="px-6 py-4">Roll Target</th><th className="px-6 py-4">Name</th><th className="px-6 py-4 text-right">CGPA</th><th className="px-6 py-4 text-right">Trend</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                      {toppers.map((t, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition">
                              <td className="px-6 py-4 font-black"><span className={`px-2 py-1 rounded text-xs ${i===0?'bg-amber-100 text-amber-600':i===1?'bg-slate-200 text-slate-500':'bg-amber-50 text-amber-800'}`}>#{t.rank}</span></td>
                              <td className="px-6 py-4 font-bold text-blue-600">{t.roll}</td>
                              <td className="px-6 py-4 font-bold text-slate-800">{t.name}</td>
                              <td className="px-6 py-4 text-right"><span className="text-emerald-600 font-black text-lg bg-emerald-50 px-2 py-1 rounded-lg">{t.cgpa}</span></td>
                              <td className="px-6 py-4 text-right text-xs font-bold">{t.trend==='up' ? <span className="text-emerald-500">↑ Up</span> : <span className="text-slate-400">− Stable</span>}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      )}

      {activeTab === 'At-Risk Analysis' && (
          <div className="bg-white rounded-[2rem] border border-rose-200 shadow-sm overflow-hidden border-2">
              <div className="p-6 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
                  <div>
                      <h3 className="font-black text-rose-800 text-lg">Academic Defaulters</h3>
                      <p className="text-xs font-bold text-rose-500 tracking-widest uppercase mt-1">Failing 2 or more subjects</p>
                  </div>
                   <button onClick={handleNotifyParents} className="px-4 py-2 bg-rose-600 text-white rounded-lg font-bold shadow-md hover:bg-rose-700 text-sm border-2 border-rose-600">Notify Guardians Now</button>
              </div>
              <table className="w-full text-left">
                  <thead className="bg-white text-[10px] font-black uppercase text-slate-400 border-b border-slate-100"><tr><th className="px-6 py-4">Roll No</th><th className="px-6 py-4">Student Name</th><th className="px-6 py-4">Fail Count</th><th className="px-6 py-4 text-right">Current CGPA</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                      {atRisk.map((r, i) => (
                          <tr key={i} className="hover:bg-rose-50/50 transition">
                              <td className="px-6 py-4 font-bold text-slate-700">{r.roll}</td>
                              <td className="px-6 py-4 font-bold text-slate-800">{r.name}</td>
                              <td className="px-6 py-4"><span className="bg-rose-100 text-rose-600 font-black px-2.5 py-1 rounded border border-rose-200 text-xs">{r.failCount} Subjects</span></td>
                              <td className="px-6 py-4 text-right font-black text-slate-700">{r.cgpa}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      )}

    </div>
  );
}
