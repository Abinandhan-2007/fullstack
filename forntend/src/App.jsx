import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import AdminPortal from './page/AdminPortal.jsx'; 
import StudentPortal from './page/StudentPortal';
import LoginPage from './page/LoginPage'; 
import AttendancePortal from './page/AttendanceMapping.jsx';
import StaffPortal from './page/StaffPortal.jsx';



export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); 
  const [loading, setLoading] = useState(true);

  const HOST_EMAILS = ["kvabhinanthan@gmail.com", "sivanagu7771@gmail.com"];
  const apiUrl = "https://fullstack-8cjk.onrender.com";

  // Used for Google Auth routing
  const determineRole = async (email) => {
    setLoading(true);
    
    if (HOST_EMAILS.map(e => e.toLowerCase()).includes(email.toLowerCase())) {
      setRole('host');
      setLoading(false);
      return;
    }

    try {
      const [staffRes, studentRes] = await Promise.all([
        fetch(`${apiUrl}/api/host/all-staff`),
        fetch(`${apiUrl}/api/host/all-students`)
      ]);

      let isStaff = false;
      let isStudent = false;

      if (staffRes.ok) {
        const staffList = await staffRes.json();
        isStaff = staffList.some(s => s.email?.toLowerCase() === email.toLowerCase());
      }
      if (studentRes.ok && !isStaff) {
        const studentList = await studentRes.json();
        isStudent = studentList.some(s => s.email?.toLowerCase() === email.toLowerCase());
      }

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

  // --- TRUE MULTI-USER BACKEND AUTHENTICATION ---
  const handleManualLogin = async (loginId, password) => {
    setLoading(true);
    
    // TEMPORARY FALLBACK: While you are building your Spring Boot backend, 
    // you can still use 1234/1234 to access the Attendance Portal!
    if (loginId === '1234' && password === '1234') {
      const mockUser = { name: 'Attendance Admin', email: '1234@system.local', role: 'attendance_portal' };
      setUser(mockUser);
      setRole('attendance_portal');
      localStorage.setItem("user", JSON.stringify(mockUser));
      setLoading(false);
      return;
    }

    try {
      // Send the entered ID and Password to your Spring Boot database
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginId, password: password })
      });

      if (response.ok) {
        // Backend confirms user exists and sends back their details and role!
        const userData = await response.json(); 
        
        setUser(userData);
        setRole(userData.role); // e.g., 'student', 'staff', 'host', or 'attendance_portal'
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        alert("Invalid credentials. Please check your ID and Password.");
      }
    } catch (error) {
      console.error("Login server error:", error);
      alert("Could not connect to the authentication server. Please try again later.");
    }
    
    setLoading(false);
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
      
      // If the backend explicitly set a role in the saved user data, use it directly!
      if (u.role) {
        setRole(u.role);
        setLoading(false);
      } else {
        determineRole(u.email);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // --- RENDERING SCREENS ---

  if (loading) return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/15 rounded-full blur-[80px] animate-pulse"></div>
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[1.5rem] shadow-xl shadow-indigo-500/30 flex items-center justify-center mb-6 animate-[bounce_2s_infinite]">
           <span className="text-3xl font-black text-white">{"</>"}</span>
        </div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-8">
          Student<span className="text-indigo-600 font-normal">HQ</span>
        </h2>
        <div className="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden mb-4 relative">
          <div className="absolute top-0 left-0 h-full w-1/2 bg-indigo-600 rounded-full animate-[progress_1.5s_ease-in-out_infinite_alternate]"></div>
        </div>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] animate-pulse">Verifying Authorization...</p>
      </div>
      <style>{`@keyframes progress { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }`}</style>
    </div>
  );

  if (!user) {
    return (
      <LoginPage 
        onGoogleSuccess={handleLogin} 
        onManualLogin={handleManualLogin} 
        GoogleLoginComponent={<GoogleLogin onSuccess={handleLogin} type="standard" theme="outline" size="large" />} 
      />
    );
  }

  if (role === 'denied') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-10 rounded-[2.5rem] shadow-xl text-center border border-rose-100">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">⛔</div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Unregistered Account</h2>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed">
            The account <span className="font-bold text-slate-900">{user.email}</span> has not been authorized by an Admin.
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
      {role === 'staff' && <StaffPortal user={user} handleLogout={handleLogout} apiUrl={apiUrl} />}
      {role === 'student' && <StudentPortal user={user} handleLogout={handleLogout} apiUrl={apiUrl} />}
      {role === 'attendance_portal' && <AttendancePortal handleLogout={handleLogout} apiUrl={apiUrl} />}
    </>
  );
}