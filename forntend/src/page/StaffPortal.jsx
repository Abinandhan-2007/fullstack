import React, { useState, useEffect } from 'react';

// Notice: We accept a loggedInEmail prop. If you pass this from your login page, 
// the portal will automatically find their exact schedule!
export default function StaffPortal({ handleLogout, apiUrl, loggedInEmail }) {
  const [activeMenu, setActiveMenu] = useState('Workspace');
  
  const [dbStaff, setDbStaff] = useState([]);
  const [dbStudents, setDbStudents] = useState([]);
  const [allMappings, setAllMappings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- AUTH STATE ---
  const [currentStaff, setCurrentStaff] = useState(null); 

  // --- ATTENDANCE STATES ---
  const [activeSession, setActiveSession] = useState(null);
  const [attendanceRecord, setAttendanceRecord] = useState({}); 
  const [searchQuery, setSearchQuery] = useState('');
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const fetchStaffData = async () => {
      setIsLoading(true);
      try {
        const [staffRes, timetableRes, studentRes] = await Promise.all([
          fetch(`${apiUrl}/api/host/all-staff`).catch(() => null),
          fetch(`${apiUrl}/api/host/timetable`).catch(() => null),
          fetch(`${apiUrl}/api/host/all-students`).catch(() => null)
        ]);

        if (staffRes?.ok) {
          const staffData = await staffRes.json();
          setDbStaff(staffData);
          
          // Auto-detect logged in staff member
          let matchedStaff = null;
          if (loggedInEmail) {
            matchedStaff = staffData.find(s => s.email === loggedInEmail);
          }
          // Fallback to first staff member for testing if email doesn't match
          setCurrentStaff(matchedStaff || staffData[0]); 
        }
        
        if (timetableRes?.ok) setAllMappings(await timetableRes.json());
        if (studentRes?.ok) setDbStudents(await studentRes.json());
        
      } catch (error) { console.error("Data fetch error", error); } 
      finally { setIsLoading(false); }
    };
    if (apiUrl) fetchStaffData();
  }, [apiUrl, loggedInEmail]);

  const mySessions = allMappings.filter(m => String(m.faculty) === String(currentStaff?.id));
  const todayDateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  // --- MENU CONFIGURATION ---
  const menuItems = [
    { name: 'Dashboard', icon: '📊', bg: 'bg-indigo-500', desc: 'View your daily schedule and teaching statistics.' },
    { name: 'Mark Attendance', icon: '📝', bg: 'bg-emerald-500', desc: 'Take live attendance for your assigned classes.' },
    { name: 'My Subjects', icon: '📚', bg: 'bg-blue-500', desc: 'View the syllabus and materials for your courses.' },
    { name: 'Leave Requests', icon: '🏖️', bg: 'bg-amber-500', desc: 'Apply for leave or view upcoming holidays.' },
  ];

  // --- ATTENDANCE LOGIC ---
  const startAttendance = (session) => {
    let seatData = [];
    try { seatData = typeof session.seatAllocation === 'string' ? JSON.parse(session.seatAllocation) : session.seatAllocation; } catch(e) {}

    const initialRecord = {};
    if (Array.isArray(seatData)) {
      seatData.forEach(seat => { if (seat.roll) initialRecord[seat.roll] = "Present"; });
    }

    setAttendanceRecord(initialRecord);
    setActiveSession({ ...session, seatAllocation: seatData });
    setSearchQuery('');
    setSubmitStatus(null);
  };

  const toggleStatus = (roll) => {
    setAttendanceRecord(prev => ({ ...prev, [roll]: prev[roll] === "Present" ? "Absent" : "Present" }));
  };

  const markAll = (status) => {
    const updated = {};
    Object.keys(attendanceRecord).forEach(roll => { updated[roll] = status; });
    setAttendanceRecord(updated);
  };

  const saveDraft = () => {
    setSubmitStatus("Draft Saved!");
    setTimeout(() => setSubmitStatus(null), 2000);
  };

  const submitAttendance = async () => {
    setSubmitStatus("Submitting...");
    try {
      setTimeout(() => {
        setSubmitStatus("Success");
        setTimeout(() => { setActiveSession(null); setSubmitStatus(null); }, 1500);
      }, 1000);
    } catch (err) { setSubmitStatus("Error"); }
  };

  // --- MATH & FILTERS ---
  const studentRolls = Object.keys(attendanceRecord);
  const totalStudents = studentRolls.length;
  const presentCount = Object.values(attendanceRecord).filter(s => s === "Present").length;
  const absentCount = Object.values(attendanceRecord).filter(s => s === "Absent").length;
  const attendancePercentage = totalStudents === 0 ? 0 : Math.round((presentCount / totalStudents) * 100);

  const getStudentName = (roll) => {
    const student = dbStudents.find(s => String(s.registerNumber) === String(roll));
    return student ? student.name : "Unknown Student";
  };

  const filteredRolls = studentRolls.filter(roll => {
    const name = getStudentName(roll).toLowerCase();
    const query = searchQuery.toLowerCase();
    return roll.toLowerCase().includes(query) || name.includes(query);
  });

  // --- UI SCREENS ---
  const renderWorkspace = () => (
    <div className="animate-in fade-in duration-200 max-w-6xl mx-auto py-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-[#1e293b] mb-3 tracking-tight">
          Welcome back, {currentStaff?.name?.split(' ')[0] || 'Professor'}
        </h2>
        <p className="text-slate-500 text-lg">Select a module below to manage your classes and records.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <div key={item.name} onClick={() => setActiveMenu(item.name)} className="bg-white p-8 rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 hover:shadow-md hover:border-indigo-100 cursor-pointer transition duration-150 group">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 ${item.bg} text-white shadow-inner group-hover:scale-105 transition-transform duration-150`}>{item.icon}</div>
            <h3 className="text-xl font-bold text-[#1e293b] mb-2">{item.name}</h3>
            <p className="text-slate-500 leading-relaxed text-sm font-medium">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="animate-in fade-in duration-200 max-w-7xl mx-auto space-y-8">
      <button onClick={() => setActiveMenu('Workspace')} className="mb-2 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors"><span>←</span> Back to Workspace</button>
      
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Dashboard</h1>
        <p className="text-slate-500 font-medium mt-1">Overview of your teaching schedule for {todayDateStr}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">📅</div>
          <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Classes Today</p><h3 className="text-3xl font-black text-slate-800">{mySessions.length}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">✅</div>
          <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Attendance Marked</p><h3 className="text-3xl font-black text-slate-800">0</h3></div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 flex items-center gap-5">
          <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">⏳</div>
          <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Classes</p><h3 className="text-3xl font-black text-slate-800">{mySessions.length}</h3></div>
        </div>
      </div>
    </div>
  );

  const renderAttendanceModule = () => (
    <div className="animate-in fade-in duration-300">
      <button onClick={() => setActiveMenu('Workspace')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold transition-colors"><span>←</span> Back to Workspace</button>
      
      <div className="mb-10">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Today's Classes</h2>
        <p className="text-slate-500 font-medium mt-1">Select a class below to mark attendance.</p>
      </div>

      {isLoading ? ( <div className="text-center py-20 text-slate-400 font-bold animate-pulse">Loading Schedule...</div> ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mySessions.length === 0 ? ( <div className="col-span-full text-center py-20 bg-white rounded-[2rem] border border-slate-200 border-dashed"><div className="text-5xl mb-4">☕</div><h3 className="text-xl font-bold text-slate-700">No classes scheduled</h3></div> ) : (
            mySessions.map((session, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4"><span className="bg-emerald-50 text-emerald-700 font-black text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md border border-emerald-100">{session.timeSlot}</span><span className="text-xs font-bold text-slate-500">📍 {session.venue}</span></div>
                  <h3 className="text-xl font-black text-slate-800 leading-tight mb-1">{session.subjectName}</h3>
                  <p className="text-sm font-bold text-emerald-600 mb-4">{session.subjectCode} • {session.department}</p>
                </div>
                <button onClick={() => startAttendance(session)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md active:scale-[0.98] transition-all">📝 Mark Attendance</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      
      {/* HEADER WITHOUT DROPDOWN */}
      <header className="bg-white border-b border-slate-200 px-6 md:px-10 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveMenu('Workspace')}>
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-inner">FP</div>
          <div><h1 className="text-xl font-black text-slate-900 tracking-tight leading-tight">Faculty<span className="text-indigo-600 font-normal">Portal</span></h1></div>
        </div>
        
        <div className="flex items-center gap-5">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-bold text-slate-800">{currentStaff?.name || "Loading..."}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{currentStaff?.department || "Faculty"}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-lg border-2 border-white shadow-sm">
            {currentStaff?.name ? currentStaff.name.charAt(0) : "F"}
          </div>
          <div className="w-px h-8 bg-slate-200 ml-2"></div>
          <button onClick={handleLogout} className="text-rose-500 font-bold text-sm hover:underline ml-2">Sign out</button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full relative">
        
        {/* ROUTING FOR STAFF PORTAL PAGES */}
        {!activeSession ? (
          <>
             {activeMenu === 'Workspace' ? renderWorkspace() : 
              activeMenu === 'Dashboard' ? renderDashboard() : 
              activeMenu === 'Mark Attendance' ? renderAttendanceModule() : 
              <div className="text-center py-20 flex flex-col items-center"><div className="text-6xl mb-4 opacity-80">🚧</div><h2 className="text-3xl font-black text-slate-800 mb-2">{activeMenu}</h2><p className="text-slate-500 font-medium">This module is under development.</p><button onClick={() => setActiveMenu('Workspace')} className="mt-6 text-indigo-600 font-bold hover:underline">Return to Workspace</button></div>}
          </>
        ) : (

          /* =========================================================
             ATTENDANCE MARKING MODAL / VIEW
             ========================================================= */
          <div className="animate-in fade-in duration-300 space-y-6 pb-24">
            
            <button onClick={() => setActiveSession(null)} className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold transition-colors">
              <span>←</span> Back to Classes
            </button>

            {/* 1. SESSION DETAILS (Top Section) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm md:text-base font-bold text-slate-700">
                <span className="text-indigo-600">{activeSession.department}</span>
                <span className="text-slate-300">|</span>
                <span>{activeSession.subjectName}</span>
                <span className="text-slate-300">|</span>
                <span>Prof. {currentStaff?.name?.split(' ')[0] || 'Staff'}</span>
                <span className="text-slate-300">|</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">📍 {activeSession.venue}</span>
                <span className="text-slate-300">|</span>
                <span>{activeSession.timeSlot}</span>
                <span className="text-slate-300">|</span>
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{todayDateStr}</span>
              </div>
            </div>

            {/* 4. ATTENDANCE SUMMARY & 5. SEARCH */}
            <div className="flex flex-col lg:flex-row justify-between gap-4 items-end">
              <div className="flex bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-r border-slate-100 text-center"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</p><p className="text-xl font-black text-slate-700">{totalStudents}</p></div>
                <div className="px-5 py-3 border-r border-slate-100 text-center bg-emerald-50/30"><p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Present</p><p className="text-xl font-black text-emerald-600">{presentCount}</p></div>
                <div className="px-5 py-3 border-r border-slate-100 text-center bg-rose-50/30"><p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Absent</p><p className="text-xl font-black text-rose-600">{absentCount}</p></div>
                <div className="px-5 py-3 text-center bg-slate-50"><p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Percent</p><p className="text-xl font-black text-indigo-600">{attendancePercentage}%</p></div>
              </div>

              <div className="relative w-full lg:w-72">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <input type="text" placeholder="Search Reg No or Name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-sm font-medium outline-none focus:border-emerald-500 shadow-sm" />
              </div>
            </div>

            {/* 3. QUICK ACTIONS (Top) */}
            <div className="flex flex-wrap gap-3">
              <button onClick={() => markAll("Present")} className="bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-emerald-700 font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-sm">✅ Mark All Present</button>
              <button onClick={() => markAll("Absent")} className="bg-white border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-rose-700 font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-sm">❌ Mark All Absent</button>
              <button onClick={() => startAttendance(activeSession)} className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-sm">🔄 Reset Form</button>
            </div>

            {/* 2. STUDENT ATTENDANCE TABLE (Main Section) */}
            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="py-4 px-6 w-1/4">Reg No</th>
                    <th className="py-4 px-6 w-1/2">Student Name</th>
                    <th className="py-4 px-6 text-center w-1/4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredRolls.length > 0 ? filteredRolls.map((roll) => {
                    const status = attendanceRecord[roll];
                    const isPresent = status === "Present";

                    return (
                      <tr key={roll} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-6 font-bold text-slate-700">{roll}</td>
                        <td className="py-3 px-6 font-bold text-slate-900">{getStudentName(roll)}</td>
                        <td className="py-3 px-6">
                          
                          {/* TOGGLE BUTTONS (P / A) */}
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => toggleStatus(roll)} className={`w-10 h-10 rounded-xl font-black text-lg transition-all flex items-center justify-center ${isPresent ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 scale-105' : 'bg-slate-100 text-slate-400 hover:bg-emerald-100 hover:text-emerald-500'}`}>P</button>
                            <button onClick={() => toggleStatus(roll)} className={`w-10 h-10 rounded-xl font-black text-lg transition-all flex items-center justify-center ${!isPresent ? 'bg-rose-500 text-white shadow-md shadow-rose-200 scale-105' : 'bg-slate-100 text-slate-400 hover:bg-rose-100 hover:text-rose-500'}`}>A</button>
                          </div>

                        </td>
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan="3" className="py-12 text-center text-slate-400 font-medium">No students match your search.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ACTION BUTTONS (Sticky Bottom) */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 shadow-[0_-4px_20px_rgb(0,0,0,0.05)] z-50 flex justify-center gap-4">
              <div className="w-full max-w-5xl flex justify-between items-center px-4">
                <span className="text-sm font-bold text-slate-500 hidden md:block">
                  {presentCount} Present • {absentCount} Absent
                </span>
                <div className="flex gap-3 w-full md:w-auto">
                  <button onClick={saveDraft} className="w-full md:w-auto px-6 py-3.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                    Save Draft
                  </button>
                  <button onClick={submitAttendance} disabled={submitStatus === "Submitting..." || submitStatus === "Success"} className={`w-full md:w-auto px-8 py-3.5 rounded-xl font-black text-white shadow-md transition-all ${submitStatus === "Success" ? 'bg-emerald-500' : submitStatus === "Error" ? 'bg-rose-500' : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 active:scale-95'}`}>
                    {submitStatus || "Submit Attendance"}
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}