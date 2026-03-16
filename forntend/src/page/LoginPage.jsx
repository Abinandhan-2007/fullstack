import React, { useState } from 'react';

// Icons defined EXACTLY ONCE here at the top
const MailIcon = () => <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const LockIcon = () => <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const EyeIcon = () => <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;

export default function LoginPage({ onGoogleSuccess, onManualLogin, GoogleLoginComponent }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (onManualLogin) {
      onManualLogin(email, password);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-800">
      <div className="bg-white max-w-[440px] w-full p-10 md:p-12 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center">
        
        <h2 className="text-3xl font-black text-slate-900 mb-2 leading-none">Sign in</h2>
        <p className="text-slate-500 mb-10 text-sm font-medium">Use College Email, HR, or PCDP Admin credentials.</p>

        <form onSubmit={handleFormSubmit} className="w-full space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 px-0.5">Login ID</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <MailIcon />
              </div>
              <input
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors placeholder-slate-400 font-medium text-slate-700"
                placeholder="Enter ID..."
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 px-0.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <LockIcon />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors placeholder-slate-400 font-medium text-slate-700"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
              >
                <EyeIcon />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between px-0.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
              <span className="text-sm font-semibold text-slate-600">Remember me</span>
            </label>
            <a href="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">Forgot password?</a>
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/20">
            Sign In to Portal
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </form>

        <div className="mt-8 mb-6 relative w-full flex items-center justify-center">
          <div className="border-t border-slate-200 w-full absolute"></div>
          <span className="bg-white px-4 text-[11px] font-black text-slate-400 uppercase tracking-widest relative">OR CONTINUE WITH GOOGLE</span>
        </div>

        <div className="w-fit">
           {GoogleLoginComponent}
        </div>

      </div>
    </div>
  );
}