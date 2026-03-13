import React, { useState, useEffect } from 'react';

export default function HostPortal({ handleLogout, apiUrl, user }) {
  const [activeTab, setActiveTab] = useState('students'); // 'students' or 'staff'
  
  // Form States
  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // List States
  const [staffList, setStaffList] = useState([]);
  const [studentList, setStudentList] = useState([]);

  const fetchData = async () => {
    try {
      const staffRes = await fetch(`${apiUrl}/api/host/all-staff`);
      if (staffRes.ok) setStaffList(await staffRes.json());

      const studentRes = await fetch(`${apiUrl}/api/host/all-students`);
      if (studentRes.ok) setStudentList(await studentRes.json());
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const endpoint = activeTab === 'staff' ? '/api/host/add-staff' : '/api/host/add-student';
    const payload = { name, registerNumber: regNo, email };

    try {
      const res = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert(`✅ ${activeTab === 'staff' ? 'Staff' : 'Student'} added successfully!`);
        setName(""); setRegNo(""); setEmail("");
        fetchData();
      } else {
        alert("❌ Failed to save to database.");
      }
    } catch (err) { 
      alert("❌ Connection Error"); 
    } finally {
      setIsSaving(false);
    }
  };

  const activeList = activeTab === 'staff' ? staffList : studentList;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Premium Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 px-8 py-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-inner">H</div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Host<span className="text-slate-500">Console</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-slate-700">System Admin</p>
            <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="text-sm font-semibold text-rose-500 hover:text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors border border-rose-100 ml-2">
            Sign out
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 animate-in fade-in duration-500">
        {/* Tab Switcher */}
        <div className="flex space-x-4 mb-8">
          <button 
            onClick={() => setActiveTab('students')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'students' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'}`}
          >
            🎓 Manage Students
          </button>
          <button 
            onClick={() => setActiveTab('staff')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'staff' ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'}`}
          >
            👨‍🏫 Manage Staff
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Registration Form */}
          <div className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-slate-200 h-fit">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Register New {activeTab === 'staff' ? 'Staff' : 'Student'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="e.g. John Doe" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Register Number</label>
                <input type="text" required value={regNo} onChange={(e) => setRegNo(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder={activeTab === 'students' ? "e.g. 737621..." : "Staff ID / Reg No"} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Google Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="name@college.edu" />
              </div>
              <button type="submit" disabled={isSaving} className={`w-full py-4 rounded-xl font-bold text-white transition-all mt-4 ${isSaving ? 'bg-slate-400 cursor-not-allowed' : activeTab === 'staff' ? 'bg-slate-800 hover:bg-slate-700' : 'bg-blue-600 hover:bg-blue-500'}`}>
                {isSaving ? "Syncing Database..." : `Authorize ${activeTab === 'staff' ? 'Staff' : 'Student'}`}
              </button>
            </form>
          </div>

          {/* Database List */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Authorized {activeTab === 'staff' ? 'Staff Database' : 'Student Database'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
              {activeList.length === 0 ? (
                <p className="text-slate-400 col-span-2 text-center py-10 font-medium">No records found in MySQL database.</p>
              ) : (
                activeList.map((person, index) => (
                  <div key={index} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between hover:border-blue-200 transition-colors">
                    <div>
                      <p className="font-bold text-slate-800 text-lg">{person.name}</p>
                      <p className="text-sm font-semibold text-blue-600 mb-2">{person.registerNumber || "No Reg No"}</p>
                    </div>
                    <p className="text-xs text-slate-500 font-medium truncate">{person.email}</p>
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