import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import HostPortal from './page/AdminPortal';
import StaffPortal from './page/StaffPortal';
import StudentPortal from './page/StudentPortal';

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Note: Make sure this URL matches your active Render backend!
  const API_URL = "https://fullstack-8cjk.onrender.com";
  const HOST_EMAIL = {"kvabhinanthan@gmail.com","sivanagu7771@gmail.com"};

  const determineRole = async (email) => {
    if (email.toLowerCase() === HOST_EMAIL.toLowerCase()) {
      setRole('host');
      setLoading(false);
      return;
    }
    try {
      // Check database for Staff
      const res = await fetch(`${API_URL}/api/host/all-staff`);
      if (res.ok) {
        const staffList = await res.json();
        const isStaff = staffList.some(s => s.email.toLowerCase() === email.toLowerCase());
        setRole(isStaff ? 'staff' : 'student');
      } else { 
        setRole('student'); 
      }
    } catch { 
      setRole('student'); 
    }
    setLoading(false);
  };

  const handleLogin = (response) => {
    // Google sends back an encrypted token. This decodes it into an object with name, email, picture, etc.
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

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center font-bold text-slate-400 bg-slate-50 animate-pulse">
        Synchronizing Data...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-12 rounded-[3rem] shadow-2xl text-center border border-slate-100">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white font-black text-4xl mx-auto mb-8 shadow-lg">
            C
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">Institution Portal</h2>
          <p className="text-slate-500 mb-10">Sign in with Google to continue</p>
          
          <div className="flex justify-center scale-110">
            {/* The Official Google Login Button */}
            <GoogleLogin 
              onSuccess={handleLogin} 
              onError={() => console.log('Login Failed')}
              theme="filled_blue" 
              shape="pill" 
              size="large" 
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {role === 'host' && <HostPortal user={user} handleLogout={handleLogout} apiUrl={API_URL} />}
      {role === 'staff' && <StaffPortal user={user} handleLogout={handleLogout} />}
      {role === 'student' && <StudentPortal user={user} handleLogout={handleLogout} />}
    </>
  );
}