import React, { useState, useEffect } from 'react';

export default function HostPortal({ handleLogout, apiUrl, user }) {
  const [activeTab, setActiveTab] = useState('students'); // 'students' or 'staff'
  
  // Form States
  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Data & Search States
  const [staffList, setStaffList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({ totalStudents: 0, totalStaff: 0 });

  // 1. Fetch Data & Stats
  const fetchData = async () => {
    try {
      const staffRes = await fetch(`${apiUrl}/api/host/all-staff`);
      const studentRes = await fetch(`${apiUrl}/api/host/all-students`);
      const statsRes = await fetch(`${apiUrl}/api/host/stats`);

      if (staffRes.ok) setStaffList(await staffRes.json());
      if (studentRes.ok) setStudentList(await studentRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      console.error("Failed to sync with database", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Handle Add User
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const endpoint = activeTab === 'staff' ? '/api/host/add-staff' : '/api/host/add-student';
    
    try {
      const res = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, registerNumber: regNo, email })
      });
      
      if (res.ok) {
        setName(""); setRegNo(""); setEmail("");
        fetchData(); 
      } else {
        alert("❌ Error: Verification failed.");
      }
    } catch (err) { 
      alert("❌ Server Connection Error"); 
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Handle Delete User
  const handleDelete = async (id) => {
    if (!window.confirm(`Permanently remove this ${activeTab.slice(0, -1)} from the system?`)) return;

    const endpoint = activeTab === 'staff' ? `/api/host/delete-staff/${id}` : `/api/host/delete-student/${id}`;
    
    try {
      const res = await fetch(`${apiUrl}${endpoint}`, { method: "DELETE" });
      if (res.ok) fetchData();
      else alert("❌ Action failed.");
    } catch (err) {
      alert("❌ Connection Error");
    }
  };

  // 4. Search Logic
  const activeList = activeTab === 'staff' ? staffList : studentList;
  const filteredList = activeList.filter(person => 
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    person.registerNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow-sm border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-inner transition-transform hover:rotate-12">H</div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Host<span className="text-blue-600">Console</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-slate-700">Administrator</p>
            <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="text-sm font-semibold text-rose-500 hover:text-rose-600 px-4 py-2 rounded-xl hover:bg-rose-50 transition-all border border-rose-100">
            Sign out
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 animate-in fade-in duration-700">
        
        {/* Statistics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2">Verified Students</p>
            <h3 className="text-5xl font-black text-blue-600 tracking-tighter">{stats.totalStudents}</h3>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2">Authorized Faculty</p>
            <h3 className="text-5xl font-black text-slate-800 tracking-tighter">{stats.totalStaff}</h3>
          </div>
          <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl text-white relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2">System Status</p>
              <h3 className="text-2xl font-black flex items-center gap-2">
                <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
                Database Live
              </h3>
              <p className="text-slate-400 text-xs mt-2 font-medium">Synced with Aiven Cloud</p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 w-fit mb-10 shadow-sm">
          <button onClick={() => {setActiveTab('students'); setSearchTerm("");}} className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'students' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}>🎓 Students</button>
          <button onClick={() => {setActiveTab('staff'); setSearchTerm("");}} className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'staff' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}>👨‍🏫 Staff Members</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Registration Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
              <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                Register {activeTab.slice(0,-1)}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all" placeholder="Full Name" />
                <input type="text" required value={regNo} onChange={(e) => setRegNo(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all" placeholder="Register Number" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all" placeholder="Google Email" />
                <button type="submit" disabled={isSaving} className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95 ${isSaving ? 'bg-slate-200 text-slate-400' : activeTab === 'staff' ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white'}`}>
                  {isSaving ? "Syncing..." : "Add to Database"}
                </button>
              </form>
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl font-black text-slate-800 px-2 tracking-tight">Active Directory</h2>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder={`Search ${activeTab}...`} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white border border-slate-200 px-10 py-3 rounded-2xl text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <span className="absolute left-4 top-3.5 opacity-30">🔍</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredList.length === 0 ? (
                <div className="col-span-2 py-20 bg-white rounded-[2rem] border border-dashed text-center text-slate-400 font-medium">
                  No matching records found.
                </div>
              ) : (
                filteredList.map((person) => (
                  <div key={person.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex justify-between items-center group hover:shadow-xl hover:border-blue-500/30 transition-all duration-300">
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-slate-800 text-lg leading-tight truncate">{person.name}</p>
                      <p className="text-blue-600 font-bold text-xs mt-1 mb-2 tracking-wider">{person.registerNumber}</p>
                      <p className="text-slate-400 text-xs font-medium truncate">{person.email}</p>
                    </div>
                    <button onClick={() => handleDelete(person.id)} className="p-3 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}