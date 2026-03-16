import React, { useState, useEffect } from 'react';

export default function AttendanceMapping({ handleLogout, apiUrl }) {
  const [activeMenu, setActiveMenu] = useState('Attendance Mapping');

  // --- DATABASE STATES ---
  const [dbStaff, setDbStaff] = useState([]);
  const [dbDepartments, setDbDepartments] = useState([]);
  const [dbSubjects, setDbSubjects] = useState([]);
  const [isLoadingDB, setIsLoadingDB] = useState(true);

  // --- FORM STATES ---
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('');
  const [rollFrom, setRollFrom] = useState('');
  const [rollTo, setRollTo] = useState('');

  // --- TIMETABLE STATES (UPDATED FOR GLOBAL SYNC) ---
  // Automatically loads saved mappings when you open the page
  const [mappings, setMappings] = useState(() => {
    const saved = localStorage.getItem('globalTimetable');
    return saved ? JSON.parse(saved) : [];
  });
  const [draggedId, setDraggedId] = useState(null);

  const timeSlots = ["09:00 AM", "09:50 AM", "10:40 AM", "11:30 AM", "01:10 PM", "02:00 PM", "02:50 PM", "03:40 PM"];

  // --- AUTOMATICALLY SAVE TO LOCALSTORAGE ---
  // Every time 'mappings' changes, it saves to the browser so StudentPortal can read it
  useEffect(() => {
    localStorage.setItem('globalTimetable', JSON.stringify(mappings));
  }, [mappings]);

  // --- 100% BULLETPROOF DATABASE FETCHING ---
  useEffect(() => {
    const fetchAdminData = async () => {
      setIsLoadingDB(true);
      try {
        const [staffRes, studentRes, subjectRes] = await Promise.all([
          fetch(`${apiUrl}/api/host/all-staff`).catch(() => null),
          fetch(`${apiUrl}/api/host/all-students`).catch(() => null),
          fetch(`${apiUrl}/api/host/all-subjects`).catch(() => null)
        ]);

        let allDepts = new Set();
        let fetchedSubjects = [];

        // 1. Fetch Staff & Extract Departments
        if (staffRes && staffRes.ok) {
          const staffData = await staffRes.json();
          setDbStaff(staffData);
          staffData.forEach(s => {
            if (s.department && s.department.trim() !== "" && s.department !== "Unassigned") {
              allDepts.add(s.department.trim());
            }
          });
        }

        // 2. Fetch Students & Extract Departments
        if (studentRes && studentRes.ok) {
          const studentData = await studentRes.json();
          studentData.forEach(s => {
            if (s.department && s.department.trim() !== "" && s.department !== "Unassigned") {
              allDepts.add(s.department.trim());
            }
          });
        }

        // 3. Fetch Subjects (Courses) & Extract Departments
        if (subjectRes && subjectRes.ok) {
          fetchedSubjects = await subjectRes.json();
          setDbSubjects(fetchedSubjects);
          fetchedSubjects.forEach(s => {
            if (s.department && s.department.trim() !== "" && s.department !== "Unassigned") {
              allDepts.add(s.department.trim());
            }
          });
        }

        // Save the MASTER list of departments from all 3 tables
        const masterDeptList = Array.from(allDepts).sort();
        setDbDepartments(masterDeptList);

      } catch (error) {
        console.error("Failed to fetch from Admin Portal DB:", error);
      } finally {
        setIsLoadingDB(false);
      }
    };

    if (apiUrl) fetchAdminData();
  }, [apiUrl]);

  // --- SMART SUBJECT FILTER ---
  const getDisplaySubjects = () => {
    if (!dbSubjects || dbSubjects.length === 0) return [];
    
    // If a department is selected, try to filter by it
    if (selectedDept) {
      const filtered = dbSubjects.filter(s => 
        s.department && s.department.trim().toLowerCase() === selectedDept.trim().toLowerCase()
      );
      // If we found matches, return them. Otherwise, return ALL subjects to prevent blocking the user.
      if (filtered.length > 0) return filtered;
    }
    
    // If no department is selected, or if the filter found zero results, show ALL subjects.
    return dbSubjects;
  };

  const hasConflict = mappings.some(m => m.faculty === selectedStaff || m.venue === selectedVenue);

  const handleAddMapping = (e) => {
    e.preventDefault();
    if (hasConflict || !selectedSubject || !selectedStaff || !selectedVenue) return;

    const usedSlots = mappings.map(m => m.time);
    const availableSlot = timeSlots.find(t => !usedSlots.includes(t));

    if (!availableSlot) {
      alert("Timetable is completely full for today!");
      return;
    }

    // Safely extract the subject code based on your Course.java entity
    const subjectObj = dbSubjects.find(s => (s.subjectName || s.name) === selectedSubject);
    const subjectCode = subjectObj ? (subjectObj.subjectCode || subjectObj.code) : "SUB";

    const newMapping = {
      id: Date.now(),
      department: selectedDept, // <--- CRITICAL FOR STUDENT PORTAL: Save the mapped department
      time: availableSlot,
      code: subjectCode,
      name: selectedSubject,
      faculty: selectedStaff,
      venue: selectedVenue,
      type: selectedVenue.includes('Lab') ? 'Laboratory' : 'Theory',
      range: rollFrom && rollTo ? `${rollFrom} to ${rollTo}` : 'All Students'
    };

    setMappings([...mappings, newMapping]);
    
    // Reset Form
    setSelectedSubject('');
    setSelectedStaff('');
    setSelectedVenue('');
    setRollFrom('');
    setRollTo('');
  };

  const handleRemove = (id) => setMappings(mappings.filter(m => m.id !== id));

  // Drag Drop Logic
  const handleDragStart = (e, id) => { setDraggedId(id); e.dataTransfer.effectAllowed = "move"; e.target.style.opacity = '0.4'; };
  const handleDragEnd = (e) => { e.target.style.opacity = '1'; setDraggedId(null); };
  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };
  const handleDrop = (e, targetTime) => {
    e.preventDefault();
    if (!draggedId) return;
    const targetSession = mappings.find(m => m.time === targetTime);
    const draggedSession = mappings.find(m => m.id === draggedId);

    setMappings(prev => prev.map(m => {
      if (m.id === draggedId) return { ...m, time: targetTime };
      if (targetSession && m.id === targetSession.id) return { ...m, time: draggedSession.time };
      return m;
    }));
  };

  const menuItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Attendance Mapping', icon: '📍' },
    { name: 'Active Sessions', icon: '🔴' },
    { name: 'Students', icon: '🎓' },
    { name: 'Staff', icon: '👥' },
    { name: 'Venues', icon: '🏢' },
    { name: 'Reports', icon: '📈' },
  ];

  const renderMappingStudio = () => (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mapping Studio</h1>
          <p className="text-slate-500 font-medium mt-1">Configure classes, venues, and student bulk mapping.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-[#FFFFFF] px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isLoadingDB ? 'bg-amber-400' : 'bg-[#10B981] animate-pulse'}`}></span>
            <span className="text-xs font-bold text-slate-600">DB Sync: <span className={isLoadingDB ? "text-amber-500" : "text-[#10B981]"}>{isLoadingDB ? 'Fetching Data...' : 'Active'}</span></span>
          </div>
        </div>
      </div>

      {/* HORIZONTAL QUICK MAPPING FORM */}
      <div className="bg-[#FFFFFF] rounded-[2rem] p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-black text-slate-800">Quick Mapping</h2>
          <span className="text-[10px] font-bold bg-[#2563EB]/10 text-[#2563EB] px-2 py-1 rounded uppercase tracking-widest">Database Linked</span>
        </div>

        <form onSubmit={handleAddMapping} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-end">
          
          {/* 1. MASTER DEPARTMENT */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">1. Department</label>
            <select 
              className="w-full bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:border-[#2563EB] outline-none disabled:opacity-50" 
              value={selectedDept} 
              onChange={(e) => { setSelectedDept(e.target.value); setSelectedSubject(''); }}
              disabled={isLoadingDB}
            >
              <option value="">{isLoadingDB ? 'Loading...' : 'All Departments...'}</option>
              {dbDepartments.length > 0 ? (
                dbDepartments.map((d, idx) => <option key={idx} value={d}>{d}</option>)
              ) : (
                <option disabled>No departments found in DB</option>
              )}
            </select>
          </div>

          {/* 2. ALL SUBJECTS */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">2. Subject / Course</label>
            <select 
              className="w-full bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:border-[#2563EB] outline-none disabled:opacity-50" 
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)} 
              disabled={isLoadingDB}
            >
              <option value="">Select Subject...</option>
              {getDisplaySubjects().length > 0 ? (
                getDisplaySubjects().map((s, idx) => {
                  const name = s.subjectName || s.name || "Unnamed Course";
                  const code = s.subjectCode || s.code || "";
                  return <option key={idx} value={name}>{name} {code ? `(${code})` : ''}</option>;
                })
              ) : (
                <option disabled>No courses found in DB</option>
              )}
            </select>
          </div>

          {/* 3. STUDENT RANGE */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 h-full flex flex-col justify-end">
            <label className="block text-[10px] font-black text-[#2563EB] uppercase tracking-widest mb-1.5 px-1">3. Bulk Map (Optional)</label>
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="Roll From" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium outline-none focus:border-[#2563EB]" value={rollFrom} onChange={(e) => setRollFrom(e.target.value)} />
              <input type="text" placeholder="Roll To" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium outline-none focus:border-[#2563EB]" value={rollTo} onChange={(e) => setRollTo(e.target.value)} />
            </div>
          </div>

          {/* 4. FACULTY */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">4. Faculty</label>
            <select 
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-3 text-sm font-medium outline-none disabled:opacity-50" 
              value={selectedStaff} 
              onChange={(e) => setSelectedStaff(e.target.value)}
              disabled={isLoadingDB}
            >
              <option value="">Select Faculty...</option>
              {dbStaff.length > 0 ? (
                dbStaff.map((staff, idx) => (
                  <option key={idx} value={staff.name || staff.email}>{staff.name || staff.email}</option>
                ))
              ) : (
                <option disabled>No staff found in DB</option>
              )}
            </select>
          </div>

          {/* 5. VENUE */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">5. Venue</label>
            <select className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-3 text-sm font-medium outline-none" value={selectedVenue} onChange={(e) => setSelectedVenue(e.target.value)}>
              <option value="">Select Venue...</option>
              <option value="Lab 1">Lab 1</option>
              <option value="Room 101">Room 101</option>
              <option value="Room 204">Room 204</option>
              <option value="Seminar Hall">Seminar Hall</option>
            </select>
          </div>

          {/* 6. SUBMIT BUTTON & WARNING */}
          <div className="relative">
             {hasConflict && (
              <div className="absolute -top-12 left-0 w-full bg-rose-50 border border-rose-200 rounded-lg p-2 flex items-center gap-2 animate-in fade-in">
                <span className="text-rose-500 text-sm">⚠️</span>
                <p className="text-[10px] font-black text-rose-700 uppercase tracking-widest leading-none">Conflict Detected</p>
              </div>
            )}
            <button type="submit" className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-md h-[46px] ${hasConflict || !selectedSubject || !selectedStaff || !selectedVenue ? 'bg-slate-300 cursor-not-allowed' : 'bg-[#2563EB] hover:bg-blue-700 hover:-translate-y-0.5 shadow-[#2563EB]/20'}`} disabled={hasConflict || !selectedSubject || !selectedStaff || !selectedVenue}>
              Confirm Mapping
            </button>
          </div>
        </form>
      </div>

      {/* TIMETABLE */}
      <div className="bg-[#FFFFFF] rounded-[2rem] p-1 shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#F8FAFC] text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
              <th className="py-4 px-6 rounded-tl-3xl">Time / Period</th>
              <th className="py-4 px-6">Assigned Class & Batch</th>
              <th className="py-4 px-6">Faculty & Venue</th>
              <th className="py-4 px-6 text-right rounded-tr-3xl">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {timeSlots.map(time => {
              const mappedSession = mappings.find(m => m.time === time);
              return (
                <tr key={time} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, time)} className={mappedSession ? "hover:bg-[#F8FAFC] transition-colors bg-white" : "bg-slate-50/50 border-dashed border-b-0"}>
                  <td className="py-4 px-6 font-bold text-slate-800 w-36">{time}</td>
                  {mappedSession ? (
                    <>
                      <td draggable onDragStart={(e) => handleDragStart(e, mappedSession.id)} onDragEnd={handleDragEnd} className="py-4 px-6 cursor-grab active:cursor-grabbing">
                        <div className="flex items-center gap-3">
                          <span className="cursor-move text-slate-300 hover:text-slate-500 transition-colors" title="Drag to move">⋮⋮</span>
                          <div>
                            <p className="font-bold text-slate-800 flex items-center gap-2">
                              <span className="bg-[#2563EB]/10 text-[#2563EB] font-bold px-2 py-0.5 rounded text-xs">{mappedSession.code}</span>
                              {mappedSession.name}
                            </p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#2563EB] mt-1">
                              🧑‍🎓 BATCH: {mappedSession.range} | {mappedSession.department}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-600">
                        <span className="text-[#2563EB] font-bold">{mappedSession.faculty}</span> <span className="text-slate-300 mx-2">|</span> <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">{mappedSession.venue}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button onClick={() => handleRemove(mappedSession.id)} className="text-xs font-bold text-rose-500 hover:text-rose-700 hover:underline bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">Remove</button>
                      </td>
                    </>
                  ) : (
                    <td colSpan="3" className="py-4 px-6">
                      <div className="border-2 border-dashed border-slate-200 rounded-xl bg-white flex items-center justify-center h-12 text-slate-400 font-medium text-xs">
                        Drag a class here, or add from quick mapping
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPlaceholder = () => (
    <div className="flex flex-col items-center justify-center h-full text-center animate-in fade-in duration-500">
      <div className="text-6xl mb-6 opacity-80">{menuItems.find(m => m.name === activeMenu)?.icon}</div>
      <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-3">{activeMenu} Overview</h2>
      <p className="text-slate-500 font-medium max-w-md">This administration module is currently under development. Analytics and tools for {activeMenu} will appear here soon.</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-800 overflow-hidden">
      <aside className="w-64 bg-[#FFFFFF] border-r border-slate-200 hidden md:flex flex-col shadow-sm z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100 mb-4">
          <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center text-white font-black">{"</>"}</div>
          <span className="text-xl font-black tracking-tight text-slate-900">Admin<span className="text-[#2563EB] font-normal">HQ</span></span>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button key={item.name} onClick={() => setActiveMenu(item.name)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeMenu === item.name ? 'bg-[#2563EB]/10 text-[#2563EB] border-r-4 border-[#2563EB]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
              <span className="text-lg">{item.icon}</span>{item.name}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="w-full py-2.5 text-rose-500 font-bold hover:bg-rose-50 rounded-xl transition-colors">Sign Out</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="bg-[#FFFFFF] border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0 z-10">
          <div className="relative w-96">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input type="text" placeholder={`Search ${activeMenu.toLowerCase()}...`} className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all" />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200 cursor-pointer">
              <div className="text-right hidden md:block">
                <p className="text-sm font-black text-slate-800">1234 Admin</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Host</p>
              </div>
              <div className="w-9 h-9 bg-[#10B981] text-white rounded-full flex items-center justify-center font-bold shadow-sm">AD</div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeMenu === 'Attendance Mapping' ? renderMappingStudio() : renderPlaceholder()}
        </div>
      </main>
    </div>
  );
}