import React, { useState, useEffect } from 'react';

const StudentPortal = ({ user, handleLogout }) => {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [myMarks, setMyMarks] = useState([]);
  const [isFetchingMarks, setIsFetchingMarks] = useState(false);
  
  // Sets the date to today
  const [attendanceDate, setAttendanceDate] = useState(new Date()); 
  const [studentProfile, setStudentProfile] = useState(null);

  // --- NEW: SERVER-LEVEL TIMETABLE STATES ---
  const [globalTimetable, setGlobalTimetable] = useState([]);
  const [isLoadingTimetable, setIsLoadingTimetable] = useState(false);
  
  const apiUrl = "https://fullstack-8cjk.onrender.com";

  // 1. Fetch Student Profile
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

  // --- 2. NEW: FETCH TIMETABLE FROM SERVER DATABASE ---
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

  const menuItems = [
    { name: 'Dashboard', icon: '📊', color: 'text-blue-500', bg: 'bg-blue-500', desc: 'Main overview and quick access links.' },
    { name: 'Profile', icon: '👤', color: 'text-slate-500', bg: 'bg-slate-500', desc: 'Manage your personal and academic details.' },
    { name: 'Attendance', icon: '✅', color: 'text-emerald-500', bg: 'bg-emerald-500', desc: 'Track your daily and subject-wise attendance.' },
    { name: 'Marks / Results', icon: '📈', color: 'text-indigo-500', bg: 'bg-indigo-500', desc: 'View your internal marks and semester results.' },
    { name: 'Arrear Tracker', icon: '⚠️', color: 'text-rose-500', bg: 'bg-rose-500', desc: 'Monitor and apply for arrear examinations.' },
    { name: 'Subjects', icon: '📚', color: 'text-amber-500', bg: 'bg-amber-500', desc: 'Access your current semester course materials.' },
    { name: 'Timetable', icon: '📅', color: 'text-cyan-500', bg: 'bg-cyan-500', desc: 'Check your daily class and lab schedule.' },
    { name: 'Notifications', icon: '🔔', color: 'text-violet-500', bg: 'bg-violet-500', desc: 'Campus announcements and alerts.' },
    { name: 'Leave Request', icon: '📝', color: 'text-orange-500', bg: 'bg-orange-500', desc: 'Apply for OD, medical, or general leave.' },
    { name: 'Documents', icon: '📂', color: 'text-teal-500', bg: 'bg-teal-500', desc: 'Download fee receipts, bonafide, and certificates.' },
  ];

  const renderDashboard = () => {
    const studentStats = {
      mentorName: "Dr. Faculty Assigned",
      currentSemester: "Active Semester",
      attendancePercentage: 88.5,
      totalSubjects: 6,
      arrearCount: 0,
      sgpa: 8.42,
      cgpa: 8.55
    };

    return (
      <div className="animate-in fade-in duration-500">
        <div className="mb-8 text-center md:text-left bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
          <img 
            src={user?.picture || "https://via.placeholder.com/100"} 
            alt="Profile" 
            className="w-24 h-24 rounded-2xl border-4 border-white shadow-md z-10"
          />
          <div className="relative z-10 flex flex-col justify-center">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {studentProfile?.name || user?.name || 'Loading Student...'}
            </h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
              <span className="bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-lg text-sm border border-slate-200">
                {studentProfile?.registerNumber || 'Loading ID...'}
              </span>
              <span className="text-slate-500 font-medium text-sm">
                • {studentProfile?.department || 'Loading Department...'}
              </span>
              {studentProfile?.batch && (
                <span className="text-slate-500 font-medium text-sm">
                  • Batch {studentProfile.batch}
                </span>
              )}
            </div>
            <p className="text-blue-600 font-semibold text-xs mt-2">{user?.email}</p>
          </div>
          <div className="absolute -right-10 -top-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        </div>

        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-5 px-1">Academic Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:border-blue-300 transition-colors">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Faculty Mentor</p>
              <p className="font-bold text-slate-800 text-lg">{studentStats.mentorName}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Semester</p>
              <p className="font-bold text-blue-600">{studentStats.currentSemester}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:border-emerald-300 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overall Attendance</p>
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-800 tracking-tighter mb-2">
                {studentStats.attendancePercentage}%
              </p>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${studentStats.attendancePercentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                  style={{ width: `${studentStats.attendancePercentage}%` }}
                ></div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 mt-2">
                {studentStats.attendancePercentage >= 75 ? 'Safe Zone' : 'Shortage Warning'}
              </p>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl shadow-md border border-slate-800 flex flex-col justify-between text-white hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Performance</p>
              <span className="text-2xl">📈</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">SGPA</p>
                <p className="text-2xl font-black text-amber-400">{studentStats.sgpa}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">CGPA</p>
                <p className="text-2xl font-black text-white">{studentStats.cgpa}</p>
              </div>
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
                <p className={`text-3xl font-black ${studentStats.arrearCount === 0 ? 'text-emerald-500' : 'text-rose-600'}`}>
                  {studentStats.arrearCount}
                </p>
                {studentStats.arrearCount === 0 && (
                  <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-1 bg-emerald-50 inline-block px-2 py-0.5 rounded">All Clear</p>
                )}
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Marks & Results</h2>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">
              Academic Performance Record
            </p>
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
                <th className="py-4 px-6">Subject Code</th>
                <th className="py-4 px-6">Assessment Type</th>
                <th className="py-4 px-6 text-right">Score Obtained</th>
                <th className="py-4 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!studentProfile ? (
                <tr><td colSpan="4" className="text-center py-20 text-slate-400 font-medium">Loading your profile...</td></tr>
              ) : isFetchingMarks ? (
                <tr><td colSpan="4" className="text-center py-20 text-indigo-500 font-bold animate-pulse tracking-widest">FETCHING YOUR SECURE RECORDS...</td></tr>
              ) : myMarks.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-20">
                    <span className="text-4xl block mb-3 opacity-50">📭</span>
                    <p className="text-slate-500 font-medium">No marks have been published for you yet.</p>
                  </td>
                </tr>
              ) : (
                myMarks.map((mark) => {
                  const isPass = (mark.score / mark.maxScore) * 100 >= 50; 
                  return (
                    <tr key={mark.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-bold text-slate-800 uppercase bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 tracking-wider">
                          {mark.subjectCode}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                          {mark.examType}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <p className="font-black text-slate-800 text-lg">
                          {mark.score} <span className="text-xs text-slate-400 font-normal">/ {mark.maxScore}</span>
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center">
                          <div className={`text-[10px] font-black px-3 py-1.5 rounded w-16 text-center border-2 ${isPass ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                            {isPass ? 'PASS' : 'FAIL'}
                          </div>
                        </div>
                      </td>
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

  // ==========================================
  // UPDATED ATTENDANCE TIMELINE (SERVER-SYNCED)
  // ==========================================
  const renderAttendance = () => {
    
    // Filter Server Data (Case-Insensitive)
    const myClasses = globalTimetable.filter(m => {
      if (!studentProfile?.department) return false;
      const adminDept = (m.department || "").toLowerCase().trim();
      const studentDept = (studentProfile.department || "").toLowerCase().trim();
      return adminDept === studentDept || adminDept === 'all departments';
    });

    const timeSlots = ["09:00 AM", "09:50 AM", "10:40 AM", "11:30 AM", "01:10 PM", "02:00 PM", "02:50 PM", "03:40 PM"];

    const handlePrevDay = () => {
      const prev = new Date(attendanceDate);
      prev.setDate(prev.getDate() - 1);
      setAttendanceDate(prev);
    };

    const handleNextDay = () => {
      const next = new Date(attendanceDate);
      next.setDate(next.getDate() + 1);
      setAttendanceDate(next);
    };

    const formattedDate = attendanceDate.toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    }).replace(/ /g, '-');

    return (
      <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
        
        {/* HEADER & DATE CONTROLS */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Daily Log</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Live Database Sync</p>
          </div>
          
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button onClick={handlePrevDay} className="px-3 py-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Previous Day">◀</button>
            <div className="px-4 py-1.5 font-bold text-indigo-700 text-sm flex items-center gap-2 min-w-[130px] justify-center">
              <span>📅</span> {formattedDate}
            </div>
            <button onClick={handleNextDay} className="px-3 py-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Next Day">▶</button>
          </div>
        </div>

        {/* FULL DAY CONNECTED TIMELINE */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
               Today's Classes for {studentProfile?.department || '...'}
             </h3>
             {isLoadingTimetable && (
               <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded animate-pulse">
                 SYNCING WITH DB...
               </span>
             )}
          </div>
          
          <div className="relative pl-4 md:pl-0">
            {/* The Vertical Line */}
            <div className="absolute left-[23px] md:left-[110px] top-4 bottom-8 w-[2px] bg-slate-100"></div>

            {myClasses.length === 0 && !isLoadingTimetable ? (
              <div className="text-center py-10 text-slate-400 font-medium border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                <p className="mb-2">No classes scheduled by Admin for your department today.</p>
              </div>
            ) : (
              timeSlots.map((time, index) => {
                // Match against the Spring Boot entity field name "timeSlot"
                const session = myClasses.find(c => c.timeSlot === time);
                if (!session) return null;

                return (
                  <div key={index} className="relative flex flex-col md:flex-row items-start mb-8 last:mb-0 group">
                    
                    {/* Time Stamp */}
                    <div className="md:w-[90px] pt-1.5 md:text-right md:pr-6 mb-2 md:mb-0 pl-12 md:pl-0">
                      <p className="text-xs font-black text-slate-800">{session.timeSlot}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">50m</p>
                    </div>

                    {/* Timeline Node (The Yellow Dot) */}
                    <div className="absolute left-0 md:left-[96px] top-1.5 w-[28px] h-[28px] rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 transition-colors duration-300 bg-amber-400">
                      <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                    </div>

                    {/* Content Card */}
                    <div className="flex-1 ml-12 md:ml-10 border rounded-xl p-4 transition-all bg-slate-50 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-sm md:text-base leading-tight text-slate-800">
                            {session.subjectName}
                          </h4>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[9px] font-black bg-white border px-1.5 py-0.5 rounded uppercase tracking-widest border-slate-200 text-slate-500">
                              {session.subjectCode}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">{session.sessionType}</span>
                          </div>
                        </div>
                        
                        <div className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border bg-amber-50 text-amber-600 border-amber-100">
                          Scheduled
                        </div>
                      </div>
                      
                      {/* FOOTER: Staff Name AND Venue */}
                      <div className="mt-3 pt-3 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-slate-200/60">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                          <p className="text-xs font-medium text-slate-500">
                            Faculty: <span className="font-bold text-slate-800">{session.faculty}</span>
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            📍 {session.venue}
                          </p>
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
      <div className="text-5xl mb-4 text-slate-300">
        {menuItems.find(m => m.name === activeMenu)?.icon || '🚧'}
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">{activeMenu}</h2>
      <p className="text-sm text-slate-500 max-w-md">
        We are currently building the {activeMenu} module. Check back soon for updates!
      </p>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden relative">
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-20 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`
        absolute lg:static z-30 flex flex-col h-full w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-inner">C</div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">Student<span className="text-blue-600">HQ</span></h1>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-md">✕</button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-5 px-4 space-y-1 custom-scrollbar">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2 mt-2">Main Menu</p>
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => { setActiveMenu(item.name); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeMenu === item.name 
                ? 'bg-blue-50 text-blue-700 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <span className="text-lg opacity-80">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </div>

        <div className="p-5 border-t border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-4">
            <img src={user?.picture || "https://via.placeholder.com/40"} alt="Profile" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{studentProfile?.name || user?.name}</p>
              <p className="text-[10px] font-semibold text-slate-500 truncate uppercase tracking-wide">
                {studentProfile?.department || 'Loading...'}
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full py-2.5 bg-white border border-slate-200 text-rose-600 font-bold text-xs rounded-xl hover:bg-rose-50 hover:border-rose-200 transition-colors shadow-sm">
            Secure Sign Out
          </button>
        </div>
      </aside>

    <main className="flex-1 overflow-y-auto relative custom-scrollbar w-full">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 px-5 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 lg:gap-0">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-1.5 -ml-1.5 text-slate-500 hover:bg-slate-100 rounded-md">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <h2 className="text-lg font-bold text-slate-800 truncate flex items-center gap-2">
              {menuItems.find(m => m.name === activeMenu)?.icon} {activeMenu}
            </h2>
          </div>
          <div className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
            {studentProfile?.registerNumber || 'Student'} Account
          </div>
        </header>

        <div className="p-5 lg:p-8 max-w-7xl mx-auto">
          {activeMenu === 'Dashboard' && renderDashboard()}
          {activeMenu === 'Marks / Results' && renderMarksAndPerformance()}
          {activeMenu === 'Attendance' && renderAttendance()}
          
          {activeMenu !== 'Dashboard' && 
           activeMenu !== 'Marks / Results' && 
           activeMenu !== 'Attendance' && 
           renderPlaceholder()}
        </div>
      </main>
    </div>
  );
};

export default StudentPortal;