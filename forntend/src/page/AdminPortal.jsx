import React, { useState, useEffect } from 'react';

// Import Modular Enterprise Components
import AdminDashboard from './admin/AdminDashboard';
import AdminDepartments from './admin/AdminDepartments';
import AdminUsers from './admin/AdminUsers';
import AdminCourses from './admin/AdminCourses';
import AdminAttendance from './admin/AdminAttendance';
import AdminPerformance from './admin/AdminPerformance';
import AdminTimetable from './admin/AdminTimetable';
import AdminSeating from './admin/AdminSeating';
import AdminCertificates from './admin/AdminCertificates';
import AdminCalendar from './admin/AdminCalendar';
import AdminReports from './admin/AdminReports';
import AdminNotifications from './admin/AdminNotifications';
import AdminPlacements from './admin/AdminPlacements';
import AdminComplaints from './admin/AdminComplaints';
import AdminSettings from './admin/AdminSettings';
import AdminSecurityLogs from './admin/AdminSecurityLogs';

export default function AdminPortal({ handleLogout, apiUrl, user, token }) {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Common Props to pass down to sub-modules
  const moduleProps = { apiUrl, token, user };

  const menuItems = [
    { name: 'Dashboard', icon: '📊', category: 'Core' },
    { name: 'Departments', icon: '🏢', category: 'Core' },
    { name: 'User Management', icon: '👥', category: 'Core' },
    { name: 'Courses & Subjects', icon: '📚', category: 'Academics' },
    { name: 'Attendance Monitoring', icon: '✅', category: 'Academics' },
    { name: 'Marks & Performance', icon: '📈', category: 'Academics' },
    { name: 'Timetable Manager', icon: '🕒', category: 'Management' },
    { name: 'Seating Arrangement', icon: '🪑', category: 'Management' },
    { name: 'Certificate Generator', icon: '🎓', category: 'Management' },
    { name: 'Placement Details', icon: '💼', category: 'Campus' },
    { name: 'Events & Calendar', icon: '📅', category: 'Campus' },
    { name: 'Complaints', icon: '⚠️', category: 'Campus' },
    { name: 'Reports Center', icon: '🖨️', category: 'System' },
    { name: 'Notification Center', icon: '📢', category: 'System' },
    { name: 'System Settings', icon: '⚙️', category: 'System' },
    { name: 'Security Logs', icon: '🛡️', category: 'System' },
  ];

  const renderActiveModule = () => {
    switch (activeMenu) {
      case 'Dashboard': return <AdminDashboard {...moduleProps} />;
      case 'Departments': return <AdminDepartments {...moduleProps} />;
      case 'User Management': return <AdminUsers {...moduleProps} />;
      case 'Courses & Subjects': return <AdminCourses {...moduleProps} />;
      case 'Attendance Monitoring': return <AdminAttendance {...moduleProps} />;
      case 'Marks & Performance': return <AdminPerformance {...moduleProps} />;
      case 'Timetable Manager': return <AdminTimetable {...moduleProps} />;
      case 'Seating Arrangement': return <AdminSeating {...moduleProps} />;
      case 'Certificate Generator': return <AdminCertificates {...moduleProps} />;
      case 'Placement Details': return <AdminPlacements {...moduleProps} />;
      case 'Events & Calendar': return <AdminCalendar {...moduleProps} />;
      case 'Complaints': return <AdminComplaints {...moduleProps} />;
      case 'Reports Center': return <AdminReports {...moduleProps} />;
      case 'Notification Center': return <AdminNotifications {...moduleProps} />;
      case 'System Settings': return <AdminSettings {...moduleProps} />;
      case 'Security Logs': return <AdminSecurityLogs {...moduleProps} />;
      default: return <div className="p-10 text-center text-slate-500">Module under construction</div>;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-20 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 w-72 bg-white border-r border-slate-200 z-30 transform transition-transform duration-300 ease-in-out flex flex-col shadow-xl md:shadow-none ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-inner shadow-white/20">A</div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">Enterprise</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Admin Portal</p>
            </div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-8 custom-scrollbar">
          {['Core', 'Academics', 'Management', 'Campus', 'System'].map(category => (
            <div key={category}>
              <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{category}</p>
              <ul className="space-y-1">
                {menuItems.filter(item => item.category === category).map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={() => { setActiveMenu(item.name); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        activeMenu === item.name
                          ? 'bg-blue-50 text-blue-700 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className="text-lg opacity-80">{item.icon}</span>
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-100 shrink-0">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-100 hover:text-rose-700 transition"
          >
            Sign Out Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm relative z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">{activeMenu} Module</h2>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-slate-800">Administrator</p>
                <p className="text-[10px] uppercase font-bold text-emerald-500 tracking-widest flex items-center justify-end gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> SYSTEM ONLINE</p>
             </div>
             <div className="w-10 h-10 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 cursor-pointer shadow-sm">
                👤
             </div>
          </div>
        </header>

        {/* Scrollable Module Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
           {renderActiveModule()}
        </div>
      </main>
    </div>
  );
}
