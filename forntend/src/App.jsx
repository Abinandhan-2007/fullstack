import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

// --- IMPORT YOUR PAGES ---
// Ensure these files exist in your src/pages folder!
import Dashboard from './pages/Dashboard';
import SkillTest from './pages/SkillTest';
import AcademicData from './pages/AcademicData';
import Subjects from './pages/Subjects';
import Placement from './pages/Placement';
import Leave from './pages/Leave';

function App() {
  const [user, setUser] = useState(null);

  // Load user from local storage on boot
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = () => {
    const mockUser = { name: "Abinandhan", email: "abi@example.com" };
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const portals = [
    { id: 'dashboard', title: 'Analytics Dashboard', icon: '📊', desc: 'Performance metrics', color: 'text-blue-600' },
    { id: 'skill-test', title: 'Technical Assessment', icon: '⚡', desc: 'Competency verification', color: 'text-amber-500' },
    { id: 'academic-data', title: 'Academic Ledger', icon: '🎓', desc: 'CGPA & Credit history', color: 'text-emerald-600' },
    { id: 'subjects', title: 'Curriculum Hub', icon: '📚', desc: 'Course materials', color: 'text-indigo-600' },
    { id: 'placement', title: 'Career Portal', icon: '🎯', desc: 'Job offers & Prep', color: 'text-rose-600' },
    { id: 'leave', title: 'Protocol Management', icon: '📝', desc: 'Leave authorization', color: 'text-slate-600' },
  ];

  // 1. LOGIN SCREEN (If no user)
  if (!user) {
    return (
      <div className="h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white px-4">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl mb-8 shadow-[0_0_40px_rgba(37,99,235,0.4)] animate-bounce"></div>
        <h1 className="text-5xl font-black tracking-tighter mb-2 italic">CENTRAL PORTAL</h1>
        <p className="text-slate-500 mb-10 tracking-[0.2em] uppercase text-xs font-bold">Systems Initializing...</p>
        <button 
          onClick={handleLogin}
          className="bg-white text-slate-900 px-10 py-4 rounded-full font-bold hover:bg-blue-500 hover:text-white transition-all transform hover:scale-105 shadow-xl"
        >
          Initialize System Access
        </button>
      </div>
    );
  }

  // 2. MAIN APP (If logged in)
  return (
    <Router>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
        
        {/* GLOBAL NAVIGATION BAR */}
        <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link to="/" className="font-black text-xl tracking-tighter italic text-blue-600 hover:opacity-80 transition-opacity">
              CENTRAL.SYSTEMS
            </Link>
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Auth User</p>
                <p className="text-sm font-bold text-slate-700">{user.name}</p>
              </div>
              <button 
                onClick={handleLogout} 
                className="bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 px-4 py-2 rounded-lg text-xs font-bold transition-colors uppercase tracking-wider"
              >
                Exit
              </button>
            </div>
          </div>
        </nav>

        {/* PAGE CONTENT AREA */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          <Routes>
            
            {/* HOME GRID (Matches path "/") */}
            <Route path="/" element={
              <div className="animate-in fade-in zoom-in duration-500">
                <header className="mb-12">
                  <h2 className="text-4xl font-black tracking-tight text-slate-900 uppercase italic">Command Center</h2>
                  <p className="text-slate-500 font-medium">Select a specialized module to begin data operations.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {portals.map((p) => (
                    <Link 
                      key={p.id} 
                      to={`/${p.id}`} 
                      className="group bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-blue-500 hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className={`text-4xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        {p.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {p.desc}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            } />

            {/* SUB-PORTAL ROUTES */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/skill-test" element={<SkillTest />} />
            <Route path="/academic-data" element={<AcademicData />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/placement" element={<Placement />} />
            <Route path="/leave" element={<Leave />} />

            {/* REDIRECT ANY TYPOS BACK TO HOME */}
            <Route path="*" element={<Navigate to="/" />} />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;