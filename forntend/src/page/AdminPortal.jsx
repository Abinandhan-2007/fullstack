import React, { useState, useEffect } from 'react';

export default function AdminPortal({ handleLogout, apiUrl, user }) {
  // Mobile Sidebar State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Dashboard'); 
  const [activeSubTab, setActiveSubTab] = useState('students'); 
  // Department Master States
  const [departmentList, setDepartmentList] = useState([]);
  const [newDeptName, setNewDeptName] = useState("");
  const [isSavingDept, setIsSavingDept] = useState(false);


  // Courses & Subjects States
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [credits, setCredits] = useState("");
  const [courseDepartment, setCourseDepartment] = useState(""); // <-- ADDED
  const [filterCourseDept, setFilterCourseDept] = useState("ALL");
  const [selectedDeptForModal, setSelectedDeptForModal] = useState(null);
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
  const [studentMarks, setStudentMarks] = useState([]);
  const [isFetchingMarks, setIsFetchingMarks] = useState(false);
  
  // Announcements States
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementMessage, setAnnouncementMessage] = useState("");
  const [announcementAudience, setAnnouncementAudience] = useState("ALL");
  const [announcementList, setAnnouncementList] = useState([]);
const [announcementDept, setAnnouncementDept] = useState("ALL"); // This was likely missing
const [isPosting, setIsPosting] = useState(false);
  // Complaints State
  const [complaintList, setComplaintList] = useState([]);
  // User Management States
  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("Computer Science (CSE)"); // ONLY ONE OF THESE
  const [isSaving, setIsSaving] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, totalStaff: 0 });
  const [filterDepartment, setFilterDepartment] = useState("ALL");

  const menuItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Departments', icon: '🏢' },
    { name: 'User Management', icon: '👥' },
    { name: 'Courses & Subjects', icon: '📚' },
    { name: 'Attendance Monitoring', icon: '✅' },
    { name: 'Marks & Performance', icon: '📈' },
    { name: 'Announcements', icon: '📢' },
    { name: 'Complaints', icon: '⚠️' },
    { name: 'Reports & Analytics', icon: '📑' },
    { name: 'System Settings', icon: '⚙️' },
    { name: 'Security Logs', icon: '🛡️' },
  ];

  // Fetch all data
  // Fetch all data
  const fetchData = async () => {
    try {
      // 1. Notice we added 'deptRes' to this list!
      const [staffRes, studentRes, statsRes, courseRes, announceRes, deptRes] = await Promise.all([
        fetch(`${apiUrl}/api/host/all-staff`),
        fetch(`${apiUrl}/api/host/all-students`),
        fetch(`${apiUrl}/api/host/stats`),
        fetch(`${apiUrl}/api/host/all-courses`),
        fetch(`${apiUrl}/api/host/all-announcements`),
        fetch(`${apiUrl}/api/host/all-departments`) // 2. This pulls the departments!
      ]);

      if (staffRes.ok) setStaffList(await staffRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
      if (courseRes.ok) setCourseList(await courseRes.json());
      if (announceRes.ok) setAnnouncementList(await announceRes.json());
      if (studentRes.ok) setStudentList(await studentRes.json());
      
      // 3. This saves them to your screen
      if (deptRes.ok) setDepartmentList(await deptRes.json()); 

    } catch (err) { console.error("Database sync failed:", err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const endpoint = activeSubTab === 'staff' ? '/api/host/add-staff' : '/api/host/add-student';
    try {
      const res = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, registerNumber: regNo, email, department }) // <-- ADDED department
      });
      if (res.ok) {
        setName(""); setRegNo(""); setEmail(""); setDepartment("Computer Science (CSE)"); // <-- RESET
        fetchData();
      }
    } catch (err) { alert("Error saving"); } 
    finally { setIsSaving(false); }
  };

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
      } else { alert("Failed to save course. Check for duplicate Subject Codes."); }
    } catch (err) { alert("Error connecting to server"); } 
    finally { setIsSavingCourse(false); }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Permanently delete this ${type}?`)) return;
const endpoint = type === 'course' ? `/api/host/delete-course/${id}` 
                   : type === 'staff' ? `/api/host/delete-staff/${id}` 
                   : type === 'announcement' ? `/api/host/delete-announcement/${id}`
                   : type === 'complaint' ? `/api/host/delete-complaint/${id}`
                   : type === 'department' ? `/api/host/delete-department/${id}`
                    // <-- ADDED THIS
                   : `/api/host/delete-student/${id}`;
    try {
      const res = await fetch(`${apiUrl}${endpoint}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (err) { console.error("Error deleting"); }
  };

  // --- UI RENDERERS ---

  const renderDashboard = () => (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-6">System Overview</h2>

      {/* TOP ROW: Primary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-200 transition-colors">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Students</p>
          <p className="text-3xl font-bold text-blue-600">{stats.totalStudents || studentList.length}</p>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Staff</p>
          <p className="text-3xl font-bold text-slate-800">{stats.totalStaff || staffList.length}</p>
        </div>
        
        <div className="bg-slate-900 text-white p-5 rounded-xl shadow-md flex flex-col justify-between">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Active Courses</p>
          <p className="text-3xl font-bold text-emerald-400">{courseList.length}</p>
        </div>

        <div className="bg-violet-600 text-white p-5 rounded-xl shadow-md flex flex-col justify-between">
          <p className="text-xs font-semibold text-violet-200 uppercase tracking-wider mb-2">Today's Attendance</p>
          <p className="text-3xl font-bold text-white">88<span className="text-xl font-medium opacity-80">%</span></p> 
        </div>
      </div>

      {/* MIDDLE ROW: Academic Performance KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-colors">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Total Pass Percentage</p>
            <p className="text-3xl font-bold text-slate-800">76.4<span className="text-lg text-slate-400 font-medium">%</span></p>
          </div>
          <div className="text-3xl opacity-30 group-hover:opacity-100 transition-opacity">📈</div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-rose-200 transition-colors">
          <div>
            <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">Total Arrear Count</p>
            <p className="text-3xl font-bold text-slate-800">142</p>
          </div>
          <div className="text-3xl opacity-30 group-hover:opacity-100 transition-opacity">⚠️</div>
        </div>
      </div>

      {/* BOTTOM ROW: Department Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/80 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-800">Department Analytics</h3>
          <span className="text-[10px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded border border-slate-200 uppercase tracking-wider">Live Data</span>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-white text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-5">Department Name</th>
                <th className="py-3 px-5 text-center">Pass %</th>
                <th className="py-3 px-5 text-center">Arrear Count</th>
                <th className="py-3 px-5 text-right">Attendance %</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700">
              {[
                { dept: "Computer Science and Eng. (CSE)", pass: "82.5%", arrear: 34, att: "91.2%" },
                { dept: "Information Technology (IT)", pass: "79.0%", arrear: 28, att: "89.5%" },
                { dept: "Electronics and Comm. (ECE)", pass: "71.4%", arrear: 45, att: "85.0%" },
                { dept: "Mechanical Engineering (MECH)", pass: "68.2%", arrear: 35, att: "82.1%" }
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-5 font-medium text-slate-800">{row.dept}</td>
                  <td className="py-3.5 px-5 text-center text-emerald-600 font-semibold">{row.pass}</td>
                  <td className="py-3.5 px-5 text-center text-rose-600 font-semibold">{row.arrear}</td>
                  <td className="py-3.5 px-5 text-right text-violet-600 font-semibold">{row.att}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

 const renderUserManagement = () => {
    // 1. Determine if we are looking at staff or students
    const currentList = activeSubTab === 'staff' ? staffList : studentList;
    
    // 2. Filter the list based on the dropdown selection
    const filteredList = filterDepartment === "ALL" 
      ? currentList 
      : currentList.filter(person => person.department === filterDepartment);

    return (
      <div className="animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Directory Management</h2>
          <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex">
            <button onClick={() => { setActiveSubTab('students'); setFilterDepartment('ALL'); }} className={`px-4 py-1.5 rounded-md font-semibold text-sm transition-all ${activeSubTab === 'students' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Students</button>
            <button onClick={() => { setActiveSubTab('staff'); setFilterDepartment('ALL'); }} className={`px-4 py-1.5 rounded-md font-semibold text-sm transition-all ${activeSubTab === 'staff' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Staff</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
            <h3 className="text-sm font-bold text-slate-800 mb-5 border-b border-slate-100 pb-2 uppercase tracking-wider">Add {activeSubTab}</h3>
            <form onSubmit={handleSubmitUser} className="space-y-3.5">
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-colors" placeholder="Full Name" />
              <input type="text" required value={regNo} onChange={e => setRegNo(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-colors" placeholder="ID / Register Number" />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-colors" placeholder="Email Address" />
              
              {/* DYNAMIC Department Dropdown (Pulls from Database) */}
              <select required value={department} onChange={e => setDepartment(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-colors appearance-none font-medium text-slate-700 cursor-pointer">
                <option value="">-- Select Department --</option>
                {departmentList.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>

              <button disabled={isSaving} className={`w-full py-2.5 mt-1 rounded-lg font-semibold text-sm text-white transition-colors ${activeSubTab === 'staff' ? 'bg-slate-800 hover:bg-slate-700' : 'bg-blue-600 hover:bg-blue-500'}`}>
                {isSaving ? "Saving..." : "Create Record"}
              </button>
            </form>
          </div>
          
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            
            {/* Header with the DYNAMIC Filter Dropdown */}
            <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Database Records</h3>
              <select 
                value={filterDepartment} 
                onChange={e => setFilterDepartment(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-400 cursor-pointer transition-colors max-w-[200px] truncate"
              >
                <option value="ALL">All Departments</option>
                {departmentList.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredList.length === 0 ? (
                <div className="col-span-2 text-center py-12 text-slate-400 text-sm font-medium">
                  No records found in this department.
                </div>
              ) : (
                filteredList.map((person) => (
                  <div key={person.id} className="p-4 rounded-lg border border-slate-200 flex justify-between items-center group hover:border-blue-300 hover:bg-blue-50/30 transition-all">
                    <div className="overflow-hidden pr-2">
                      <p className="font-semibold text-sm text-slate-800 truncate">{person.name}</p>
                      
                      {/* Department Badge next to RegNo */}
                      <div className="flex items-center gap-2 my-0.5">
                        <p className="text-[11px] font-bold text-blue-600">{person.registerNumber}</p>
                        {person.department && (
                          <span className="text-[9px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded truncate max-w-[100px]">
                            {person.department.split(' ')[0]} {/* Shows just the first word for neatness */}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 truncate">{person.email}</p>
                    </div>
                    <button onClick={() => handleDelete(person.id, activeSubTab)} className="text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 flex-shrink-0">
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
const renderAnnouncements = () => {
  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    setIsPosting(true);
    try {
      const res = await fetch(`${apiUrl}/api/host/post-announcement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: announcementTitle, 
          message: announcementMessage, 
          targetAudience: announcementAudience,
          department: announcementDept 
        })
      });
      if (res.ok) {
        setAnnouncementTitle(""); 
        setAnnouncementMessage(""); 
        setAnnouncementAudience("ALL");
        setAnnouncementDept("ALL"); 
        fetchData();
      }
    } catch (err) { 
      alert("Server Connection Error"); 
    } finally { 
      setIsPosting(false); 
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // SAFETY CHECK: Ensure lists are arrays before filtering
  const safeAnnouncements = announcementList || [];
  const safeDepartments = departmentList || [];

  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-6">Campus Broadcasting</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CREATE FORM */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
          <h3 className="text-sm font-bold text-slate-800 mb-5 border-b border-slate-100 pb-2 uppercase tracking-wider">New Broadcast</h3>
          <form onSubmit={handlePostAnnouncement} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Target Group</label>
                <select value={announcementAudience} onChange={e => setAnnouncementAudience(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-teal-400">
                  <option value="ALL">Everyone</option>
                  <option value="STUDENTS">Students</option>
                  <option value="STAFF">Staff</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Dept Filter</label>
                <select value={announcementDept} onChange={e => setAnnouncementDept(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-teal-600 outline-none focus:border-teal-400">
                  <option value="ALL">All Depts</option>
                  {safeDepartments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Subject Title</label>
              <input type="text" required value={announcementTitle} onChange={e => setAnnouncementTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-teal-400" placeholder="e.g. Lab Maintenance" />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Message Body</label>
              <textarea required rows="4" value={announcementMessage} onChange={e => setAnnouncementMessage(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-teal-400 resize-none" placeholder="Type your message..." />
            </div>

            <button disabled={isPosting} className="w-full py-2.5 mt-1 rounded-lg font-semibold text-sm text-white bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 shadow-sm transition-colors">
              {isPosting ? "Sending..." : "Dispatch Broadcast"}
            </button>
          </form>
        </div>

        {/* BROADCAST HISTORY */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Broadcast History</h3>
            <select 
              value={filterCourseDept} 
              onChange={e => setFilterCourseDept(e.target.value)}
              className="text-[10px] font-bold bg-slate-100 border-none rounded px-2 py-1 text-slate-500 outline-none"
            >
              <option value="ALL">Show All History</option>
              {safeDepartments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {safeAnnouncements
              .filter(a => filterCourseDept === "ALL" || a.department === filterCourseDept)
              .length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-sm italic">No history found.</div>
            ) : (
              safeAnnouncements
                .filter(a => filterCourseDept === "ALL" || a.department === filterCourseDept)
                .map((announcement) => (
                <div key={announcement.id} className="p-4 rounded-lg border border-slate-200 group relative hover:border-teal-300 hover:bg-teal-50/20 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                        announcement.targetAudience === 'ALL' ? 'bg-slate-100 text-slate-600' : 
                        announcement.targetAudience === 'STUDENTS' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {announcement.targetAudience}
                      </span>
                      {announcement.department && announcement.department !== "ALL" && (
                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-teal-100 text-teal-700 border border-teal-200">
                          {announcement.department}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-medium italic">{formatDate(announcement.postedAt)}</span>
                    </div>
                    <button onClick={() => handleDelete(announcement.id, 'announcement')} className="text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all">✕</button>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1">{announcement.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{announcement.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
 const renderCoursesAndSubjects = () => {
    
    // Filter the courses based on the dropdown selection
    const filteredCourses = filterCourseDept === "ALL" 
      ? courseList 
      : courseList.filter(course => course.department === filterCourseDept);

    const handleAddCourse = async (e) => {
      e.preventDefault();
      setIsSavingCourse(true);
      try {
        const res = await fetch(`${apiUrl}/api/host/add-course`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subjectName, subjectCode, credits: parseInt(credits), department: courseDepartment })
        });
        if (res.ok) {
          setSubjectName(""); setSubjectCode(""); setCredits(""); setCourseDepartment("");
          fetchData();
        } else { alert("Failed to save course. Check for duplicate Subject Codes."); }
      } catch (err) { alert("Error connecting to server"); } 
      finally { setIsSavingCourse(false); }
    };

    return (
      <div className="animate-in fade-in duration-500 relative">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-6">Curriculum Master</h2>
        
        {/* TOP SECTION: Form & List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Add Subject Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
            <h3 className="text-sm font-bold text-slate-800 mb-5 border-b border-slate-100 pb-2 uppercase tracking-wider">Register Subject</h3>
            <form onSubmit={handleAddCourse} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Subject Name</label>
                <input type="text" required value={subjectName} onChange={e => setSubjectName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-400 focus:bg-white transition-colors" placeholder="e.g. Data Structures" />
              </div>
              
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Course Code</label>
                <input type="text" required value={subjectCode} onChange={e => setSubjectCode(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-400 focus:bg-white transition-colors" placeholder="e.g. CS8391" />
              </div>
              
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Owning Department</label>
                <select required value={courseDepartment} onChange={e => setCourseDepartment(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-400 focus:bg-white transition-colors appearance-none font-medium text-slate-700 cursor-pointer">
                  <option value="">-- Select Department --</option>
                  {departmentList.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Credit Units</label>
                <input type="number" required min="1" max="5" value={credits} onChange={e => setCredits(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-400 focus:bg-white transition-colors" placeholder="e.g. 3" />
              </div>
              
              <button disabled={isSavingCourse} className="w-full py-2.5 mt-2 rounded-lg font-semibold text-sm text-white bg-amber-500 hover:bg-amber-600 transition-colors shadow-sm">
                {isSavingCourse ? "Saving..." : "Add to Registry"}
              </button>
            </form>
          </div>

          {/* Subject List & Filter */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Official Subject List</h3>
              <select 
                value={filterCourseDept} 
                onChange={e => setFilterCourseDept(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-400 cursor-pointer transition-colors max-w-[200px] truncate"
              >
                <option value="ALL">All Departments</option>
                {departmentList.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredCourses.length === 0 ? (
                <p className="text-sm text-slate-400 col-span-2 text-center py-12 font-medium">No subjects found in this view.</p>
              ) : (
                filteredCourses.map((course) => (
                  <div key={course.id} className="p-4 rounded-lg border border-slate-200 flex justify-between items-start group hover:border-amber-300 hover:bg-amber-50/30 transition-colors">
                    <div className="overflow-hidden pr-2">
                      <p className="font-semibold text-sm text-slate-800 truncate mb-1">{course.subjectName}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          {course.subjectCode}
                        </span>
                        {course.department && course.department !== "Unassigned" && (
                           <span className="text-[9px] font-bold uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100 px-1.5 py-0.5 rounded truncate max-w-[100px]">
                             {course.department.split(' ')[0]}
                           </span>
                        )}
                      </div>
                      <p className="text-[11px] font-medium text-slate-500 mt-1.5">{course.credits} Credits</p>
                    </div>
                    <button onClick={() => handleDelete(course.id, 'course')} className="text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 flex-shrink-0">✕</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Department Summary Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/80 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Department Course Map</h3>
            <span className="text-[10px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded border border-slate-200 uppercase tracking-wider">Click row to view</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-white text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-4 px-6">Department Name</th>
                  <th className="py-4 px-6 text-right">Total Subjects</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {departmentList.length === 0 ? (
                  <tr><td colSpan="2" className="text-center py-10 text-slate-400 font-medium">No departments registered.</td></tr>
                ) : (
                  departmentList.map(dept => {
                    const deptCoursesCount = courseList.filter(c => c.department === dept.name).length;
                    return (
                      <tr 
                        key={`summary-${dept.id}`} 
                        onClick={() => setSelectedDeptForModal(dept.name)}
                        className="border-b border-slate-100 hover:bg-amber-50/50 transition-colors cursor-pointer group"
                      >
                        <td className="py-4 px-6 font-semibold text-slate-800 group-hover:text-amber-700 transition-colors">{dept.name}</td>
                        <td className="py-4 px-6 text-right font-bold text-amber-600 group-hover:text-amber-700 transition-colors">{deptCoursesCount} Subjects <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-1">→</span></td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL POP-UP FOR SUBJECTS */}
        {selectedDeptForModal && (
          <div className="fixed inset-0 bg-slate-900/40 z-[60] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
              
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{selectedDeptForModal}</h3>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Assigned Subjects</p>
                </div>
                <button onClick={() => setSelectedDeptForModal(null)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all shadow-sm">✕</button>
              </div>

              {/* Modal Body */}
              <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar bg-slate-50/30">
                {courseList.filter(c => c.department === selectedDeptForModal).length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-sm font-medium">No subjects assigned to this department yet.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {courseList.filter(c => c.department === selectedDeptForModal).map(course => (
                      <div key={course.id} className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col gap-3 hover:border-amber-300 transition-colors">
                        <p className="font-bold text-slate-800 text-sm leading-tight">{course.subjectName}</p>
                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
                          <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-amber-100">
                            {course.subjectCode}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">{course.credits} Credits</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    );
  };
  const renderAttendanceMonitoring = () => {
    const filteredStudents = studentList.filter(s => 
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
      s.registerNumber.toLowerCase().includes(studentSearch.toLowerCase())
    );
    const activeStudent = studentList.find(s => s.registerNumber === selectedStudent);

    const toggleAttendance = (subjectCode) => {
      setAttendanceData(prev => ({ ...prev, [subjectCode]: !prev[subjectCode] }));
    };

    const handleSaveAttendance = async () => {
      if (!selectedStudent) return alert("Please select a student first!");
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
      } catch (err) { alert("Server Connection Error"); }
      finally { setIsSavingAttendance(false); }
    };

    return (
      <div className="animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-6">Attendance Operations</h2>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-end relative">
          <div className="flex-1 min-w-[160px]">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Date</label>
            <input type="date" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-violet-400 focus:bg-white text-slate-700 transition-colors" />
          </div>
          
          <div className="flex-[2] min-w-[250px] relative">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Search Student</label>
            {activeStudent ? (
              <div className="flex items-center justify-between w-full bg-violet-50 border border-violet-200 rounded-lg px-4 py-2">
                <div>
                  <p className="text-sm font-bold text-violet-900">{activeStudent.name}</p>
                  <p className="text-[11px] font-semibold text-violet-600">{activeStudent.registerNumber}</p>
                </div>
                <button onClick={() => { setSelectedStudent(""); setStudentSearch(""); setAttendanceData({}); }} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white text-violet-500 hover:text-rose-500 transition-colors">✕</button>
              </div>
            ) : (
              <div className="relative">
                <input 
                  type="text" value={studentSearch} 
                  onChange={e => { setStudentSearch(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-violet-400 focus:bg-white text-slate-700 transition-colors" 
                  placeholder="Enter ID or Name..." 
                />
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">🔍</span>
                {showDropdown && studentSearch.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
                    {filteredStudents.length === 0 ? (
                      <div className="p-3 text-sm text-slate-500 text-center">No students found</div>
                    ) : (
                      filteredStudents.map(student => (
                        <div key={student.id} onClick={() => { setSelectedStudent(student.registerNumber); setShowDropdown(false); }} className="p-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{student.name}</p>
                            <p className="text-[11px] text-slate-500">{student.registerNumber}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <button onClick={handleSaveAttendance} disabled={isSavingAttendance || courseList.length === 0 || !selectedStudent} className="px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-slate-800 hover:bg-slate-700 transition-colors disabled:bg-slate-300">
            {isSavingAttendance ? "Saving..." : "Log Entry"}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-5">Subject Name</th>
                <th className="py-3 px-5 hidden md:table-cell">Subject Code</th>
                <th className="py-3 px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-slate-800">
              {!selectedStudent ? (
                 <tr><td colSpan="3" className="text-center py-12 text-slate-400">Search and select a student to mark attendance.</td></tr>
              ) : courseList.length === 0 ? (
                 <tr><td colSpan="3" className="text-center py-12 text-slate-400">No subjects found in Curriculum.</td></tr>
              ) : (
                courseList.map((course) => {
                  const isPresent = attendanceData[course.subjectCode] || false;
                  return (
                    <tr key={course.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-5 font-medium">{course.subjectName}</td>
                      <td className="py-3 px-5 text-slate-500 text-xs hidden md:table-cell">{course.subjectCode}</td>
                      <td className="py-3 px-5 text-right">
                        <button onClick={() => toggleAttendance(course.subjectCode)} className={`px-4 py-1.5 rounded-md text-xs font-bold tracking-wide transition-colors w-24 border ${isPresent ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white text-slate-500 border-slate-300 hover:border-slate-400'}`}>
                          {isPresent ? 'PRESENT' : 'ABSENT'}
                        </button>
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

  const renderMarksAndPerformance = () => {
  // 1. First, narrow down the student pool by the selected Department filter
  const deptFilteredStudents = filterCourseDept === "ALL" 
    ? studentList 
    : studentList.filter(s => s.department === filterCourseDept);

  // 2. Then, apply the search text filter on that department's students
  const filteredStudents = deptFilteredStudents.filter(s => 
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
    s.registerNumber.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const activeStudent = studentList.find(s => s.registerNumber === selectedStudent);

  const handleSelectStudent = async (regNo) => {
    setSelectedStudent(regNo);
    setShowDropdown(false);
    setIsFetchingMarks(true);
    try {
      const res = await fetch(`${apiUrl}/api/host/student-marks/${regNo}`);
      setStudentMarks(res.ok ? await res.json() : []);
    } catch (err) { console.error("Failed to fetch marks"); } 
    finally { setIsFetchingMarks(false); }
  };

  const getSubjectName = (code) => {
    const course = courseList.find(c => c.subjectCode === code);
    return course ? course.subjectName : code;
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Academic Records</h2>
        
        {/* DEPARTMENT SELECTOR */}
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filter Dept:</label>
          <select 
            value={filterCourseDept} 
            onChange={e => {
              setFilterCourseDept(e.target.value);
              setSelectedStudent(""); // Clear selection when switching departments
              setStudentMarks([]);
            }}
            className="bg-white border-2 border-slate-200 text-xs font-bold text-slate-700 rounded-lg px-3 py-2 outline-none focus:border-blue-400 transition-all shadow-sm"
          >
            <option value="ALL">All Departments</option>
            {departmentList.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
          </select>
        </div>
      </div>
      
      {/* SEARCH SECTION */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
        <div className="w-full relative max-w-xl">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Locate Student in {filterCourseDept === "ALL" ? "Institution" : filterCourseDept}
          </label>
          {activeStudent ? (
            <div className="flex items-center justify-between bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5">
              <div>
                <p className="text-sm font-bold text-slate-900">{activeStudent.name}</p>
                <p className="text-xs text-slate-500">{activeStudent.registerNumber} • {activeStudent.department}</p>
              </div>
              <button onClick={() => { setSelectedStudent(""); setStudentSearch(""); setStudentMarks([]); }} className="text-slate-400 hover:text-slate-700 p-1">✕</button>
            </div>
          ) : (
            <div className="relative">
              <input 
                type="text" value={studentSearch} 
                onChange={e => { setStudentSearch(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
                className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" 
                placeholder={`Search by ID or Name...`} 
              />
              <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
              {showDropdown && studentSearch.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredStudents.length === 0 ? (
                    <div className="p-3 text-sm text-slate-500 text-center">No records found in {filterCourseDept}</div>
                  ) : (
                    filteredStudents.map(student => (
                      <div key={student.id} onClick={() => handleSelectStudent(student.registerNumber)} className="p-3 border-b border-slate-50 hover:bg-blue-50 cursor-pointer transition-colors">
                        <p className="font-semibold text-slate-800 text-sm">{student.name}</p>
                        <p className="text-[11px] text-slate-500">{student.registerNumber} • {student.department}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MARKS TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[300px]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <th className="py-4 px-5">Subject Details</th>
              <th className="py-4 px-5 hidden sm:table-cell">Assessment Type</th>
              <th className="py-4 px-5 text-right">Performance Score</th>
            </tr>
          </thead>
          <tbody>
            {!selectedStudent ? (
              <tr><td colSpan="3" className="text-center py-20 text-slate-400 font-medium">Please select a student from the {filterCourseDept} list above.</td></tr>
            ) : isFetchingMarks ? (
              <tr><td colSpan="3" className="text-center py-20 text-blue-500 font-bold animate-pulse tracking-widest">LOADING RECORDS...</td></tr>
            ) : studentMarks.length === 0 ? (
              <tr><td colSpan="3" className="text-center py-20 text-slate-400 italic">No scores recorded for {activeStudent?.name} yet.</td></tr>
            ) : (
              studentMarks.map((mark) => {
                const isPass = (mark.score / mark.maxScore) * 100 >= 50; 
                return (
                  <tr key={mark.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/30 transition-colors">
                    <td className="py-4 px-5">
                      <p className="font-bold text-slate-800">{getSubjectName(mark.subjectCode)}</p>
                      <p className="text-[11px] font-mono text-slate-500 uppercase tracking-tighter">{mark.subjectCode}</p>
                    </td>
                    <td className="py-4 px-5 hidden sm:table-cell">
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-slate-200">{mark.examType}</span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex justify-end items-center gap-4">
                        <p className="font-black text-slate-800 text-lg">{mark.score} <span className="text-xs text-slate-400 font-normal">/ {mark.maxScore}</span></p>
                        <div className={`text-[10px] font-black px-2 py-1 rounded w-14 text-center border-2 ${isPass ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
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
  const renderComplaints = () => {
  // 1. Filter the complaints based on the selected department
  // This assumes your ticket object has a 'department' field from the backend
  const filteredComplaints = filterCourseDept === "ALL" 
    ? complaintList 
    : complaintList.filter(c => c.department === filterCourseDept);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch(`${apiUrl}/api/host/update-complaint/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchData();
    } catch (err) { console.error("Failed to update status"); }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  // 2. Calculate stats specifically for the FILTERED list
  const pendingCount = filteredComplaints.filter(c => c.status === 'PENDING').length;
  const resolvedCount = filteredComplaints.filter(c => c.status === 'RESOLVED').length;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Helpdesk Tickets</h2>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm font-medium text-slate-500">Manage and resolve campus issues.</p>
            <span className="h-4 w-[1px] bg-slate-300"></span>
            
            {/* DEPARTMENT FILTER DROPDOWN */}
            <select 
              value={filterCourseDept} 
              onChange={e => setFilterCourseDept(e.target.value)}
              className="text-xs font-bold text-blue-600 bg-blue-50 border-none rounded px-2 py-1 outline-none cursor-pointer hover:bg-blue-100 transition-colors"
            >
              <option value="ALL">All Departments</option>
              {departmentList.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Stats based on Filter */}
        <div className="flex gap-4">
          <div className="bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 flex flex-col items-center min-w-[80px]">
            <span className="text-xl font-bold text-amber-600">{pendingCount}</span>
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Pending</span>
          </div>
          <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 flex flex-col items-center min-w-[80px]">
            <span className="text-xl font-bold text-emerald-600">{resolvedCount}</span>
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Resolved</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredComplaints.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4 opacity-30 italic font-serif">
                {filterCourseDept === "ALL" ? "✅" : "📂"}
              </div>
              <p className="text-slate-400 font-medium">
                {filterCourseDept === "ALL" 
                  ? "Inbox zero. No complaints reported." 
                  : `No tickets found for ${filterCourseDept}.`}
              </p>
            </div>
          ) : (
            filteredComplaints.map((ticket) => (
              <div key={ticket.id} className={`p-6 rounded-2xl border transition-all ${ticket.status === 'RESOLVED' ? 'bg-slate-50 border-slate-200 opacity-70' : 'bg-white border-amber-200 shadow-sm'}`}>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                      ticket.userRole === 'STAFF' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {ticket.userRole}
                    </span>
                    {/* SHOW TICKET DEPARTMENT TAG */}
                    <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase tracking-tighter">
                      {ticket.department}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{formatDate(ticket.submittedAt)}</span>
                    <span className="text-xs font-medium text-slate-400 border-l border-slate-300 pl-3">By: <span className="font-bold text-slate-700">{ticket.raisedBy}</span></span>
                  </div>

                  {/* Action Controls */}
                  <div className="flex items-center gap-3">
                    <select 
                      value={ticket.status} 
                      onChange={(e) => handleStatusUpdate(ticket.id, e.target.value)}
                      className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border outline-none cursor-pointer appearance-none text-center ${
                        ticket.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                        ticket.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="RESOLVED">RESOLVED</option>
                    </select>
                    
                    <button onClick={() => handleDelete(ticket.id, 'complaint')} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all">
                      ✕
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-slate-800 mb-2">{ticket.subject}</h4>
                  <p className="text-sm font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
const renderDepartments = () => {
    const handleAddDept = async (e) => {
      e.preventDefault();
      setIsSavingDept(true);
      try {
        const res = await fetch(`${apiUrl}/api/host/add-department`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newDeptName })
        });
        if (res.ok) {
          setNewDeptName("");
          fetchData(); // Refreshes the list instantly
        } else {
          alert("Failed to add. Department might already exist.");
        }
      } catch (err) { alert("Server Error"); } 
      finally { setIsSavingDept(false); }
    };

    return (
      <div className="animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-6">Department Master</h2>
        
        {/* TOP SECTION: Form & Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Add Department Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
            <h3 className="text-sm font-bold text-slate-800 mb-5 border-b border-slate-100 pb-2 uppercase tracking-wider">Add Department</h3>
            <form onSubmit={handleAddDept} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Department Name</label>
                <input 
                  type="text" required value={newDeptName} onChange={e => setNewDeptName(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-colors" 
                  placeholder="e.g. Computer Science (CSE)" 
                />
              </div>
              <button disabled={isSavingDept} className="w-full py-2.5 mt-2 rounded-lg font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm">
                {isSavingDept ? "Saving..." : "Register Department"}
              </button>
            </form>
          </div>

          {/* Department Quick List */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Manage Active Departments</h3>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {departmentList.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm font-medium">No departments registered yet.</div>
              ) : (
                departmentList.map((dept) => (
                  <div key={dept.id} className="p-4 rounded-lg border border-slate-200 flex justify-between items-center group hover:border-blue-300 hover:bg-blue-50/20 transition-all">
                    <h4 className="font-semibold text-sm text-slate-800">{dept.name}</h4>
                    <button onClick={() => handleDelete(dept.id, 'department')} className="text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                      ✕ Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Full Demographics Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/80 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Institution Demographics Report</h3>
            <span className="text-[10px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded border border-slate-200 uppercase tracking-wider">Live Data</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm min-w-[600px]">
              <thead>
                <tr className="bg-white text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-4 px-6">Department Name</th>
                  <th className="py-4 px-6 text-center">Total Students</th>
                  <th className="py-4 px-6 text-center">Total Staff</th>
                  <th className="py-4 px-6 text-right">Total Headcount</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {departmentList.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-slate-400 font-medium">Add departments to see demographics.</td>
                  </tr>
                ) : (
                  departmentList.map((dept) => {
                    // Calculate exact numbers for this specific department
                    const deptStudents = studentList.filter(s => s.department === dept.name).length;
                    const deptStaff = staffList.filter(s => s.department === dept.name).length;
                    const totalMembers = deptStudents + deptStaff;

                    return (
                      <tr key={`summary-${dept.id}`} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-6 font-semibold text-slate-800">{dept.name}</td>
                        <td className="py-3.5 px-6 text-center font-bold text-blue-600">{deptStudents}</td>
                        <td className="py-3.5 px-6 text-center font-bold text-indigo-600">{deptStaff}</td>
                        <td className="py-3.5 px-6 text-right font-bold text-slate-900 bg-slate-50/30">{totalMembers}</td>
                      </tr>
                    );
                  })
                )}
                
                {/* Grand Total Row at the absolute bottom */}
                {departmentList.length > 0 && (
                  <tr className="bg-slate-100/50 border-t-2 border-slate-200">
                    <td className="py-4 px-6 font-bold text-slate-900 uppercase tracking-widest text-xs">Grand Total</td>
                    <td className="py-4 px-6 text-center font-black text-blue-700">{studentList.length}</td>
                    <td className="py-4 px-6 text-center font-black text-indigo-700">{staffList.length}</td>
                    <td className="py-4 px-6 text-right font-black text-slate-900 text-base">{studentList.length + staffList.length}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    );
  };
  const renderPlaceholder = () => (
    <div className="flex flex-col items-center justify-center h-[50vh] text-center">
      <div className="text-4xl mb-3 text-slate-300">⚙️</div>
      <h2 className="text-lg font-semibold text-slate-800 mb-1">{activeMenu}</h2>
      <p className="text-sm text-slate-500">This module is under active development.</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden relative">
      
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/30 z-20 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR */}
      <aside className={`
        absolute lg:static z-30 flex flex-col h-full w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-inner">C</div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">Portal</h1>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-md">✕</button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1 custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => { setActiveMenu(item.name); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm transition-colors ${
                activeMenu === item.name 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="text-base opacity-70">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <img src={user?.picture || "https://via.placeholder.com/40"} alt="Profile" className="w-9 h-9 rounded-full border border-slate-200" />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || "Administrator"}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full py-2 bg-white border border-slate-200 text-slate-600 font-medium text-xs rounded-md hover:bg-slate-50 hover:text-slate-900 transition-colors">
            Sign out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative custom-scrollbar w-full">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 px-5 lg:px-8 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-3 lg:gap-0">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-1.5 -ml-1.5 text-slate-500 hover:bg-slate-100 rounded-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <h2 className="text-sm font-semibold text-slate-800 truncate">{activeMenu}</h2>
          </div>
          <div className="text-[10px] font-medium text-slate-500 border border-slate-200 bg-white px-2 py-1 rounded">
            Admin Access
          </div>
        </header>

        <div className="p-5 lg:p-8 max-w-6xl mx-auto">
          {activeMenu === 'Dashboard' && renderDashboard()}
          {activeMenu === 'Departments' && renderDepartments()}
          {activeMenu === 'User Management' && renderUserManagement()}
          {activeMenu === 'Courses & Subjects' && renderCoursesAndSubjects()}
          {activeMenu === 'Attendance Monitoring' && renderAttendanceMonitoring()}
          {activeMenu === 'Marks & Performance' && renderMarksAndPerformance()}
          {activeMenu === 'Announcements' && renderAnnouncements()}
          {activeMenu === 'Complaints' && renderComplaints()}
          {
            activeMenu !== 'Dashboard' && 
            activeMenu !== 'Departments' &&
            activeMenu !== 'User Management' && 
            activeMenu !== 'Courses & Subjects' && 
            activeMenu !== 'Attendance Monitoring' && 
            activeMenu !== 'Marks & Performance' && 
            activeMenu !== 'Announcements' && 
            activeMenu !== 'Complaints' &&
            renderPlaceholder()
          }
        </div>
      </main>
    </div>
  );
}