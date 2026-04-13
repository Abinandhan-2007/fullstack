import React, { useState } from 'react';
import StaffDashboard from './staff/StaffDashboard';
import StaffAttendance from './staff/StaffAttendance';
import StaffSubjects from './staff/StaffSubjects';
import StaffMarksEntry from './staff/StaffMarksEntry';
import StaffTimetable from './staff/StaffTimetable';
import StaffLeave from './staff/StaffLeave';
import StaffStudentPerformance from './staff/StaffStudentPerformance';
import StaffFeedback from './staff/StaffFeedback';
import StaffCommunications from './staff/StaffCommunications';

export default function StaffPortal({ handleLogout, apiUrl, loggedInEmail, onSwitchToAdminView }) {
  const [activeModule, setActiveModule] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: '📊', id: 'Dashboard' },
    { name: 'Mark Attendance', icon: '📝', id: 'Mark Attendance' },
    { name: 'Marks Entry', icon: '💯', id: 'Marks Entry' },
    { name: 'My Subjects', icon: '📚', id: 'My Subjects' },
    { name: 'My Timetable', icon: '📅', id: 'My Timetable' },
    { name: 'Student Performance', icon: '🎯', id: 'Student Performance' },
    { name: 'Leave Requests', icon: '🏖️', id: 'Leave Requests' },
    { name: 'Complaints & Feedback', icon: '💬', id: 'Complaints & Feedback' },
    { name: 'Internal Communications', icon: '✉️', id: 'Internal Communications' },
  ];

  const renderModule = () => {
    switch (activeModule) {
      case 'Dashboard': return <StaffDashboard apiUrl={apiUrl} />;
      case 'Mark Attendance': return <StaffAttendance apiUrl={apiUrl} />;
      case 'Marks Entry': return <StaffMarksEntry apiUrl={apiUrl} />;
      case 'My Subjects': return <StaffSubjects apiUrl={apiUrl} />;
      case 'My Timetable': return <StaffTimetable apiUrl={apiUrl} />;
      case 'Student Performance': return <StaffStudentPerformance apiUrl={apiUrl} />;
      case 'Leave Requests': return <StaffLeave apiUrl={apiUrl} />;
      case 'Complaints & Feedback': return <StaffFeedback apiUrl={apiUrl} />;
      case 'Internal Communications': return <StaffCommunications apiUrl={apiUrl} />;
      default: return <StaffDashboard apiUrl={apiUrl} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-inner shadow-indigo-800/30">FP</div>
             <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">Faculty<span className="text-indigo-600 font-normal">Portal</span></h1>
          </div>
          <button className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition" onClick={() => setIsMobileMenuOpen(false)}>✕</button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="h-[calc(100vh-5rem)] overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveModule(item.id); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all duration-200 text-sm ${activeModule === item.id ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600 border border-transparent'}`}
            >
              <span className={`text-xl ${activeModule === item.id ? 'opacity-100 scale-110 transform transition-transform' : 'opacity-70 group-hover:opacity-100'}`}>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Sticky Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-30 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 transition" onClick={() => setIsMobileMenuOpen(true)}>☰</button>
            <h2 className="hidden md:block text-2xl font-black text-slate-800 tracking-tight">{activeModule}</h2>
          </div>
          
          <div className="flex items-center gap-5">
             {/* Switch Admin View Component Integration */}
             {onSwitchToAdminView && (
                <button onClick={onSwitchToAdminView} className="hidden md:flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-slate-800 transition">
                  <span>🔑</span> Switch to Admin View
                </button>
             )}

            <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
               <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-bold text-slate-800">Faculty Role</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">Professor</span>
               </div>
               <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-indigo-200 text-indigo-700 font-extrabold shadow-sm">
                  F
               </div>
               <button onClick={handleLogout} className="text-rose-500 font-bold text-sm hover:underline ml-2">Sign out</button>
            </div>
          </div>
        </header>

        {/* Dynamic Module Container */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F8FAFC] p-4 md:p-8 custom-scrollbar relative">
           <div className="max-w-7xl mx-auto w-full pb-12">
              {renderModule()}
           </div>
        </main>
      </div>

    </div>
  );
}