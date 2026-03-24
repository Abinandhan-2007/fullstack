import React, { useState, useEffect } from 'react';

const StudentPortal = ({ user, handleLogout }) => {
  // --- CHANGED DEFAULT MENU TO WORKSPACE ---
  const [activeMenu, setActiveMenu] = useState('Workspace');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [myMarks, setMyMarks] = useState([]);
  const [isFetchingMarks, setIsFetchingMarks] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState(new Date()); 
  const [studentProfile, setStudentProfile] = useState(null);

  const [globalTimetable, setGlobalTimetable] = useState([]);
  const [isLoadingTimetable, setIsLoadingTimetable] = useState(false);
  
  const apiUrl = "https://fullstack-8cjk.onrender.com";

  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/host/all-students`);
        if (res.ok) {
          const allStudents = await res.json();
          const myData = allStudents.find(s => s.email.toLowerCase() === user.email.toLowerCase());
          if (myData) setStudentProfile(myData);
        }
      } catch (err) { console.error("Failed to fetch student profile", err); }
    };
    if (user?.email) fetchMyProfile();
  }, [user, apiUrl]);

  useEffect(() => {
    if (activeMenu === 'Attendance') {
      setIsLoadingTimetable(true);
      fetch(`${apiUrl}/api/host/timetable`)
        .then(res => {
          if (!res.ok) throw new Error("Network response was not ok");
          return res.json();
        })
        .then(data => {
          setGlobalTimetable(data);
          setIsLoadingTimetable(false);
        })
        .catch(err => {
          console.error("Failed to load timetable from server", err);
          setIsLoadingTimetable(false);
        });
    }
  }, [activeMenu, apiUrl]);

  // --- UPDATED MENU ITEMS FOR WORKSPACE ---
  const menuItems = [
    { name: 'Dashboard', icon: '📊', bg: 'bg-blue-500', desc: 'Return to the main academic analytics and system metrics panel.' },
    { name: 'Attendance', icon: '✅', bg: 'bg-emerald-500', desc: 'View your live daily timetable and track your attendance records.' },
    { name: 'Marks / Results', icon: '📈', bg: 'bg-indigo-500', desc: 'View your overall CGPA, semester credits, and university records.' },
    { name: 'Skill Test', icon: '💻', bg: 'bg-violet-500', desc: 'Practice programming MCQs and technical coding challenges.' },
    { name: 'Arrear Tracker', icon: '⚠️', bg: 'bg-rose-500', desc: 'Monitor pending subjects and apply for arrear examinations.' },
    { name: 'Leave Request', icon: '📝', bg: 'bg-orange-500', desc: 'Apply for On-Duty (OD), medical leave, or general permissions.' },
  ];

  // ==========================================
  // THE NEW WORKSPACE GRID
  // ==========================================
  const renderWorkspace = () => (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto py-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-[#1e293b] mb-3 tracking-tight">
          Welcome to your Workspace, {studentProfile?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'Student'}
        </h2>
        <p className="text-slate-500 text-lg">Select a module below to access your tools.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div 
            key={item.name} 
            onClick={() => setActiveMenu(item.name)}
            className="bg-white p-8 rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 hover:shadow-lg hover:border-blue-100 cursor-pointer transition-all duration-300 group"
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 ${item.bg} text-white shadow-inner group-hover:scale-110 transition-transform duration-300`}>
              {item.icon}
            </div>
            <h3 className="text-xl font-bold text-[#1e293b] mb-2">{item.name}</h3>
            <p className="text-slate-500 leading-relaxed text-sm font-medium">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDashboard = () => {
    const studentStats = {
      mentorName: "Dr. Faculty Assigned", currentSemester: "Active Semester", attendancePercentage: 88.5, totalSubjects: 6, arrearCount: 0, sgpa: 8.42, cgpa: 8.55
    };

    return (
      <div className="animate-in fade-in duration-500">
        <button onClick={() => setActiveMenu('Workspace')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors">
          <span>←</span> Back to Workspace
        </button>
        <div className="mb-8 text-center md:text-left bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
          <img src={user?.picture || "https://via.placeholder.com/100"} alt="Profile" className="w-24 h-24 rounded-2xl border-4 border-white shadow-md z-10" />
          <div className="relative z-10 flex flex-col justify-center">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{studentProfile?.name || user?.name || 'Loading Student...'}</h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
              <span className="bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-lg text-sm border border-slate-200">{studentProfile?.registerNumber || 'Loading ID...'}</span>
              <span className="text-slate-500 font-medium text-sm">• {studentProfile?.department || 'Loading Department...'}</span>
              {studentProfile?.batch && <span className="text-slate-500 font-medium text-sm">• Batch {studentProfile.batch}</span>}
            </div>
            <p className="text-blue-600 font-semibold text-xs mt-2">{user?.email}</p>
          </div>
          <div className="absolute -right-10 -top-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        </div>

        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-5 px-1">Academic Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:border-blue-300 transition-colors">
            <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Faculty Mentor</p><p className="font-bold text-slate-800 text-lg">{studentStats.mentorName}</p></div>
            <div className="mt-4 pt-4 border-t border-slate-100"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Semester</p><p className="font-bold text-blue-600">{studentStats.currentSemester}</p></div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:border-emerald-300 transition-colors">
            <div className="flex justify-between items-start mb-2"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overall Attendance</p><span className="text-2xl">✅</span></div>
            <div>
              <p className="text-3xl font-black text-slate-800 tracking-tighter mb-2">{studentStats.attendancePercentage}%</p>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className={`h-full ${studentStats.attendancePercentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${studentStats.attendancePercentage}%` }}></div></div>
              <p className="text-[10px] font-bold text-slate-400 mt-2">{studentStats.attendancePercentage >= 75 ? 'Safe Zone' : 'Shortage Warning'}</p>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl shadow-md border border-slate-800 flex flex-col justify-between text-white hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Performance</p><span className="text-2xl">📈</span></div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">SGPA</p><p className="text-2xl font-black text-amber-400">{studentStats.sgpa}</p></div>
              <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">CGPA</p><p className="text-2xl font-black text-white">{studentStats.cgpa}</p></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:border-rose-300 transition-colors lg:col-span-3 xl:col-span-1">
            <div className="grid grid-cols-2 gap-4 h-full">
              <div className="flex flex-col justify-center border-r border-slate-100 pr-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Subjects</p>
                <p className="text-3xl font-black text-slate-800">{studentStats.totalSubjects}</p>
              </div>
              <div className="flex flex-col justify-center pl-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Standing Arrears</p>
                <p className={`text-3xl font-black ${studentStats.arrearCount === 0 ? 'text-emerald-500' : 'text-rose-600'}`}>{studentStats.arrearCount}</p>
                {studentStats.arrearCount === 0 && <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-1 bg-emerald-50 inline-block px-2 py-0.5 rounded">All Clear</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMarksAndPerformance = () => {
    return (
      <div className="animate-in fade-in duration-500">
        <button onClick={() => setActiveMenu('Workspace')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors">
          <span>←</span> Back to Workspace
        </button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Marks & Results</h2>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Academic Performance Record</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Register No.</p>
            <p className="font-bold text-indigo-700">{studentProfile?.registerNumber || 'Loading...'}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-4 px-6">Subject Code</th><th className="py-4 px-6">Assessment Type</th><th className="py-4 px-6 text-right">Score Obtained</th><th className="py-4 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!studentProfile ? (
                <tr><td colSpan="4" className="text-center py-20 text-slate-400 font-medium">Loading your profile...</td></tr>
              ) : isFetchingMarks ? (
                <tr><td colSpan="4" className="text-center py-20 text-indigo-500 font-bold animate-pulse tracking-widest">FETCHING YOUR SECURE RECORDS...</td></tr>
              ) : myMarks.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-20"><span className="text-4xl block mb-3 opacity-50">📭</span><p className="text-slate-500 font-medium">No marks have been published for you yet.</p></td></tr>
              ) : (
                myMarks.map((mark) => {
                  const isPass = (mark.score / mark.maxScore) * 100 >= 50; 
                  return (
                    <tr key={mark.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6"><span className="font-bold text-slate-800 uppercase bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 tracking-wider">{mark.subjectCode}</span></td>
                      <td className="py-4 px-6"><span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{mark.examType}</span></td>
                      <td className="py-4 px-6 text-right"><p className="font-black text-slate-800 text-lg">{mark.score} <span className="text-xs text-slate-400 font-normal">/ {mark.maxScore}</span></p></td>
                      <td className="py-4 px-6"><div className="flex justify-center"><div className={`text-[10px] font-black px-3 py-1.5 rounded w-16 text-center border-2 ${isPass ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>{isPass ? 'PASS' : 'FAIL'}</div></div></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderAttendance = () => {
    // 🔥 SMART MATCHER: Solves the "7376" prefix issue in the student portal
    const doRollsMatch = (roll1, roll2) => {
      if (!roll1 || !roll2) return false;
      const r1 = String(roll1).toUpperCase().trim();
      const r2 = String(roll2).toUpperCase().trim();
      return r1 === r2 || r1.endsWith(r2) || r2.endsWith(r1);
    };

    // 🔥 STRICT STUDENT FILTER: Only show classes where this exact student has a seat!
    const myClasses = globalTimetable.filter(m => {
      if (!studentProfile?.registerNumber) return false;
      const myRoll = String(studentProfile.registerNumber).toUpperCase().trim();

      let seatData = [];
      try {
        let parsed = m.seatAllocation;
        if (typeof parsed === 'string') parsed = JSON.parse(parsed);
        if (typeof parsed === 'string') parsed = JSON.parse(parsed);
        seatData = Array.isArray(parsed) ? parsed : [];
      } catch (e) {}

      // Check if my roll number exists anywhere in this specific venue's seating grid
      const isMySeatHere = seatData.some(seat => 
        seat && seat.roll && doRollsMatch(seat.roll, myRoll)
      );

      return isMySeatHere;
    });

    const timeSlots = ["09:00 AM", "09:50 AM", "10:40 AM", "11:30 AM", "01:10 PM", "02:00 PM", "02:50 PM", "03:40 PM"];
    const handlePrevDay = () => { const prev = new Date(attendanceDate); prev.setDate(prev.getDate() - 1); setAttendanceDate(prev); };
    const handleNextDay = () => { const next = new Date(attendanceDate); next.setDate(next.getDate() + 1); setAttendanceDate(next); };
    const formattedDate = attendanceDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');

    return (
      <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
        <button onClick={() => setActiveMenu('Workspace')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors">
          <span>←</span> Back to Workspace
        </button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div><h2 className="text-2xl font-black text-slate-800 tracking-tight">Daily Log</h2><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Live Database Sync</p></div>
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button onClick={handlePrevDay} className="px-3 py-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">◀</button>
            <div className="px-4 py-1.5 font-bold text-indigo-700 text-sm flex items-center gap-2 min-w-[130px] justify-center"><span>📅</span> {formattedDate}</div>
            <button onClick={handleNextDay} className="px-3 py-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">▶</button>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Today's Classes for {studentProfile?.registerNumber || '...'}</h3>
             {isLoadingTimetable && <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded animate-pulse">SYNCING WITH DB...</span>}
          </div>
          
          <div className="relative pl-4 md:pl-0">
            <div className="absolute left-[23px] md:left-[110px] top-4 bottom-8 w-[2px] bg-slate-100"></div>

            {myClasses.length === 0 && !isLoadingTimetable ? (
              <div className="text-center py-10 text-slate-400 font-medium border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                <p className="mb-2">No classes scheduled for you today.</p>
              </div>
            ) : (
              timeSlots.map((time, index) => {
                const session = myClasses.find(c => c.timeSlot === time);
                if (!session) return null;

                return (
                  <div key={index} className="relative flex flex-col md:flex-row items-start mb-8 last:mb-0 group">
                    <div className="md:w-[90px] pt-1.5 md:text-right md:pr-6 mb-2 md:mb-0 pl-12 md:pl-0">
                      <p className="text-xs font-black text-slate-800">{session.timeSlot}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">50m</p>
                    </div>
                    <div className="absolute left-0 md:left-[96px] top-1.5 w-[28px] h-[28px] rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 transition-colors duration-300 bg-amber-400"><div className="w-2.5 h-2.5 rounded-full bg-white"></div></div>
                    <div className="flex-1 ml-12 md:ml-10 border rounded-xl p-4 transition-all bg-slate-50 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-sm md:text-base leading-tight text-slate-800">{session.subjectName}</h4>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[9px] font-black bg-white border px-1.5 py-0.5 rounded uppercase tracking-widest border-slate-200 text-slate-500">{session.subjectCode}</span>
                            <span className="text-[10px] font-bold text-slate-400">{session.sessionType}</span>
                          </div>
                        </div>
                        <div className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border bg-amber-50 text-amber-600 border-amber-100">Scheduled</div>
                      </div>
                      <div className="mt-3 pt-3 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-slate-200/60">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                          <p className="text-xs font-medium text-slate-500">Faculty: <span className="font-bold text-slate-800">{session.faculty}</span></p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">📍 {session.venue}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  };
  const renderPlaceholder = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in duration-500">
      <button onClick={() => setActiveMenu('Workspace')} className="mb-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors">
        <span>←</span> Back to Workspace
      </button>
      <div className="text-6xl mb-4 opacity-80">{menuItems.find(m => m.name === activeMenu)?.icon || '🚧'}</div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">{activeMenu}</h2>
      <p className="text-sm text-slate-500 max-w-md">We are currently building the {activeMenu} module. Check back soon for updates!</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 flex flex-col">
      {/* PERSISTENT TOP NAVBAR */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveMenu('Workspace')}>
          <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-inner">
            C
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 hidden sm:block">
            Central<span className="text-[#2563EB] font-normal">Portal</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-slate-900">{studentProfile?.name || user?.name || 'Student'}</p>
            <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
          </div>
          <img src={user?.picture || "https://via.placeholder.com/40"} alt="Profile" className="w-10 h-10 rounded-full border border-slate-200 shadow-sm" />
          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
          <button onClick={handleLogout} className="text-rose-500 font-bold text-sm hover:text-rose-700 transition-colors">
            Sign out
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar relative">
        {activeMenu === 'Workspace' && renderWorkspace()}
        {activeMenu === 'Dashboard' && renderDashboard()}
        {activeMenu === 'Marks / Results' && renderMarksAndPerformance()}
        {activeMenu === 'Attendance' && renderAttendance()}
        
        {activeMenu !== 'Workspace' && 
         activeMenu !== 'Dashboard' && 
         activeMenu !== 'Marks / Results' && 
         activeMenu !== 'Attendance' && 
         renderPlaceholder()}
      </main>
    </div>
  );
};

export default StudentPortal;