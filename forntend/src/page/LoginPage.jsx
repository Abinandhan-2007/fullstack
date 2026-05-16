import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ apiUrl, onLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError('');
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const email = decoded.email;

      const response = await fetch(`${apiUrl}/api/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, googleToken: credentialResponse.credential })
      });

      if (!response.ok) throw new Error("Unauthorized user");

      const data = await response.json();
      localStorage.setItem('erp_token', data.token);
      localStorage.setItem('erp_role', data.role);
      localStorage.setItem('erp_email', email);
      localStorage.setItem('erp_name', data.name || decoded.name);
      localStorage.setItem('erp_linked_id', data.linkedId);

      // Role routes mapping
      const roleRoutes = {
        ROLE_STUDENT:   '/student',
        ROLE_STAFF:     '/staff',
        ROLE_ADMIN:     '/admin',
        ROLE_COE:       '/coe',
        ROLE_FINANCE:   '/finance',
        ROLE_WARDEN:    '/hostel',
        ROLE_LIBRARIAN: '/library',
        ROLE_PARENT:    '/parent',
        ROLE_PLACEMENT: '/placement',
        ROLE_STAFFADMIN: '/staffadmin',
      };

      onLoginSuccess(data.role);
      navigate(roleRoutes[data.role] || '/');
      
    } catch(err) {
      console.error(err);
      setError("Institutional identity verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { value: 'ADMIN', label: 'Institutional Admin' },
    { value: 'STAFF', label: 'Academic Faculty' },
    { value: 'STUDENT', label: 'Resident Scholar' },
    { value: 'PARENT', label: 'Guardian' },
    { value: 'COE', label: 'Examinations (COE)' },
    { value: 'FINANCE', label: 'Fiscal Control' },
    { value: 'WARDEN', label: 'Residential Warden' },
    { value: 'LIBRARIAN', label: 'Knowledge Curator' },
    { value: 'PLACEMENT', label: 'Career Placement' },
    { value: 'STAFFADMIN', label: 'Staff Admin' }
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
        localStorage.setItem('erp_linked_id', data.linkedId);
        onLoginSuccess(data.role);
      } else {
        setError('Invalid credentials or unmapped institutional role.');
      }
    } catch (err) {
      setError('System communication error. Verify backend status.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] font-sans relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-5xl w-full flex flex-col lg:flex-row bg-white rounded-[3rem] shadow-2xl overflow-hidden relative z-10 border border-slate-200/50 scale-95 lg:scale-100">
         {/* Left Side: Branding & Aesthetics */}
         <div className="lg:w-[45%] bg-indigo-600 p-12 lg:p-16 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-800 opacity-90"></div>
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/10 rounded-full translate-x-24 translate-y-24 blur-3xl"></div>
            
            <div className="relative z-10">
               <div className="flex items-center gap-4 mb-16">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 text-3xl font-black shadow-xl">I</div>
                  <div>
                     <h1 className="text-3xl font-black tracking-tighter leading-none italic">Intuition</h1>
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] mt-1 text-indigo-200">Enterprise ERP</p>
                  </div>
               </div>
               
               <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-tight italic mb-8">Harmonizing Institutional <span className="text-blue-200 underline decoration-indigo-400 underline-offset-8">Intelligence.</span></h2>
               <p className="text-indigo-100 font-bold text-sm leading-relaxed max-w-sm">A unified digital ecosystem for scholars, faculty, and administrators to orchestrate academic excellence.</p>
            </div>
            
            <div className="relative z-10 mt-16 lg:mt-0 flex items-center gap-6">
               <div className="flex -space-x-3">
                  {[1,2,3].map(i => <div key={i} className="w-10 h-10 bg-indigo-500 border-2 border-indigo-600 rounded-full flex items-center justify-center text-[10px] font-black italic">U{i}</div>)}
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 leading-tight">Trusted by 12,000+ Institutional Members</p>
            </div>
         </div>

         {/* Right Side: Login Logic */}
         <div className="lg:w-[55%] p-12 lg:p-16 flex flex-col justify-center">
            <div className="mb-10">
               <h3 className="text-3xl font-black text-slate-800 tracking-tighter italic">Welcome Back, Scholar</h3>
               <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2 italic flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  Secure Gateway Entry
               </p>
            </div>

            {error && (
              <div className="mb-8 p-5 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-4 shadow-sm">
                 <span className="text-xl">⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 italic">Institutional Role</label>
                  <select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-black text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 appearance-none transition-all cursor-pointer"
                  >
                    {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 italic">Institutional Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@intuition.edu"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-black text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:opacity-30"
                    required
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 italic flex justify-between items-center">
                     Secret Cipher
                     <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-indigo-600 hover:underline">VIEW</button>
                  </label>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-black text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:opacity-30"
                    required
                  />
               </div>

               <button 
                 type="submit" 
                 disabled={isLoading}
                 className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 mt-4"
               >
                 {isLoading ? 'Verifying Integrity...' : 'Authenticate Identity'}
               </button>
            </form>

            <div className="mt-10 flex items-center gap-6">
               <div className="h-px flex-1 bg-slate-100"></div>
               <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em]">Secure SSO</span>
               <div className="h-px flex-1 bg-slate-100"></div>
            </div>

            <div className="mt-10 flex justify-center scale-110">
               <GoogleLogin 
                  onSuccess={handleGoogleSuccess} 
                  onError={() => setError("Google SSO Verification Failed")}
                  shape="pill"
                  theme="outline"
                  size="large"
               />
            </div>
         </div>
      </div>
    </div>
  );
};

export default LoginPage;