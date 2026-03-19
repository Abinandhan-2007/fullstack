import React, { useState, useEffect } from 'react';

export default function AttendanceMapping({ handleLogout, apiUrl }) {
  const [activeMenu, setActiveMenu] = useState('Workspace');

  // --- DATABASE STATES ---
  const [dbStaff, setDbStaff] = useState([]);
  const [dbDepartments, setDbDepartments] = useState([]);
  const [dbSubjects, setDbSubjects] = useState([]);
  const [dbStudents, setDbStudents] = useState([]); 
  const [isLoadingDB, setIsLoadingDB] = useState(true);

  // --- VENUE MANAGER STATES ---
  const [dbVenues, setDbVenues] = useState([
    { id: 1, building: "Main Block", name: "Lab 1", rows: 5, cols: 6, capacity: 30 },
    { id: 2, building: "Main Block", name: "Lab 2", rows: 5, cols: 6, capacity: 30 },
    { id: 3, building: "Science Block", name: "Room 101", rows: 6, cols: 10, capacity: 60 },
    { id: 4, building: "Admin Block", name: "Seminar Hall", rows: 10, cols: 15, capacity: 150 }
  ]);
  const [newVenueBuilding, setNewVenueBuilding] = useState('');
  const [newVenueName, setNewVenueName] = useState('');
  const [newVenueRows, setNewVenueRows] = useState('');
  const [newVenueCols, setNewVenueCols] = useState('');

  // --- MAPPING STUDIO STATES ---
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('');
  const [selectedTime, setSelectedTime] = useState(''); 
  const [seatingStrategy, setSeatingStrategy] = useState('sequential');
  const [rollFrom, setRollFrom] = useState('');
  const [rollTo, setRollTo] = useState('');

  const [selectedStaffId, setSelectedStaffId] = useState(''); 
  const [facultySearch, setFacultySearch] = useState('');     
  const [showFacultyList, setShowFacultyList] = useState(false);

  const [venueSearch, setVenueSearch] = useState('');
  const [showVenueList, setShowVenueList] = useState(false);

  const [mappings, setMappings] = useState([]);
  const [draggedId, setDraggedId] = useState(null);
  
  // --- MODAL & SEARCH STATES ---
  const [selectedSessionForSeats, setSelectedSessionForSeats] = useState(null);
  const [seatSearchTerm, setSeatSearchTerm] = useState('');
  const [conflictPopup, setConflictPopup] = useState(null); 
  
  // --- ADMIN ATTENDANCE & RECORD STATES ---
  const [studentSearch, setStudentSearch] = useState('');
  const [staffSearch, setStaffSearch] = useState('');
  
  // NEW: Store Admin's Staff Attendance marking
  const [staffAttendance, setStaffAttendance] = useState({}); 
  
  // NEW: Store Live Student Attendance (Simulated for UI preview)
  const [liveStudentStatus, setLiveStudentStatus] = useState({}); 

  const timeSlots = ["09:00 AM", "09:50 AM", "10:40 AM", "11:30 AM", "01:10 PM", "02:00 PM", "02:50 PM", "03:40 PM"];

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    const fetchAdminData = async () => {
      setIsLoadingDB(true);
      try {
        const [deptRes, staffRes, timetableRes, subRes, studentRes] = await Promise.all([
          fetch(`${apiUrl}/api/host/all-departments`).catch(() => null),
          fetch(`${apiUrl}/api/host/all-staff`).catch(() => null),
          fetch(`${apiUrl}/api/host/timetable`).catch(() => null),
          fetch(`${apiUrl}/api/host/all-courses`).catch(() => null),
          fetch(`${apiUrl}/api/host/all-students`).catch(() => null) 
        ]);

        if (deptRes && deptRes.ok) setDbDepartments((await deptRes.json()).map(d => d.name || d.departmentName).sort());
        else setDbDepartments(["IT", "ECE", "EEE", "Computer Science and Engineering"]);

        let fetchedStaff = [];
        if (staffRes?.ok) {
          fetchedStaff = await staffRes.json();
          setDbStaff(fetchedStaff);
          // Initialize all staff as "Present" by default for the Admin
          const initialStaffAtt = {};
          fetchedStaff.forEach(s => initialStaffAtt[s.id] = 'Present');
          setStaffAttendance(initialStaffAtt);
        }
        
        if (timetableRes?.ok) setMappings(await timetableRes.json());
        if (subRes?.ok) setDbSubjects(await subRes.json());
        
        if (studentRes?.ok) {
          const fetchedStudents = await studentRes.json();
          setDbStudents(fetchedStudents);
          
          // SIMULATE LIVE STUDENT ATTENDANCE (For UI Preview)
          // In the future, this will be fetched from your actual backend database
          const simulatedStatus = {};
          fetchedStudents.forEach(s => {
            const rand = Math.random();
            if (rand > 0.9) simulatedStatus[s.registerNumber] = 'Absent';
            else if (rand > 0.85) simulatedStatus[s.registerNumber] = 'Late';
            else if (rand > 0.8) simulatedStatus[s.registerNumber] = 'PS'; // Permission Slip / On Duty
            else simulatedStatus[s.registerNumber] = 'Present';
          });
          setLiveStudentStatus(simulatedStatus);
        }

      } catch (error) { console.error("Sync Error:", error); } 
      finally { setIsLoadingDB(false); }
    };
    if (apiUrl) fetchAdminData();
  }, [apiUrl]);

  // --- VENUE LOGIC ---
  const handleAddVenue = (e) => {
    e.preventDefault();
    if (!newVenueName || !newVenueRows || !newVenueCols || !newVenueBuilding) return;
    const rows = parseInt(newVenueRows, 10);
    const cols = parseInt(newVenueCols, 10);
    setDbVenues([...dbVenues, { id: Date.now(), building: newVenueBuilding, name: newVenueName, rows, cols, capacity: rows * cols }]);
    setNewVenueBuilding(''); setNewVenueName(''); setNewVenueRows(''); setNewVenueCols('');
  };
  const handleRemoveVenue = (id) => setDbVenues(dbVenues.filter(v => v.id !== id));

  // --- MAPPING FILTERS ---
  const getDisplaySubjects = () => {
    if (!dbSubjects || dbSubjects.length === 0 || !selectedDept) return [];
    const filterDeptStr = selectedDept.toLowerCase().trim();
    return dbSubjects.filter(s => {
      if (!s.department) return false;
      const subjDeptStr = s.department.toLowerCase().trim();
      return (subjDeptStr === filterDeptStr || subjDeptStr.includes(filterDeptStr) || filterDeptStr.includes(subjDeptStr) || subjDeptStr === "all" || subjDeptStr === "general");
    });
  };

  const getFilteredFaculty = () => {
    const query = facultySearch.toLowerCase().trim();
    return dbStaff.filter(staff => {
      const name = (staff.name || '').toLowerCase();
      const id = String(staff.id || '').toLowerCase();
      const matchesSearch = name.includes(query) || id.includes(query);
      if (selectedDept) return matchesSearch && (staff.department || '').toLowerCase().includes(selectedDept.toLowerCase());
      return matchesSearch;
    });
  };

  const getFilteredVenues = () => dbVenues.filter(v => v.name.toLowerCase().includes(venueSearch.toLowerCase()) || v.building.toLowerCase().includes(venueSearch.toLowerCase()));

  const getVenueMaxOccupied = (venueName) => {
    const venueMappings = mappings.filter(m => m.venue === venueName);
    if (venueMappings.length === 0) return 0;
    let maxCount = 0;
    venueMappings.forEach(m => {
      let seatData = [];
      try { seatData = typeof m.seatAllocation === 'string' ? JSON.parse(m.seatAllocation) : m.seatAllocation; } catch(e) {}
      if (Array.isArray(seatData)) {
        const count = seatData.filter(s => s.roll).length;
        if (count > maxCount) maxCount = count;
      }
    });
    return maxCount;
  };

  // --- AUTO-SEATING ENGINE ---
  let rollListToMap = [];
  if (rollFrom && rollTo) {
    const fromStr = rollFrom.trim();
    const toStr = rollTo.trim();
    const matchFrom = fromStr.match(/^(.*?)(\d+)$/);
    const matchTo = toStr.match(/^(.*?)(\d+)$/);

    if (matchFrom && matchTo && matchFrom[1] === matchTo[1]) {
      const prefix = matchFrom[1];
      const startNum = parseInt(matchFrom[2], 10);
      const endNum = parseInt(matchTo[2], 10);
      for(let i = Math.min(startNum, endNum); i <= Math.max(startNum, endNum); i++) {
        rollListToMap.push(prefix + i.toString().padStart(matchFrom[2].length, '0'));
      }
    } else { rollListToMap = [fromStr, toStr]; }
  } else if (selectedDept) {
    rollListToMap = dbStudents.filter(s => (s.department || '').toLowerCase().trim() === selectedDept.toLowerCase().trim()).map(s => s.registerNumber || s.email || 'Unknown');
  }
  const calculatedStudents = rollListToMap.length;

  const selectedVenueObj = dbVenues.find(v => v.name === selectedVenue);
  const mappingsAtSelectedTime = mappings.filter(m => m.timeSlot === selectedTime);
  const hasStaffConflict = selectedTime && mappingsAtSelectedTime.some(m => String(m.faculty) === String(selectedStaffId));
  
  let venueOccupiedSeats = 0;
  let existingVenueLayout = null;

  mappingsAtSelectedTime.forEach(m => {
      if (m.venue === selectedVenue) {
          let seatData = [];
          try { seatData = typeof m.seatAllocation === 'string' ? JSON.parse(m.seatAllocation) : m.seatAllocation; } catch(e) {}
          if (Array.isArray(seatData)) {
              venueOccupiedSeats += seatData.filter(s => s.roll).length;
              if (seatData.length > 0) existingVenueLayout = seatData; 
          }
      }
  });

  const effectiveCapacity = seatingStrategy === 'exam' ? Math.ceil((selectedVenueObj?.capacity || 0) / 2) : (selectedVenueObj?.capacity || 0);
  const isCapacityExceeded = selectedVenueObj && (venueOccupiedSeats + calculatedStudents) > effectiveCapacity;
  
  const generateSeats = (rollList, deptName, venueObj, existingLayout, strategy) => {
    const allCols = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    const activeCols = allCols.slice(0, venueObj.cols); 
    let layout = [];
    if (existingLayout && existingLayout.length > 0) {
        layout = JSON.parse(JSON.stringify(existingLayout)); 
        layout.forEach(cell => {
            if (cell.r === undefined) {
                const matchC = cell.seat.match(/[A-Z]+/);
                const matchR = cell.seat.match(/\d+/);
                cell.c = activeCols.indexOf(matchC ? matchC[0] : 'A');
                cell.r = matchR ? parseInt(matchR[0], 10) : 1;
            }
        });
    } else {
        for (let r = 1; r <= venueObj.rows; r++) {
            for (let c = 0; c < activeCols.length; c++) layout.push({ seat: activeCols[c] + r, roll: null, dept: null, r: r, c: c });
        }
    }

    let processedRolls = [...rollList];
    if (strategy === 'random') processedRolls.sort(() => Math.random() - 0.5);
    else processedRolls.sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));

    let shortDept = deptName || "GEN";
    if(shortDept.includes(" ")) shortDept = shortDept.split(" ").map(w=>w[0]).join("").toUpperCase();
    else shortDept = shortDept.substring(0,3).toUpperCase();
    if (shortDept.toLowerCase().includes("com")) shortDept = "CSE";

    let rollIndex = 0;
    let emptySeats = layout.filter(s => s.roll === null);

    if (strategy === 'exam') {
        emptySeats.forEach(cell => {
            if (rollIndex < processedRolls.length && (cell.r + cell.c) % 2 === 0) {
                cell.roll = processedRolls[rollIndex]; cell.dept = shortDept; rollIndex++;
            }
        });
    } else {
        emptySeats.forEach(cell => {
            if (rollIndex < processedRolls.length) {
                cell.roll = processedRolls[rollIndex]; cell.dept = shortDept; rollIndex++;
            }
        });
    }
    return layout; 
  };

  const handleAddMapping = async (e) => {
    e.preventDefault();
    if (!selectedDept || !selectedSubject || !selectedStaffId || !selectedVenue || !selectedTime) return setConflictPopup({ title: "Missing Fields", message: "Please fill out all mapping fields."});
    if (calculatedStudents === 0) return setConflictPopup({ title: "No Students Found", message: `No students found for ${selectedDept}. Please add students to the database or enter manual Roll Numbers.`});

    const fromStr = rollFrom.trim();
    const toStr = rollTo.trim();
    if (fromStr || toStr) {
      if (!fromStr || !toStr) return setConflictPopup({ title: "Invalid Input", message: "Bulk Map Error: Fill both Roll From and To."});
      if (fromStr === toStr) return setConflictPopup({ title: "Invalid Input", message: "Bulk Map Error: Range cannot be identical."});
      if (fromStr.length !== toStr.length) return setConflictPopup({ title: "Invalid Input", message: "Bulk Map Warning: Length mismatch in roll numbers."});
    }

    if (mappings.some(m => m.timeSlot === selectedTime && m.department === selectedDept)) return setConflictPopup({ title: "Batch Conflict", message: `Time slot ${selectedTime} is already mapped for ${selectedDept}!`});

    let mappedRollsAtTime = new Set();
    mappingsAtSelectedTime.forEach(m => {
      let seatData = [];
      try { seatData = typeof m.seatAllocation === 'string' ? JSON.parse(m.seatAllocation) : m.seatAllocation; } catch(e) {}
      if (Array.isArray(seatData)) seatData.forEach(s => { if(s.roll) mappedRollsAtTime.add(s.roll); });
    });

    const overlappingStudents = rollListToMap.filter(roll => mappedRollsAtTime.has(roll));
    if (overlappingStudents.length > 0) return setConflictPopup({ title: "Student Double Booking", message: `Conflict: ${overlappingStudents.length} student(s) (e.g. ${overlappingStudents[0]}) are already scheduled for a class at ${selectedTime}.` });
    if (hasStaffConflict) return setConflictPopup({ title: "Staff Double Booking", message: "This faculty member is already assigned to a different venue at this time." });
    if (!selectedVenueObj) return setConflictPopup({ title: "Venue Not Found", message: "Please select a valid Venue."});

    if (isCapacityExceeded) {
       let errorMsg = `Venue has ${selectedVenueObj.capacity} total seats. Currently occupied: ${venueOccupiedSeats}. You are trying to add ${calculatedStudents} more.`;
       if (seatingStrategy === 'exam') errorMsg = `EXAM MODE ACTIVE: Venue capacity is halved to ${effectiveCapacity} to allow for gaps. You are trying to fit ${calculatedStudents} students into ${effectiveCapacity - venueOccupiedSeats} available exam seats.`;
       return setConflictPopup({ title: "Capacity Exceeded", message: errorMsg });
    }

    const subjectObj = dbSubjects.find(s => (s.subjectName || s.name) === selectedSubject);
    const subjectCode = subjectObj ? (subjectObj.subjectCode || subjectObj.code) : "SUB";
    const seatLayout = generateSeats(rollListToMap, selectedDept, selectedVenueObj, existingVenueLayout, seatingStrategy);

    const newMapping = {
      department: selectedDept, timeSlot: selectedTime, subjectCode: subjectCode, subjectName: selectedSubject,
      faculty: selectedStaffId, venue: selectedVenue, sessionType: selectedVenue.toLowerCase().includes('lab') ? 'Laboratory' : 'Theory',
      batchRange: (rollFrom && rollTo) ? `${rollFrom} to ${rollTo}` : 'All Students', seatAllocation: seatLayout 
    };

    try {
      const response = await fetch(`${apiUrl}/api/host/timetable`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newMapping) });
      if (response.ok) {
        const savedMapping = await response.json(); 
        savedMapping.seatAllocation = seatLayout; 
        const updatedMappings = mappings.map(m => {
            if (m.timeSlot === selectedTime && m.venue === selectedVenue) return { ...m, seatAllocation: seatLayout }; 
            return m;
        });
        setMappings([...updatedMappings, savedMapping]);
        setSelectedSubject(''); setSelectedStaffId(''); setFacultySearch(''); setSelectedVenue(''); setVenueSearch(''); setSelectedTime(''); setRollFrom(''); setRollTo('');
      }
    } catch (err) { console.error("Save failed:", err); }
  };

  const handleRemove = async (id) => {
    try { await fetch(`${apiUrl}/api/host/timetable/${id}`, { method: 'DELETE' }); setMappings(mappings.filter(m => m.id !== id)); } catch (err) { console.error("Failed to delete mapping", err); }
  };

  const handleDragStart = (e, id) => { setDraggedId(id); e.dataTransfer.effectAllowed = "move"; e.target.style.opacity = '0.4'; };
  const handleDragEnd = (e) => { e.target.style.opacity = '1'; setDraggedId(null); };
  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };
  const handleDrop = async (e, targetTime) => {
    e.preventDefault(); if (!draggedId) return;
    const targetSession = mappings.find(m => m.timeSlot === targetTime);
    const draggedSession = mappings.find(m => m.id === draggedId);
    setMappings(prev => prev.map(m => m.id === draggedId ? { ...m, timeSlot: targetTime } : m));
  };

  const menuItems = [
    { name: 'Dashboard', icon: '📈', bg: 'bg-indigo-500', desc: 'Main administrative overview and campus statistics.' },
    { name: 'Mapping Studio', icon: '📍', bg: 'bg-emerald-500', desc: 'Configure global class schedules and venue mappings.' },
    { name: 'Student Records', icon: '🎓', bg: 'bg-blue-500', desc: 'View live campus attendance and student database.' },
    { name: 'Staff Records', icon: '👥', bg: 'bg-violet-500', desc: 'Mark faculty attendance and manage assignments.' },
    { name: 'Venue Manager', icon: '🏢', bg: 'bg-amber-500', desc: 'Manage campus locations, labs, and seating capacities.' },
    { name: 'Active Sessions', icon: '🔴', bg: 'bg-rose-500', desc: 'Monitor ongoing lectures and live attendance feeds.' },
  ];

  // --- RENDER HELPERS ---
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

  // --- UI SCREENS ---
  
  const renderDashboard = () => (
    <div className="animate-in fade-in duration-200 max-w-7xl mx-auto space-y-8">
      <button onClick={() => setActiveMenu('Workspace')} className="mb-2 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors"><span>←</span> Back to Workspace</button>
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">Real-time overview of campus data and schedules.</p>
        </div>
        <div className="bg-[#FFFFFF] px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isLoadingDB ? 'bg-amber-400' : 'bg-[#10B981] animate-pulse'}`}></span>
          <span className="text-xs font-bold text-slate-600">Status: <span className={isLoadingDB ? "text-amber-500" : "text-[#10B981]"}>{isLoadingDB ? 'Syncing...' : 'Online & Live'}</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">🎓</div>
          <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Students</p><h3 className="text-3xl font-black text-slate-800">{dbStudents.length}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 flex items-center gap-5">
          <div className="w-14 h-14 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">👥</div>
          <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Faculty</p><h3 className="text-3xl font-black text-slate-800">{dbStaff.length}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 flex items-center gap-5">
          <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">🏢</div>
          <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Active Venues</p><h3 className="text-3xl font-black text-slate-800">{dbVenues.length}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">📅</div>
          <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Mapped Classes</p><h3 className="text-3xl font-black text-slate-800">{mappings.length}</h3></div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8">
        <h2 className="text-xl font-black text-slate-800 mb-6">Today's Schedule Progress</h2>
        <div className="space-y-6">
          {timeSlots.map((time, idx) => {
            const mappedForSlot = mappings.filter(m => m.timeSlot === time).length;
            const fillPct = Math.min(100, (mappedForSlot / (dbVenues.length || 1)) * 100);
            return (
              <div key={idx} className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-500 w-20">{time}</span>
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${fillPct > 0 ? 'bg-indigo-500' : 'bg-transparent'}`} style={{width: `${fillPct}%`}}></div>
                </div>
                <span className="text-xs font-bold text-slate-400 w-24 text-right">{mappedForSlot} Classes</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );

  const renderStudentRecords = () => {
    const filteredStudents = dbStudents.filter(s => 
      (s.name && s.name.toLowerCase().includes(studentSearch.toLowerCase())) || 
      (s.registerNumber && s.registerNumber.toLowerCase().includes(studentSearch.toLowerCase())) ||
      (s.department && s.department.toLowerCase().includes(studentSearch.toLowerCase()))
    );

    // Calculate Live Stats
    const totalS = filteredStudents.length;
    const presentS = filteredStudents.filter(s => liveStudentStatus[s.registerNumber] === 'Present').length;
    const absentS = filteredStudents.filter(s => liveStudentStatus[s.registerNumber] === 'Absent').length;
    const lateS = filteredStudents.filter(s => liveStudentStatus[s.registerNumber] === 'Late').length;
    const psS = filteredStudents.filter(s => liveStudentStatus[s.registerNumber] === 'PS').length;

    return (
      <div className="animate-in fade-in duration-200 max-w-7xl mx-auto space-y-6">
        <button onClick={() => setActiveMenu('Workspace')} className="mb-2 flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors"><span>←</span> Back to Workspace</button>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
          <div><h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Live Records</h1><p className="text-slate-500 font-medium mt-1">Live campus tracking derived from faculty attendance.</p></div>
        </div>

        {/* LIVE STUDENT SUMMARY CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Found</span><span className="text-2xl font-black text-slate-700">{totalS}</span></div>
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-center items-center"><span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Present</span><span className="text-2xl font-black text-emerald-700">{presentS}</span></div>
          <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 shadow-sm flex flex-col justify-center items-center"><span className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Absent</span><span className="text-2xl font-black text-rose-700">{absentS}</span></div>
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 shadow-sm flex flex-col justify-center items-center"><span className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Late</span><span className="text-2xl font-black text-amber-700">{lateS}</span></div>
          <div className="bg-violet-50 p-4 rounded-2xl border border-violet-100 shadow-sm flex flex-col justify-center items-center"><span className="text-[10px] font-black text-violet-600 uppercase tracking-widest mb-1">PS / OD</span><span className="text-2xl font-black text-violet-700">{psS}</span></div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <div className="relative w-full max-w-md">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              <input type="text" placeholder="Search by name, roll number, or department..." value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm font-medium outline-none focus:border-blue-500 shadow-sm" />
            </div>
            <button className="bg-white border border-slate-200 text-slate-600 font-bold py-2 px-4 rounded-xl hover:bg-slate-50 transition shadow-sm text-xs">Export Report</button>
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-white sticky top-0 shadow-sm z-10"><tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest"><th className="py-4 px-6">Roll Number</th><th className="py-4 px-6">Student Name</th><th className="py-4 px-6">Department</th><th className="py-4 px-6">Current Location</th><th className="py-4 px-6 text-right">Live Status</th></tr></thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredStudents.length > 0 ? filteredStudents.map((student, idx) => {
                  const status = liveStudentStatus[student.registerNumber] || 'Not Marked';
                  
                  // Find their current venue by scanning mappings (Simulated Logic)
                  let currentVenue = "Campus";
                  if (status === 'Present' || status === 'Late') {
                     // Just grab a random active venue to show the UI working
                     currentVenue = dbVenues.length > 0 ? dbVenues[idx % dbVenues.length].name : "Lab 1"; 
                  } else if (status === 'Absent') {
                     currentVenue = "-";
                  }

                  let statusBadge = <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">Unknown</span>;
                  if (status === 'Present') statusBadge = <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">Present</span>;
                  if (status === 'Absent') statusBadge = <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">Absent</span>;
                  if (status === 'Late') statusBadge = <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">Late</span>;
                  if (status === 'PS') statusBadge = <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">PS / OD</span>;

                  return (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                      <td className="py-4 px-6 font-bold text-[#2563EB]">{student.registerNumber || 'N/A'}</td>
                      <td className="py-4 px-6 font-bold text-slate-800 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-xs">{student.name ? student.name.charAt(0).toUpperCase() : 'S'}</div>
                        {student.name || 'Unknown Student'}
                      </td>
                      <td className="py-4 px-6"><span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest">{student.department || 'N/A'}</span></td>
                      <td className="py-4 px-6 text-slate-500 font-medium flex items-center gap-1">
                         {currentVenue !== "-" && <span className="text-blue-500">📍</span>} {currentVenue}
                      </td>
                      <td className="py-4 px-6 text-right">{statusBadge}</td>
                    </tr>
                  )
                }) : <tr><td colSpan="5" className="py-10 text-center text-slate-400 font-medium">No students match your search.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderStaffRecords = () => {
    const filteredStaff = dbStaff.filter(s => 
      (s.name && s.name.toLowerCase().includes(staffSearch.toLowerCase())) || 
      (String(s.id).toLowerCase().includes(staffSearch.toLowerCase())) ||
      (s.department && s.department.toLowerCase().includes(staffSearch.toLowerCase()))
    );

    // Calculate Daily Staff Stats
    const totalF = filteredStaff.length;
    const presentF = filteredStaff.filter(s => staffAttendance[s.id] === 'Present').length;
    const absentF = filteredStaff.filter(s => staffAttendance[s.id] === 'Absent').length;
    const leaveF = filteredStaff.filter(s => staffAttendance[s.id] === 'Leave').length;

    const handleStaffMarking = (id, status) => {
      setStaffAttendance(prev => ({ ...prev, [id]: status }));
    };

    const markAllStaff = (status) => {
      const updated = {};
      filteredStaff.forEach(s => updated[s.id] = status);
      setStaffAttendance(prev => ({ ...prev, ...updated }));
    };

    return (
      <div className="animate-in fade-in duration-200 max-w-7xl mx-auto space-y-6">
        <button onClick={() => setActiveMenu('Workspace')} className="mb-2 flex items-center gap-2 text-slate-500 hover:text-violet-600 font-bold transition-colors"><span>←</span> Back to Workspace</button>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
          <div><h1 className="text-3xl font-black text-slate-900 tracking-tight">Staff Attendance Register</h1><p className="text-slate-500 font-medium mt-1">Manage and mark daily attendance for campus faculty.</p></div>
        </div>

        {/* STAFF SUMMARY CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Faculty</span><span className="text-2xl font-black text-slate-700">{totalF}</span></div>
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-center items-center"><span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Present Today</span><span className="text-2xl font-black text-emerald-700">{presentF}</span></div>
          <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 shadow-sm flex flex-col justify-center items-center"><span className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Absent Today</span><span className="text-2xl font-black text-rose-700">{absentF}</span></div>
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 shadow-sm flex flex-col justify-center items-center"><span className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">On Leave</span><span className="text-2xl font-black text-amber-700">{leaveF}</span></div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-wrap justify-between items-center gap-4">
            <div className="relative w-full max-w-md">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              <input type="text" placeholder="Search by name, ID, or department..." value={staffSearch} onChange={(e) => setStaffSearch(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-medium outline-none focus:border-violet-500 shadow-sm" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => markAllStaff('Present')} className="bg-white border border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 text-emerald-600 font-bold text-xs py-2 px-4 rounded-xl transition shadow-sm">✅ All Present</button>
              <button onClick={() => markAllStaff('Absent')} className="bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-rose-600 font-bold text-xs py-2 px-4 rounded-xl transition shadow-sm">❌ All Absent</button>
            </div>
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-white sticky top-0 shadow-sm z-10"><tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest"><th className="py-4 px-6 w-1/6">Staff ID</th><th className="py-4 px-6 w-1/3">Faculty Name</th><th className="py-4 px-6 w-1/4">Department</th><th className="py-4 px-6 text-right w-1/4">Daily Attendance</th></tr></thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredStaff.length > 0 ? filteredStaff.map((staff, idx) => {
                  const status = staffAttendance[staff.id] || 'Present';
                  
                  return (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                      <td className="py-3 px-6 font-bold text-violet-600">{staff.id || 'N/A'}</td>
                      <td className="py-3 px-6 font-bold text-slate-800 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-black text-xs shadow-inner border border-violet-200">{staff.name ? staff.name.charAt(0).toUpperCase() : 'F'}</div>
                        {staff.name || 'Unknown Faculty'}
                      </td>
                      <td className="py-3 px-6"><span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest">{staff.department || 'N/A'}</span></td>
                      <td className="py-3 px-6 text-right">
                         
                         {/* STAFF ATTENDANCE TOGGLES */}
                         <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => handleStaffMarking(staff.id, 'Present')} className={`w-8 h-8 rounded-lg font-black text-sm transition-all flex items-center justify-center ${status === 'Present' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' : 'bg-slate-100 text-slate-400 hover:bg-emerald-50 hover:text-emerald-500'}`} title="Present">P</button>
                            <button onClick={() => handleStaffMarking(staff.id, 'Absent')} className={`w-8 h-8 rounded-lg font-black text-sm transition-all flex items-center justify-center ${status === 'Absent' ? 'bg-rose-500 text-white shadow-md shadow-rose-200' : 'bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-500'}`} title="Absent">A</button>
                            <button onClick={() => handleStaffMarking(staff.id, 'Leave')} className={`w-8 h-8 rounded-lg font-black text-sm transition-all flex items-center justify-center ${status === 'Leave' ? 'bg-amber-500 text-white shadow-md shadow-amber-200' : 'bg-slate-100 text-slate-400 hover:bg-amber-50 hover:text-amber-500'}`} title="On Leave">L</button>
                         </div>

                      </td>
                    </tr>
                  )
                }) : <tr><td colSpan="4" className="py-10 text-center text-slate-400 font-medium">No faculty match your search.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderWorkspace = () => (
    <div className="animate-in fade-in duration-200 max-w-6xl mx-auto py-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-[#1e293b] mb-3 tracking-tight">Welcome to your Workspace, Admin</h2>
        <p className="text-slate-500 text-lg">Select an administrative module below to manage campus systems.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div key={item.name} onClick={() => setActiveMenu(item.name)} className="bg-white p-8 rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 hover:shadow-md hover:border-blue-100 cursor-pointer transition duration-150 group">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 ${item.bg} text-white shadow-inner group-hover:scale-105 transition-transform duration-150`}>{item.icon}</div>
            <h3 className="text-xl font-bold text-[#1e293b] mb-2">{item.name}</h3>
            <p className="text-slate-500 leading-relaxed text-sm font-medium">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderVenueManager = () => (
    <div className="animate-in fade-in duration-200 max-w-5xl mx-auto space-y-6">
      <button onClick={() => setActiveMenu('Workspace')} className="mb-2 flex items-center gap-2 text-slate-500 hover:text-amber-500 font-bold transition-colors"><span>←</span> Back to Workspace</button>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div><h1 className="text-3xl font-black text-slate-900 tracking-tight">Venue Manager</h1><p className="text-slate-500 font-medium mt-1">Add class rooms, laboratories, and track live occupancy.</p></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 md:col-span-1 h-max sticky top-6">
          <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white text-2xl mb-6 shadow-inner">🏢</div>
          <h2 className="text-xl font-black text-slate-800 mb-6">Add New Venue</h2>
          
          <form onSubmit={handleAddVenue} className="space-y-5">
            <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Building Name</label><input type="text" required value={newVenueBuilding} onChange={(e) => setNewVenueBuilding(e.target.value)} className="w-full bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition-colors duration-150" /></div>
            <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Venue Name</label><input type="text" required value={newVenueName} onChange={(e) => setNewVenueName(e.target.value)} className="w-full bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition-colors duration-150" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Columns</label><input type="number" required min="1" value={newVenueCols} onChange={(e) => setNewVenueCols(e.target.value)} className="w-full bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition-colors duration-150" /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Rows</label><input type="number" required min="1" value={newVenueRows} onChange={(e) => setNewVenueRows(e.target.value)} className="w-full bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition-colors duration-150" /></div>
            </div>
            <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
               <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest block mb-1">Total Auto-Capacity</span>
               <span className="text-xl font-bold text-amber-800">{((parseInt(newVenueRows)||0) * (parseInt(newVenueCols)||0)) || 0} Seats</span>
            </div>
            <button type="submit" className="w-full py-3.5 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-md transition duration-150 active:scale-95">Save Venue</button>
          </form>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="font-bold text-slate-500 uppercase tracking-widest text-xs">Campus Venues Master List</h3><span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md">{dbVenues.length} Total</span>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100"><tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest"><th className="py-4 px-6 w-1/3">Building & Venue</th><th className="py-4 px-6">Layout & Capacity</th><th className="py-4 px-6 text-right">Action</th></tr></thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {dbVenues.map((venue) => {
                  const maxOccupied = getVenueMaxOccupied(venue.name);
                  const fillPercentage = Math.min(100, (maxOccupied / venue.capacity) * 100);
                  const isOver = maxOccupied > venue.capacity;
                  return (
                    <tr key={venue.id} className="hover:bg-slate-50 transition-colors duration-150 group">
                      <td className="py-4 px-6"><p className="font-bold text-slate-800 text-sm flex items-center gap-2"><span className="text-lg">📍</span> {venue.name}</p><p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mt-1 ml-7">{venue.building}</p></td>
                      <td className="py-4 px-6"><div className="flex items-center justify-between mb-1.5 pr-4"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Max Booked: <span className={`font-black ml-1 text-sm ${isOver ? 'text-rose-500' : 'text-[#2563EB]'}`}>{maxOccupied}</span> / {venue.capacity}</span><span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 rounded">{venue.cols}x{venue.rows} Grid</span></div><div className="w-full max-w-[200px] h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-300 ${isOver ? 'bg-rose-500' : fillPercentage > 85 ? 'bg-amber-400' : 'bg-[#2563EB]'}`} style={{ width: `${fillPercentage}%` }}></div></div></td>
                      <td className="py-4 px-6 text-right"><button onClick={() => handleRemoveVenue(venue.id)} className="text-xs font-bold text-rose-500 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 opacity-0 group-hover:opacity-100 transition-opacity duration-150">Remove</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMappingStudio = () => (
    <div className="animate-in fade-in duration-200 max-w-7xl mx-auto space-y-6">
      <button onClick={() => setActiveMenu('Workspace')} className="mb-2 flex items-center gap-2 text-slate-500 hover:text-[#2563EB] font-bold transition-colors"><span>←</span> Back to Workspace</button>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div><h1 className="text-3xl font-black text-slate-900 tracking-tight">Mapping Studio</h1><p className="text-slate-500 font-medium mt-1">Configure global class schedules and automated venue seating.</p></div>
        <div className="flex gap-3"><div className="bg-[#FFFFFF] px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${isLoadingDB ? 'bg-amber-400' : 'bg-[#10B981] animate-pulse'}`}></span><span className="text-xs font-bold text-slate-600">DB Sync: <span className={isLoadingDB ? "text-amber-500" : "text-[#10B981]"}>{isLoadingDB ? 'Fetching DB...' : 'Live Server Sync'}</span></span></div></div>
      </div>

      <div className="bg-[#FFFFFF] rounded-[2.5rem] p-8 shadow-sm border border-slate-200">
        <h2 className="text-xl font-black text-slate-800 mb-6 border-b border-slate-100 pb-4">Create Automated Mapping</h2>
        <form onSubmit={handleAddMapping} className="flex flex-wrap gap-6 items-end">
          <div className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">1. Department</label><select className="w-full bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition duration-150" value={selectedDept} onChange={(e) => { setSelectedDept(e.target.value); setSelectedSubject(''); setSelectedStaffId(''); setFacultySearch(''); }}><option value="">{isLoadingDB ? 'Loading...' : 'Select Department...'}</option>{dbDepartments.map((d, idx) => <option key={idx} value={d}>{d}</option>)}</select></div>
          <div className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">2. Subject / Course</label><select className="w-full bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:border-[#2563EB] outline-none disabled:opacity-50 transition duration-150" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} disabled={!selectedDept || isLoadingDB}><option value="">Select Subject...</option>{getDisplaySubjects().length > 0 ? getDisplaySubjects().map((s, idx) => <option key={idx} value={s.subjectName || s.name}>{s.subjectName || s.name} {s.subjectCode || s.code ? `(${s.subjectCode || s.code})` : ''}</option>) : <option disabled>No courses found in DB</option>}</select></div>
          <div className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] bg-slate-50 p-3 rounded-xl border border-slate-100 h-[74px] flex flex-col justify-end relative"><label className="flex justify-between items-center block text-[10px] font-black text-[#2563EB] uppercase tracking-widest mb-2 px-1">3. Bulk Map Students {calculatedStudents > 0 && <span className="bg-[#2563EB] text-white px-2 py-0.5 rounded">{calculatedStudents} Total</span>}</label><div className="grid grid-cols-2 gap-2"><input type="text" placeholder="Roll From (Opt)" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-[#2563EB]" value={rollFrom} onChange={(e) => setRollFrom(e.target.value.toUpperCase())} /><input type="text" placeholder="Roll To" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-[#2563EB]" value={rollTo} onChange={(e) => setRollTo(e.target.value.toUpperCase())} /></div></div>
          <div className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] relative"><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">4. Faculty (Name/ID)</label><input type="text" placeholder="Search Faculty..." className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#2563EB]" value={facultySearch} onChange={(e) => { setFacultySearch(e.target.value); setShowFacultyList(true); if (e.target.value === "") setSelectedStaffId(''); }} onFocus={() => setShowFacultyList(true)} onBlur={() => setTimeout(() => setShowFacultyList(false), 150)} />{showFacultyList && (<div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto">{getFilteredFaculty().map((staff) => (<div key={staff.id} className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-none" onMouseDown={() => { setSelectedStaffId(staff.id); setFacultySearch(staff.name); setShowFacultyList(false); }}><div className="flex justify-between items-center"><span className="text-sm font-bold text-slate-700">{staff.name}</span><span className="text-[10px] font-black bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">ID: {staff.id}</span></div><p className="text-[10px] text-blue-500 font-medium uppercase">{staff.department}</p></div>))}</div>)}</div>
          <div className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] relative"><label className="flex justify-between items-center block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">5. Venue {dbVenues.find(v=>v.name===selectedVenue) && <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Cap: {dbVenues.find(v=>v.name===selectedVenue).capacity}</span>}</label><input type="text" placeholder="Search Venue..." className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#2563EB]" value={venueSearch} onChange={(e) => { setVenueSearch(e.target.value); setShowVenueList(true); setSelectedVenue(''); }} onFocus={() => setShowVenueList(true)} onBlur={() => setTimeout(() => setShowVenueList(false), 150)} />{showVenueList && (<div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-56 overflow-y-auto">{getFilteredVenues().map((v, i) => (<div key={i} className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex justify-between items-center border-b border-slate-50" onMouseDown={() => { setSelectedVenue(v.name); setVenueSearch(v.name); setShowVenueList(false); }}><div><span className="text-sm font-bold text-slate-700">{v.name}</span><p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{v.building}</p></div><span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-1 rounded">{v.capacity} Seats</span></div>))}</div>)}</div>
          <div className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"><label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">6. Time Slot</label><select className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-3 text-sm font-medium outline-none transition duration-150" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}><option value="">Select Time...</option>{timeSlots.map((t, idx) => <option key={idx} value={t}>{t}</option>)}</select></div>
          <div className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"><label className="block text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">7. Seating Strategy</label><select className="w-full bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-3 py-3 text-sm font-bold outline-none focus:border-emerald-500 transition duration-150" value={seatingStrategy} onChange={(e) => setSeatingStrategy(e.target.value)}><option value="sequential">Sequential (Roll No. Order)</option><option value="random">Random Shuffled</option><option value="exam">Exam Mode (Alternate Seats)</option></select></div>
          <div className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] h-[46px] relative"><button type="submit" className={`w-full h-full rounded-xl font-bold text-white transition duration-150 shadow-md flex items-center justify-center ${!selectedSubject || !selectedStaffId || !selectedVenue || !selectedTime ? 'bg-slate-300 cursor-not-allowed' : 'bg-[#2563EB] hover:bg-blue-700 active:scale-[0.99] shadow-[#2563EB]/20'}`}>Confirm Mapping</button></div>
        </form>
      </div>

      <div className="bg-[#FFFFFF] rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left"><thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200"><tr><th className="py-4 px-6 rounded-tl-3xl">S.No</th><th className="py-4 px-6">Assigned Class & Batch</th><th className="py-4 px-6">Faculty, Venue & Time</th><th className="py-4 px-6 text-right rounded-tr-3xl">Action</th></tr></thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {timeSlots.map((time, index) => {
              const sessionsInSlot = mappings.filter(m => m.timeSlot === time);
              return (
                <tr key={time} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, time)}>
                  <td className="py-4 px-6 font-bold text-slate-800 w-24 align-top pt-6 bg-slate-50/30 border-r border-slate-100">Period {index + 1}</td>
                  <td colSpan="3" className="p-0">
                    {sessionsInSlot.length === 0 ? (<div className="py-6 text-center text-slate-400 font-medium text-xs border-2 border-dashed border-slate-100 m-4 rounded-xl bg-slate-50/50">No classes scheduled. Drag a class here or add via Auto-Mapping.</div>) : (
                      <div className="flex flex-col">
                        {sessionsInSlot.map((session) => (
                          <div key={session.id} draggable onDragStart={(e) => handleDragStart(e, session.id)} onDragEnd={handleDragEnd} className="flex flex-col md:flex-row items-start md:items-center border-b border-slate-100 last:border-0 hover:bg-[#F8FAFC] p-4 group transition-colors duration-150 cursor-grab active:cursor-grabbing">
                            <div className="flex-1 flex items-center gap-3 w-full md:w-auto mb-2 md:mb-0"><span className="text-slate-300 hover:text-slate-500 transition-colors duration-150" title="Drag to move">⋮⋮</span><div><p className="font-bold text-slate-800 flex items-center gap-2"><span className="bg-[#2563EB]/10 text-[#2563EB] font-bold px-2 py-0.5 rounded text-xs">{session.subjectCode}</span>{session.subjectName}</p><p className="text-[10px] font-black uppercase tracking-widest text-[#2563EB] mt-1">🧑‍🎓 BATCH: {session.batchRange} | {session.department}</p></div></div>
                            <div className="flex-1 font-medium text-slate-600 flex items-center flex-wrap gap-2 w-full md:w-auto pl-7 md:pl-0"><span className="text-[#2563EB] font-bold">{dbStaff.find(s => String(s.id) === String(session.faculty))?.name || `ID: ${session.faculty}`}</span> <span className="text-slate-300">|</span> <button onClick={() => setSelectedSessionForSeats(session)} className="font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1 rounded-md transition-colors duration-150 cursor-pointer flex items-center gap-1 shadow-sm">📍 {session.venue} <span className="text-[10px] font-normal text-slate-500 ml-1">(View Map)</span></button><span className="text-slate-300">|</span> <span className="font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1 rounded-md">{session.timeSlot}</span></div>
                            <div className="w-full md:w-24 text-right mt-2 md:mt-0 pr-2"><button onClick={() => handleRemove(session.id)} className="text-xs font-bold text-rose-500 hover:text-rose-700 hover:underline bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150">Remove</button></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveMenu('Workspace')}>
          <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-inner">C</div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Central<span className="text-[#2563EB] font-normal">Portal</span></h1>
        </div>
        <button onClick={handleLogout} className="text-rose-500 font-bold text-sm hover:underline transition duration-150">Sign out</button>
      </header>

      <main className="flex-1 p-6 md:p-10 relative">
        {activeMenu === 'Workspace' ? renderWorkspace() : 
         activeMenu === 'Dashboard' ? renderDashboard() : 
         activeMenu === 'Student Records' ? renderStudentRecords() : 
         activeMenu === 'Staff Records' ? renderStaffRecords() : 
         activeMenu === 'Mapping Studio' ? renderMappingStudio() : 
         activeMenu === 'Venue Manager' ? renderVenueManager() :
         <div className="text-center py-20 flex flex-col items-center"><div className="text-6xl mb-4 opacity-80">🚧</div><h2 className="text-3xl font-black text-slate-800 mb-2">{activeMenu}</h2><p className="text-slate-500 font-medium">This module is currently under development.</p><button onClick={() => setActiveMenu('Workspace')} className="mt-6 text-blue-600 font-bold hover:underline">Return to Workspace</button></div>}
      </main>

      {/* --- MODALS --- */}
      {conflictPopup && (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl flex flex-col items-center text-center transform scale-100">
            <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center text-3xl mb-6">⚠️</div>
            <h2 className="text-2xl font-black text-slate-800 mb-3">{conflictPopup.title}</h2>
            <p className="text-slate-500 font-medium leading-relaxed mb-8">{conflictPopup.message}</p>
            <button onClick={() => setConflictPopup(null)} className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 rounded-xl transition duration-150 active:scale-95 shadow-md">Acknowledge & Edit</button>
          </div>
        </div>
      )}

      {selectedSessionForSeats && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-[95vw] lg:max-w-7xl h-[90vh] flex flex-col shadow-2xl overflow-hidden transform scale-100 transition-transform duration-200">
            <div className="p-6 border-b border-slate-100 bg-white">
              <div className="flex justify-between items-start mb-4">
                <div><div className="flex items-center gap-3 mb-1"><span className="text-3xl">📍</span><h2 className="text-2xl font-black text-slate-800">{selectedSessionForSeats.venue} Map</h2></div><p className="text-sm font-bold text-slate-500 ml-10">{selectedSessionForSeats.subjectName} <span className="text-[#2563EB] mx-2">•</span> {selectedSessionForSeats.timeSlot}</p></div>
                <button onClick={() => {setSelectedSessionForSeats(null); setSeatSearchTerm('');}} className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 transition duration-150 font-bold text-lg shadow-sm active:scale-95">✕</button>
              </div>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 ml-10">
                <div className="relative w-full md:w-80"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span><input type="text" placeholder="Search by roll number..." className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-medium outline-none focus:border-blue-500 transition-colors" value={seatSearchTerm} onChange={(e) => setSeatSearchTerm(e.target.value)} /></div>
                <div className="flex gap-5 items-center text-xs font-bold text-slate-500 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100"><span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-600 shadow-sm border border-blue-700"></div> Found Match</span><span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#E1EAF9] border border-[#C8D9F4]"></div> CSE</span><span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#FEF4C1] border border-[#FDEB9E]"></div> ECE</span><span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#FBE1EC] border border-[#F7CDE0]"></div> EEE</span><span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#DBF6E4] border border-[#C3EED3]"></div> IT</span><span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#F8FAFC] border border-slate-200"></div> Empty</span></div>
              </div>
            </div>
            <div className="p-6 overflow-auto bg-[#F8FAFC] flex-1 custom-scrollbar">
               {(() => {
                 let seatAllocationData = [];
                 try { seatAllocationData = typeof selectedSessionForSeats.seatAllocation === 'string' ? JSON.parse(selectedSessionForSeats.seatAllocation) : selectedSessionForSeats.seatAllocation; } catch(e) { seatAllocationData = []; }
                 const gridMatrix = getGridMatrix(seatAllocationData);
                 
                 if (seatAllocationData && seatAllocationData.length > 0) {
                   return (
                     <div className="bg-white border border-slate-200 rounded-[2rem] p-4 min-w-max shadow-sm">
                       <table className="border-separate border-spacing-2 mx-auto">
                         <thead><tr><th className="w-10"></th>{gridMatrix.cols.map(c => (<th key={c} className="text-slate-400 font-bold pb-2 text-center w-24 text-sm">{c}</th>))}</tr></thead>
                         <tbody>
                           {gridMatrix.rows.map(r => (
                             <tr key={r}><td className="text-slate-400 font-bold text-center pr-4 text-sm">{r}</td>
                               {gridMatrix.cols.map(c => {
                                 const seatId = `${c}${r}`;
                                 const seatInfo = seatAllocationData.find(s => s.seat === seatId);
                                 const isMatch = seatSearchTerm && seatInfo?.roll && seatInfo.roll.toLowerCase().includes(seatSearchTerm.toLowerCase());
                                 const colorClasses = isMatch ? 'bg-blue-600 text-white border-blue-700 shadow-md transform scale-105 z-10' : getDeptColorClasses(seatInfo?.dept, !!seatInfo?.roll);

                                 return (
                                   <td key={c} className="p-0 align-top relative">
                                     <div className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border shadow-sm h-full min-h-[85px] transition-all duration-200 ${colorClasses}`}>
                                       {seatInfo && seatInfo.roll ? (
                                          <><span className={`text-[10px] font-black mb-1 ${isMatch ? 'text-blue-200' : 'text-slate-500'}`}>{seatInfo.seat}</span><span className="text-xs font-black uppercase tracking-wider mb-1.5">{seatInfo.dept}</span><span className={`text-[9px] font-medium tracking-tight break-all text-center ${isMatch ? 'text-white' : 'text-slate-600'}`}>{seatInfo.roll}</span></>
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
                   return <div className="text-center py-20 flex flex-col items-center"><div className="text-4xl mb-4">🪑</div><p className="text-slate-600 font-bold text-lg mb-2">No Seats Allocated</p><p className="text-slate-400 font-medium text-sm max-w-sm">This session was mapped before the grid allocation feature was added, or no students were assigned.</p></div>;
                 }
               })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}