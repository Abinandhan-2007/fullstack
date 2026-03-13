import React, { useState, useEffect } from 'react';
import HostPortal from './page/HostPortal';
import StaffPortal from './page/StaffPortal';
import StudentPortal from './page/StudentPortal';

// Note: Replace this with your actual Google Login import
// import { GoogleLogin } from '@react-oauth/google'; 

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'host', 'staff', or 'student'
  const [loading, setLoading] = useState(false);

  const HOST_EMAIL = "kvabhinanthan@gmail.com";
  const API_URL = "https://fullstack-8cjk.onrender.com";

  // Simulate or handle Google Login success
  const handleLoginSuccess = async (credentialResponse) => {
    setLoading(true);
    // Decode your Google credential here to get the email
    // For this example, we assume you extract the email successfully:
    const userEmail = "extracted_email@gmail.com"; // Replace with actual decoded email
    const userData = { email: userEmail, name: "Google User" }; // Replace with actual decoded data
    
    setUser(userData);
    await determineRole(userData.email);
  };

  const determineRole = async (email) => {
    if (email.toLowerCase() === HOST_EMAIL.toLowerCase()) {
      setRole('host');
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/api/host/all-staff`);
      if (res.ok) {
        const staffList = await res.json();
        const isStaff = staffList.some(s => 
          s.email.trim().toLowerCase() === email.trim().toLowerCase()
        );
        setRole(isStaff ? 'staff' : 'student');
      } else { 
        setRole('student'); 
      }
    } catch (error) { 
      console.error("Gatekeeper Error:", error);
      setRole('student'); 
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setUser(null);
    setRole(null);
    // Add any specific Google logout logic here if needed
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-6">College ERP Portal</h1>
          {/* Put your actual Google Login button component here */}
          <button 
            onClick={() => handleLoginSuccess()} // Replace with real auth handler
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-bold">Verifying Access...</div>;
  }

  if (role === 'host') return <HostPortal handleLogout={handleLogout} apiUrl={API_URL} />;
  if (role === 'staff') return <StaffPortal handleLogout={handleLogout} user={user} />;
  return <StudentPortal handleLogout={handleLogout} user={user} />;
}