import React, { useState, useEffect } from 'react';

export default function AdminAttendance({ apiUrl, token }) {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Dashboard states
  const [isUpdating, setIsUpdating] = useState(false);
  const [deptRanking, setDeptRanking] = useState([]);
  const [facultySubmission, setFacultySubmission] = useState([]);
  const [defaulters, setDefaulters] = useState([]);
  
  // Heatmap & Audit Log
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    // Simulated fetch of rich attendance analytics
    const fetchAnalytics = () => {
        setIsUpdating(true);
        setTimeout(() => {
            setDeptRanking([
                { dept: 'IT', avg: 91.2 }, { dept: 'CSE', avg: 89.4 }, { dept: 'ECE', avg: 86.1 }, { dept: 'EEE', avg: 84.8 }, { dept: 'MECH', avg: 82.5 }
            ]);
            setFacultySubmission([
                { name: 'Dr. Alan (CSE)', rate: 100 }, { name: 'Prof. Sarah (IT)', rate: 95 }, { name: 'Dr. Hopper (ECE)', rate: 80 }, { name: 'Dr. Ford (ME)', rate: 65 }
            ]);
            setDefaulters([
                { roll: '737622CS101', name: 'Rahul K.', att: 45.2 }, { roll: '737622EC055', name: 'Priya S.', att: 52.8 }, { roll: '737622IT204', name: 'Amit P.', att: 61.5 }, { roll: '737622EE112', name: 'Kavya N.', att: 71.2 }
            ]);
            setAuditLogs([
                { time: new Date(Date.now()-1000*60*5).toLocaleTimeString(), action: 'Marked CSE Sem 4', user: 'Dr. Alan', type: 'Normal' },
                { time: new Date(Date.now()-1000*60*45).toLocaleTimeString(), action: 'Overrode Roll 101 to Present', user: 'Admin', type: 'Override', reason: 'Medical Leave Approved' },
                { time: new Date(Date.now()-1000*60*120).toLocaleTimeString(), action: 'Marked MECH Sem 6', user: 'Dr. Ford', type: 'Normal' },
            ]);
            setLastUpdate(new Date());
            setIsUpdating(false);
        }, 800);
    };

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000); // 30-second live updates
    return () => clearInterval(interval);
  }, []);

  const handleSendWarnings = () => {
      alert("System Action: Automated Warning Emails & SMS dispatched to 4 defaulters below 75%.");
  };

  const handleExportCSV = () => {
      const csv = "data:text/csv;charset=utf-8,Roll,Name,Attendance%\n" + defaulters.map(d => `${d.roll},${d.name},${d.att}`).join("\n");
      const a = document.createElement('a'); a.href = encodeURI(csv); a.download = "defaulters_report.csv"; a.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-blue-500 to-indigo-500"></div>
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">Attendance Monitoring <span className="bg-rose-100 text-rose-600 px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-widest border border-rose-200 flex items-center gap-1"><span className={`w-1.5 h-1.5 bg-rose-500 rounded-full ${isUpdating?'':'animate-pulse'}`}></span> Live</span></h1>
            <p className="text-slate-500 font-medium mt-1">Global view of campus attendance statistics.</p>
         </div>
         <div className="flex gap-3">
            <button onClick={handleExportCSV} className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition flex gap-2 items-center"><span>📉</span> Export Report</button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Center Main Panels */}
         <div className="lg:col-span-2 space-y-6">
             
             {/* Department Ranking & Submission Rates */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Dept Rank */}
                 <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6">
                     <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Department Ranking (Avg %)</h3>
                     <div className="space-y-3">
                         {deptRanking.map((d, i) => (
                             <div key={i} className="flex items-center gap-3">
                                <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black ${i===0?'bg-amber-100 text-amber-600':i===1?'bg-slate-100 text-slate-500':i===2?'bg-amber-50 text-amber-800':'bg-transparent text-slate-400'}`}>{i+1}</span>
                                <span className="font-bold text-sm text-slate-700 w-12">{d.dept}</span>
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{width:`${d.avg}%`}}></div></div>
                                <span className="text-xs font-black text-slate-800">{d.avg}%</span>
                             </div>
                         ))}
                     </div>
                 </div>

                 {/* Faculty Rate */}
                 <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6">
                     <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Faculty Submission Rate</h3>
                     <div className="space-y-3">
                         {facultySubmission.map((f, i) => (
                             <div key={i} className="flex justify-between items-center bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                                <span className="text-xs font-bold text-slate-700">{f.name}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black ${f.rate>90?'bg-emerald-100 text-emerald-600':f.rate>75?'bg-blue-100 text-blue-600':'bg-rose-100 text-rose-600'}`}>{f.rate}% Submitted</span>
                             </div>
                         ))}
                     </div>
                 </div>
             </div>

             {/* Attendance Heatmap Simulation */}
             <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
                 <div className="flex justify-between items-end mb-6">
                    <h3 className="text-lg font-black text-slate-800">Campus Attendance Heatmap</h3>
                    <div className="flex gap-2 items-center text-[10px] font-bold text-slate-400 uppercase">
                       <span>Low</span>
                       <div className="w-3 h-3 rounded bg-rose-200"></div><div className="w-3 h-3 rounded bg-amber-200"></div><div className="w-3 h-3 rounded bg-emerald-300"></div><div className="w-3 h-3 rounded bg-emerald-500"></div>
                       <span>High</span>
                    </div>
                 </div>
                 <div className="flex flex-wrap gap-1 md:gap-2">
                     {/* 30 days dummy heatmap generation */}
                     {Array.from({length: 60}).map((_, i) => {
                         const val = Math.random();
                         const color = val > 0.8 ? 'bg-emerald-500' : val > 0.4 ? 'bg-emerald-300' : val > 0.1 ? 'bg-amber-200' : 'bg-rose-200';
                         return <div key={i} className={`w-4 h-4 md:w-6 md:h-6 rounded-sm md:rounded ${color} hover:ring-2 ring-slate-900 cursor-pointer transition-all`} title={`Day ${i+1}: ${Math.floor(val*100)}%`}></div>
                     })}
                 </div>
             </div>
         </div>

         {/* Right Action Column */}
         <div className="space-y-6">
             
             {/* Defaulter Actions */}
             <div className="bg-white rounded-[2rem] border border-rose-200 shadow-sm overflow-hidden border-2">
                 <div className="p-6 border-b border-rose-100 bg-rose-50 flex items-center justify-between">
                    <div>
                        <h3 className="font-black text-rose-800">Critical Alerts</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-rose-500">{defaulters.length} Students below 75%</p>
                    </div>
                    <span className="text-3xl">⚠️</span>
                 </div>
                 <div className="p-4">
                     {defaulters.map((d, i) => (
                         <div key={i} className="flex justify-between items-center border-b border-slate-50 py-2 last:border-0 hover:bg-slate-50 px-2 rounded-lg transition text-sm">
                             <div className="flex flex-col"><span className="font-bold text-slate-800">{d.name}</span><span className="text-[10px] font-black tracking-widest text-slate-400">{d.roll}</span></div>
                             <span className="font-black text-rose-600">{d.att}%</span>
                         </div>
                     ))}
                 </div>
             </div>

             {/* Audit Log */}
             <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6">
                 <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4 flex items-center gap-2"><span>🔍</span> Live Audit Trail</h3>
                 <div className="space-y-4">
                     {auditLogs.map((log, i) => (
                         <div key={i} className="border-l-2 border-slate-200 pl-4 relative">
                             <span className={`absolute -left-[5px] top-1 w-2 h-2 rounded-full ${log.type==='Override'?'bg-amber-500':'bg-slate-300'}`}></span>
                             <p className="text-xs font-bold text-slate-800 leading-tight">{log.action}</p>
                             <p className="text-[10px] font-medium text-slate-500 mt-1">By {log.user} at {log.time}</p>
                             {log.reason && <p className="text-[10px] font-bold text-amber-700 bg-amber-50 p-1 rounded mt-1 border border-amber-100">Reason: {log.reason}</p>}
                         </div>
                     ))}
                 </div>
                 <button className="w-full mt-4 py-2 border border-slate-200 text-slate-500 text-xs font-bold rounded-lg hover:bg-slate-50">View Full Log</button>
             </div>

         </div>
      </div>

    </div>
  );
}
