import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import AdminPortal from './page/AdminPortal.jsx'; 
import StudentPortal from './page/StudentPortal';
import LoginPage from './page/LoginPage'; 

// 1. STAFF PORTAL PLACEHOLDER
const StaffPortal = ({ user, handleLogout }) => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
    <h1 className="text-3xl font-black text-slate-800 tracking-tighter">STAFF<span className="text-indigo-600">PORTAL</span></h1>
    <p className="text-slate-500 mt-2 mb-8 font-medium italic">Welcome, {user.name}. Accessing faculty records...</p>
    <button onClick={handleLogout} className="px-8 py-3 bg-rose-500 text-white font-bold rounded-2xl shadow-lg">Sign Out</button>
  </div>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); 
  const [loading, setLoading] = useState(true);

  const HOST_EMAILS = ["kvabhinanthan@gmail.com", "sivanagu7771@gmail.com"];
  const apiUrl = "https://fullstack-8cjk.onrender.com";

  const determineRole = async (email) => {
    setLoading(true);
    
    // Step A: Check if it's Admin
    if (HOST_EMAILS.map(e => e.toLowerCase()).includes(email.toLowerCase())) {
      setRole('host');
      setLoading(false);
      return;
    }

    try {
      // Step B: Fetch DB lists
      const [staffRes, studentRes] = await Promise.all([
        fetch(`${apiUrl}/api/host/all-staff`),
        fetch(`${apiUrl}/api/host/all-students`)
      ]);

      let isStaff = false;
      let isStudent = false;

      // Step C & D: Verification
      if (staffRes.ok) {
        const staffList = await staffRes.json();
        isStaff = staffList.some(s => s.email?.toLowerCase() === email.toLowerCase());
      }
      if (studentRes.ok && !isStaff) {
        const studentList = await studentRes.json();
        isStudent = studentList.some(s => s.email?.toLowerCase() === email.toLowerCase());
      }

      // Step E: Final Routing
      if (isStaff) setRole('staff');
      else if (isStudent) setRole('student');
      else setRole('denied'); 

    } catch (error) {
      console.error("Auth System Error:", error);
      setRole('denied');
    }
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
    } else {
      setLoading(false);
    }
  }, []);


  // --- RENDERING SCREENS ---

 if (loading) return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
      
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/15 rounded-full blur-[80px] animate-pulse"></div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Floating Logo */}
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[1.5rem] shadow-xl shadow-indigo-500/30 flex items-center justify-center mb-6 animate-[bounce_2s_infinite]">
           <span className="text-3xl font-black text-white">{"</>"}</span>
        </div>

        {/* App Branding */}
        <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-8">
          Student<span className="text-indigo-600 font-normal">HQ</span>
        </h2>

        {/* Sleek Indeterminate Progress Bar */}
        <div className="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden mb-4 relative">
          <div className="absolute top-0 left-0 h-full w-1/2 bg-indigo-600 rounded-full animate-[progress_1.5s_ease-in-out_infinite_alternate]"></div>
        </div>
        
        {/* Blinking Status Text */}
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] animate-pulse">
          Verifying Authorization...
        </p>
      </div>

      {/* Custom Animation for the sleek sliding bar */}
      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );

  // 1. THE NEW LOGIN SCREEN
  if (!user) {
    return (
      <LoginPage 
        onGoogleSuccess={handleLogin} 
        GoogleLoginComponent={<GoogleLogin onSuccess={handleLogin} type="standard" theme="outline" size="large" />} 
      />
    );
  }

  // 2. ACCESS DENIED SCREEN
  if (role === 'denied') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-10 rounded-[2.5rem] shadow-xl text-center border border-rose-100">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">⛔</div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Unregistered Account</h2>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed">
            The email <span className="font-bold text-slate-900">{user.email}</span> has not been added to the system by an Admin.
          </p>
          <button onClick={handleLogout} className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-sm">Back to Login</button>
        </div>
      </div>
    );
  }

  // 3. SUCCESSFUL ROUTING
  return (
    <>
      {role === 'host' && <AdminPortal user={user} handleLogout={handleLogout} apiUrl={apiUrl} />}
      {role === 'staff' && <StaffPortal user={user} handleLogout={handleLogout} />}
      {role === 'student' && <StudentPortal user={user} handleLogout={handleLogout} />}
    </>
  );
}