import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function PlacementDrives({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/placement/drives');
      setData(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic underline decoration-emerald-500 underline-offset-4">Recruitment Drive Scheduler</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Orchestrate campus hiring events and synchronize with corporate partners</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-xl flex items-center gap-2">
           <span>🚀</span> Deploy New Drive
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {data.map((drive, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[3rem] p-10 shadow-sm flex flex-col relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8">
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border ${
                  drive.status === 'ONGOING' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 animate-pulse' : 'bg-slate-50 text-slate-400 border-slate-100'
                }`}>
                   {drive.status}
                </span>
             </div>

             <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-[2rem] flex items-center justify-center text-3xl font-black shadow-inner">
                   {drive.company?.name?.charAt(0)}
                </div>
                <div>
                   <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">{drive.company?.name}</h3>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{drive.date} • {drive.location || 'CAMPUS HUB'}</p>
                </div>
             </div>

             <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-slate-50 dark:bg-gray-800/50 rounded-2xl border border-slate-100 dark:border-gray-700">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Registrations</p>
                   <p className="text-xl font-black text-slate-800 dark:text-white mt-1 italic">{drive.registrationCount || 450}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-gray-800/50 rounded-2xl border border-slate-100 dark:border-gray-700">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Eligible</p>
                   <p className="text-xl font-black text-blue-600 mt-1 italic">{drive.eligibleCount || 280}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-gray-800/50 rounded-2xl border border-slate-100 dark:border-gray-700">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Rounds</p>
                   <p className="text-xl font-black text-amber-600 mt-1 italic">{drive.rounds || 3}</p>
                </div>
             </div>

             <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-[2rem] border border-emerald-100 dark:border-emerald-800/30">
                <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] mb-2">Job Profiles</p>
                <div className="flex flex-wrap gap-2">
                   {['Full Stack Dev', 'ML Engineer', 'DevOps'].map(role => (
                     <span key={role} className="px-3 py-1 bg-white dark:bg-gray-800 text-[9px] font-bold text-slate-500 rounded-lg shadow-sm">{role}</span>
                   ))}
                </div>
             </div>

             <div className="mt-8 flex gap-3">
                <button className="flex-1 py-4 bg-slate-900 dark:bg-emerald-600 text-white font-black text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl hover:scale-105 transition-all">Manage Students</button>
                <button className="flex-1 py-4 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-2xl">Broadcast Update</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
