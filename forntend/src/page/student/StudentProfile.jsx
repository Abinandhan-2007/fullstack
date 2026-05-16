import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StudentProfile({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/host/all-students');
      const myData = res.data.find(s => s.email?.toLowerCase() === user.email?.toLowerCase());
      setProfile(myData || res.data[0]); // Fallback for demo
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [user.email]);

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="relative">
         <div className="h-64 bg-gradient-to-r from-indigo-600 to-indigo-900 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 flex items-center justify-center">
               <span className="text-[15rem] font-black italic tracking-tighter select-none">SCHOLAR</span>
            </div>
            <div className="absolute bottom-0 right-0 p-10 opacity-20">
               <div className="w-48 h-48 bg-white rounded-full blur-3xl"></div>
            </div>
         </div>
         
         <div className="absolute -bottom-16 left-12 flex flex-col md:flex-row items-end gap-8 px-6">
            <div className="w-48 h-48 bg-white dark:bg-gray-900 rounded-[3.5rem] p-4 shadow-2xl relative z-10 border-4 border-white dark:border-gray-800">
               <div className="w-full h-full bg-slate-100 dark:bg-gray-800 rounded-[2.5rem] flex items-center justify-center text-7xl font-black italic text-indigo-500 shadow-inner">
                  {profile?.name?.charAt(0)}
               </div>
            </div>
            <div className="mb-6 pb-2 relative z-10">
               <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic leading-none">{profile?.name}</h2>
               <p className="text-sm font-black text-indigo-600 uppercase tracking-[0.4em] mt-3">{profile?.registerNumber || 'REG-STUD-001'}</p>
            </div>
         </div>
         
         <div className="absolute -bottom-12 right-12 flex gap-4 hidden lg:flex">
            <button className="px-10 py-4 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl hover:scale-105 transition-all">Export ID Card</button>
            <button className="px-10 py-4 bg-slate-900 dark:bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-2xl hover:scale-105 transition-all">Modify Registry</button>
         </div>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[3rem] p-10 shadow-sm space-y-8 group hover:border-indigo-500 transition-all">
            <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] italic mb-6 border-b border-slate-50 dark:border-gray-800 pb-4">Personal Identification</h3>
            <div className="space-y-6">
               {[
                 { label: 'Full Legal Name', value: profile?.name },
                 { label: 'Primary Digital ID', value: profile?.email },
                 { label: 'Physiological Group', value: profile?.bloodGroup || 'O+ Positive' },
                 { label: 'Date of Genesis', value: '15 MAY 2002' }
               ].map((item, i) => (
                 <div key={i}>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">{item.label}</p>
                    <p className="text-base font-black text-slate-800 dark:text-white italic">{item.value || 'N/A'}</p>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[3rem] p-10 shadow-sm space-y-8 group hover:border-indigo-500 transition-all">
            <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] italic mb-6 border-b border-slate-50 dark:border-gray-800 pb-4">Institutional Credentials</h3>
            <div className="space-y-6">
               {[
                 { label: 'Departmental Faculty', value: profile?.department },
                 { label: 'Academic Cycle', value: profile?.batch || '2022-2026' },
                 { label: 'Current Semester', value: `Semester ${profile?.semester || 'VI'}` },
                 { label: 'Scholarly Role', value: 'Full-time Resident Scholar' }
               ].map((item, i) => (
                 <div key={i}>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">{item.label}</p>
                    <p className="text-base font-black text-slate-800 dark:text-white italic">{item.value || 'N/A'}</p>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-sm space-y-8 text-white relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-500 opacity-10 rounded-full blur-3xl"></div>
            <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] italic mb-6 border-b border-white/10 pb-4 relative z-10">Guardian Registry</h3>
            <div className="space-y-6 relative z-10">
               {[
                 { label: 'Guardian Identity', value: 'MR. ANANDAN' },
                 { label: 'Relationship Nexus', value: 'Parent (Father)' },
                 { label: 'Telephonic Line', value: '+91 9876543210' },
                 { label: 'Postal Domicile', value: '123 Academic Block, Scholarly Street, Knowledge City' }
               ].map((item, i) => (
                 <div key={i}>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">{item.label}</p>
                    <p className="text-base font-black text-slate-200 italic leading-snug">{item.value || 'N/A'}</p>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
