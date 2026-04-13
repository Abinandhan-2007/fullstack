import React, { useState, useEffect } from 'react';

const PlacementPortal = ({ handleLogout, apiUrl, loggedInEmail, token, userName }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Common Headers
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [drivesRes, appsRes] = await Promise.all([
          fetch(`${apiUrl}/api/host/all-placementdrives`, { headers }).catch(() => null),
          fetch(`${apiUrl}/api/host/all-placementapplications`, { headers }).catch(() => null)
        ]);

        if (drivesRes?.ok) setDrives(await drivesRes.json() || []);
        if (appsRes?.ok) setApplications(await appsRes.json() || []);
      } catch (err) {
        console.error("Failed to load Placement dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [apiUrl, token]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'drives', label: 'Drive Manager', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'applications', label: 'Student Applications', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'offers', label: 'Offer Letter Tracker', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
    { id: 'resumes', label: 'Resume Bank', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'analytics', label: 'Analytics', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' }
  ];

  /* ---------------- MODULE: DASHBOARD ---------------- */
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Companies Visited', value: drives.length || 0, color: 'text-indigo-600' },
          { label: 'Total Offers', value: applications.filter(a=>a.status==='Selected').length || 0, color: 'text-emerald-500' },
          { label: 'Highest Package', value: '42 LPA', color: 'text-blue-600' },
          { label: 'Avg Package', value: '7.5 LPA', color: 'text-slate-700' },
          { label: 'Placement %', value: '89.4%', color: 'text-amber-500' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">{kpi.label}</p>
            <p className={`text-3xl font-black ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
          <h3 className="font-bold text-slate-800 mb-6">Department-wise Placements</h3>
          <div className="flex items-end space-x-4 h-64 mt-4 px-2 border-b border-slate-200 pb-2">
            {[ {d:'CSE', p:95}, {d:'IT', p:92}, {d:'ECE', p:84}, {d:'MECH', p:65}, {d:'CIVIL', p:54} ].map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group relative">
                <div className="absolute -top-8 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.p}%
                </div>
                <div className="w-full bg-blue-500 hover:bg-blue-600 rounded-t-md transition-all duration-500" style={{height: `${item.p}%`}}></div>
                <span className="text-xs font-bold text-slate-600 mt-2">{item.d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
             <h3 className="font-bold text-slate-800">Upcoming Drives</h3>
          </div>
          <div className="divide-y divide-slate-100">
             {(drives || []).filter(d => d.status === 'Upcoming').slice(0, 4).map((drv, i) => (
               <div key={i} className="p-4 px-6 flex justify-between items-center hover:bg-slate-50">
                 <div>
                   <h4 className="font-bold text-indigo-700 text-sm">{drv.companyName}</h4>
                   <div className="text-xs text-slate-500">{drv.jobRole} • {drv.ctc} LPA</div>
                 </div>
                 <div className="text-right">
                   <div className="text-xs font-bold text-slate-600 mb-1">{drv.batch} Batch</div>
                   <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{drv.status}</span>
                 </div>
               </div>
             ))}
             {!(drives || []).filter(d => d.status === 'Upcoming').length && <div className="p-8 text-center text-slate-500">No upcoming drives.</div>}
          </div>
        </div>
      </div>
    </div>
  );

  /* ---------------- MODULE: DRIVE MANAGER ---------------- */
  const [driveForm, setDriveForm] = useState({ companyName: '', jobRole: '', ctc: '', batch: '2024', department: 'All', status: 'Upcoming' });

  const handleAddDrive = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/api/host/add-placementdrive`, {
        method: 'POST',
        headers,
        body: JSON.stringify({...driveForm, placedStudents: 0})
      });
      if(res.ok) {
        setDrives([...drives, await res.json()]);
        setDriveForm({ companyName: '', jobRole: '', ctc: '', batch: '2024', department: 'All', status: 'Upcoming' });
        alert('Placement Drive Created');
      }
    } catch(err) {}
  };

  const renderDrives = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50"><h3 className="font-bold text-slate-800">Add Placement Drive</h3></div>
        <form onSubmit={handleAddDrive} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label><input required type="text" value={driveForm.companyName} onChange={e=>setDriveForm({...driveForm, companyName:e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 outline-none focus:border-indigo-400" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Job Role</label><input required type="text" value={driveForm.jobRole} onChange={e=>setDriveForm({...driveForm, jobRole:e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 outline-none focus:border-indigo-400" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">CTC (LPA)</label><input required type="text" value={driveForm.ctc} onChange={e=>setDriveForm({...driveForm, ctc:e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 outline-none focus:border-indigo-400" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Eligible Batch</label><input required type="text" value={driveForm.batch} onChange={e=>setDriveForm({...driveForm, batch:e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 outline-none focus:border-indigo-400" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Eligible Departments</label><select value={driveForm.department} onChange={e=>setDriveForm({...driveForm, department:e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 outline-none focus:border-indigo-400"><option>All</option><option>CSE, IT</option><option>Circuit Branches</option><option>Core Branches</option></select></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Status</label><select value={driveForm.status} onChange={e=>setDriveForm({...driveForm, status:e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 outline-none focus:border-indigo-400"><option>Upcoming</option><option>Ongoing</option><option>Completed</option></select></div>
          <div className="md:col-span-3 flex justify-end"><button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-6 py-2 transition-colors">Create Drive</button></div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50"><h3 className="font-bold text-slate-800">All Registration Drives</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate-700">Company & Role</th>
                <th className="px-6 py-3 font-semibold text-slate-700">CTC (LPA)</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Eligibility</th>
                <th className="px-6 py-3 font-semibold text-slate-700 text-center">Status</th>
                <th className="px-6 py-3 font-semibold text-slate-700 text-center">Placed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(drives || []).map((d, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-6 py-4"><div className="font-bold text-indigo-700">{d.companyName}</div><div className="text-xs text-slate-500">{d.jobRole}</div></td>
                  <td className="px-6 py-4 font-black text-slate-700">{d.ctc} LPA</td>
                  <td className="px-6 py-4 text-xs text-slate-600">{d.department} • Batch {d.batch}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${d.status === 'Completed' ? 'bg-slate-100 text-slate-600' : d.status === 'Ongoing' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{d.status}</span>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-emerald-600">{d.placedStudents || 0}</td>
                </tr>
              ))}
              {!drives?.length && <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No drives available.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  /* ---------------- MODULE: APPLICATIONS ---------------- */
  const [appDriveId, setAppDriveId] = useState('');
  
  const handleAppStatusChange = async (appId, newStatus, newRound) => {
    try {
      const target = applications.find(a => a.id === appId);
      const res = await fetch(`${apiUrl}/api/host/update-placementapplication/${appId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({...target, status: newStatus, round: newRound})
      });
      if(res.ok) {
         setApplications(applications.map(async a => a.id === appId ? await res.json() : a));
      }
    } catch(err) {}
  };

  const renderApplications = () => {
    const filteredApps = appDriveId ? applications.filter(a => a.driveId == appDriveId) : applications;
    
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
           <h3 className="font-bold text-slate-800">Student Placement Applications</h3>
           <select value={appDriveId} onChange={e => setAppDriveId(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-indigo-400">
             <option value="">All Drives</option>
             {drives.map(d => <option key={d.id} value={d.id}>{d.companyName} ({d.jobRole})</option>)}
           </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate-700">Student Details</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Company & CGPA</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Current Round</th>
                <th className="px-6 py-3 font-semibold text-slate-700 text-center">Status</th>
                <th className="px-6 py-3 font-semibold text-slate-700 text-center">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(filteredApps || []).map((app, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-6 py-4"><div className="font-medium text-slate-800">{app.studentName}</div><div className="text-xs text-slate-500">{app.registerNumber} • {app.department}</div></td>
                  <td className="px-6 py-4"><div className="font-bold text-indigo-700">{app.companyName}</div><div className="text-xs text-slate-600 mt-1">CGPA: <span className="font-black">{app.cgpa}</span></div></td>
                  <td className="px-6 py-4 font-medium text-slate-600">{app.round || 'Applied'}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${app.status === 'Selected' ? 'bg-emerald-100 text-emerald-700' : app.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>{app.status || 'In Progress'}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <select onChange={(e) => {
                      const val = e.target.value;
                      if(!val) return;
                      const [nS, nR] = val.split('|');
                      handleAppStatusChange(app.id, nS, nR);
                      e.target.value = "";
                    }} className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs outline-none">
                       <option value="">Update...</option>
                       <option value="In Progress|Aptitude">Move to Aptitude</option>
                       <option value="In Progress|Technical">Move to Technical</option>
                       <option value="In Progress|HR Round">Move to HR Round</option>
                       <option value="Selected|Final">Selected (Offer)</option>
                       <option value="Rejected|Eliminated">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
              {!filteredApps?.length && <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No applications found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  /* ---------------- MODULE: OFFERS ---------------- */
  const renderOffers = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
         <h3 className="font-bold text-slate-800">Offer Letter Tracker</h3>
         <button className="bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">Export CSV</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200">
             <tr>
               <th className="px-6 py-3 font-semibold text-slate-700">Student Name</th>
               <th className="px-6 py-3 font-semibold text-slate-700">Dept & Reg No</th>
               <th className="px-6 py-3 font-semibold text-slate-700">Company Name</th>
               <th className="px-6 py-3 font-semibold text-slate-700">CTC & Role</th>
               <th className="px-6 py-3 font-semibold text-slate-700 text-center">Status</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
             {(applications || []).filter(a=>a.status==='Selected').map((app, i) => {
               // derive drive details
               const drv = drives.find(d => d.id === app.driveId);
               return (
                 <tr key={i} className="hover:bg-slate-50">
                   <td className="px-6 py-4 font-bold text-slate-800">{app.studentName}</td>
                   <td className="px-6 py-4"><div className="font-medium text-slate-600">{app.department}</div><div className="text-xs text-slate-500">{app.registerNumber}</div></td>
                   <td className="px-6 py-4 font-bold text-indigo-700">{app.companyName}</td>
                   <td className="px-6 py-4 font-black text-slate-700">{drv?.ctc || 'N/A'} LPA <div className="font-normal text-xs text-slate-500 mt-1">{drv?.jobRole}</div></td>
                   <td className="px-6 py-4 text-center"><span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-1 rounded text-xs">Offer Accepted</span></td>
                 </tr>
               )
             })}
             {!(applications || []).filter(a=>a.status==='Selected').length && <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No offers released yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* ---------------- CONSTANTS / RETURN ---------------- */
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans">
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col shadow-lg md:shadow-none`}>
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h1 className="text-xl font-black text-blue-600 tracking-tight">Placement<span className="text-slate-800">Portal</span></h1>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-slate-600">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveMenu(item.id); setIsSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeMenu === item.id ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <svg className={`w-5 h-5 ${activeMenu === item.id ? 'text-blue-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}/>
                </svg>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-200">
           <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              <span>Sign Out</span>
           </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm px-4 md:px-8 py-4 flex justify-between items-center">
           <div className="flex items-center">
             <button onClick={() => setIsSidebarOpen(true)} className="md:hidden mr-4 text-slate-500 hover:text-slate-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
             </button>
             <h2 className="text-xl font-bold text-slate-800 capitalize">{menuItems.find(m => m.id === activeMenu)?.label}</h2>
           </div>
           <div className="flex items-center space-x-4">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-bold text-slate-800">{userName}</p>
               <p className="text-xs text-slate-500">Placement Officer</p>
             </div>
             <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold border-2 border-blue-200">
               {userName?.charAt(0) || 'P'}
             </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
           {loading ? (
              <div className="h-full flex items-center justify-center">
                 <svg className="animate-spin h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              </div>
           ) : (
              <div className="max-w-6xl mx-auto pb-12">
                 {activeMenu === 'dashboard' && renderDashboard()}
                 {activeMenu === 'drives' && renderDrives()}
                 {activeMenu === 'applications' && renderApplications()}
                 {activeMenu === 'offers' && renderOffers()}
                 {activeMenu === 'resumes' && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center text-slate-500">
                       <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                       <h3 className="text-xl font-bold text-slate-700 mb-2">Centralized Resume Bank</h3>
                       <p>This module securely stores and indexes all student resumes.</p>
                       <p className="text-sm mt-2">Filter by CGPA, Skills, and Department available.</p>
                    </div>
                 )}
                 {activeMenu === 'analytics' && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center text-slate-500">
                       <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>
                       <h3 className="text-xl font-bold text-slate-700 mb-2">Placement Analytics & Trends</h3>
                       <p>Package Distribution, Year-Wise Comparison, Top Recruiters.</p>
                       <button className="mt-6 bg-slate-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-900 transition-colors">Download Annual Report</button>
                    </div>
                 )}
              </div>
           )}
        </main>
      </div>
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
    </div>
  );
};

export default PlacementPortal;
