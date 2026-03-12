import React from 'react';

const AcademicData = () => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex justify-between items-end mb-8">
      <div>
        <h2 className="text-4xl font-black italic tracking-tighter uppercase">Academic Ledger</h2>
        <p className="text-slate-500 font-medium">Semester-wise performance audit</p>
      </div>
      <div className="bg-blue-600 text-white p-4 rounded-2xl text-center shadow-lg">
        <p className="text-[10px] uppercase font-bold tracking-widest opacity-80">Aggregate CGPA</p>
        <p className="text-3xl font-black">8.92</p>
      </div>
    </div>
    
    <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="p-6 text-xs uppercase tracking-widest text-slate-400">Semester</th>
            <th className="p-6 text-xs uppercase tracking-widest text-slate-400">GPA</th>
            <th className="p-6 text-xs uppercase tracking-widest text-slate-400">Credits</th>
            <th className="p-6 text-xs uppercase tracking-widest text-slate-400">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium">
          {['Sem 1', 'Sem 2', 'Sem 3'].map((sem, i) => (
            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
              <td className="p-6 text-slate-900">{sem}</td>
              <td className="p-6 text-blue-600">8.{5 + i}</td>
              <td className="p-6">24</td>
              <td className="p-6"><span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs">PASSED</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
export default AcademicData;