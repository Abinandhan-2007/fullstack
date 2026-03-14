import React, { useState } from 'react';

const StudentPortal = ({ user, handleLogout }) => {
  // Navigation States
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Full Menu Definition
  const menuItems = [
    { name: 'Dashboard', icon: '📊', color: 'text-blue-500', bg: 'bg-blue-500', desc: 'Main overview and quick access links.' },
    { name: 'Profile', icon: '👤', color: 'text-slate-500', bg: 'bg-slate-500', desc: 'Manage your personal and academic details.' },
    { name: 'Attendance', icon: '✅', color: 'text-emerald-500', bg: 'bg-emerald-500', desc: 'Track your daily and subject-wise attendance.' },
    { name: 'Marks / Results', icon: '📈', color: 'text-indigo-500', bg: 'bg-indigo-500', desc: 'View your internal marks and semester results.' },
    { name: 'Arrear Tracker', icon: '⚠️', color: 'text-rose-500', bg: 'bg-rose-500', desc: 'Monitor and apply for arrear examinations.' },
    { name: 'Subjects', icon: '📚', color: 'text-amber-500', bg: 'bg-amber-500', desc: 'Access your current semester course materials.' },
    { name: 'Timetable', icon: '📅', color: 'text-cyan-500', bg: 'bg-cyan-500', desc: 'Check your daily class and lab schedule.' },
    { name: 'Notifications', icon: '🔔', color: 'text-violet-500', bg: 'bg-violet-500', desc: 'Campus announcements and alerts.' },
    { name: 'Leave Request', icon: '📝', color: 'text-orange-500', bg: 'bg-orange-500', desc: 'Apply for OD, medical, or general leave.' },
    { name: 'Documents', icon: '📂', color: 'text-teal-500', bg: 'bg-teal-500', desc: 'Download fee receipts, bonafide, and certificates.' },
  ];

  // --- UI RENDERERS ---

  const renderDashboard = () => (
    <div className="animate-in fade-in duration-500">
      <div className="mb-10 text-center md:text-left bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Welcome back, {user?.given_name || 'Student'}! 👋
          </h2>
          <p className="text-slate-500 mt-2 font-medium text-sm max-w-xl">
            Here is your academic overview. Select a module below or use the sidebar to access your tools and records.
          </p>
        </div>
        {/* Decorative background shape */}
        <div className="absolute -right-10 -top-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      </div>

      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-5 px-1">Quick Access Apps</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {menuItems.filter(item => item.name !== 'Dashboard').map((portal, index) => (
          <button 
            key={index} 
            onClick={() => setActiveMenu(portal.name)}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 group text-left flex flex-col h-full"
          >
            <div className={`w-12 h-12 ${portal.bg} text-white rounded-xl flex items-center justify-center text-2xl shadow-inner mb-4 group-hover:scale-110 transition-transform duration-300`}>
              {portal.icon}
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
              {portal.name}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-auto">
              {portal.desc}
            </p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderPlaceholder = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in duration-500">
      <div className="text-5xl mb-4 text-slate-300">
        {menuItems.find(m => m.name === activeMenu)?.icon || '🚧'}
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">{activeMenu}</h2>
      <p className="text-sm text-slate-500 max-w-md">
        We are currently building the {activeMenu} module. Check back soon for updates!
      </p>
    </div>
  );

  // --- MAIN LAYOUT ---

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden relative">
      
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-20 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR */}
      <aside className={`
        absolute lg:static z-30 flex flex-col h-full w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-inner">C</div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">Student<span className="text-blue-600">HQ</span></h1>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-md">✕</button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-5 px-4 space-y-1 custom-scrollbar">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2 mt-2">Main Menu</p>
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => { setActiveMenu(item.name); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeMenu === item.name 
                ? 'bg-blue-50 text-blue-700 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <span className="text-lg opacity-80">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </div>

        <div className="p-5 border-t border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-4">
            <img src={user?.picture || "https://via.placeholder.com/40"} alt="Profile" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.name || "Student Name"}</p>
              <p className="text-[10px] font-semibold text-slate-500 truncate uppercase tracking-wide">B.E. Computer Science</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full py-2.5 bg-white border border-slate-200 text-rose-600 font-bold text-xs rounded-xl hover:bg-rose-50 hover:border-rose-200 transition-colors shadow-sm">
            Secure Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative custom-scrollbar w-full">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 px-5 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 lg:gap-0">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-1.5 -ml-1.5 text-slate-500 hover:bg-slate-100 rounded-md">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <h2 className="text-lg font-bold text-slate-800 truncate flex items-center gap-2">
              {menuItems.find(m => m.name === activeMenu)?.icon} {activeMenu}
            </h2>
          </div>
          <div className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
            Student Account
          </div>
        </header>

        <div className="p-5 lg:p-8 max-w-7xl mx-auto">
          {activeMenu === 'Dashboard' ? renderDashboard() : renderPlaceholder()}
        </div>
      </main>
    </div>
  );
};

export default StudentPortal;