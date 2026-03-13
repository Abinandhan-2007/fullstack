import React, { useState, useEffect } from 'react';

export default function AdminPortal({ handleLogout, apiUrl, user }) {
  const [activeMenu, setActiveMenu] = useState('Attendance Monitoring'); // Set to Attendance to test the search!
  const [activeSubTab, setActiveSubTab] = useState('students'); 
  
  // User Management States
  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, totalStaff: 0 });

  // Courses & Subjects States
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [credits, setCredits] = useState("");
  const [courseList, setCourseList] = useState([]);
  const [isSavingCourse, setIsSavingCourse] = useState(false);

  // Attendance & Search States
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStudent, setSelectedStudent] = useState(""); 
  const [attendanceData, setAttendanceData] = useState({}); 
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  // Marks & Performance States
 // Marks & Performance States (VIEW ONLY)
  const [studentMarks, setStudentMarks] = useState([]);
  const [isFetchingMarks, setIsFetchingMarks] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'User Management', icon: '👥' },
    { name: 'Courses & Subjects', icon: '📚' },
    { name: 'Attendance Monitoring', icon: '✅' },
    { name: 'Marks & Performance', icon: '📈' },
    { name: 'Announcements', icon: '📢' },
    { name: 'Events', icon: '🗓️' },
    { name: 'Complaints', icon: '⚠️' },
    { name: 'Reports & Analytics', icon: '📑' },
    { name: 'System Settings', icon: '⚙️' },
    { name: 'Security Logs', icon: '🛡️' },
  ];

  // Fetch all data
  const fetchData = async () => {
    try {
      const [staffRes, studentRes, statsRes, courseRes] = await Promise.all([
        fetch(`${apiUrl}/api/host/all-staff`),
        fetch(`${apiUrl}/api/host/all-students`),
        fetch(`${apiUrl}/api/host/stats`),
        fetch(`${apiUrl}/api/host/all-courses`)
      ]);

      if (staffRes.ok) setStaffList(await staffRes.json());
      if (studentRes.ok) setStudentList(await studentRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
      if (courseRes.ok) setCourseList(await courseRes.json());
    } catch (err) { console.error("Database sync failed"); }
  };

  useEffect(() => { fetchData(); }, []);

  // Handle Add User (Staff/Student)
  const handleSubmitUser = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const endpoint = activeSubTab === 'staff' ? '/api/host/add-staff' : '/api/host/add-student';
    try {
      const res = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, registerNumber: regNo, email })
      });
      if (res.ok) {
        setName(""); setRegNo(""); setEmail("");
        fetchData();
      }
    } catch (err) { alert("Error saving"); } 
    finally { setIsSaving(false); }
  };

  // Handle Add Course
  const handleAddCourse = async (e) => {
    e.preventDefault();
    setIsSavingCourse(true);
    try {
      const res = await fetch(`${apiUrl}/api/host/add-course`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectName, subjectCode, credits: parseInt(credits) })
      });
      if (res.ok) {
        setSubjectName(""); setSubjectCode(""); setCredits("");
        fetchData();
      } else {
        alert("Failed to save course. Check for duplicate Subject Codes.");
      }
    } catch (err) { alert("Error connecting to server"); } 
    finally { setIsSavingCourse(false); }
  };

  // Handle Delete Data
  const handleDelete = async (id, type) => {
    if (!window.confirm(`Permanently delete this ${type}?`)) return;
    const endpoint = type === 'course' ? `/api/host/delete-course/${id}` 
                   : type === 'staff' ? `/api/host/delete-staff/${id}` 
                   : `/api/host/delete-student/${id}`;
    try {
      const res = await fetch(`${apiUrl}${endpoint}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (err) { console.error("Error deleting"); }
  };

  // --- UI RENDERERS ---

  const renderDashboard = () => (
    <div className="animate-in fade-in">
      <h2 className="text-3xl font-black text-slate-800 mb-8">System Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Total Students</p>
          <p className="text-5xl font-black text-blue-600">{stats.totalStudents || studentList.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Total Staff</p>
          <p className="text-5xl font-black text-slate-800">{stats.totalStaff || staffList.length}</p>
        </div>
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Active Courses</p>
          <p className="text-5xl font-black text-emerald-400">{courseList.length}</p>
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-slate-800">User Management</h2>
        <div className="bg-white p-1.5 rounded-xl border border-slate-200 flex shadow-sm">
          <button onClick={() => setActiveSubTab('students')} className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeSubTab === 'students' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-slate-800'}`}>Students</button>
          <button onClick={() => setActiveSubTab('staff')} className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeSubTab === 'staff' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:text-slate-800'}`}>Staff</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 h-fit">
          <h3 className="text-lg font-bold text-slate-800 mb-6 uppercase tracking-wider text-sm">Add {activeSubTab}</h3>
          <form onSubmit={handleSubmitUser} className="space-y-4">
            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Full Name" />
            <input type="text" required value={regNo} onChange={e => setRegNo(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Register Number" />
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Email Address" />
            <button disabled={isSaving} className={`w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-md ${activeSubTab === 'staff' ? 'bg-slate-800 hover:bg-slate-700' : 'bg-blue-600 hover:bg-blue-500'}`}>
              {isSaving ? "Saving..." : "Authorize User"}
            </button>
          </form>
        </div>
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 uppercase tracking-wider text-sm">Database Records</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {(activeSubTab === 'staff' ? staffList : studentList).map((person) => (
              <div key={person.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex justify-between items-center group hover:border-blue-300 transition-all">
                <div className="overflow-hidden">
                  <p className="font-bold text-slate-800 truncate">{person.name}</p>
                  <p className="text-xs font-black text-blue-600 mb-1">{person.registerNumber}</p>
                  <p className="text-xs text-slate-400 truncate">{person.email}</p>
                </div>
                <button onClick={() => handleDelete(person.id, activeSubTab)} className="p-2 text-slate-300 hover:text-rose-600 bg-white rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCoursesAndSubjects = () => (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-3xl font-black text-slate-800 mb-8">Academic Master: Subjects</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 h-fit">
          <h3 className="text-lg font-bold text-slate-800 mb-6 uppercase tracking-wider text-sm">Register Subject</h3>
          <form onSubmit={handleAddCourse} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Subject Name</label>
              <input type="text" required value={subjectName} onChange={e => setSubjectName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="e.g. Data Structures" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Subject Code</label>
              <input type="text" required value={subjectCode} onChange={e => setSubjectCode(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="e.g. CS8391" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Credits</label>
              <input type="number" required min="1" max="5" value={credits} onChange={e => setCredits(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="e.g. 3" />
            </div>
            <button disabled={isSavingCourse} className="w-full py-3.5 mt-4 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-600 transition-all shadow-md">
              {isSavingCourse ? "Saving..." : "Add to Curriculum"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 uppercase tracking-wider text-sm">Official Curriculum Map</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {courseList.length === 0 ? (
              <p className="text-slate-400 font-medium col-span-2 text-center py-10">No subjects added yet.</p>
            ) : (
              courseList.map((course) => (
                <div key={course.id} className="bg-amber-50 p-5 rounded-2xl border border-amber-100 flex justify-between items-center group hover:shadow-md transition-all">
                  <div>
                    <p className="font-bold text-slate-800">{course.subjectName}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="bg-amber-200 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-md tracking-wider">
                        {course.subjectCode}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">{course.credits} Credits</span>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(course.id, 'course')} className="p-2 text-amber-300 hover:text-rose-600 bg-white rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAttendanceMonitoring = () => {
    // Search Filter Logic
    const filteredStudents = studentList.filter(s => 
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
      s.registerNumber.toLowerCase().includes(studentSearch.toLowerCase())
    );

    const activeStudent = studentList.find(s => s.registerNumber === selectedStudent);

    const toggleAttendance = (subjectCode) => {
      setAttendanceData(prev => ({
        ...prev,
        [subjectCode]: !prev[subjectCode]
      }));
    };

    const handleSaveAttendance = async () => {
      if (!selectedStudent) return alert("Please search and select a student first!");
      setIsSavingAttendance(true);
      
      const payload = courseList.map(course => ({
        registerNumber: selectedStudent,
        subjectCode: course.subjectCode,
        date: attendanceDate,
        isPresent: attendanceData[course.subjectCode] || false
      }));

      try {
        const res = await fetch(`${apiUrl}/api/host/save-attendance`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) alert("✅ Attendance Locked in for " + attendanceDate);
        else alert("❌ Failed to save attendance.");
      } catch (err) { alert("Server Connection Error"); }
      finally { setIsSavingAttendance(false); }
    };

    return (
      <div className="animate-in fade-in duration-500">
        <h2 className="text-3xl font-black text-slate-800 mb-8">Daily Attendance Registry</h2>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8 flex flex-wrap gap-6 items-end relative">
          
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Select Date</label>
            <input type="date" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium text-slate-700" />
          </div>
          
          {/* LIVE SEARCH COMPONENT */}
          <div className="flex-1 min-w-[250px] relative">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Search Student</label>
            
            {activeStudent ? (
              <div className="flex items-center justify-between w-full bg-violet-50 border border-violet-200 rounded-xl px-4 py-2.5">
                <div>
                  <p className="text-sm font-bold text-violet-900 truncate">{activeStudent.name}</p>
                  <p className="text-[10px] font-black text-violet-600 tracking-wider">{activeStudent.registerNumber}</p>
                </div>
                <button 
                  onClick={() => { setSelectedStudent(""); setStudentSearch(""); setAttendanceData({}); }} 
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-violet-400 hover:text-rose-500 hover:bg-rose-50 font-bold shadow-sm transition-all"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="relative">
                <input 
                  type="text" 
                  value={studentSearch} 
                  onChange={e => { setStudentSearch(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-10 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium text-slate-700" 
                  placeholder="Name or Reg No..." 
                />
                <span className="absolute left-4 top-3.5 opacity-40">🔍</span>
                
                {showDropdown && studentSearch.length > 0 && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
                    {filteredStudents.length === 0 ? (
                      <div className="p-4 text-sm font-medium text-slate-400 text-center">No students found</div>
                    ) : (
                      filteredStudents.map(student => (
                        <div 
                          key={student.id} 
                          onClick={() => { setSelectedStudent(student.registerNumber); setShowDropdown(false); }}
                          className="p-3 border-b border-slate-50 hover:bg-violet-50 cursor-pointer transition-colors flex justify-between items-center group"
                        >
                          <div className="truncate pr-2">
                            <p className="font-bold text-slate-800 text-sm truncate">{student.name}</p>
                            <p className="text-[10px] tracking-widest text-violet-500 font-bold">{student.registerNumber}</p>
                          </div>
                          <span className="opacity-0 group-hover:opacity-100 text-violet-600 text-xs font-bold bg-violet-100 px-2 py-1 rounded-lg transition-all">Select</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <button onClick={handleSaveAttendance} disabled={isSavingAttendance || courseList.length === 0 || !selectedStudent} className="w-full md:w-auto px-10 py-3.5 rounded-xl font-bold text-white bg-violet-600 hover:bg-violet-700 transition-all shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed">
            {isSavingAttendance ? "Locking..." : "Lock Attendance"}
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="col-span-8 md:col-span-4 text-xs font-black text-slate-400 uppercase tracking-widest">Subject Name</div>
            <div className="col-span-4 text-xs font-black text-slate-400 uppercase tracking-widest hidden md:block">Subject Code</div>
            <div className="col-span-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right pr-4">Status</div>
          </div>
          
          <div className="max-h-[50vh] overflow-y-auto custom-scrollbar p-2">
            {!selectedStudent ? (
               <div className="text-center py-16">
                 <div className="text-4xl mb-3 opacity-50">🔍</div>
                 <p className="text-slate-400 font-medium">Search and select a student above to mark attendance.</p>
               </div>
            ) : courseList.length === 0 ? (
              <p className="text-center text-slate-400 py-10 font-medium">No subjects found. Add subjects in the Academic Master first.</p>
            ) : (
              courseList.map((course) => {
                const isPresent = attendanceData[course.subjectCode] || false;
                return (
                  <div key={course.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100 mb-1">
                    <div className="col-span-8 md:col-span-4 font-bold text-slate-800 truncate">{course.subjectName}</div>
                    <div className="col-span-4 text-sm font-semibold text-violet-600 hidden md:block tracking-widest">{course.subjectCode}</div>
                    <div className="col-span-4 flex justify-end">
                      <button onClick={() => toggleAttendance(course.subjectCode)} className={`px-6 py-2 rounded-lg font-bold text-[11px] tracking-widest transition-all w-28 shadow-sm ${isPresent ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-slate-100 text-slate-400 hover:bg-rose-500 hover:text-white'}`}>
                        {isPresent ? 'PRESENT' : 'ABSENT'}
                      </button>
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
// 5. Marks & Performance View (HOST READ-ONLY)
  const renderMarksAndPerformance = () => {
    const filteredStudents = studentList.filter(s => 
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
      s.registerNumber.toLowerCase().includes(studentSearch.toLowerCase())
    );

    const activeStudent = studentList.find(s => s.registerNumber === selectedStudent);

    // Fetch marks automatically when a student is selected
    const handleSelectStudent = async (regNo) => {
      setSelectedStudent(regNo);
      setShowDropdown(false);
      setIsFetchingMarks(true);
      
      try {
        const res = await fetch(`${apiUrl}/api/host/student-marks/${regNo}`);
        if (res.ok) {
          setStudentMarks(await res.json());
        } else {
          setStudentMarks([]);
        }
      } catch (err) {
        console.error("Failed to fetch marks");
      } finally {
        setIsFetchingMarks(false);
      }
    };

    // Helper to get Subject Name from Subject Code
    const getSubjectName = (code) => {
      const course = courseList.find(c => c.subjectCode === code);
      return course ? course.subjectName : code;
    };

    return (
      <div className="animate-in fade-in duration-500">
        <h2 className="text-3xl font-black text-slate-800 mb-8">Academic Report Viewer</h2>
        
        {/* Top Control Panel */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8">
          
          {/* LIVE SEARCH COMPONENT */}
          <div className="w-full relative max-w-2xl">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Search Student Record</label>
            {activeStudent ? (
              <div className="flex items-center justify-between w-full bg-rose-50 border border-rose-200 rounded-xl px-6 py-4">
                <div>
                  <p className="text-xl font-black text-rose-900 truncate">{activeStudent.name}</p>
                  <p className="text-xs font-black text-rose-600 tracking-wider mt-1">{activeStudent.registerNumber} • {activeStudent.email}</p>
                </div>
                <button onClick={() => { setSelectedStudent(""); setStudentSearch(""); setStudentMarks([]); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-rose-400 hover:text-rose-600 hover:bg-rose-100 font-bold shadow-sm transition-all text-lg">✕</button>
              </div>
            ) : (
              <div className="relative">
                <input 
                  type="text" value={studentSearch} 
                  onChange={e => { setStudentSearch(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-12 py-4 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium text-slate-700 text-lg" 
                  placeholder="Enter Student Name or Register Number..." 
                />
                <span className="absolute left-5 top-4 opacity-40 text-lg">🔍</span>
                {showDropdown && studentSearch.length > 0 && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
                    {filteredStudents.length === 0 ? (
                      <div className="p-4 text-sm font-medium text-slate-400 text-center">No matching records</div>
                    ) : (
                      filteredStudents.map(student => (
                        <div key={student.id} onClick={() => handleSelectStudent(student.registerNumber)} className="p-4 border-b border-slate-50 hover:bg-rose-50 cursor-pointer transition-colors flex justify-between items-center group">
                          <div className="truncate pr-2">
                            <p className="font-bold text-slate-800 text-base truncate">{student.name}</p>
                            <p className="text-xs tracking-widest text-rose-500 font-bold">{student.registerNumber}</p>
                          </div>
                          <span className="opacity-0 group-hover:opacity-100 text-rose-600 text-xs font-bold bg-rose-100 px-3 py-1.5 rounded-lg transition-all">View Report</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Report Card Viewer */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
          <div className="grid grid-cols-12 gap-4 p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="col-span-5 text-xs font-black text-slate-400 uppercase tracking-widest">Subject</div>
            <div className="col-span-3 text-xs font-black text-slate-400 uppercase tracking-widest">Exam Type</div>
            <div className="col-span-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right pr-4">Score Obtained</div>
          </div>
          
          <div className="max-h-[50vh] overflow-y-auto custom-scrollbar p-2">
            {!selectedStudent ? (
               <div className="text-center py-24">
                 <div className="text-5xl mb-4 opacity-40">🗂️</div>
                 <p className="text-slate-400 font-medium text-lg">Select a student to view their academic performance.</p>
               </div>
            ) : isFetchingMarks ? (
               <div className="text-center py-20">
                 <p className="text-rose-500 font-bold animate-pulse">Retrieving records from database...</p>
               </div>
            ) : studentMarks.length === 0 ? (
              <div className="text-center py-20">
                 <p className="text-slate-400 font-medium">No exam marks have been uploaded for this student yet.</p>
              </div>
            ) : (
              studentMarks.map((mark) => {
                const percentage = (mark.score / mark.maxScore) * 100;
                // Simple pass/fail logic based on 50%
                const isPass = percentage >= 50; 

                return (
                  <div key={mark.id} className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100 mb-1">
                    <div className="col-span-5">
                      <p className="font-bold text-slate-800 truncate">{getSubjectName(mark.subjectCode)}</p>
                      <p className="text-xs font-semibold text-rose-500 tracking-widest">{mark.subjectCode}</p>
                    </div>
                    <div className="col-span-3">
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-md">
                        {mark.examType}
                      </span>
                    </div>
                    <div className="col-span-4 flex justify-end items-center gap-4 pr-2">
                      <div className="text-right">
                        <p className="font-black text-xl text-slate-800">{mark.score} <span className="text-sm text-slate-400">/ {mark.maxScore}</span></p>
                      </div>
                      <div className={`w-20 text-center py-1.5 rounded-lg text-xs font-black tracking-widest ${isPass ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {isPass ? 'PASS' : 'FAIL'}
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
      <div className="text-6xl mb-4">🚧</div>
      <h2 className="text-2xl font-black text-slate-800 mb-2">{activeMenu} Module</h2>
      <p className="text-slate-500">This section is currently under construction.</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* LEFT SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm z-20">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-inner">C</div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Central<span className="text-indigo-600">Portal</span></h1>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveMenu(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                activeMenu === item.name 
                ? 'bg-blue-50 text-blue-700 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4 px-2">
            <img src={user?.picture || "https://via.placeholder.com/40"} alt="Profile" className="w-10 h-10 rounded-full border border-slate-200" />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">{user?.name || "Admin"}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full py-2.5 bg-rose-50 text-rose-600 font-bold text-xs rounded-xl hover:bg-rose-100 transition-colors">
            Secure Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative custom-scrollbar">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 px-8 py-5 flex justify-between items-center">
          <h2 className="text-lg font-black text-slate-800">{activeMenu}</h2>
          <div className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
            Host Privilege Active
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {activeMenu === 'Dashboard' && renderDashboard()}
          {activeMenu === 'User Management' && renderUserManagement()}
          {activeMenu === 'Courses & Subjects' && renderCoursesAndSubjects()}
          {activeMenu === 'Attendance Monitoring' && renderAttendanceMonitoring()}
          {activeMenu === 'Marks & Performance' && renderMarksAndPerformance()}
          {
            activeMenu !== 'Dashboard' && 
            activeMenu !== 'User Management' && 
            activeMenu !== 'Courses & Subjects' && 
            activeMenu !== 'Attendance Monitoring' && 
            activeMenu !== 'Marks & Performance' &&
            renderPlaceholder()
          }
        </div>
      </main>
    </div>
  );
}