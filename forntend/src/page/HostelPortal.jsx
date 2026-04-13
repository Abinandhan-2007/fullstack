import React, { useState, useEffect } from 'react';

const HostelPortal = ({ handleLogout, apiUrl, loggedInEmail, token, userName }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [gatePasses, setGatePasses] = useState([]);
  const [menus, setMenus] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [rooms, setRooms] = useState([]);
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
        const [gpRes, menuRes, allocRes, roomRes] = await Promise.all([
          fetch(`${apiUrl}/api/host/all-gatepasses`, { headers }).catch(() => null),
          fetch(`${apiUrl}/api/host/all-messmenus`, { headers }).catch(() => null),
          fetch(`${apiUrl}/api/host/all-hostelallocations`, { headers }).catch(() => null),
          fetch(`${apiUrl}/api/host/all-hostelrooms`, { headers }).catch(() => null)
        ]);

        if (gpRes?.ok) setGatePasses(await gpRes.json() || []);
        if (menuRes?.ok) setMenus(await menuRes.json() || []);
        if (allocRes?.ok) setAllocations(await allocRes.json() || []);
        if (roomRes?.ok) setRooms(await roomRes.json() || []);

      } catch (err) {
        console.error("Failed to load Hostel dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [apiUrl, token]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'allocation', label: 'Room Allocation', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'gatepass', label: 'Gate Pass Manager', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
    { id: 'messmenu', label: 'Mess Menu Manager', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
    { id: 'complaints', label: 'Hostel Complaints', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    { id: 'residents', label: 'Residents List', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' }
  ];

  /* ---------------- MODULE: DASHBOARD ---------------- */
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Capacity', value: '1,500', color: 'text-blue-600' },
          { label: 'Occupied Rooms', value: allocations.length || 0, color: 'text-indigo-600' },
          { label: 'Vacant Rooms', value: Math.max(0, 1500 - (allocations.length || 0)), color: 'text-emerald-500' },
          { label: 'Pending Gate Passes', value: (gatePasses || []).filter(g=>g.status==='Pending').length || 0, color: 'text-amber-500' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <p className="text-sm font-medium text-slate-500 mb-2">{kpi.label}</p>
            <p className={`text-4xl font-black ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center">
          <h3 className="font-bold text-slate-800 self-start mb-4">Overall Occupancy</h3>
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="12" fill="none" />
              <circle cx="50" cy="50" r="40" stroke="#3b82f6" strokeWidth="12" fill="none" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - Math.min(1, allocations.length / 1500))} className="transition-all duration-1000" />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-black text-slate-800">{allocations.length ? Math.round((allocations.length/1500)*100) : 0}%</span>
              <span className="block text-xs text-slate-500 font-medium mt-1">Filled</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
             <h3 className="font-bold text-slate-800">Recent Gate Pass Requests</h3>
           </div>
           <div className="divide-y divide-slate-100">
             {(gatePasses || []).slice(0, 4).map((gp, idx) => (
               <div key={idx} className="p-4 px-6 flex justify-between items-center hover:bg-slate-50">
                 <div>
                   <h4 className="font-medium text-slate-800 text-sm">{gp.studentName}</h4>
                   <div className="text-xs text-slate-500">{gp.registerNumber} • Room: {gp.roomNumber}</div>
                 </div>
                 <div className="text-right">
                   <span className={`px-2.5 py-1 rounded text-xs font-bold ${gp.status === 'Pending' ? 'bg-amber-100 text-amber-700' : gp.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{gp.status}</span>
                   <div className="text-xs text-slate-400 mt-1">{gp.destination}</div>
                 </div>
               </div>
             ))}
             {!gatePasses?.length && <div className="p-8 text-center text-slate-500">No recent requests.</div>}
           </div>
        </div>
      </div>
    </div>
  );

  /* ---------------- MODULE: ROOM ALLOCATION ---------------- */
  const [selectedBlock, setSelectedBlock] = useState('Block A');
  const [allocModal, setAllocModal] = useState(null);

  const mockFloors = [1, 2, 3];
  const mockRoomsPerFloor = 8;

  const renderRoomGrid = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-lg">Visual Grid - {selectedBlock}</h3>
        <select value={selectedBlock} onChange={e => setSelectedBlock(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-blue-400 font-medium">
          {['Block A', 'Block B', 'Block C', 'Girls Wing D'].map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      <div className="space-y-8 animate-fade-in text-sm">
        {mockFloors.map(floor => (
          <div key={floor} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-600 border-b border-slate-100 pb-2 mb-4">Floor {floor}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {Array.from({length: mockRoomsPerFloor}).map((_, i) => {
                const roomNum = `${floor}0${i+1}`;
                // dummy status generator
                const isFull = i % 3 === 0;
                const isPartial = i % 2 === 0 && !isFull;
                const occ = isFull ? 4 : isPartial ? 2 : 0;
                
                return (
                  <button 
                    key={roomNum} 
                    onClick={() => setAllocModal({roomNum, block: selectedBlock, occ, max: 4})}
                    className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-transform hover:scale-105 ${occ === 0 ? 'bg-emerald-50 border-emerald-200' : isFull ? 'bg-rose-50 border-rose-200' : 'bg-blue-50 border-blue-200'}`}
                  >
                    <span className="font-bold text-slate-800">{roomNum}</span>
                    <span className={`text-xs font-medium mt-1 px-2 py-0.5 rounded ${occ === 0 ? 'text-emerald-700 bg-emerald-100' : isFull ? 'text-rose-700 bg-rose-100' : 'text-blue-700 bg-blue-100'}`}>
                      {occ}/4 Occ
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {allocModal && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in">
             <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
               <h3 className="font-bold text-slate-800">Manage Room {allocModal.roomNum} ({allocModal.block})</h3>
               <button onClick={() => setAllocModal(null)} className="text-slate-400 hover:text-slate-600">✕</button>
             </div>
             <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-slate-700 mb-3 border-b pb-2">Current Occupants</h4>
                  {allocModal.occ > 0 ? (
                    <ul className="space-y-2">
                       {Array.from({length: allocModal.occ}).map((_, j) => (
                         <li key={j} className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-100">
                           <span className="text-sm font-medium text-slate-700">Resident Name {j+1} <span className="text-xs text-slate-400">(REG2024{j}5)</span></span>
                           <button className="text-rose-500 hover:text-rose-700 text-xs font-bold">Remove</button>
                         </li>
                       ))}
                    </ul>
                  ) : <p className="text-sm text-slate-500">Room is currently vacant.</p>}
                </div>
                
                {allocModal.occ < allocModal.max && (
                  <div>
                     <h4 className="text-sm font-bold text-slate-700 mb-3 border-b pb-2">Assign New Student</h4>
                     <div className="flex space-x-2">
                        <input type="text" placeholder="Enter Registration No." className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg font-medium text-sm transition-colors cursor-pointer">Assign</button>
                     </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );

  /* ---------------- MODULE: GATE PASS MANAGER ---------------- */
  const [gpFilter, setGpFilter] = useState('Pending');

  const handleUpdateGp = async (id, status) => {
    try {
      const target = gatePasses.find(g => g.id === id);
      const res = await fetch(`${apiUrl}/api/host/update-gatepass/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({...target, status})
      });
      if(res.ok) setGatePasses(gatePasses.map(g => g.id === id ? {...g, status} : g));
    } catch(err) {}
  };

  const renderGatePasses = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">Gate Pass Manager</h3>
        <select value={gpFilter} onChange={e => setGpFilter(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-400">
          {['Pending', 'Approved', 'Rejected', 'Returned'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 font-semibold text-slate-700">Resident Details</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Destination/Reason</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Out / Expected Return</th>
              <th className="px-6 py-3 font-semibold text-slate-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(gatePasses || []).filter(g => g.status === gpFilter).map((gp, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800">{gp.studentName}</div>
                  <div className="text-xs text-slate-500">Room: {gp.roomNumber} • {gp.registerNumber}</div>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  <div className="font-medium">{gp.destination}</div>
                  <div className="text-xs truncate max-w-[150px]">{gp.reason}</div>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  <div>OUT: {gp.outDateTime}</div>
                  <div className="text-xs font-bold text-slate-500">IN: {gp.expectedReturn}</div>
                </td>
                <td className="px-6 py-4 flex justify-center space-x-2">
                  {gp.status === 'Pending' && (
                    <>
                      <button onClick={() => handleUpdateGp(gp.id, 'Approved')} className="px-3 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-md font-medium text-xs transition-colors">Approve</button>
                      <button onClick={() => handleUpdateGp(gp.id, 'Rejected')} className="px-3 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-md font-medium text-xs transition-colors">Reject</button>
                    </>
                  )}
                  {gp.status === 'Approved' && (
                    <button onClick={() => handleUpdateGp(gp.id, 'Returned')} className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md font-medium text-xs transition-colors border border-blue-200">Mark Returned</button>
                  )}
                  {gp.status === 'Returned' && <span className="text-emerald-600 font-bold text-xs"><svg className="w-4 h-4 inline" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> Returned</span>}
                </td>
              </tr>
            ))}
            {!(gatePasses || []).filter(g => g.status === gpFilter).length && <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">No {gpFilter} passes found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* ---------------- MODULE: MESS MENU ---------------- */
  const renderMessMenu = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">Weekly Mess Menu</h3>
        <button className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">Save Changes</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap table-fixed">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-bold text-slate-800 w-32 border-r bg-slate-100">Day</th>
              <th className="px-4 py-3 font-semibold text-slate-700 w-48">Breakfast (8 AM)</th>
              <th className="px-4 py-3 font-semibold text-slate-700 w-48">Lunch (1 PM)</th>
              <th className="px-4 py-3 font-semibold text-slate-700 w-48">Snacks (5 PM)</th>
              <th className="px-4 py-3 font-semibold text-slate-700 w-48">Dinner (8 PM)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => (
              <tr key={day} className="hover:bg-slate-50">
                 <td className="px-4 py-3 font-bold text-slate-700 border-r bg-slate-50">{day}</td>
                 <td className="px-2 py-2"><input type="text" className="w-full bg-transparent border-none outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 rounded px-2 py-1" defaultValue="Idli, Vada, Chutney" /></td>
                 <td className="px-2 py-2"><input type="text" className="w-full bg-transparent border-none outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 rounded px-2 py-1" defaultValue="Rice, Sambar, Rasam, Poriyal" /></td>
                 <td className="px-2 py-2"><input type="text" className="w-full bg-transparent border-none outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 rounded px-2 py-1" defaultValue="Tea, Biscuits" /></td>
                 <td className="px-2 py-2"><input type="text" className="w-full bg-transparent border-none outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 rounded px-2 py-1" defaultValue="Chapati, Dal, Rice" /></td>
              </tr>
            ))}
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
          <h1 className="text-xl font-black text-rose-600 tracking-tight">Hostel<span className="text-slate-800">Portal</span></h1>
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
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeMenu === item.id ? 'bg-rose-50 text-rose-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <svg className={`w-5 h-5 ${activeMenu === item.id ? 'text-rose-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Main Area */}
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
               <p className="text-xs text-slate-500">Chief Warden</p>
             </div>
             <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-700 font-bold border-2 border-rose-200">
               {userName?.charAt(0) || 'W'}
             </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
           {loading ? (
              <div className="h-full flex items-center justify-center">
                 <svg className="animate-spin h-10 w-10 text-rose-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              </div>
           ) : (
              <div className="max-w-6xl mx-auto pb-12">
                 {activeMenu === 'dashboard' && renderDashboard()}
                 {activeMenu === 'allocation' && renderRoomGrid()}
                 {activeMenu === 'gatepass' && renderGatePasses()}
                 {activeMenu === 'messmenu' && renderMessMenu()}
                 {activeMenu === 'complaints' && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center text-slate-500">
                       <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                       <h3 className="text-xl font-bold text-slate-700 mb-2">Complaints Module</h3>
                       <p>Integration pending with central ticketing system.</p>
                    </div>
                 )}
                 {activeMenu === 'residents' && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center text-slate-500">
                       <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5V4a2 2 0 00-2-2H4a2 2 0 00-2 2v16h5m8 0v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2m8 0h-8"/></svg>
                       <h3 className="text-xl font-bold text-slate-700 mb-2">Residents Directory</h3>
                       <p>Module active. Searching directory enabled.</p>
                       <button className="mt-6 bg-slate-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-900 transition-colors">Export Directory (.CSV)</button>
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

export default HostelPortal;
