import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import StudentPortalLayout from "./Layouts/StudentLayout";
import HostManagementLayout from "./Layouts/HostLayout";
import StaffPortalLayout from "./Layouts/StaffLayout";

export default function App() {

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // 🔐 Permanent Host Email
  const HOST_EMAIL = "kvabhinanthan@gmail.com";

  // --------------------------------------------------
  // 1️⃣ Check if user already logged in
  // --------------------------------------------------

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      determineRole(parsedUser.email);
    }
  }, []);

  // --------------------------------------------------
  // 2️⃣ Determine Role (Host / Staff / Student)
  // --------------------------------------------------

  const determineRole = async (email) => {

    setIsVerifying(true);

    // HOST CHECK
    if (email.toLowerCase() === HOST_EMAIL.toLowerCase()) {
      setRole("host");
      setIsVerifying(false);
      return;
    }

    try {

      // STAFF CHECK FROM BACKEND
      const response = await fetch(
        "https://fullstack-q3c5.onrender.com/api/host/all-staff"
      );

      if (response.ok) {

        const staffList = await response.json();

        const isStaff = staffList.some(
          (staff) => staff.email.toLowerCase() === email.toLowerCase()
        );

        if (isStaff) {
          setRole("staff");
        } else {
          setRole("student");
        }

      } else {
        setRole("student");
      }

    } catch (error) {

      console.error("Backend error:", error);
      setRole("student");

    }

    setIsVerifying(false);
  };

  // --------------------------------------------------
  // 3️⃣ Handle Google Login
  // --------------------------------------------------

  const handleLogin = (credentialResponse) => {

    const decodedUser = jwtDecode(credentialResponse.credential);

    console.log("Login Success:", decodedUser);

    setUser(decodedUser);

    localStorage.setItem("user", JSON.stringify(decodedUser));

    determineRole(decodedUser.email);
  };

  // --------------------------------------------------
  // 4️⃣ Logout
  // --------------------------------------------------

  const handleLogout = () => {

    setUser(null);
    setRole(null);

    localStorage.removeItem("user");

    window.location.reload();

  };

  // --------------------------------------------------
  // SCREEN 1️⃣ LOGIN PAGE
  // --------------------------------------------------

  if (!user) {
    return (

      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">

        <div className="bg-white max-w-md w-full p-10 rounded-3xl shadow-xl border border-slate-100 text-center">

          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-inner mx-auto mb-6">
            C
          </div>

          <h2 className="text-3xl font-extrabold text-slate-800 mb-2">
            Sign in
          </h2>

          <p className="text-slate-500 mb-10">
            to continue to the Central Portal
          </p>

          <div className="flex justify-center">

            <GoogleLogin
              onSuccess={handleLogin}
              onError={() => {
                console.log("Login Failed");
              }}
              theme="outline"
              size="large"
              shape="pill"
            />

          </div>

          <div className="mt-10 pt-8 border-t border-slate-100 flex justify-center gap-4 text-sm text-slate-500">

            <a href="#">Help</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>

          </div>

        </div>

      </div>

    );
  }

  // --------------------------------------------------
  // SCREEN 2️⃣ VERIFYING ROLE
  // --------------------------------------------------

  if (isVerifying || !role) {
    return (

      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">

        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>

        <p className="font-bold text-slate-400">
          Verifying Permissions...
        </p>

      </div>

    );
  }

  // --------------------------------------------------
  // SCREEN 3️⃣ PORTALS
  // --------------------------------------------------

  return (

    <>

      {role === "host" && (
        <HostManagementLayout user={user} handleLogout={handleLogout} />
      )}

      {role === "staff" && (
        <StaffPortalLayout user={user} handleLogout={handleLogout} />
      )}

      {role === "student" && (
        <StudentPortalLayout user={user} handleLogout={handleLogout} />
      )}

    </>

  );
}