import React, { useState } from 'react';

// Use simple SVG icons for a crisp look
const MailIcon = () => <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const LockIcon = () => <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const EyeIcon = () => <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const GoogleIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>;

// Props for Google One Tap to work, as requested in image_3.png
export default function LoginPage({ GoogleLoginComponent }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    // Centered card layout from image_4.png with light-grey background
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-800">
      <div className="bg-white max-w-[440px] w-full p-10 md:p-12 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center">
        
        {/* Title and descriptions from image_3.png, verbatim */}
        <h2 className="text-3xl font-black text-slate-900 mb-2 leading-none">Sign in</h2>
        <p className="text-slate-500 mb-10 text-sm font-medium">Use College Email, HR, or PCDP Admin credentials.</p>

        {/* Input fields with icons and simple style, like image_3.png but centered on page */}
        <form className="w-full space-y-6">
          
          {/* Email field verbatim from image_3.png */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 px-0.5">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <MailIcon />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors placeholder-slate-400 font-medium text-slate-700"
                placeholder="user@gmail.com"
              />
            </div>
          </div>

          {/* Password field verbatim from image_3.png */}
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

          {/* Remember me & Forgot Password, verbatim with blue from portal theme */}
          <div className="flex items-center justify-between px-0.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
              <span className="text-sm font-semibold text-slate-600">Remember me</span>
            </label>
            <a href="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">Forgot password?</a>
          </div>

          {/* Main button, vibrant blue with arrow, verbatim text */}
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/20">
            Sign In to Portal
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </form>

        {/* Divider and uppercase text verbatim from image_3.png */}
        <div className="mt-8 mb-6 relative w-full flex items-center justify-center">
          <div className="border-t border-slate-200 w-full absolute"></div>
          <span className="bg-white px-4 text-[11px] font-black text-slate-400 uppercase tracking-widest relative">OR CONTINUE WITH GOOGLE</span>
        </div>

        {/* Google One Tap button slot for the real component prop, exactly like image_3.png */}
        <div className="w-fit">
           {GoogleLoginComponent ? (
             GoogleLoginComponent // Render the real component if prop exists
           ) : (
             // Fallback mock button looks exactly like image_3.png for visual parity
             <div className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer">
               <div className="w-6 h-6 rounded-full bg-[#648454] text-white flex items-center justify-center text-xs font-bold">A</div>
               <div className="text-left">
                 <p className="text-xs font-bold text-slate-700 leading-tight">Continue as ABINANDHAN</p>
                 <p className="text-[10px] text-slate-500">abinandhank.cs24@bitsathy.ac.in</p>
               </div>
               <GoogleIcon />
             </div>
           )}
        </div>

      </div>
    </div>
  );
}