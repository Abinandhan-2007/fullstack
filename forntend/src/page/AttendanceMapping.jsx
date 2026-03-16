import React, { useState, useEffect } from 'react';

export default function AttendanceMapping({ handleLogout, apiUrl }) {
  const [activeMenu, setActiveMenu] = useState('Mapping Studio');

  const [dbStaff, setDbStaff] = useState([]);
  const [dbDepartments, setDbDepartments] = useState([]);
  const [dbSubjects, setDbSubjects] = useState([]);
  const [isLoadingDB, setIsLoadingDB] = useState(true);

  const [selectedDept, setSelectedDept] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('');
  const [rollFrom, setRollFrom] = useState('');
  const [rollTo, setRollTo] = useState('');

  const [mappings, setMappings] = useState([]);
  const [draggedId, setDraggedId] = useState(null);

  const timeSlots = ["09:00 AM", "09:50 AM", "10:40 AM", "11:30 AM", "01:10 PM", "02:00 PM", "02:50 PM", "03:40 PM"];

  useEffect(() => {
  const fetchAdminData = async () => {
    setIsLoadingDB(true);
    try {
      // 1. Fetch Departments, Staff, and Timetable simultaneously
      const [deptRes, staffRes, timetableRes] = await Promise.all([
        fetch(`${apiUrl}/api/host/all-departments`).catch(() => null),
        fetch(`${apiUrl}/api/host/all-staff`).catch(() => null),
        fetch(`${apiUrl}/api/host/timetable`).catch(() => null)
      ]);

      // 2. Handle Departments (The "Synthetic" Fix)
      if (deptRes && deptRes.ok) {
        const deptData = await deptRes.json();
        // Extract just the names if your Department model is {id, name}
        const deptNames = deptData.map(d => d.name || d.departmentName);
        setDbDepartments(deptNames.sort());
      } else {
        // Fallback if the endpoint fails
        setDbDepartments(["IT", "ECE", "EEE", "CSE"]);
      }

      // 3. Handle Staff
      if (staffRes && staffRes.ok) {
        const staffData = await staffRes.json();
        setDbStaff(staffData);
      }

      // 4. Handle Existing Timetable
      if (timetableRes && timetableRes.ok) {
        const timetableData = await timetableRes.json();
        setMappings(timetableData);
      }

      // 5. Handle Subjects/Courses
      const subRes = await fetch(`${apiUrl}/api/host/all-courses`);
      if (subRes.ok) {
        const subData = await subRes.json();
        setDbSubjects(subData);
      }

    } catch (error) {
      console.error("Sync Error:", error);
    } finally {
      setIsLoadingDB(false);
    }
  };

  if (apiUrl) fetchAdminData();
}, [apiUrl]);

 const getDisplaySubjects = () => {
  // 1. If no subjects are loaded, return empty
  if (!dbSubjects || dbSubjects.length === 0) return [];
  
  // 2. If no department is selected yet, show nothing (or show all)
  // Most users prefer seeing nothing until a department is picked
  if (!selectedDept) return []; 

  const filterDeptStr = selectedDept.toLowerCase().trim();

  // 3. Filter subjects by department name
  return dbSubjects.filter(s => {
    if (!s.department) return false;
    
    const subjDeptStr = s.department.toLowerCase().trim();
    return (
      subjDeptStr === filterDeptStr || 
      subjDeptStr.includes(filterDeptStr) || 
      filterDeptStr.includes(subjDeptStr) ||
      subjDeptStr === "all" || 
      subjDeptStr === "general"
    );
  });
};
  const hasConflict = mappings.some(m => m.timeSlot === timeSlots.find(t => !mappings.map(map => map.timeSlot).includes(t)) && (m.faculty === selectedStaff || m.venue === selectedVenue));

  const handleAddMapping = async (e) => {
    e.preventDefault();
    if (hasConflict || !selectedSubject || !selectedStaff || !selectedVenue) return;

    // =======================================================
    // 🛡️ STRICT BULK MAPPING RULES APPLIED HERE
    // =======================================================
    const fromStr = rollFrom.trim();
    const toStr = rollTo.trim();

    if (fromStr || toStr) {
      // RULE 1: All or Nothing
      if (!fromStr || !toStr) {
        alert("Bulk Map Error: You must fill in BOTH 'Roll From' and 'Roll To', or leave them both empty for 'All Students'.");
        return;
      }
      // RULE 3 & 4: Typo Prevention & Exact Match Block
      if (fromStr === toStr) {
        alert("Bulk Map Error: 'Roll From' and 'Roll To' cannot be the exact same number.");
        return;
      }
      if (fromStr.length !== toStr.length) {
        alert(`Bulk Map Warning: Length mismatch.\n\nFrom: ${fromStr} (${fromStr.length} chars)\nTo: ${toStr} (${toStr.length} chars)\n\nPlease check for missing digits or typos.`);
        return;
      }
    }
    // =======================================================

    const usedSlots = mappings.map(m => m.timeSlot);
    const availableSlot = timeSlots.find(t => !usedSlots.includes(t));

    if (!availableSlot) return alert("Timetable is completely full for today!");

    const subjectObj = dbSubjects.find(s => (s.subjectName || s.name) === selectedSubject);
    const subjectCode = subjectObj ? (subjectObj.subjectCode || subjectObj.code) : "SUB";

    const newMapping = {
      department: selectedDept,
      timeSlot: availableSlot,
      subjectCode: subjectCode,
      subjectName: selectedSubject,
      faculty: selectedStaff,
      venue: selectedVenue,
      sessionType: selectedVenue.includes('Lab') ? 'Laboratory' : 'Theory',
      batchRange: fromStr && toStr ? `${fromStr} to ${toStr}` : 'All Students'
    };

    try {
      const response = await fetch(`${apiUrl}/api/host/timetable`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMapping)
      });
      if (response.ok) {
        const savedMapping = await response.json(); 
        setMappings([...mappings, savedMapping]);
        setSelectedSubject(''); setSelectedStaff(''); setSelectedVenue(''); setRollFrom(''); setRollTo('');
      }
    } catch (err) { console.error("Failed to save mapping to server", err); }
  };

  const handleRemove = async (id) => {
    try {
      await fetch(`${apiUrl}/api/host/timetable/${id}`, { method: 'DELETE' });
      setMappings(mappings.filter(m => m.id !== id));
    } catch (err) { console.error("Failed to delete mapping", err); }
  };

  const handleDragStart = (e, id) => { setDraggedId(id); e.dataTransfer.effectAllowed = "move"; e.target.style.opacity = '0.4'; };
  const handleDragEnd = (e) => { e.target.style.opacity = '1'; setDraggedId(null); };
  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };
  
  const handleDrop = async (e, targetTime) => {
    e.preventDefault();
    if (!draggedId) return;
    const targetSession = mappings.find(m => m.timeSlot === targetTime);
    const draggedSession = mappings.find(m => m.id === draggedId);

    setMappings(prev => prev.map(m => {
      if (m.id === draggedId) return { ...m, timeSlot: targetTime };
      if (targetSession && m.id === targetSession.id) return { ...m, timeSlot: draggedSession.timeSlot };
      return m;
    }));

    try {
      await fetch(`${apiUrl}/api/host/timetable/${draggedId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...draggedSession, timeSlot: targetTime })
      });
      if (targetSession) {
        await fetch(`${apiUrl}/api/host/timetable/${targetSession.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...targetSession, timeSlot: draggedSession.timeSlot })
        });
      }
    } catch (err) { console.error("Failed to update drag-and-drop on server", err); }
  };

  const menuItems = [
    { name: 'Dashboard', icon: '📈', bg: 'bg-indigo-500', desc: 'Main administrative overview and campus statistics.' },
    { name: 'Mapping Studio', icon: '📍', bg: 'bg-emerald-500', desc: 'Configure global class schedules and venue mappings.' },
    { name: 'Active Sessions', icon: '🔴', bg: 'bg-rose-500', desc: 'Monitor ongoing lectures and live attendance feeds.' },
    { name: 'Student Records', icon: '🎓', bg: 'bg-blue-500', desc: 'Manage database of enrolled students and batches.' },
    { name: 'Staff Records', icon: '👥', bg: 'bg-violet-500', desc: 'Manage faculty credentials and department assignments.' },
    { name: 'Venue Manager', icon: '🏢', bg: 'bg-amber-500', desc: 'Oversee campus locations, labs, and room availability.' },
  ];

  const renderWorkspace = () => (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto py-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-[#1e293b] mb-3 tracking-tight">
          Welcome to your Workspace, Admin
        </h2>
        <p className="text-slate-500 text-lg">Select an administrative module below to manage campus systems.</p>
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

  const renderMappingStudio = () => (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto space-y-6">
      
      <button onClick={() => setActiveMenu('Workspace')} className="mb-2 flex items-center gap-2 text-slate-500 hover:text-[#2563EB] font-bold transition-colors">
        <span>←</span> Back to Workspace
      </button>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mapping Studio</h1>
          <p className="text-slate-500 font-medium mt-1">Configure global class schedules and venues.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-[#FFFFFF] px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isLoadingDB ? 'bg-amber-400' : 'bg-[#10B981] animate-pulse'}`}></span>
            <span className="text-xs font-bold text-slate-600">DB Sync: <span className={isLoadingDB ? "text-amber-500" : "text-[#10B981]"}>{isLoadingDB ? 'Fetching DB...' : 'Live Server Sync'}</span></span>
          </div>
        </div>
      </div>

      <div className="bg-[#FFFFFF] rounded-[2rem] p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-black text-slate-800">Quick Mapping</h2>
          <span className="text-[10px] font-bold bg-[#2563EB]/10 text-[#2563EB] px-2 py-1 rounded uppercase tracking-widest">Global Sync</span>
        </div>

        <form onSubmit={handleAddMapping} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">1. Department</label>
            <select className="w-full bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:border-[#2563EB] outline-none disabled:opacity-50" value={selectedDept} onChange={(e) => { setSelectedDept(e.target.value); setSelectedSubject(''); }} disabled={isLoadingDB}>
              <option value="">{isLoadingDB ? 'Loading...' : 'Select Department...'}</option>
              {dbDepartments.map((d, idx) => <option key={idx} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">2. Subject / Course</label>
            <select className="w-full bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:border-[#2563EB] outline-none disabled:opacity-50" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} disabled={!selectedDept || isLoadingDB}>
              <option value="">Select Subject...</option>
              {getDisplaySubjects().length > 0 ? getDisplaySubjects().map((s, idx) => {
                  const name = s.subjectName || s.name || "Unnamed Course";
                  const code = s.subjectCode || s.code || "";
                  return <option key={idx} value={name}>{name} {code ? `(${code})` : ''}</option>;
                }) : <option disabled>No courses found in DB</option>}
            </select>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 h-full flex flex-col justify-end relative">
            {/* The Auto-Uppercase magic happens on the 'onChange' event here */}
            <label className="block text-[10px] font-black text-[#2563EB] uppercase tracking-widest mb-1.5 px-1">3. Bulk Map (Optional)</label>
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="text" 
                placeholder="Roll From" 
                className={`w-full bg-white border rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-[#2563EB] ${rollFrom && !rollTo ? 'border-amber-400 focus:ring-1 focus:ring-amber-400' : 'border-slate-200'}`} 
                value={rollFrom} 
                onChange={(e) => setRollFrom(e.target.value.toUpperCase())} // Rule 2
              />
              <input 
                type="text" 
                placeholder="Roll To" 
                className={`w-full bg-white border rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-[#2563EB] ${!rollFrom && rollTo ? 'border-amber-400 focus:ring-1 focus:ring-amber-400' : 'border-slate-200'}`} 
                value={rollTo} 
                onChange={(e) => setRollTo(e.target.value.toUpperCase())} // Rule 2
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">4. Faculty</label>
            <select className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-3 text-sm font-medium outline-none disabled:opacity-50" value={selectedStaff} onChange={(e) => setSelectedStaff(e.target.value)} disabled={isLoadingDB}>
              <option value="">Select Faculty...</option>
              {dbStaff.length > 0 ? dbStaff.map((staff, idx) => <option key={idx} value={staff.name || staff.email}>{staff.name || staff.email}</option>) : <option disabled>No staff found in DB</option>}
            </select>
          </div>

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
              const mappedSession = mappings.find(m => m.timeSlot === time);
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
                              <span className="bg-[#2563EB]/10 text-[#2563EB] font-bold px-2 py-0.5 rounded text-xs">{mappedSession.subjectCode}</span>
                              {mappedSession.subjectName}
                            </p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#2563EB] mt-1">
                              🧑‍🎓 BATCH: {mappedSession.batchRange} | {mappedSession.department}
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
    <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in duration-500">
      <button onClick={() => setActiveMenu('Workspace')} className="mb-8 flex items-center gap-2 text-slate-500 hover:text-[#2563EB] font-bold transition-colors">
        <span>←</span> Back to Workspace
      </button>
      <div className="text-6xl mb-4 opacity-80">{menuItems.find(m => m.name === activeMenu)?.icon || '🚧'}</div>
      <h2 className="text-3xl font-black text-slate-800 mb-2">{activeMenu}</h2>
      <p className="text-slate-500 font-medium max-w-md">This administrative module is currently under development. Tools for {activeMenu} will appear here soon.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 flex flex-col">
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
            <p className="text-sm font-bold text-slate-900">System Admin</p>
            <p className="text-xs text-slate-500 font-medium">admin@system.local</p>
          </div>
          <div className="w-10 h-10 bg-[#10B981] text-white rounded-full flex items-center justify-center font-bold shadow-sm border border-slate-200">
            AD
          </div>
          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
          <button onClick={handleLogout} className="text-rose-500 font-bold text-sm hover:text-rose-700 transition-colors">
            Sign out
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar relative">
        {activeMenu === 'Workspace' && renderWorkspace()}
        {activeMenu === 'Mapping Studio' && renderMappingStudio()}
        {activeMenu !== 'Workspace' && activeMenu !== 'Mapping Studio' && renderPlaceholder()}
      </main>
    </div>
  );
}