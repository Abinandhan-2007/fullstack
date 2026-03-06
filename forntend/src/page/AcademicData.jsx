import React, { useState, useEffect } from 'react';

export default function AcademicData({ user, onViewSemester }) {
  const [academicInfo, setAcademicInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // The roll number to fetch. In a real app, you get this from the 'user' object.
  const studentRollNo = "7376241CS106"; 

  useEffect(() => {
    // Fetch data from your Spring Boot Backend
    fetch(`http://localhost:8080/api/academic/${studentRollNo}`)
      .then(res => res.json())
      .then(data => {
        setAcademicInfo(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching from Spring Boot:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-slate-500 font-bold gap-4 animate-in fade-in">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        Syncing with Institution Database...
      </div>
    );
  }

  if (!academicInfo) {
    return <div className="text-center text-red-500 font-bold mt-10">Student Record Not Found in Database.</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in duration-500 ease-out pb-10 font-sans">
      
      {/* 1. PROFESSIONAL HEADER (Dynamic) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white border border-slate-200 p-5 md:p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight mb-1">
            Academic Transcript
          </h2>
          <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            Official Performance Audit
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-50 p-2 pr-6 rounded-full border border-slate-200">
          <img 
            src={user?.picture || `https://ui-avatars.com/api/?name=${academicInfo.name}&background=f1f5f9&color=0f172a`} 
            alt="Profile" 
            className="w-10 h-10 rounded-full border border-slate-300 object-cover shadow-sm"
          />
          <div>
            <p className="text-sm font-bold text-slate-800">{academicInfo.name}</p>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{academicInfo.rollNo}</p>
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-8">
        
        {/* Main Hero Card: CGPA */}
        <div className="md:col-span-12 lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-6 border-b border-slate-100 pb-2">
            Aggregate Performance
          </p>
          
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 36 36">
                <path className="text-slate-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-blue-600 transition-all duration-1000 ease-out" strokeDasharray={`${(academicInfo.cgpa / 10) * 100}, 100`} strokeLinecap="round" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center mt-1">
                <span className="text-xl font-bold tracking-tight text-slate-800">{academicInfo.cgpa.toFixed(2)}</span>
                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">CGPA</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Department</p>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{academicInfo.department}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Current Semester</p>
                <p className="text-sm font-bold text-blue-600 mt-0.5">Semester {academicInfo.currentSemester}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="md:col-span-12 lg:col-span-7 grid grid-cols-3 gap-5">
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Total Credits</p>
            <h3 className="text-4xl font-bold tracking-tight text-slate-800">{academicInfo.totalCredits}</h3>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Arrears</p>
            <h3 className={`text-4xl font-bold tracking-tight ${academicInfo.arrearCount > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
              {academicInfo.arrearCount}
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Fees Due</p>
            <h3 className="text-3xl font-bold tracking-tight text-slate-800">
              {academicInfo.feesDue === '0' || !academicInfo.feesDue ? '-' : `₹${academicInfo.feesDue}`}
            </h3>
          </div>

        </div>
      </div>

      {/* 3. DYNAMIC CHART SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 mb-8">
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-800">Performance Trajectory</h3>
          <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-md">10.0 Scale</span>
        </div>
        
        <div className="relative h-56 w-full flex items-end justify-around px-2 sm:px-12 pb-6 pt-12">
          {/* Background Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pb-6 pt-12 pointer-events-none z-0">
            <div className="w-full border-t border-dashed border-slate-200"><span className="absolute -translate-y-1/2 bg-white px-1 text-[10px] font-semibold text-slate-400">10.0</span></div>
            <div className="w-full border-t border-dashed border-slate-200"><span className="absolute -translate-y-1/2 bg-white px-1 text-[10px] font-semibold text-slate-400">8.0</span></div>
            <div className="w-full border-t border-dashed border-slate-200"><span className="absolute -translate-y-1/2 bg-white px-1 text-[10px] font-semibold text-slate-400">6.0</span></div>
            <div className="w-full border-t border-slate-200"></div>
          </div>

          {/* DYNAMIC BARS MAPPED FROM SPRING BOOT */}
          {academicInfo.semesterRecords && academicInfo.semesterRecords.map((sem, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center flex-1 group h-full justify-end cursor-pointer" onClick={() => onViewSemester(sem.semesterName)}>
              <div className="absolute -top-9 bg-slate-800 text-white p-1 px-2.5 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 shadow-sm z-20 flex flex-col items-center pointer-events-none">
                <span className="text-xs font-bold">{sem.sgpa.toFixed(2)}</span>
                <div className="absolute -bottom-1 w-2 h-2 bg-slate-800 rotate-45"></div>
              </div>
              
              <div className="w-full max-w-[3rem] bg-slate-50 rounded-t-md h-full flex items-end overflow-hidden border border-b-0 border-slate-100 shadow-inner">
                <div 
                  className="w-full bg-blue-600 group-hover:bg-blue-500 transition-all duration-700 ease-out rounded-t-sm"
                  style={{ height: `${(sem.sgpa / 10) * 100}%` }}
                ></div>
              </div>
              
              <span className="text-[10px] font-semibold text-slate-500 mt-3 uppercase tracking-wider group-hover:text-blue-600 transition-colors">
                Sem {sem.semesterName}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. ENHANCED INSTITUTIONAL DATA TABLE (CLICKABLE ROWS) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="text-sm font-bold text-slate-800">Detailed Academic Ledger</h3>
          <button className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors border border-blue-100">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Download Official PDF
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Semester</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Subjects<br/><span className="text-[9px] font-medium text-slate-400">Registered</span></th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Cleared</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Arrears</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Credits<br/><span className="text-[9px] font-medium text-slate-400">Earned</span></th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">SGPA</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Maps through dynamic backend data and reverses it to show newest semester first */}
              {academicInfo.semesterRecords && [...academicInfo.semesterRecords].reverse().map((sem, index) => {
                
                // Fallback variables just in case your backend doesn't supply these fields yet
                const subjectsCount = sem.courses || 6;
                const clearedCount = sem.cleared || 6;
                const arrearsCount = sem.arrears || 0;
                const creditsEarned = sem.credits || 22;
                const statusStr = sem.status || 'Verified';

                return (
                  <tr 
                    key={index} 
                    onClick={() => onViewSemester(sem.semesterName)} // <--- MAKES THE ROW CLICKABLE
                    className="hover:bg-blue-50/50 transition-colors cursor-pointer group" // <--- ADDS HOVER EFFECT
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                        Semester {sem.semesterName}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-slate-700 font-medium">{subjectsCount}</span>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-emerald-600 font-semibold">{clearedCount}</span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className={`text-sm font-semibold ${arrearsCount > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                        {arrearsCount}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-slate-800 font-semibold bg-slate-100 px-2 py-1 rounded border border-slate-200">
                        {creditsEarned}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-bold text-blue-600">{sem.sgpa.toFixed(2)}</span>
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase ${
                        statusStr === 'Verified' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {statusStr}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}