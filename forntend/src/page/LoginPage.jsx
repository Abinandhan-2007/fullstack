import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const LoginPage = ({ apiUrl, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const HOST_EMAILS = ["kvabhinanthan@gmail.com", "sivanagu7771@gmail.com"];

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const email = decoded.email;

      // Call backend to get role
      const res = await fetch(`${apiUrl}/api/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, googleToken: credentialResponse.credential })
      });

      if (!res.ok) {
        throw new Error("Unauthorized user");
      }

      const data = await res.json();

      // Store in localStorage
      localStorage.setItem('erp_token', data.token);
      localStorage.setItem('erp_role', data.role);
      localStorage.setItem('erp_email', email);
      localStorage.setItem('erp_name', data.name || decoded.name);

      // Tell App.jsx we logged in successfully
      onLoginSuccess(data.role);
      
    } catch(err) {
      console.error(err);
      setError("Unauthorized user or login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { value: 'ADMIN', label: 'Administrator' },
    { value: 'STAFF', label: 'Faculty/Staff' },
    { value: 'STUDENT', label: 'Student' },
    { value: 'PARENT', label: 'Parent' },
    { value: 'COE', label: 'Examinations (COE)' },
    { value: 'FINANCE', label: 'Finance' },
    { value: 'WARDEN', label: 'Hostel Warden' },
    { value: 'LIBRARIAN', label: 'Librarian' },
    { value: 'PLACEMENT', label: 'Placement Officer' }
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('erp_token', data.token);
        localStorage.setItem('erp_role', data.role);
        localStorage.setItem('erp_email', data.email);
        localStorage.setItem('erp_name', data.name);
        onLoginSuccess(data.role);
      } else {
        setError('Invalid credentials. Please check your email, password, and chosen role.');
      }
    } catch (err) {
      if (err.message === 'Failed to fetch' || err.message.includes('NetworkError')) {
         setError('Network Error: Cannot connect to the server. Is your backend running?');
      } else {
         setError('An error occurred during login. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFC] font-sans">
      {/* Left side branding */}
      <div className="md:w-1/2 bg-gradient-to-br from-blue-800 to-indigo-900 text-white p-12 flex flex-col justify-center relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-800" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L1 7l11 5 9-4.1V17h2V7L12 2zm0 10.9l-9-4.1v5.1l9 4.1 9-4.1V8.8l-9 4.1z" />
              </svg>
            </div>
            <h1 className="text-4xl font-black tracking-tight">Apex University ERP</h1>
          </div>
          <h2 className="text-2xl font-bold text-blue-100 mb-12">Integrated Campus Management System</h2>
          
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold">Academic Excellence</h3>
                <p className="text-blue-200 text-sm">Comprehensive modules for managing curriculum, attendance, and examinations.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold">Data-Driven Insights</h3>
                <p className="text-blue-200 text-sm">Advanced analytics and reporting for administrators and finance teams.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold">Campus Life</h3>
                <p className="text-blue-200 text-sm">Seamless administration of hostel, library, and student facilities.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold">Career Placements</h3>
                <p className="text-blue-200 text-sm">End-to-end recruitment drive management and student application tracking.</p>
              </div>
            </div>
          </div>
        </div>
        {/* Abstract shapes */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      {/* Right side login form */}
      <div className="md:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-sm text-slate-500 mt-2">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-sm flex items-center">
              <svg className="w-5 h-5 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Role</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-4 py-3 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 outline-none transition-all appearance-none"
              >
                {roles.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-4 py-3 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 outline-none transition-all"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700">Forgot password?</a>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-4 py-3 pr-12 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 outline-none transition-all"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-3 transition-colors flex justify-center items-center h-12 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : "Sign In"}
            </button>
          </form>
          
          <div className="mt-6 flex items-center justify-center space-x-4">
              <span className="h-px w-full bg-slate-200"></span>
              <span className="text-xs text-slate-400 font-bold uppercase">OR</span>
              <span className="h-px w-full bg-slate-200"></span>
          </div>
          
          <div className="mt-6 flex justify-center">
             <GoogleLogin 
                onSuccess={handleGoogleSuccess} 
                onError={() => setError("Google Login Failed")}
                type="standard" 
                theme="outline" 
                size="large" 
             />
          </div>
          
          <div className="mt-8 text-center text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Apex University. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;