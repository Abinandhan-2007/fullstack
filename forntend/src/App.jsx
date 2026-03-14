import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import AdminPortal from './page/AdminPortal.jsx'; 

// 1. STAFF PORTAL PLACEHOLDER
const StaffPortal = ({ user, handleLogout }) => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
    <h1 className="text-3xl font-black text-slate-800 tracking-tighter">STAFF<span className="text-indigo-600">PORTAL</span></h1>
    <p className="text-slate-500 mt-2 mb-8 font-medium italic">Welcome, {user.name}. Accessing faculty records...</p>
    <button onClick={handleLogout} className="px-8 py-3 bg-rose-500 text-white font-bold rounded-2xl shadow-lg">Sign Out</button>
  </div>
);

// 2. STUDENT PORTAL PLACEHOLDER (We built the UI earlier, this is the wrapper)
const StudentPortal = ({ user, handleLogout }) => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
    <h1 className="text-3xl font-black text-slate-800 tracking-tighter">STUDENT<span className="text-blue-600">PORTAL</span></h1>
    <p className="text-slate-500 mt-2 mb-8 font-medium italic">Welcome, {user.name}. Synchronizing your academic dashboard...</p>
    <button onClick={handleLogout} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg">Sign Out</button>
  </div>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'host', 'staff', 'student', or 'denied'
  const [loading, setLoading] = useState(true);

 const HOST_EMAILS = ["kvabhinanthan@gmail.com", "sivanagu7771@gmail.com"];
  const apiUrl = "https://fullstack-8cjk.onrender.com";

  // THIS IS THE LOGIC YOU ARE STRIKING ON:
  const determineRole = async (email) => {
    setLoading(true);
    
    // Step A: Check if it's YOU (The Admin)
   if (HOST_EMAILS.map(e => e.toLowerCase()).includes(email.toLowerCase())) {
      setRole('host');
      setLoading(false);
      return;
    }

    try {
      // Step B: Ask the backend for the lists the Admin created
      const [staffRes, studentRes] = await Promise.all([
        fetch(`${apiUrl}/api/host/all-staff`),
        fetch(`${apiUrl}/api/host/all-students`)
      ]);

      let isStaff = false;
      let isStudent = false;

      // Step C: Check Staff list
      if (staffRes.ok) {
        const staffList = await staffRes.json();
        isStaff = staffList.some(s => s.email?.toLowerCase() === email.toLowerCase());
      }

      // Step D: Check Student list
      if (studentRes.ok && !isStaff) {
        const studentList = await studentRes.json();
        isStudent = studentList.some(s => s.email?.toLowerCase() === email.toLowerCase());
      }

      // Step E: Final Decision
      if (isStaff) setRole('staff');
      else if (isStudent) setRole('student');
      else setRole('denied'); // NOT FOUND IN DB -> NO ACCESS

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
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-400 font-black text-[10px] tracking-widest uppercase">Verifying Authorization</p>
    </div>
  );

  // 1. LOGIN SCREEN
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-12 rounded-[3rem] shadow-xl text-center border border-slate-100">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-6 shadow-lg shadow-blue-600/20">C</div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">Campus Portal</h2>
          <p className="text-slate-400 mb-10 text-sm font-medium">Use your registered Google account to enter</p>
          <div className="flex justify-center"><GoogleLogin onSuccess={handleLogin} theme="filled_blue" shape="pill" /></div>
        </div>
      </div>
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