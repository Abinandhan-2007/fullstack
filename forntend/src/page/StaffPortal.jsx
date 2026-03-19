import React, { useState, useEffect } from 'react';

export default function StaffPortal({ handleLogout, apiUrl }) {
  const [dbStaff, setDbStaff] = useState([]);
  const [allMappings, setAllMappings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- TESTING/AUTH STATE ---
  // In a real app, this would come from the logged-in user's session token
  const [currentStaffId, setCurrentStaffId] = useState(''); 

  // --- ATTENDANCE STATES ---
  const [activeSession, setActiveSession] = useState(null);
  const [attendanceRecord, setAttendanceRecord] = useState({}); // Stores { rollNumber: "Present" | "Absent" }
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const fetchStaffData = async () => {
      setIsLoading(true);
      try {
        const [staffRes, timetableRes] = await Promise.all([
          fetch(`${apiUrl}/api/host/all-staff`).catch(() => null),
          fetch(`${apiUrl}/api/host/timetable`).catch(() => null)
        ]);

        if (staffRes?.ok) {
          const staffData = await staffRes.json();
          setDbStaff(staffData);
          if (staffData.length > 0) setCurrentStaffId(String(staffData[0].id)); // Default to first staff member
        }
        
        if (timetableRes?.ok) {
          setAllMappings(await timetableRes.json());
        }
      } catch (error) {
        console.error("Failed to fetch staff data", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (apiUrl) fetchStaffData();
  }, [apiUrl]);

  // Filter mappings to show ONLY the classes assigned to the currently "logged in" staff member
  const mySessions = allMappings.filter(m => String(m.faculty) === String(currentStaffId));

  // --- ATTENDANCE LOGIC ---
  const startAttendance = (session) => {
    let seatData = [];
    try {
      seatData = typeof session.seatAllocation === 'string' ? JSON.parse(session.seatAllocation) : session.seatAllocation;
    } catch(e) {}

    // Initialize all mapped students as "Present" by default
    const initialRecord = {};
    if (Array.isArray(seatData)) {
      seatData.forEach(seat => {
        if (seat.roll) initialRecord[seat.roll] = "Present";
      });
    }

    setAttendanceRecord(initialRecord);
    setActiveSession({ ...session, seatAllocation: seatData });
    setSubmitStatus(null);
  };

  const toggleAttendance = (roll) => {
    if (!roll) return; // Do nothing if it's an empty seat
    setAttendanceRecord(prev => ({
      ...prev,
      [roll]: prev[roll] === "Present" ? "Absent" : "Present"
    }));
  };

  const submitAttendance = async () => {
    // This is the payload you will send to your Spring Boot backend!
    const payload = {
      sessionId: activeSession.id,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      subjectCode: activeSession.subjectCode,
      facultyId: currentStaffId,
      records: Object.keys(attendanceRecord).map(roll => ({
        rollNumber: roll,
        status: attendanceRecord[roll]
      }))
    };

    setSubmitStatus("Submitting...");

    try {
      // TODO: Create this endpoint in your Spring Boot backend later!
      /*
      const response = await fetch(`${apiUrl}/api/host/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Failed to save");
      */
      
      // Simulating a successful network request
      setTimeout(() => {
        setSubmitStatus("Success");
        setTimeout(() => {
          setActiveSession(null);
          setSubmitStatus(null);
        }, 1500); // Close modal automatically after success
      }, 800);

    } catch (err) {
      console.error(err);
      setSubmitStatus("Error");
    }
  };

  // --- GRID RENDER HELPERS ---
  const getGridMatrix = (seatData) => {
    if (!Array.isArray(seatData) || seatData.length === 0) return { rows: [], cols: [] };
    try {
      const usedCols = [...new Set(seatData.map(s => { const m = s?.seat?.match(/[A-Z]+/); return m ? m[0] : 'A'; }))].sort();
      const usedRows = [...new Set(seatData.map(s => { const m = s?.seat?.match(/\d+/); return m ? parseInt(m[0], 10) : 1; }))].sort((a,b)=>a-b);
      return { rows: usedRows, cols: usedCols };
    } catch (e) { return { rows: [], cols: [] }; }
  };

  const presentCount = Object.values(attendanceRecord).filter(status => status === "Present").length;
  const absentCount = Object.values(attendanceRecord).filter(status => status === "Absent").length;
  const totalCount = presentCount + absentCount;

  const currentStaffName = dbStaff.find(s => String(s.id) === String(currentStaffId))?.name || "Staff Member";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-inner">SP</div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-tight">Faculty<span className="text-indigo-600 font-normal">Portal</span></h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attendance Manager</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {/* SIMULATED LOGIN DROPDOWN */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="text-xs font-bold text-slate-500">View as:</span>
            <select 
              className="bg-transparent text-sm font-bold text-indigo-600 outline-none cursor-pointer"
              value={currentStaffId}
              onChange={(e) => setCurrentStaffId(e.target.value)}
            >
              {dbStaff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
          <button onClick={handleLogout} className="text-rose-500 font-bold text-sm hover:underline transition duration-150">Sign out</button>
        </div>
      </header>

      {/* MAIN DASHBOARD */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back, {currentStaffName}</h2>
          <p className="text-slate-500 font-medium mt-1">Here is your teaching schedule for today. Select a class to mark attendance.</p>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-slate-400 font-bold animate-pulse">Loading Schedule...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mySessions.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-white rounded-[2rem] border border-slate-200 border-dashed">
                <div className="text-5xl mb-4">☕</div>
                <h3 className="text-xl font-bold text-slate-700">No classes scheduled</h3>
                <p className="text-slate-400 font-medium">You have a free day today! No sessions have been mapped to you.</p>
              </div>
            ) : (
              mySessions.map((session, idx) => (
                <div key={idx} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition duration-150">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-indigo-50 text-indigo-700 font-black text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md border border-indigo-100">
                        {session.timeSlot}
                      </span>
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        📍 {session.venue}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-slate-800 leading-tight mb-1">{session.subjectName}</h3>
                    <p className="text-sm font-bold text-[#2563EB] mb-4">{session.subjectCode}</p>
                    
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-6">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Batch Details</p>
                      <p className="text-sm font-bold text-slate-700">{session.department}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{session.batchRange}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => startAttendance(session)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md shadow-indigo-200 transition duration-150 active:scale-95 flex justify-center items-center gap-2"
                  >
                    <span>📝</span> Mark Attendance
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* --- ATTENDANCE MODAL (INTERACTIVE SEAT GRID) --- */}
      {activeSession && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-[95vw] lg:max-w-7xl h-[90vh] flex flex-col shadow-2xl overflow-hidden transform scale-100 transition-transform duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 bg-white shadow-sm z-10 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-3xl">📝</span>
                  <h2 className="text-2xl font-black text-slate-800">Live Attendance <span className="text-slate-300 mx-2">|</span> {activeSession.venue}</h2>
                </div>
                <p className="text-sm font-bold text-slate-500 ml-11">
                  {activeSession.subjectName} ({activeSession.timeSlot})
                </p>
              </div>
              
              {/* Live Status Bar */}
              <div className="flex items-center gap-4 ml-11 md:ml-0">
                <div className="flex gap-4 items-center bg-slate-50 px-5 py-2.5 rounded-xl border border-slate-200 shadow-inner">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</p>
                    <p className="text-lg font-black text-slate-700 leading-none">{totalCount}</p>
                  </div>
                  <div className="w-px h-8 bg-slate-200"></div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Present</p>
                    <p className="text-lg font-black text-emerald-600 leading-none">{presentCount}</p>
                  </div>
                  <div className="w-px h-8 bg-slate-200"></div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Absent</p>
                    <p className="text-lg font-black text-rose-600 leading-none">{absentCount}</p>
                  </div>
                </div>

                <button onClick={() => setActiveSession(null)} className="w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-xl transition duration-150">✕</button>
              </div>
            </div>

            {/* Instruction Bar */}
            <div className="bg-indigo-50 px-6 py-3 border-b border-indigo-100 flex items-center justify-between">
              <p className="text-sm font-medium text-indigo-800 flex items-center gap-2">
                <span className="text-lg">💡</span> <strong>Tap on a seat</strong> to mark a student as absent.
              </p>
              <div className="flex gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-100 border border-emerald-400"></div> Present</span>
                <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-rose-100 border border-rose-400"></div> Absent</span>
              </div>
            </div>

            {/* Interactive Grid Area */}
            <div className="p-6 overflow-auto bg-[#F8FAFC] flex-1 custom-scrollbar">
               {activeSession.seatAllocation && activeSession.seatAllocation.length > 0 ? (
                 <div className="bg-white border border-slate-200 rounded-[2rem] p-4 min-w-max shadow-sm">
                   <table className="border-separate border-spacing-2 mx-auto">
                     <thead>
                       <tr>
                         <th className="w-10"></th> 
                         {getGridMatrix(activeSession.seatAllocation).cols.map(c => (
                           <th key={c} className="text-slate-400 font-bold pb-2 text-center w-24 text-sm">{c}</th>
                         ))}
                       </tr>
                     </thead>
                     <tbody>
                       {getGridMatrix(activeSession.seatAllocation).rows.map(r => (
                         <tr key={r}>
                           <td className="text-slate-400 font-bold text-center pr-4 text-sm">{r}</td>
                           {getGridMatrix(activeSession.seatAllocation).cols.map(c => {
                             const seatId = `${c}${r}`;
                             const seatInfo = activeSession.seatAllocation.find(s => s.seat === seatId);
                             const hasStudent = seatInfo && seatInfo.roll;
                             const status = hasStudent ? attendanceRecord[seatInfo.roll] : null;
                             
                             // Styling based on attendance status
                             let colorClasses = 'bg-slate-50 border-slate-200 opacity-40 cursor-not-allowed'; // Empty
                             if (status === 'Present') colorClasses = 'bg-emerald-50 border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400 cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-0.5';
                             if (status === 'Absent') colorClasses = 'bg-rose-50 border-rose-300 hover:bg-rose-100 hover:border-rose-400 cursor-pointer shadow-inner scale-95 opacity-80';

                             return (
                               <td key={c} className="p-0 align-top relative">
                                 <div 
                                   onClick={() => toggleAttendance(seatInfo?.roll)}
                                   className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border h-full min-h-[90px] transition-all duration-150 select-none ${colorClasses}`}
                                 >
                                   {hasStudent ? (
                                      <>
                                        <span className={`text-[10px] font-black mb-1 ${status === 'Absent' ? 'text-rose-400' : 'text-emerald-600/50'}`}>{seatInfo.seat}</span>
                                        <span className={`text-[10px] font-black uppercase tracking-widest bg-white px-1.5 py-0.5 rounded shadow-sm border mb-1.5 ${status === 'Absent' ? 'text-rose-600 border-rose-200' : 'text-emerald-700 border-emerald-200'}`}>{seatInfo.dept}</span>
                                        <span className={`text-[10px] font-bold tracking-tight text-center ${status === 'Absent' ? 'text-rose-800 line-through decoration-rose-400' : 'text-emerald-900'}`}>{seatInfo.roll}</span>
                                      </>
                                   ) : (
                                      <>
                                        <span className="text-[10px] font-black text-slate-400 mb-1">{seatId}</span>
                                        <span className="text-[10px] font-bold text-slate-300 mt-1">Empty</span>
                                      </>
                                   )}
                                 </div>
                               </td>
                             )