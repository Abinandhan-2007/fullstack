import React, { useState, useEffect } from 'react';

// ============================================================================
// 🚨 ERROR BOUNDARY (Crash Protection)
// ============================================================================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { this.setState({ errorInfo }); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-rose-50 p-10 font-mono flex flex-col items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-4xl w-full border-2 border-rose-300">
            <h1 className="text-3xl font-black mb-2 text-rose-600">🚨 Application Crashed!</h1>
            <div className="bg-rose-100 p-4 rounded-xl mb-4 overflow-auto">
              <p className="font-black text-rose-800">{this.state.error && this.state.error.toString()}</p>
            </div>
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700">Reload Portal</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function StaffPortal({ handleLogout, apiUrl, loggedInEmail }) {
  return (
    <ErrorBoundary>
      <StaffPortalContent handleLogout={handleLogout} apiUrl={apiUrl} loggedInEmail={loggedInEmail} />
    </ErrorBoundary>
  );
}

function StaffPortalContent({ handleLogout, apiUrl, loggedInEmail }) {
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
  
  // 🔥 POPUP STATES
  const [attendancePopup, setAttendancePopup] = useState(null);
  const [popupAction, setPopupAction] = useState(null); 

  // ============================================================================
  // 1. UNIVERSAL EXTRACTORS & MATCHERS
  // ============================================================================
  const doRollsMatch = (roll1, roll2) => {
    if (!roll1 || !roll2) return false;
    const r1 = String(roll1).toUpperCase().trim();
    const r2 = String(roll2).toUpperCase().trim();
    return r1 === r2 || r1.endsWith(r2) || r2.endsWith(r1);
  };

  const extractArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.content && Array.isArray(data.content)) return data.content;
    if (data.data && Array.isArray(data.data)) return data.data;
    if (data._embedded) {
       const keys = Object.keys(data._embedded);
       if (keys.length > 0 && Array.isArray(data._embedded[keys[0]])) return data._embedded[keys[0]];
    }
    return [];
  };

  const getStaffId = (s) => {
    if (!s) return '';
    const strId = s.staffId || s.employeeId || s.facultyId || s.id;
    if (strId) return String(strId);
    if (s.email) return String(s.email).split('@')[0];
    return 'N/A';
  };

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
          const staffData = extractArray(await staffRes.json());
          setDbStaff(staffData);
          let matchedStaff = null;
          if (loggedInEmail) matchedStaff = staffData.find(s => s.email === loggedInEmail);
          setCurrentStaff(matchedStaff || staffData[0]); 
        }
        
        if (timetableRes?.ok) setAllMappings(extractArray(await timetableRes.json()));
        if (studentRes?.ok) setDbStudents(extractArray(await studentRes.json()));
        
      } catch (error) { console.error("Data fetch error", error); } 
      finally { setIsLoading(false); }
    };
    if (apiUrl) fetchStaffData();
  }, [apiUrl, loggedInEmail]);

  const mySessions = allMappings.filter(m => String(m.faculty) === getStaffId(currentStaff));
  const todayDateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  const menuItems = [
    { name: 'Dashboard', icon: '📊', bg: 'bg-indigo-500', desc: 'View your daily schedule and teaching statistics.' },
    { name: 'Mark Attendance', icon: '📝', bg: 'bg-emerald-500', desc: 'Take live attendance using the interactive seating grid.' },
    { name: 'My Subjects', icon: '📚', bg: 'bg-blue-500', desc: 'View the syllabus and materials for your courses.' },
    { name: 'Leave Requests', icon: '🏖️', bg: 'bg-amber-500', desc: 'Apply for leave or view upcoming holidays.' },
  ];

  // --- GRID HELPERS ---
  const getDeptColorClasses = (dept, isOccupied) => {
    if (!isOccupied) return 'bg-[#F8FAFC] border-slate-200 text-slate-400';
    if (!dept) return 'bg-slate-200 border-slate-300 text-slate-700';
    const d = dept.toLowerCase();
    if (d.includes('cs')) return 'bg-[#E1EAF9] border-[#C8D9F4] text-slate-800'; 
    if (d.includes('ec')) return 'bg-[#FEF4C1] border-[#FDEB9E] text-slate-800'; 
    if (d.includes('ee')) return 'bg-[#FBE1EC] border-[#F7CDE0] text-slate-800'; 
    if (d.includes('it')) return 'bg-[#DBF6E4] border-[#C3EED3] text-slate-800'; 
    if (d.includes('ei') || d.includes('e&i')) return 'bg-[#FDF0D5] border-[#FCE1B6] text-slate-800'; 
    return 'bg-blue-50 border-blue-100 text-slate-800'; 
  };

  const getGridMatrix = (seatData) => {
    if (!Array.isArray(seatData) || seatData.length === 0) return { rows: [], cols: [] };
    try {
      const usedCols = [...new Set(seatData.map(s => { const m = s?.seat?.match(/[A-Z]+/); return m ? m[0] : 'A'; }))].sort();
      const usedRows = [...new Set(seatData.map(s => { const m = s?.seat?.match(/\d+/); return m ? parseInt(m[0], 10) : 1; }))].sort((a,b)=>a-b);
      return { rows: usedRows, cols: usedCols };
    } catch (e) { return { rows: [], cols: [] }; }
  };

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

  // 🔥 THE NEW ANIMATED CLICK HANDLER FOR THE POPUP
  const handlePopupAction = (status) => {
    setPopupAction(status); // 1. Instantly changes the button color to Green/Red/Purple
    
    // 2. Wait 400ms so the user can see the color change, then save & close
    setTimeout(() => {
      if (attendancePopup) {
        setAttendanceRecord(prev => ({ ...prev, [attendancePopup.roll]: status }));
      }
      setAttendancePopup(null);
      setPopupAction(null); // Reset animation state
    }, 400); 
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
        setTimeout(() => { setActiveSession(null); setSubmitStatus(null); setActiveMenu('Dashboard'); }, 1500);
      }, 1000);
    } catch (err) { setSubmitStatus("Error"); }
  };

  // --- MATH & FILTERS ---
  const studentRolls = Object.keys(attendanceRecord);
  const totalStudents = studentRolls.length;
  const presentCount = Object.values(attendanceRecord).filter(s => s === "Present").length;
  const absentCount = Object.values(attendanceRecord).filter(s => s === "Absent").length;
  const psCount = Object.values(attendanceRecord).filter(s => s === "PS").length; 
  
  const attendancePercentage = totalStudents === 0 ? 0 : Math.round(((presentCount + psCount) / totalStudents) * 100);

  const getStudentName = (roll) => {
    const student = dbStudents.find(s => doRollsMatch(s.registerNumber || s.regNo || s.email, roll));
    return student ? student.name : "Unknown Student";
  };

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
      <div><h1 className="text-3xl font-black text-slate-900 tracking-tight">My Dashboard</h1><p className="text-slate-500 font-medium mt-1">Overview of your teaching schedule for {todayDateStr}.</p></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 flex items-center gap-5"><div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">📅</div><div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Classes Today</p><h3 className="text-3xl font-black text-slate-800">{mySessions.length}</h3></div></div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 flex items-center gap-5"><div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">✅</div><div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Attendance Marked</p><h3 className="text-3xl font-black text-slate-800">0</h3></div></div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 flex items-center gap-5"><div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">⏳</div><div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Classes</p><h3 className="text-3xl font-black text-slate-800">{mySessions.length}</h3></div></div>
      </div>
    </div>
  );

  const renderAttendanceModule = () => (
    <div className="animate-in fade-in duration-300">
      <button onClick={() => setActiveMenu('Workspace')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold transition-colors"><span>←</span> Back to Workspace</button>
      <div className="mb-10"><h2 className="text-3xl font-black text-slate-900 tracking-tight">Today's Classes</h2><p className="text-slate-500 font-medium mt-1">Select a class below to mark attendance via the interactive grid.</p></div>

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
        {!activeSession ? (
          <>
             {activeMenu === 'Workspace' ? renderWorkspace() : 
              activeMenu === 'Dashboard' ? renderDashboard() : 
              activeMenu === 'Mark Attendance' ? renderAttendanceModule() : 
              <div className="text-center py-20 flex flex-col items-center"><div className="text-6xl mb-4 opacity-80">🚧</div><h2 className="text-3xl font-black text-slate-800 mb-2">{activeMenu}</h2><p className="text-slate-500 font-medium">This module is under development.</p><button onClick={() => setActiveMenu('Workspace')} className="mt-6 text-indigo-600 font-bold hover:underline">Return to Workspace</button></div>}
          </>
        ) : (

          /* =========================================================
             ATTENDANCE MARKING (INTERACTIVE GRID)
             ========================================================= */
          <div className="animate-in fade-in duration-300 space-y-6 pb-24">
            
            <button onClick={() => setActiveSession(null)} className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold transition-colors">
              <span>←</span> Back to Classes
            </button>

            {/* 1. SESSION DETAILS */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm md:text-base font-bold text-slate-700">
                <span className="text-indigo-600">{activeSession.department}</span><span className="text-slate-300">|</span>
                <span>{activeSession.subjectName}</span><span className="text-slate-300">|</span>
                <span>Prof. {currentStaff?.name?.split(' ')[0] || 'Staff'}</span><span className="text-slate-300">|</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">📍 {activeSession.venue}</span><span className="text-slate-300">|</span>
                <span>{activeSession.timeSlot}</span><span className="text-slate-300">|</span>
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{todayDateStr}</span>
              </div>
            </div>

            {/* 2. SUMMARY & SEARCH */}
            <div className="flex flex-col lg:flex-row justify-between gap-4 items-end">
              <div className="flex bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden w-full lg:w-auto">
                <div className="px-3 py-3 border-r border-slate-100 text-center flex-1"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total</p><p className="text-lg font-black text-slate-700">{totalStudents}</p></div>
                <div className="px-3 py-3 border-r border-slate-100 text-center bg-emerald-50/30 flex-1"><p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Pre</p><p className="text-lg font-black text-emerald-600">{presentCount}</p></div>
                <div className="px-3 py-3 border-r border-slate-100 text-center bg-rose-50/30 flex-1"><p className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Abs</p><p className="text-lg font-black text-rose-600">{absentCount}</p></div>
                <div className="px-3 py-3 border-r border-slate-100 text-center bg-violet-50/30 flex-1"><p className="text-[9px] font-black text-violet-500 uppercase tracking-widest">PS</p><p className="text-lg font-black text-violet-600">{psCount}</p></div>
                <div className="px-3 py-3 text-center bg-slate-50 flex-1"><p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Score</p><p className="text-lg font-black text-indigo-600">{attendancePercentage}%</p></div>
              </div>

              <div className="relative w-full lg:w-72">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <input type="text" placeholder="Search Reg No or Name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-sm font-medium outline-none focus:border-emerald-500 shadow-sm" />
              </div>
            </div>

            {/* 3. QUICK ACTIONS */}
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex flex-wrap gap-3">
                <button onClick={() => markAll("Present")} className="bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-emerald-700 font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-sm">✅ Mark All Present</button>
                <button onClick={() => markAll("Absent")} className="bg-white border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-rose-700 font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-sm">❌ Mark All Absent</button>
                <button onClick={() => markAll("PS")} className="bg-white border border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-violet-700 font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-sm">⚠️ Mark All PS</button>
                <button onClick={() => startAttendance(activeSession)} className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-sm">🔄 Reset Grid</button>
              </div>
              <p className="text-sm font-medium text-slate-500 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">💡 <strong>Tap a seat</strong> to open options.</p>
            </div>

            {/* 4. VISUAL INTERACTIVE GRID */}
            <div className="p-6 overflow-auto bg-[#F8FAFC] rounded-[2rem] border border-slate-200 shadow-inner custom-scrollbar">
               {(() => {
                 let seatAllocationData = [];
                 try { seatAllocationData = typeof activeSession.seatAllocation === 'string' ? JSON.parse(activeSession.seatAllocation) : activeSession.seatAllocation; } catch(e) { seatAllocationData = []; }
                 const gridMatrix = getGridMatrix(seatAllocationData);
                 
                 if (seatAllocationData && seatAllocationData.length > 0) {
                   return (
                     <div className="bg-white border border-slate-200 rounded-3xl p-4 min-w-max shadow-sm">
                       <table className="border-separate border-spacing-2 mx-auto">
                         <thead><tr><th className="w-10"></th>{gridMatrix.cols.map(c => (<th key={c} className="text-slate-400 font-bold pb-2 text-center w-24 text-sm">{c}</th>))}</tr></thead>
                         <tbody>
                           {gridMatrix.rows.map(r => (
                             <tr key={r}><td className="text-slate-400 font-bold text-center pr-4 text-sm">{r}</td>
                               {gridMatrix.cols.map(c => {
                                 const seatId = `${c}${r}`;
                                 const seatInfo = seatAllocationData.find(s => s.seat === seatId);
                                 const hasStudent = seatInfo && seatInfo.roll;
                                 const status = hasStudent ? attendanceRecord[seatInfo.roll] : null;
                                 
                                 // Highlight if searched
                                 const isMatch = searchQuery && hasStudent && (seatInfo.roll.toLowerCase().includes(searchQuery.toLowerCase()) || getStudentName(seatInfo.roll).toLowerCase().includes(searchQuery.toLowerCase()));

                                 // Styling logic based on 3 Statuses
                                 let colorClasses = 'bg-slate-50 border-slate-200 opacity-40 cursor-not-allowed'; 
                                 if (hasStudent) {
                                     if (status === 'Absent') {
                                         colorClasses = 'bg-rose-500 text-white border-rose-600 shadow-md transform scale-[0.96]';
                                     } else if (status === 'PS') {
                                         colorClasses = 'bg-violet-500 text-white border-violet-600 shadow-md transform scale-[0.96]';
                                     } else {
                                         colorClasses = getDeptColorClasses(seatInfo.dept, true) + ' cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all';
                                     }
                                     if (isMatch) colorClasses += ' ring-4 ring-indigo-500 ring-offset-2';
                                 }

                                 return (
                                   <td key={c} className="p-0 align-top relative">
                                     <div 
                                        onClick={() => hasStudent && setAttendancePopup({ ...seatInfo, currentStatus: status })} 
                                        className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border h-full min-h-[85px] transition-all duration-150 select-none cursor-pointer ${colorClasses}`}
                                     >
                                       {hasStudent ? (
                                          <>
                                            <span className={`text-[10px] font-black mb-1 ${status === 'Absent' || status === 'PS' ? 'text-white/70' : 'text-slate-500'}`}>{seatInfo.seat}</span>
                                            <span className={`text-xs font-black uppercase tracking-wider mb-1.5 ${status === 'Absent' || status === 'PS' ? 'text-white' : ''}`}>{seatInfo.dept}</span>
                                            <span className={`text-[9px] font-medium tracking-tight break-all text-center ${status === 'Absent' || status === 'PS' ? 'text-white' : 'text-slate-600'}`}>{seatInfo.roll}</span>
                                          </>
                                       ) : (
                                          <><span className="text-[10px] font-black text-slate-400 mb-1">{seatId}</span><span className="text-[10px] font-bold text-slate-300 italic mt-1">Empty</span></>
                                       )}
                                     </div>
                                   </td>
                                 )
                               })}
                             </tr>
                           ))}
                         </tbody>
                       </table>
                     </div>
                   );
                 } else {
                   return <div className="text-center py-20 flex flex-col items-center"><div className="text-4xl mb-4">🪑</div><p className="text-slate-600 font-bold text-lg mb-2">No Seats Allocated</p><p className="text-slate-400 font-medium text-sm">Please ask your Admin to generate an Automated Seating map for this class.</p></div>;
                 }
               })()}
            </div>

            {/* ACTION BUTTONS (Sticky Bottom) */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 shadow-[0_-4px_20px_rgb(0,0,0,0.05)] z-40 flex justify-center gap-4">
              <div className="w-full max-w-5xl flex justify-between items-center px-4">
                <span className="text-sm font-bold text-slate-500 hidden md:block">
                  {presentCount} Present • {absentCount} Absent • {psCount} PS
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

      {/* 🔥 THE REDESIGNED ACTION MENU POPUP */}
      {attendancePopup && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
           
           <div className="bg-white rounded-[2rem] p-6 max-w-sm w-full shadow-2xl flex flex-col items-center transform scale-100 border border-slate-100 animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0">
               
               {/* Header Area */}
               <div className="w-full flex justify-between items-start mb-4">
                  <div className="bg-slate-100 text-slate-500 font-black text-xs uppercase tracking-widest px-3 py-1.5 rounded-lg border border-slate-200 shadow-inner">
                     Seat {attendancePopup.seat}
                  </div>
                  <button onClick={() => setAttendancePopup(null)} className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold transition-colors">✕</button>
               </div>

               {/* Student Info */}
               <div className="text-center mb-6">
                   <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-1">{attendancePopup.roll}</h3>
                   <p className="text-sm font-bold text-slate-500">{getStudentName(attendancePopup.roll)}</p>
               </div>

               {/* Modern Interactive Buttons */}
               <div className="flex flex-col gap-3 w-full">
                   <button 
                      onClick={() => handlePopupAction('Present')} 
                      className={`relative overflow-hidden w-full py-4 rounded-2xl font-black text-lg transition-all duration-200 shadow-sm border-2 flex items-center justify-center gap-3 ${
                          (popupAction === 'Present' || (!popupAction && attendancePopup.currentStatus === 'Present'))
                          ? 'bg-[#10B981] border-[#10B981] text-white scale-[1.02] shadow-lg shadow-emerald-200' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-[#10B981] hover:bg-emerald-50'
                      }`}>
                      <span className="text-2xl">✅</span> Present
                   </button>

                   <button 
                      onClick={() => handlePopupAction('Absent')} 
                      className={`relative overflow-hidden w-full py-4 rounded-2xl font-black text-lg transition-all duration-200 shadow-sm border-2 flex items-center justify-center gap-3 ${
                          (popupAction === 'Absent' || (!popupAction && attendancePopup.currentStatus === 'Absent'))
                          ? 'bg-[#EF4444] border-[#EF4444] text-white scale-[1.02] shadow-lg shadow-rose-200' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-[#EF4444] hover:bg-rose-50'
                      }`}>
                      <span className="text-2xl">❌</span> Absent
                   </button>

                   <button 
                      onClick={() => handlePopupAction('PS')} 
                      className={`relative overflow-hidden w-full py-4 rounded-2xl font-black text-lg transition-all duration-200 shadow-sm border-2 flex items-center justify-center gap-3 ${
                          (popupAction === 'PS' || (!popupAction && attendancePopup.currentStatus === 'PS'))
                          ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white scale-[1.02] shadow-lg shadow-violet-200' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-[#8B5CF6] hover:bg-violet-50'
                      }`}>
                      <span className="text-2xl">⚠️</span> PS / OD
                   </button>
               </div>

           </div>
        </div>
      )}

    </div>
  );
}