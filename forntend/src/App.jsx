import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

// ==========================================
// 1. HOST PORTAL (kvabhinanthan@gmail.com)
// ==========================================
const HostPortal = ({ user, handleLogout }) => {
  const [staffEmail, setStaffEmail] = useState("");
  const [staffName, setStaffName] = useState("");
  const [staffList, setStaffList] = useState([]);

  const fetchStaff = async () => {
    try {
      const res = await fetch("https://fullstack-8cjk.onrender.com/api/host/all-staff");
      if (res.ok) {
        const data = await res.json();
        setStaffList(data);
      }
    } catch (err) { console.error("Database fetch failed"); }
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
       const res = await fetch("https://fullstack-8cjk.onrender.com/api/host/add-staff", {
       method: "POST",
  
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: staffName, email: staffEmail })
      });
      if (res.ok) {
        alert("✅ Staff added to Aiven MySQL!");
        setStaffEmail(""); setStaffName("");
        fetchStaff();
      }
    } catch (err) { alert("❌ Connection Error"); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
      <header className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
        <h1 className="text-xl font-black text-blue-500 tracking-tighter">HOST CONSOLE</h1>
        <button onClick={handleLogout} className="bg-rose-600 px-4 py-2 rounded-xl text-sm font-bold">Sign Out</button>
      </header>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 shadow-2xl">
          <h2 className="text-xl font-bold mb-6 text-blue-400">Register Staff</h2>
          <form onSubmit={handleAddStaff} className="space-y-4">
            <input className="w-full bg-slate-800 p-4 rounded-xl border border-slate-700 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Full Name" value={staffName} onChange={(e)=>setStaffName(e.target.value)} required />
            <input className="w-full bg-slate-800 p-4 rounded-xl border border-slate-700 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Google Email" value={staffEmail} onChange={(e)=>setStaffEmail(e.target.value)} required />
            <button className="w-full bg-blue-600 py-4 rounded-xl font-bold hover:bg-blue-500 transition-all">Add Staff Member</button>
          </form>
        </div>
        <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800">
          <h2 className="text-xl font-bold mb-6 text-slate-500">Authorized Staff</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {staffList.map((s, i) => (
              <div key={i} className="flex justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700 text-sm">
                <span className="font-bold">{s.name}</span>
                <span className="text-blue-400">{s.email}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. STAFF PORTAL (abinadhu1293@gmail.com)
// ==========================================
const StaffPortal = ({ user, handleLogout }) => (
  <div className="min-h-screen bg-emerald-50 p-8 font-sans">
    <div className="max-w-4xl mx-auto bg-white p-12 rounded-[3rem] shadow-xl border border-emerald-100">
      <div className="text-5xl mb-6">👨‍🏫</div>
      <h1 className="text-3xl font-black text-emerald-900 mb-2">Staff Portal</h1>
      <p className="text-emerald-600 mb-8 font-medium italic">Welcome, Professor {user.name}</p>
      <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
        <p className="font-bold text-emerald-800">Permission: Granted</p>
        <p className="text-sm text-emerald-600">You can now manage student marks and university data.</p>
      </div>
      <button onClick={handleLogout} className="mt-8 text-rose-600 font-bold hover:underline">Sign Out</button>
    </div>
  </div>
);

// ==========================================
// 3. STUDENT PORTAL (abinandhank.cs24@bitsathy.ac.in)
// ==========================================
const StudentPortal = ({ user, handleLogout }) => {
   const portals = [
    { title: 'Dashboard', icon: '📊', desc: 'Return to the main engineering analytics and system metrics panel.', color: 'bg-blue-500' },
    { title: 'Skill Test', icon: '💻', desc: 'Practice programming MCQs and technical coding challenges.', color: 'bg-indigo-500' },
    { title: 'Academic Data', icon: '🎓', desc: 'View your overall CGPA, semester credits, and university records.', color: 'bg-emerald-500' },
    { title: 'Subjects', icon: '📚', desc: 'Access standard course materials, assignments, and NPTEL tracking.', color: 'bg-amber-500' },
    { title: 'Placement', icon: '🚀', desc: 'Track interview schedules, resume updates, and upcoming placement drives.', color: 'bg-violet-500' },
    { title: 'Leave', icon: '📅', desc: 'Apply for on-duty (OD), medical leave, or general absences.', color: 'bg-rose-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <header className="bg-white shadow-sm border-b border-slate-200 px-8 py-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-inner">
            C
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Central<span className="text-blue-600">Portal</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            {/* Displaying the ACTUAL name from Google! */}
            <p className="text-sm font-bold text-slate-700">{user.name}</p>
            <p className="text-xs text-slate-500 font-medium">{user.email}</p>
          </div>
          {/* Displaying the ACTUAL profile picture from Google! */}
          <img 
            src={user.picture} 
            alt="Profile" 
            className="w-10 h-10 rounded-full border-2 border-slate-200 shadow-sm"
          />
          <button 
            onClick={() => setUser(null)}
            className="text-sm font-semibold text-rose-500 hover:text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors ml-2"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 md:py-20 animate-in fade-in duration-500 slide-in-from-bottom-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">
            Welcome to your Workspace, {user.given_name}
          </h2>
          <p className="text-slate-500 mt-3 font-medium text-lg">
            Select a module below to access your tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portals.map((portal, index) => (
            <a key={index} href="#" className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group block">
              <div className={`w-16 h-16 ${portal.color} rounded-2xl flex items-center justify-center text-3xl shadow-inner mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {portal.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                {portal.title}
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                {portal.desc}
              </p>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}

// ==========================================
// MAIN GATEKEEPER
// ==========================================
export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const HOST_EMAIL = "kvabhinanthan@gmail.com";

  const determineRole = async (email) => {
    if (email.toLowerCase() === HOST_EMAIL.toLowerCase()) {
      setRole('host');
      setLoading(false);
      return;
    }
    try {
      // Check database for Staff
      const res = await fetch("https://fullstack-q3c5.onrender.com/api/host/all-staff");
      if (res.ok) {
        const staffList = await res.json();
        const isStaff = staffList.some(s => s.email.toLowerCase() === email.toLowerCase());
        setRole(isStaff ? 'staff' : 'student');
      } else { setRole('student'); }
    } catch { setRole('student'); }
    setLoading(false);
  };

  const handleLogin = (response) => {
    const decoded = jwtDecode(response.credential);
    setUser(decoded);
    localStorage.setItem("user", JSON.stringify(decoded));
    determineRole(decoded.email);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      const u = JSON.parse(saved);
      setUser(u);
      determineRole(u.email);
    } else { setLoading(false); }
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-slate-400 animate-pulse">Synchronizing Data...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-12 rounded-[3rem] shadow-2xl text-center border">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white font-black text-4xl mx-auto mb-8 shadow-lg">C</div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">Institution Portal</h2>
          <p className="text-slate-500 mb-10">Sign in with Google to continue</p>
          <div className="flex justify-center scale-110">
            <GoogleLogin onSuccess={handleLogin} theme="filled_blue" shape="pill" size="large" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {role === 'host' && <HostPortal user={user} handleLogout={handleLogout} />}
      {role === 'staff' && <StaffPortal user={user} handleLogout={handleLogout} />}
      {role === 'student' && <StudentPortal user={user} handleLogout={handleLogout} />}
    </>
  );
}