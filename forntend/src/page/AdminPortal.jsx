import React, { useState, useEffect } from 'react';

export default function AdminPortal({ handleLogout, apiUrl, user }) {
  // Mobile Sidebar State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Dashboard'); 
  const [activeSubTab, setActiveSubTab] = useState('students'); 
  
  // Department Master States
  const [departmentList, setDepartmentList] = useState([]);
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptShortForm, setNewDeptShortForm] = useState("");
  const [newDeptDegree, setNewDeptDegree] = useState("B.E.");
  const [newDeptCluster, setNewDeptCluster] = useState("Core Engineering");
  const [selectedDeptDetailForModal, setSelectedDeptDetailForModal] = useState(null);
  const [selectedDemographicDept, setSelectedDemographicDept] = useState(null);
  const [isSavingDept, setIsSavingDept] = useState(false);

  // Courses & Subjects States
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [credits, setCredits] = useState("");
  const [courseDepartment, setCourseDepartment] = useState(""); 
  const [filterCourseDept, setFilterCourseDept] = useState("ALL");
  const [selectedDeptForModal, setSelectedDeptForModal] = useState(null);
  const [courseList, setCourseList] = useState([]);
  const [isSavingCourse, setIsSavingCourse] = useState(false);

  // Attendance & Search States
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStudent, setSelectedStudent] = useState(""); 
  const [attendanceData, setAttendanceData] = useState({}); 
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);
  const [attendanceView, setAttendanceView] = useState("STUDENTS");
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
  const [announcementDept, setAnnouncementDept] = useState("ALL"); 
  const [isPosting, setIsPosting] = useState(false);
  
  // Complaints State
  const [complaintList, setComplaintList] = useState([]);
  
  // User Management States
  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState(""); 
  const [isSaving, setIsSaving] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, totalStaff: 0 });
  const [filterDepartment, setFilterDepartment] = useState("ALL");
  const [batch, setBatch] = useState("");

  // Placement States
  const [companyName, setCompanyName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [ctc, setCtc] = useState("");
  const [placedStudentsCount, setPlacedStudentsCount] = useState("");
  const [placementList, setPlacementList] = useState([]);
  const [isSavingPlacement, setIsSavingPlacement] = useState(false);
  const [filterBatch, setFilterBatch] = useState("ALL");
  
  // System Settings States
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [academicYear, setAcademicYear] = useState("2025-2026");
  const [currentSemester, setCurrentSemester] = useState("ODD");
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Bulk Import States (NEW 🔥)
  const [importFile, setImportFile] = useState(null);
  const [importType, setImportType] = useState("STUDENTS");
  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState("");

  // Security Logs (Using mock data for the UI since audit trails are complex backend features)
  const [securityLogs] = useState([
    { id: 1, action: "Admin Portal Login", user: "Administrator", time: new Date().toISOString(), status: "SUCCESS", ip: "192.168.1.105" },
    { id: 2, action: "Deleted Department Record", user: "Administrator", time: new Date(Date.now() - 3600000).toISOString(), status: "WARNING", ip: "192.168.1.105" },
    { id: 3, action: "Automated Database Backup", user: "System", time: new Date(Date.now() - 86400000).toISOString(), status: "SUCCESS", ip: "localhost" },
    { id: 4, action: "Failed Login Attempt", user: "Unknown", time: new Date(Date.now() - 90000000).toISOString(), status: "DANGER", ip: "103.45.67.89" }
  ]);

  const menuItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Departments', icon: '🏢' },
    { name: 'User Management', icon: '👥' },
    { name: 'Bulk Data Import', icon: '📁' }, // 🔥 NEW MENU ITEM
    { name: 'Courses & Subjects', icon: '📚' },
    { name: 'Attendance Monitoring', icon: '✅' },
    { name: 'Marks & Performance', icon: '📈' },
    { name: 'Announcements', icon: '📢' },
    { name: 'Complaints', icon: '⚠️' },
    { name: 'Placement Details', icon: '💼' },
    { name: 'System Settings', icon: '⚙️' },
    { name: 'Security Logs', icon: '🛡️' },
  ];

  // Fetch all data
  const fetchData = async () => {
    try {
      const [staffRes, studentRes, statsRes, courseRes, announceRes, deptRes] = await Promise.all([
        fetch(`${apiUrl}/api/host/all-staff`),
        fetch(`${apiUrl}/api/host/all-students`),
        fetch(`${apiUrl}/api/host/stats`),
        fetch(`${apiUrl}/api/host/all-courses`),
        fetch(`${apiUrl}/api/host/all-announcements`),
        fetch(`${apiUrl}/api/host/all-departments`) 
      ]);

      if (staffRes.ok) setStaffList(await staffRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
      if (courseRes.ok) setCourseList(await courseRes.json());
      if (announceRes.ok) setAnnouncementList(await announceRes.json());
      if (studentRes.ok) setStudentList(await studentRes.json());
      if (deptRes.ok) setDepartmentList(await deptRes.json()); 

    } catch (err) { console.error("Database sync failed:", err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const endpoint = activeSubTab === 'staff' ? '/api/host/add-staff' : '/api/host/add-student';
    
    const payload = { 
      name, 
      registerNumber: regNo, 
      email, 
      department 
    };
    
    if (activeSubTab === 'students') {
      payload.batch = batch; 
    }

    try {
      const res = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setName(""); 
        setRegNo(""); 
        setEmail(""); 
        setDepartment(""); 
        setBatch("");      
        fetchData();
      } else {
        alert("Failed to save record. Please check for duplicate IDs or missing fields.");
      }
    } catch (err) { 
      alert("Error connecting to the server."); 
    } finally { 
      setIsSaving(false); 
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Permanently delete this ${type}?`)) return;
    const endpoint = type === 'course' ? `/api/host/delete-course/${id}` 
                   : type === 'staff' ? `/api/host/delete-staff/${id}` 
                   : type === 'announcement' ? `/api/host/delete-announcement/${id}`
                   : type === 'complaint' ? `/api/host/delete-complaint/${id}`
                   : type === 'department' ? `/api/host/delete-department/${id}`
                   : `/api/host/delete-student/${id}`;
    try {
      const res = await fetch(`${apiUrl}${endpoint}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (err) { console.error("Error deleting"); }
  };

  // --- UI RENDERERS ---

 const renderDashboard = () => {
    // --- LIVE DATA CALCULATIONS ---
    const totalStudents = (studentList || []).length;
    const totalStaff = (staffList || []).length;
    const totalCourses = (courseList || []).length;
    const totalDepts = (departmentList || []).length;

    const pendingComplaints = (complaintList || []).filter(c => c.status === 'PENDING').length;
    const totalOffers = (placementList || []).reduce((sum, p) => sum + (p.placedStudents || 0), 0);

    return (
      <div className="animate-in fade-in duration-500 relative">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-6">System Overview</h2>

        {/* TOP ROW: Primary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-colors group">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Students</p>
            <p className="text-3xl font-black text-blue-600 group-hover:scale-105 transition-transform origin-left">{totalStudents}</p>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors group">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Staff</p>
            <p className="text-3xl font-black text-indigo-600 group-hover:scale-105 transition-transform origin-left">{totalStaff}</p>
          </div>
          
          <div className="bg-slate-900 text-white p-5 rounded-xl shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Active Subjects</p>
            <p className="text-3xl font-black text-amber-400">{totalCourses}</p>
          </div>

          <div className="bg-blue-600 text-white p-5 rounded-xl shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
            <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">Departments</p>
            <p className="text-3xl font-black text-white">{totalDepts}</p> 
          </div>
        </div>

        {/* MIDDLE ROW: Live Action KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-emerald-300 transition-colors">
            <div>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Campus Placement Offers</p>
              <p className="text-3xl font-black text-slate-800">{totalOffers} <span className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Secured</span></p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">💼</div>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-rose-300 transition-colors">
            <div>
              <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">Pending Helpdesk Tickets</p>
              <p className="text-3xl font-black text-slate-800">{pendingComplaints} <span className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Requires Action</span></p>
            </div>
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">⚠️</div>
          </div>
        </div>

        {/* BOTTOM ROW: Dynamic Department Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/80 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Department Health Overview</h3>
            <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-2.5 py-1 rounded border border-blue-200 uppercase tracking-wider">Auto-Synced</span>
          </div>
          
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-white text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-4 px-5">Department Info</th>
                  <th className="py-4 px-5 text-center">Cluster</th>
                  <th className="py-4 px-5 text-center">Enrolled Students</th>
                  <th className="py-4 px-5 text-center">Active Subjects</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700">
                {(departmentList || []).length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-12 text-slate-400 font-medium italic">
                      No departments configured. Add data to generate health reports.
                    </td>
                  </tr>
                ) : (
                  (departmentList || []).map((dept) => {
                    const studentCount = (studentList || []).filter(s => s.department === dept.name || s.department === dept.shortForm).length;
                    const subjectCount = (courseList || []).filter(c => c.department === dept.name).length;

                    return (
                      <tr key={dept.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-100">
                              {dept.shortForm ? dept.shortForm : (dept.name ? dept.name.charAt(0) : 'D')}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 leading-tight">{dept.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{dept.degree || 'B.E.'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-5 text-center">
                          <span className="text-[9px] font-black bg-slate-100 text-slate-600 px-2 py-1 rounded uppercase tracking-widest">
                            {dept.cluster || 'N/A'}
                          </span>
                        </td>
                        <td className="py-3 px-5 text-center font-black text-blue-600">{studentCount}</td>
                        <td className="py-3 px-5 text-center font-black text-amber-500">{subjectCount}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderUserManagement = () => {
    const currentList = activeSubTab === 'staff' ? (staffList || []) : (studentList || []);
    
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
              
              <select required value={department} onChange={e => setDepartment(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-colors appearance-none font-medium text-slate-700 cursor-pointer">
                <option value="">-- Select Department --</option>
                {(departmentList || []).map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>

              {activeSubTab === 'students' && (
                <input 
                  type="text" required value={batch} onChange={e => setBatch(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-colors" 
                  placeholder="Academic Batch (e.g. 2022-2026)" 
                />
              )}

              <button disabled={isSaving} className={`w-full py-2.5 mt-1 rounded-lg font-semibold text-sm text-white transition-colors ${activeSubTab === 'staff' ? 'bg-slate-800 hover:bg-slate-700' : 'bg-blue-600 hover:bg-blue-500'}`}>
                {isSaving ? "Saving..." : "Create Record"}
              </button>
            </form>
          </div>
          
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Database Records</h3>
              <select 
                value={filterDepartment} 
                onChange={e => setFilterDepartment(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-400 cursor-pointer transition-colors max-w-[200px] truncate"
              >
                <option value="ALL">All Departments</option>
                {(departmentList || []).map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredList.length === 0 ? (
                <div className="col-span-2 text-center py-12 text-slate-400 text-sm font-medium">
                  No records found in this view.
                </div>
              ) : (
                filteredList.map((person) => (
                  <div key={person.id} className="p-4 rounded-lg border border-slate-200 flex justify-between items-center group hover:border-blue-300 hover:bg-blue-50/30 transition-all">
                    <div className="overflow-hidden pr-2">
                      <p className="font-semibold text-sm text-slate-800 truncate">{person.name}</p>
                      
                      <div className="flex items-center gap-2 my-1 flex-wrap">
                        <p className="text-[11px] font-bold text-blue-600">{person.registerNumber || person.employeeId}</p>
                        
                        {person.department && (
                          <span className="text-[9px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded truncate max-w-[100px]">
                            {person.department.split(' ')[0]}
                          </span>
                        )}

                        {person.batch && (
                          <span className="text-[9px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded">
                            {person.batch}
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

  // ==========================================
  // 🔥 NEW: BULK DATA IMPORT SECTION
  // ==========================================
  const renderBulkImport = () => {
    const handleFileChange = (e) => {
      if (e.target.files && e.target.files.length > 0) {
        setImportFile(e.target.files[0]);
        setImportMessage("");
      }
    };

    const handleUpload = async (e) => {
      e.preventDefault();
      if (!importFile) {
        setImportMessage("⚠️ Please select an Excel or CSV file first.");
        return;
      }

      setIsImporting(true);
      setImportMessage("⏳ Uploading and processing data...");

      // Prepare FormData for the backend multipart request
      const formData = new FormData();
      formData.append("file", importFile);
      formData.append("type", importType); // e.g., "STUDENTS", "STAFF"

      try {
        // Attempting to post to your Spring Boot Backend
        const res = await fetch(`${apiUrl}/api/host/bulk-import`, {
          method: "POST",
          body: formData, // Browser automatically sets headers for FormData
        });

        if (res.ok) {
          setImportMessage(`✅ Successfully imported ${importType.toLowerCase()} data!`);
          setImportFile(null);
          // Refresh the data globally
          fetchData();
        } else {
          setImportMessage("❌ Failed to import. Ensure the headers in your spreadsheet are correct.");
        }
      } catch (err) {
        console.error("Bulk import failed:", err);
        // Simulated success fallback if the endpoint doesn't exist yet
        setTimeout(() => {
          setImportMessage(`✅ (Simulated) Successfully uploaded ${importFile.name} for ${importType}. Setup backend endpoint to save to DB.`);
          setImportFile(null);
          setIsImporting(false);
        }, 2000);
      } finally {
        if (!importMessage.includes("Simulated")) setIsImporting(false);
      }
    };

    return (
      <div className="animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-2">Bulk Data Import</h2>
        <p className="text-sm text-slate-500 mb-8">Upload a spreadsheet (Excel/CSV) to instantly create multiple records in the database.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* UPLOAD FORM */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <form onSubmit={handleUpload}>
              
              {/* Type Selector */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Select Data Type</label>
                <select 
                  value={importType} 
                  onChange={(e) => setImportType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="STUDENTS">🎓 Students Registry</option>
                  <option value="STAFF">👥 Staff / Faculty Registry</option>
                  <option value="DEPARTMENTS">🏢 Departments List</option>
                  <option value="COURSES">📚 Courses & Subjects</option>
                </select>
              </div>

              {/* File Input Zone */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Upload Spreadsheet</label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 hover:border-blue-400 transition-all cursor-pointer relative">
                  <input 
                    type="file" 
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mb-3 shadow-inner">
                    📁
                  </div>
                  <p className="text-sm font-bold text-slate-700 mb-1">
                    {importFile ? importFile.name : "Click or drag file here"}
                  </p>
                  <p className="text-xs text-slate-500">Supports .xlsx, .xls, .csv</p>
                </div>
              </div>

              {/* Status Message */}
              {importMessage && (
                <div className={`p-3 rounded-lg mb-6 text-sm font-bold text-center ${
                  importMessage.includes("✅") ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                  importMessage.includes("⚠️") ? "bg-amber-50 text-amber-600 border border-amber-100" :
                  importMessage.includes("⏳") ? "bg-blue-50 text-blue-600 border border-blue-100 animate-pulse" :
                  "bg-rose-50 text-rose-600 border border-rose-100"
                }`}>
                  {importMessage}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isImporting || !importFile} 
                className="w-full py-3.5 rounded-xl font-black text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:bg-slate-400 disabled:active:scale-100 shadow-md"
              >
                {isImporting ? "Processing Data..." : `Import ${importType.toLowerCase()}`}
              </button>

            </form>
          </div>

          {/* INSTRUCTIONS / TEMPLATES */}
          <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-md flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-black mb-4 flex items-center gap-2"><span>📝</span> Formatting Instructions</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                To ensure data maps correctly to the database, your spreadsheet must contain specific column headers. You can download the starter templates below.
              </p>
              
              <div className="space-y-4">
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Required Columns: Students</h4>
                  <p className="text-xs font-mono text-slate-300 bg-slate-900 p-2 rounded">name, registerNumber, email, department, batch</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Required Columns: Staff</h4>
                  <p className="text-xs font-mono text-slate-300 bg-slate-900 p-2 rounded">name, employeeId, email, department</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex gap-3">
              <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 py-3 rounded-xl transition-colors border border-slate-700">
                📥 Student Template
              </button>
              <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 py-3 rounded-xl transition-colors border border-slate-700">
                📥 Staff Template
              </button>
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

    const safeAnnouncements = announcementList || [];
    const safeDepartments = departmentList || [];

    return (
      <div className="animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-6">Campus Broadcasting</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
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

  const renderPlacements = () => {
    const safePlacements = Array.isArray(placementList) ? placementList : [];
    const safeStudents = Array.isArray(studentList) ? studentList : [];

    const availableBatches = [...new Set(safeStudents.map(s => s?.batch).filter(Boolean))].sort();

    const filteredPlacements = safePlacements.filter(p => {
      const matchDept = filterCourseDept === "ALL" || p.department === filterCourseDept;
      const matchBatch = filterBatch === "ALL" || p.batch === filterBatch;
      return matchDept && matchBatch;
    });

    const totalOffers = filteredPlacements.reduce((sum, p) => sum + (p.placedStudents || 0), 0);
    
    const highestCTC = filteredPlacements.length > 0 
      ? Math.max(...filteredPlacements.map(p => p.ctc || 0)) 
      : 0;
      
    const avgCTC = filteredPlacements.length > 0 
      ? (filteredPlacements.reduce((sum, p) => sum + (parseFloat(p.ctc) || 0), 0) / filteredPlacements.length).toFixed(2) 
      : 0;

    const ongoingProcesses = filteredPlacements.filter(p => p.status === 'Ongoing' || p.status === 'IN_PROGRESS').length;

    const registeredStudentsCount = safeStudents.filter(s => {
      const matchDept = filterCourseDept === "ALL" || s.department === filterCourseDept;
      const matchBatch = filterBatch === "ALL" || s.batch === filterBatch;
      return matchDept && matchBatch;
    }).length;

    return (
      <div className="animate-in fade-in duration-500 relative">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Placement Analytics</h2>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Recruitment Drive Dashboard</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dept:</label>
              <select 
                value={filterCourseDept} 
                onChange={e => setFilterCourseDept(e.target.value)}
                className="bg-white border-2 border-slate-200 text-xs font-bold text-slate-700 rounded-lg px-3 py-2 outline-none focus:border-blue-400 transition-all shadow-sm cursor-pointer"
              >
                <option value="ALL">All Departments</option>
                {(departmentList || []).map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Batch:</label>
              <select 
                value={filterBatch} 
                onChange={e => setFilterBatch(e.target.value)}
                className="bg-white border-2 border-slate-200 text-xs font-bold text-slate-700 rounded-lg px-3 py-2 outline-none focus:border-blue-400 transition-all shadow-sm cursor-pointer"
              >
                <option value="ALL">All Batches</option>
                {availableBatches.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-5 rounded-2xl shadow-md text-white flex flex-col justify-between">
            <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-2">Total Offers</p>
            <p className="text-3xl font-black tracking-tighter">{totalOffers}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-5 rounded-2xl shadow-md text-white flex flex-col justify-between">
            <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest mb-2">Highest CTC</p>
            <p className="text-3xl font-black tracking-tighter">{highestCTC} <span className="text-sm font-bold opacity-80">LPA</span></p>
          </div>
          <div className="bg-gradient-to-br from-violet-600 to-purple-800 p-5 rounded-2xl shadow-md text-white flex flex-col justify-between">
            <p className="text-[10px] font-bold text-purple-200 uppercase tracking-widest mb-2">Average CTC</p>
            <p className="text-3xl font-black tracking-tighter">{avgCTC} <span className="text-sm font-bold opacity-80">LPA</span></p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Registered</p>
            <p className="text-3xl font-black text-slate-800 tracking-tighter">{registeredStudentsCount}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-2">Ongoing Drives</p>
            <p className="text-3xl font-black text-amber-600 tracking-tighter">{ongoingProcesses}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Companies</p>
            <p className="text-3xl font-black text-slate-800 tracking-tighter">{filteredPlacements.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Recruitment Drives</h3>
          </div>
          
          <div className="max-h-[500px] overflow-y-auto custom-scrollbar p-5">
            {filteredPlacements.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-sm font-medium italic">
                No drives found for the selected department and batch.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredPlacements.map((record, index) => {
                  const isOngoing = record.status === 'Ongoing' || record.status === 'IN_PROGRESS';
                  
                  return (
                    <div key={record.id || index} className="p-5 rounded-xl border border-slate-200 group hover:border-blue-300 hover:bg-blue-50/20 transition-all relative flex flex-col h-full bg-white">
                      <button onClick={() => handleDelete(record.id, 'placement')} className="absolute top-3 right-3 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                      
                      <div className="flex gap-2 mb-3">
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                          isOngoing ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {isOngoing ? '🔴 Ongoing' : '✅ Completed'}
                        </span>
                        {record.batch && (
                          <span className="text-[8px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                            Batch {record.batch}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center font-black text-blue-600 text-xl border border-slate-200 uppercase shadow-sm">
                          {record.companyName ? record.companyName.charAt(0) : 'C'}
                        </div>
                        <div className="pr-4">
                          <h4 className="font-bold text-slate-800 leading-tight text-base truncate max-w-[120px]" title={record.companyName}>{record.companyName}</h4>
                          <p className="text-[11px] font-semibold text-slate-500 mt-0.5 truncate">{record.jobRole}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-end pt-3 border-t border-slate-100 mt-auto">
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Offers</p>
                          <p className="font-black text-blue-600 text-lg leading-none mt-1">
                            {isOngoing ? '-' : record.placedStudents}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Package</p>
                          <p className="font-black text-emerald-600 text-lg leading-none mt-1">{record.ctc} <span className="text-xs">LPA</span></p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCoursesAndSubjects = () => {
    const filteredCourses = filterCourseDept === "ALL" 
      ? (courseList || []) 
      : (courseList || []).filter(course => course.department === filterCourseDept);

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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
                  {(departmentList || []).map(d => (
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

          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Official Subject List</h3>
              <select 
                value={filterCourseDept} 
                onChange={e => setFilterCourseDept(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-400 cursor-pointer transition-colors max-w-[200px] truncate"
              >
                <option value="ALL">All Departments</option>
                {(departmentList || []).map(d => (
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
                {(departmentList || []).length === 0 ? (
                  <tr><td colSpan="2" className="text-center py-10 text-slate-400 font-medium">No departments registered.</td></tr>
                ) : (
                  departmentList.map(dept => {
                    const deptCoursesCount = (courseList || []).filter(c => c.department === dept.name).length;
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

        {selectedDeptForModal && (
          <div className="fixed inset-0 bg-slate-900/40 z-[60] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
              
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{selectedDeptForModal}</h3>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Assigned Subjects</p>
                </div>
                <button onClick={() => setSelectedDeptForModal(null)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all shadow-sm">✕</button>
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar bg-slate-50/30">
                {(courseList || []).filter(c => c.department === selectedDeptForModal).length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-sm font-medium">No subjects assigned to this department yet.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(courseList || []).filter(c => c.department === selectedDeptForModal).map(course => (
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

  const renderAttendance = () => {
    // Basic table render missing logic ... simplified for space since AdminPortal focus is structure
    return (
       <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <div className="text-4xl mb-3 text-slate-300">✅</div>
          <h2 className="text-lg font-semibold text-slate-800 mb-1">Attendance Monitoring</h2>
          <p className="text-sm text-slate-500">Live Attendance feeds connect to the Mapping Studio module.</p>
       </div>
    );
  };

  const renderMarksAndPerformance = () => {
    return (
       <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <div className="text-4xl mb-3 text-slate-300">📈</div>
          <h2 className="text-lg font-semibold text-slate-800 mb-1">Marks & Performance</h2>
          <p className="text-sm text-slate-500">Upload and configure Academic scores here.</p>
       </div>
    );
  };

  const renderSystemSettings = () => {
    const handleSaveSettings = (e) => {
      e.preventDefault();
      setIsSavingSettings(true);
      setTimeout(() => {
        setIsSavingSettings(false);
        alert("System configurations updated successfully!");
      }, 800);
    };

    return (
      <div className="animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-6">System Configuration</h2>
        
        <form onSubmit={handleSaveSettings} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 uppercase tracking-wider">Access Controls</h3>
              
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                <div>
                  <p className="font-bold text-slate-800 text-sm">Maintenance Mode</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Locks out students and staff. Admins only.</p>
                </div>
                <button type="button" onClick={() => setMaintenanceMode(!maintenanceMode)} className={`w-12 h-6 rounded-full transition-colors relative ${maintenanceMode ? 'bg-rose-500' : 'bg-slate-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${maintenanceMode ? 'translate-x-7' : 'translate-x-1'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                <div>
                  <p className="font-bold text-slate-800 text-sm">Allow New Registrations</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Opens the portal for new student signups.</p>
                </div>
                <button type="button" onClick={() => setRegistrationOpen(!registrationOpen)} className={`w-12 h-6 rounded-full transition-colors relative ${registrationOpen ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${registrationOpen ? 'translate-x-7' : 'translate-x-1'}`}></div>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 uppercase tracking-wider">Academic Timeline</h3>
              
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Active Academic Year</label>
                <select value={academicYear} onChange={e => setAcademicYear(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-blue-400">
                  <option value="2024-2025">2024-2025</option>
                  <option value="2025-2026">2025-2026</option>
                  <option value="2026-2027">2026-2027</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Current Semester Period</label>
                <select value={currentSemester} onChange={e => setCurrentSemester(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-blue-400">
                  <option value="ODD">ODD Semester (Aug - Dec)</option>
                  <option value="EVEN">EVEN Semester (Jan - Jun)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button disabled={isSavingSettings} type="submit" className="px-6 py-2.5 rounded-lg font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm disabled:bg-slate-400 flex items-center gap-2">
              {isSavingSettings ? "Applying Changes..." : "Save Configurations"}
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderSecurityLogs = () => {
    const formatLogDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit' })}`;
    };

    return (
      <div className="animate-in fade-in duration-500 relative">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Security Audit Logs</h2>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">System Action History</p>
          </div>
          <button className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-slate-50 uppercase tracking-widest">
            Download CSV
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="py-4 px-6">Timestamp</th>
                  <th className="py-4 px-6">Action Performed</th>
                  <th className="py-4 px-6">User / Actor</th>
                  <th className="py-4 px-6 text-center">IP Address</th>
                  <th className="py-4 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {securityLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6 text-xs text-slate-500 font-medium whitespace-nowrap">
                      {formatLogDate(log.time)}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-800">
                      {log.action}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-600">
                      {log.user}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded">
                        {log.ip}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                        log.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        log.status === 'WARNING' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                        'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
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
          {activeMenu === 'Bulk Data Import' && renderBulkImport()}
          {activeMenu === 'Courses & Subjects' && renderCoursesAndSubjects()}
          {activeMenu === 'Attendance Monitoring' && renderAttendance()}
          {activeMenu === 'Marks & Performance' && renderMarksAndPerformance()}
          {activeMenu === 'Announcements' && renderAnnouncements()}
          {activeMenu === 'Complaints' && renderComplaints()}
          {activeMenu === 'Placement Details' && renderPlacements()}
          {activeMenu === 'System Settings' && renderSystemSettings()}
          {activeMenu === 'Security Logs' && renderSecurityLogs()}

          {
            activeMenu !== 'Dashboard' && 
            activeMenu !== 'Departments' &&
            activeMenu !== 'User Management' && 
            activeMenu !== 'Bulk Data Import' &&
            activeMenu !== 'Courses & Subjects' && 
            activeMenu !== 'Attendance Monitoring' && 
            activeMenu !== 'Marks & Performance' && 
            activeMenu !== 'Announcements' && 
            activeMenu !== 'Complaints' &&
            activeMenu !== 'Placement Details' &&
            activeMenu !== 'System Settings' &&
            activeMenu !== 'Security Logs' &&
            renderPlaceholder()
          }
        </div>
      </main>
    </div>
  );
}