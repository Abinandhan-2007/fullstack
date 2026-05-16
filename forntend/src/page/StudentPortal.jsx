import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

// Import Modular Components
import StudentDashboard from './student/StudentDashboard';
import StudentMarks from './student/StudentMarks';
import StudentAttendance from './student/StudentAttendance';
import StudentTimetable from './student/StudentTimetable';
import StudentFees from './student/StudentFees';
import StudentExamSchedule from './student/StudentExamSchedule';
import StudentLibrary from './student/StudentLibrary';
import StudentHostel from './student/StudentHostel';
import StudentLeave from './student/StudentLeave';
import StudentProfile from './student/StudentProfile';

export default function StudentPortal({ handleLogout, apiUrl, user, token, userName, loggedInEmail, linkedId }) {
  const { isDark, toggleTheme } = useTheme();
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const moduleProps = { apiUrl, token, user: { name: userName, email: loggedInEmail }, linkedId };

  const menuItems = [
    { name: 'Dashboard', icon: '🏠', category: 'Main' },
    { name: 'Academic Results', icon: '📊', category: 'Academic' },
    { name: 'Attendance', icon: '📅', category: 'Academic' },
    { name: 'Class Timetable', icon: '🕒', category: 'Academic' },
    { name: 'Fee Payments', icon: '💳', category: 'Financial' },
    { name: 'Exam Schedule', icon: '📝', category: 'Academic' },
    { name: 'Library Books', icon: '📚', category: 'Campus' },
    { name: 'Hostel & Mess', icon: '🏨', category: 'Campus' },
    { name: 'Leave Application', icon: '📋', category: 'Personal' },
    { name: 'My Profile', icon: '👤', category: 'Personal' },
  ];

  const categories = ['Main', 'Academic', 'Financial', 'Campus', 'Personal'];

  const renderActiveModule = () => {
    switch (activeMenu) {
      case 'Dashboard': return <StudentDashboard {...moduleProps} />;
      case 'Academic Results': return <StudentMarks {...moduleProps} />;
      case 'Attendance': return <StudentAttendance {...moduleProps} />;
      case 'Class Timetable': return <StudentTimetable {...moduleProps} />;
      case 'Fee Payments': return <StudentFees {...moduleProps} />;
      case 'Exam Schedule': return <StudentExamSchedule {...moduleProps} />;
      case 'Library Books': return <StudentLibrary {...moduleProps} />;
      case 'Hostel & Mess': return <StudentHostel {...moduleProps} />;
      case 'Leave Application': return <StudentLeave {...moduleProps} />;
      case 'My Profile': return <StudentProfile {...moduleProps} />;
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
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-inner shadow-white/20">S</div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Intuition</h1>
              <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest mt-1">Student Portal</p>
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
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 shadow-sm'
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
                <p className="text-sm font-bold text-slate-800 dark:text-white">{userName || 'Student'}</p>
                <p className="text-[10px] uppercase font-bold text-indigo-500 tracking-widest flex items-center justify-end gap-1"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span> SCHOLAR</p>
             </div>
             <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 cursor-pointer shadow-sm">
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
