import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

// Import Modular Components
import StaffAdminDashboard from './staffAdmin/StaffAdminDashboard';
import StaffAdminTimetable from './staffAdmin/StaffAdminTimetable';
import StaffAdminSubjectAllocation from './staffAdmin/StaffAdminSubjectAllocation';
import StaffAdminDepartmentStaff from './staffAdmin/StaffAdminDepartmentStaff';
import StaffAdminDepartmentStudents from './staffAdmin/StaffAdminDepartmentStudents';
import StaffAdminAttendanceMapping from './staffAdmin/StaffAdminAttendanceMapping';
import StaffAdminAttendanceReports from './staffAdmin/StaffAdminAttendanceReports';
import StaffAdminExamDuty from './staffAdmin/StaffAdminExamDuty';
import StaffAdminSeating from './staffAdmin/StaffAdminSeating';
import StaffAdminVenueManagement from './staffAdmin/StaffAdminVenueManagement';
import StaffAdminAnnouncements from './staffAdmin/StaffAdminAnnouncements';
import StaffAdminSettings from './staffAdmin/StaffAdminSettings';

export default function StaffAdminPortal({ handleLogout, apiUrl, user, token, userName, loggedInEmail }) {
  const { isDark, toggleTheme } = useTheme();
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const moduleProps = { apiUrl, token, user: { name: userName, email: loggedInEmail } };

  const menuItems = [
    { name: 'Dashboard', icon: '🏠', category: 'Main' },
    { name: 'Master Timetable', icon: '📅', category: 'Academic' },
    { name: 'Subject Allocation', icon: '🎯', category: 'Academic' },
    { name: 'Faculty Directory', icon: '👨‍🏫', category: 'People' },
    { name: 'Student Registry', icon: '🎓', category: 'People' },
    { name: 'Attendance Matrix', icon: '📊', category: 'People' },
    { name: 'Attendance Audit', icon: '📋', category: 'Reports' },
    { name: 'Exam Duty Roster', icon: '📝', category: 'Examinations' },
    { name: 'Seating Planner', icon: '🪑', category: 'Examinations' },
    { name: 'Venue Manager', icon: '📍', category: 'Infrastructure' },
    { name: 'Announcements', icon: '📢', category: 'General' },
    { name: 'System Settings', icon: '⚙️', category: 'General' },
  ];

  const categories = ['Main', 'Academic', 'People', 'Reports', 'Examinations', 'Infrastructure', 'General'];

  const renderActiveModule = () => {
    switch (activeMenu) {
      case 'Dashboard': return <StaffAdminDashboard {...moduleProps} />;
      case 'Master Timetable': return <StaffAdminTimetable {...moduleProps} />;
      case 'Subject Allocation': return <StaffAdminSubjectAllocation {...moduleProps} />;
      case 'Faculty Directory': return <StaffAdminDepartmentStaff {...moduleProps} />;
      case 'Student Registry': return <StaffAdminDepartmentStudents {...moduleProps} />;
      case 'Attendance Matrix': return <StaffAdminAttendanceMapping {...moduleProps} />;
      case 'Attendance Audit': return <StaffAdminAttendanceReports {...moduleProps} />;
      case 'Exam Duty Roster': return <StaffAdminExamDuty {...moduleProps} />;
      case 'Seating Planner': return <StaffAdminSeating {...moduleProps} />;
      case 'Venue Manager': return <StaffAdminVenueManagement {...moduleProps} />;
      case 'Announcements': return <StaffAdminAnnouncements {...moduleProps} />;
      case 'System Settings': return <StaffAdminSettings {...moduleProps} />;
      default: return <div className="p-10 text-center text-slate-500">Module under construction</div>;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-gray-950 font-sans overflow-hidden transition-colors duration-200">
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/60 z-20 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <aside className={`fixed md:static inset-y-0 left-0 w-72 bg-white dark:bg-gray-900 border-r border-slate-200 dark:border-gray-800 z-30 transform transition-transform duration-300 ease-in-out flex flex-col shadow-xl md:shadow-none ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-700 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-inner shadow-white/20">SA</div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Intuition</h1>
              <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest mt-1">Staff Admin</p>
            </div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-8 custom-scrollbar">
          {categories.map(category => (
            <div key={category}>
              <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500 mb-2">{category}</p>
              <ul className="space-y-1">
                {menuItems.filter(item => item.category === category).map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={() => { setActiveMenu(item.name); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        activeMenu === item.name
                          ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 shadow-sm'
                          : 'text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-slate-900 dark:hover:text-gray-200'
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
        
        <div className="p-4 border-t border-slate-100 dark:border-gray-800 shrink-0">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-bold rounded-xl hover:bg-rose-100 transition"
          >
            Sign Out Session
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm relative z-10 transition-colors duration-200">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 -ml-2 text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg></button>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight hidden sm:block">{activeMenu}</h2>
          </div>
          
          <div className="flex items-center gap-6">
             <button onClick={toggleTheme} className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors">
                {isDark ? '☀️' : '🌙'}
             </button>
             <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-slate-800 dark:text-white">{userName || 'Staff Admin'}</p>
                <p className="text-[10px] uppercase font-bold text-sky-500 tracking-widest flex items-center justify-end gap-1"><span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span> DEPT HEAD</p>
             </div>
             <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-full border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 cursor-pointer shadow-sm">
                👤
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
           {renderActiveModule()}
        </div>
      </main>
    </div>
  );
}
