import React, { useState } from 'react';

export default function AdminReports() {
  const [reportType, setReportType] = useState('Student Strength');
  const [filterDept, setFilterDept] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const reportOptions = [
      { name: 'Student Strength', icon: '🎓', desc: 'Department-wise enrollment counts' },
      { name: 'Attendance Summary', icon: '📊', desc: 'Aggregate class attendance percentages' },
      { name: 'Fee Collection', icon: '💰', desc: 'Pending vs Paid financial overview' },
      { name: 'Placement Statistics', icon: '💼', desc: 'Recruiting data and package metrics' },
      { name: 'Exam Results', icon: '📝', desc: 'CGPA distribution and pass/fail rates' },
      { name: 'Staff Workload', icon: '👨‍🏫', desc: 'Faculty weekly hours breakdown' },
  ];

  const handleGenerate = () => {
      // Create a mock rich CSV string
      const csv = `data:text/csv;charset=utf-8,Mock_Data,Mock_Value\nReport_Type,${reportType}\nDepartment,${filterDept}\nGenerated,${new Date().toLocaleString()}`;
      const a = document.createElement('a');
      a.href = encodeURI(csv);
      a.download = `${reportType.replace(' ','_')}_Report.csv`;
      a.click();
  };

  const handleSchedule = () => {
      alert(`Automated weekly schedule configured for: ${reportType}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Reports Center</h1>
            <p className="text-slate-500 font-medium mt-1">Generate deep administrative insights and export data as CSV.</p>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Report Selection */}
          <div className="w-full lg:w-96 shrink-0 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Select Report Type</h3>
              <div className="space-y-3">
                  {reportOptions.map(r => (
                      <div key={r.name} onClick={() => setReportType(r.name)} className={`p-4 rounded-xl border cursor-pointer transition-all ${reportType === r.name ? 'bg-indigo-50 border-indigo-200 shadow-inner' : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'}`}>
                          <div className="flex items-center gap-3">
                              <span className="text-xl">{r.icon}</span>
                              <div>
                                 <h4 className={`text-sm font-black ${reportType===r.name ? 'text-indigo-800' : 'text-slate-700'}`}>{r.name}</h4>
                                 <p className="text-[10px] font-medium text-slate-500 mt-0.5 leading-tight">{r.desc}</p>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* Configuration Form */}
          <div className="flex-1 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                  <div className="border-b border-slate-100 pb-6 mb-6">
                     <h2 className="text-2xl font-black text-slate-800">{reportType} Report</h2>
                     <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Configuration Matrix</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                         <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Target Department</label>
                         <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 cursor-pointer shadow-sm">
                             <option value="All">All Departments (Campus Wide)</option>
                             <option value="CSE">Computer Science (CSE)</option>
                             <option value="IT">Information Technology (IT)</option>
                             <option value="ECE">Electronics (ECE)</option>
                         </select>
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Start Date Range</label>
                         <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-bold text-slate-500 outline-none focus:border-indigo-500 shadow-sm" />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">End Date Range</label>
                         <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-bold text-slate-500 outline-none focus:border-indigo-500 shadow-sm" />
                      </div>
                  </div>
              </div>

              <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                  <button onClick={handleGenerate} className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-black shadow-lg hover:bg-slate-800 transition shadow-slate-900/20 text-sm flex justify-center items-center gap-2"><span>📥</span> Generate & Download CSV</button>
                  <button onClick={handleSchedule} className="flex-1 py-4 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl font-black shadow-sm hover:bg-indigo-100 transition text-sm flex justify-center items-center gap-2"><span>⏱️</span> Schedule Weekly Auto-Export</button>
              </div>
          </div>

      </div>
    </div>
  );
}
