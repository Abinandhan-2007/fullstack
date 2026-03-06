import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

import AcademicData from './page/AcademicData';
import SemesterResult from './page/SemesterResult';

const Placeholder = ({ title }) => (
  <div className="text-center py-32 bg-white rounded-[2rem] border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6">🚧</div>
    <h2 className="text-2xl font-extrabold text-slate-800 mb-2">{title} Portal</h2>
    <p className="text-slate-500 font-medium">This module is currently under development.</p>
  </div>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [selectedSemester, setSelectedSemester] = useState(null); 

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (credentialResponse) => {
    const decodedUser = jwtDecode(credentialResponse.credential);
    setUser(decodedUser);
    localStorage.setItem("user", JSON.stringify(decodedUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setCurrentView('home');
  };

  const handleViewSemester = (semesterId) => {
    setSelectedSemester(semesterId);
    setCurrentView('semester-result');
  };

  const portals = [
    { id: 'dashboard', title: 'Dashboard', icon: '📊', desc: 'Return to the main engineering analytics and system metrics panel.', color: 'bg-blue-500' },
    { id: 'skill-test', title: 'Skill Test', icon: '💻', desc: 'Practice programming MCQs and technical coding challenges.', color: 'bg-indigo-500' },
    { id: 'academic', title: 'Academic Data', icon: '🎓', desc: 'View your overall CGPA, semester credits, and university records.', color: 'bg-emerald-500' },
    { id: 'subjects', title: 'Subjects', icon: '📚', desc: 'Access standard course materials, assignments, and NPTEL tracking.', color: 'bg-amber-500' },
    { id: 'placement', title: 'Placement', icon: '🚀', desc: 'Track interview schedules, resume updates, and upcoming placement drives.', color: 'bg-violet-500' },
    { id: 'leave', title: 'Leave', icon: '📅', desc: 'Apply for on-duty (OD), medical leave, or general absences.', color: 'bg-rose-500' },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white max-w-md w-full p-10 rounded-3xl shadow-xl border border-slate-100 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-inner mx-auto mb-6">C</div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Sign in</h2>
          <p className="text-slate-500 font-medium mb-10">to continue to the Central Portal</p>
          <div className="flex justify-center">
            <GoogleLogin onSuccess={handleLogin} onError={() => console.log('Login Failed')} theme="outline" size="large" shape="pill" />
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch(currentView) {
      case 'academic':
        return <AcademicData user={user} onViewSemester={handleViewSemester} />; 
      case 'semester-result':
        return <SemesterResult 
                  semesterId={selectedSemester} 
                  rollNo="7376241CS106" 
                  userName={user?.name || "Abinandhan K"}
                  onBack={() => setCurrentView('academic')} 
                />;
      case 'dashboard':
        return <Placeholder title="Analytics Dashboard" />;
      case 'skill-test':
        return <Placeholder title="Skill Test" />;
      case 'subjects':
        return <Placeholder title="Subjects Hub" />;
      case 'placement':
        return <Placeholder title="Career & Placement" />;
      case 'leave':
        return <Placeholder title="Leave Management" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <header className="bg-white shadow-sm border-b border-slate-200 px-8 py-4 flex justify-between items-center z-10 sticky top-0">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-inner">C</div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Central<span className="text-blue-600">Portal</span></h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-slate-700">{user.name}</p>
            <p className="text-xs text-slate-500 font-medium">{user.email}</p>
          </div>
          <img src={user.picture} alt="Profile" className="w-10 h-10 rounded-full border-2 border-slate-200 shadow-sm" />
          <button 
            onClick={handleLogout}
            className="text-sm font-semibold text-rose-500 hover:text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors ml-2"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 md:py-20">
        
        {currentView === 'home' ? (
          <div className="animate-in fade-in duration-500 slide-in-from-bottom-4">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">Welcome to your Workspace, {user.given_name}</h2>
              <p className="text-slate-500 mt-3 font-medium text-lg">Select a module below to access your tools.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portals.map((portal) => (
                <div 
                  key={portal.id} 
                  onClick={() => setCurrentView(portal.id)}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group block cursor-pointer"
                >
                  <div className={`w-16 h-16 ${portal.color} rounded-2xl flex items-center justify-center text-3xl shadow-inner mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {portal.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{portal.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{portal.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {currentView !== 'semester-result' && (
              <button 
                onClick={() => setCurrentView('home')} 
                className="mb-8 bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:text-blue-600 hover:border-blue-200 hover:shadow-sm px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
              >
                ← Back to Workspace
              </button>
            )}
            {renderContent()}
          </div>
        )}
      </main>
    </div>
  );
}