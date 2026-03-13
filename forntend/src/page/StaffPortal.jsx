import React, { useState, useEffect } from 'react';

export default function StaffPortal({ handleLogout, apiUrl, user }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  
  // Data States
  const [studentList, setStudentList] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [announcementList, setAnnouncementList] = useState([]);
  
  // Marks Upload States
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [examType, setExamType] = useState("Midterm");
  const [score, setScore] = useState("");
  const [maxScore, setMaxScore] = useState("100");
  const [isSavingMark, setIsSavingMark] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Take Attendance', icon: '✅' },
    { name: 'Upload Marks', icon: '📝' },
    { name: 'Campus Announcements', icon: '📢' },
  ];

  // Fetch initial data for Staff
  const fetchData = async () => {
    try {
      const [studentRes, courseRes, announceRes] = await Promise.all([
        fetch(`${apiUrl}/api/host/all-students`),
        fetch(`${apiUrl}/api/host/all-courses`),
        fetch(`${apiUrl}/api/host/all-announcements`)
      ]);

      if (studentRes.ok) setStudentList(await studentRes.json());
      if (courseRes.ok) setCourseList(await courseRes.json());
      if (announceRes.ok) {
        const allAnnouncements = await announceRes.json();
        // Staff should only see 'ALL' or 'STAFF' announcements
        setAnnouncementList(allAnnouncements.filter(a => a.targetAudience === 'ALL' || a.targetAudience === 'STAFF'));
      }
    } catch (err) { console.error("Database sync failed"); }
  };

  useEffect(() => { fetchData(); }, []);

  // --- UI RENDERERS ---

  const renderDashboard = () => (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome, {user?.name || "Professor"}</h2>
        <p className="text-slate-500 font-medium mt-1">Here is your daily academic overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-indigo-600 text-white p-6 rounded-3xl shadow-lg flex flex-col justify-between">
          <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-2">Total Students</p>
          <p className="text-4xl font-bold">{studentList.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">My Subjects</p>
          <p className="text-4xl font-bold text-slate-800">{courseList.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Pending Tasks</p>
          <p className="text-4xl font-bold text-amber-500">2</p>
        </div>
      </div>
    </div>
  );

  const renderUploadMarks = () => {
    const handleUploadMark = async (e) => {
      e.preventDefault();
      if(!selectedStudent || !selectedSubject) return alert("Please select a student and a subject.");
      
      setIsSavingMark(true);
      try {
        const res = await fetch(`${apiUrl}/api/host/upload-mark`, { // We will build this endpoint next!
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            registerNumber: selectedStudent, 
            subjectCode: selectedSubject,
            examType: examType,
            score: parseInt(score),
            maxScore: parseInt(maxScore)
          })
        });
        if (res.ok) {
          alert("✅ Marks successfully uploaded!");
          setScore("");
        } else { alert("Failed to upload marks."); }
      } catch (err) { alert("Server Connection Error"); } 
      finally { setIsSavingMark(false); }
    };

    return (
      <div className="animate-in fade-in duration-500">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-8">Grade Entry System</h2>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 max-w-2xl">
          <h3 className="text-lg font-bold text-slate-800 mb-6 tracking-tight border-b border-slate-100 pb-3">Upload Student Marks</h3>
          
          <form onSubmit={handleUploadMark} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Select Student</label>
              <select required value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-700 appearance-none">
                <option value="">-- Choose Student --</option>
                {studentList.map(s => (
                  <option key={s.id} value={s.registerNumber}>{s.registerNumber} - {s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Select Subject</label>
              <select required value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-700 appearance-none">
                <option value="">-- Choose Subject --</option>
                {courseList.map(c => (
                  <option key={c.id} value={c.subjectCode}>{c.subjectCode} - {c.subjectName}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Exam Type</label>
                <select value={examType} onChange={e => setExamType(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-700 appearance-none">
                  <option value="Unit Test 1">Unit Test 1</option>
                  <option value="Midterm">Midterm</option>
                  <option value="Final Exam">Final Exam</option>
                  <option value="Assignment">Assignment</option>
                </select>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Score</label>
                  <input type="number" required min="0" value={score} onChange={e => setScore(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800" placeholder="0" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Max</label>
                  <input type="number" required min="1" value={maxScore} onChange={e => setMaxScore(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-400" />
                </div>
              </div>
            </div>

            <button disabled={isSavingMark} className="w-full py-4 mt-2 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md">
              {isSavingMark ? "Uploading..." : "Submit Grades to Database"}
            </button>
          </form>
        </div>
      </div>
    );
  };

  const renderAnnouncements = () => (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-8">Notice Board</h2>
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 max-w-4xl">
        <div className="space-y-4">
          {announcementList.length === 0 ? (
            <p className="text-slate-400 font-medium text-center py-10">No announcements at this time.</p>
          ) : (
            announcementList.map(a => (
              <div key={a.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg uppercase tracking-widest">
                    {a.targetAudience}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {new Date(a.postedAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-bold text-lg text-slate-800 mb-2">{a.title}</h4>
                <p className="text-slate-600 font-medium text-sm leading-relaxed whitespace-pre-wrap">{a.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderPlaceholder = () => (
    <div className="flex flex-col items-center justify-center h-[50vh] text-center animate-in fade-in duration-500">
      <div className="text-5xl mb-4 opacity-30">🚧</div>
      <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-2">{activeMenu}</h2>
      <p className="text-slate-500 font-medium">You can copy the Attendance component from the Admin Portal later.</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden relative">
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-20 lg:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* LEFT SIDEBAR */}
      <aside className={`absolute lg:static z-30 flex flex-col h-full w-72 bg-white border-r border-slate-200 shadow-2xl lg:shadow-none transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-inner">S</div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Staff<span className="text-indigo-600">Portal</span></h1>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 rounded-lg">✕</button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => { setActiveMenu(item.name); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
                activeMenu === item.name 
                ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <span className="text-xl opacity-80">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </div>

        <div className="p-5 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4 px-2">
            <img src={user?.picture || "https://via.placeholder.com/40"} alt="Profile" className="w-10 h-10 rounded-full border border-slate-200" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-800 truncate">{user?.name || "Staff Member"}</p>
              <p className="text-[11px] font-medium text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full py-3 bg-white border border-slate-200 text-rose-600 font-bold text-xs rounded-xl hover:bg-rose-50 transition-colors">
            Secure Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto relative custom-scrollbar w-full">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 px-6 lg:px-10 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3 lg:gap-0">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight truncate">{activeMenu}</h2>
          </div>
          <div className="text-[10px] lg:text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 whitespace-nowrap uppercase tracking-wider">
            Faculty Access
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          {activeMenu === 'Dashboard' && renderDashboard()}
          {activeMenu === 'Upload Marks' && renderUploadMarks()}
          {activeMenu === 'Campus Announcements' && renderAnnouncements()}
          {activeMenu !== 'Dashboard' && activeMenu !== 'Upload Marks' && activeMenu !== 'Campus Announcements' && renderPlaceholder()}
        </div>
      </main>
    </div>
  );
}