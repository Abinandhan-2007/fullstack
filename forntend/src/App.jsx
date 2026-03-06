import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

// Change these lines to match your actual folder name
import StudentPortalLayout from './Layouts/StudentLayout';
import HostManagementLayout from './Layouts/HostLayout';
import StaffPortalLayout from './Layouts/StaffLayout';

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); 
  const [isVerifying, setIsVerifying] = useState(false);

  // 1. YOUR PERMANENT ADMIN EMAIL
  const HOST_EMAIL = "kvabhinanthan@gmail.com"; 

  // 2. On Load: Check if a user is already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);
      determineRole(u.email);
    }
  }, []);

  // 3. Role Identification Logic
  const determineRole = async (email) => {
    setIsVerifying(true);
    
    // Check if Host
    if (email === HOST_EMAIL) {
      setRole('host');
    } else {
      try {
        // Check if Staff (Fetching from your Render Backend)
        const response = await fetch(`https://fullstack-q3c5.onrender.com/api/host/all-staff`);
        if (response.ok) {
          const staffList = await response.json();
          // Verify if the logged-in email exists in the Staff table
          const isStaff = staffList.some(s => s.email === email);
          setRole(isStaff ? 'staff' : 'student');
        } else {
          setRole('student'); // Default to student if API fails
        }
      } catch (err) {
        console.error("Backend error, defaulting to student");
        setRole('student');
      }
    }
    setIsVerifying(false);
  };

  const handleLogin = (credentialResponse) => {
    const decodedUser = jwtDecode(credentialResponse.credential);
    setUser(decodedUser);
    localStorage.setItem("user", JSON.stringify(decodedUser));
    determineRole(decodedUser.email);
  };

  const handleLogout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem("user");
    window.location.reload(); // Hard refresh to clear all states
  };

  // --- RENDERING LOGIC ---

  // SCREEN 1: LOGIN PAGE
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-10 rounded-[3rem] shadow-xl border border-slate-100 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-6 shadow-lg">C</div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Central Portal</h2>
          <p className="text-slate-500 font-medium mb-10">Sign in with your institutional email</p>
          <div className="flex justify-center">
            <GoogleLogin 
              onSuccess={handleLogin} 
              onError={() => console.log('Login Failed')}
              theme="outline" 
              size="large" 
              shape="pill" 
            />
          </div>
        </div>
      </div>
    );
  }

  // SCREEN 2: LOADING STATE
  if (isVerifying || !role) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-slate-400">Verifying Permissions...</p>
      </div>
    );
  }

  // SCREEN 3: ACTUAL PORTALS
  return (
    <>
      {role === 'host' && <HostManagementLayout user={user} handleLogout={handleLogout} />}
      {role === 'staff' && <StaffPortalLayout user={user} handleLogout={handleLogout} />}
      {role === 'student' && <StudentPortalLayout user={user} handleLogout={handleLogout} />}
    </>
  );
}