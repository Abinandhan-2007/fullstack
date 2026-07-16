import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function PlacementTraining({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/placement/training');
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
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic">Skill Development & Training</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Institutional grooming programs to enhance student employability and technical prowess</p>
        </div>
        <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-xl flex items-center gap-2">
           <span>🎓</span> Launch Training Module
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {data.map((module, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[3rem] p-10 shadow-sm flex flex-col relative overflow-hidden group hover:border-emerald-500 transition-all">
             <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner font-black italic">
                      {idx + 1}
                   </div>
                   <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic leading-tight">{module.title || 'Training Program'}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">{module.category || 'General'}</p>
                   </div>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-lg">Active</span>
             </div>

             <div className="space-y-4 flex-1">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-gray-800/50 rounded-2xl border border-slate-100 dark:border-gray-700">
                   <div className="flex items-center gap-3">
                      <span className="text-xl">👨‍🏫</span>
                      <div className="text-left">
                         <p className="text-[9px] font-black text-slate-300 uppercase leading-none mb-1">Lead Instructor</p>
                         <p className="text-sm font-bold text-slate-700 dark:text-gray-300 italic">{module.trainer || 'External Consultant'}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-black text-slate-300 uppercase leading-none mb-1">Target</p>
                      <p className="text-xs font-black text-emerald-600">III Year B.E.</p>
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-slate-50 dark:bg-gray-800/50 rounded-2xl border border-slate-100 dark:border-gray-700">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Duration</p>
                      <p className="text-sm font-black text-slate-800 dark:text-white italic">{module.duration || '2 Weeks'}</p>
                   </div>
                   <div className="p-4 bg-slate-50 dark:bg-gray-800/50 rounded-2xl border border-slate-100 dark:border-gray-700">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Batch Size</p>
                      <p className="text-sm font-black text-slate-800 dark:text-white italic">120 Students</p>
                   </div>
                </div>
             </div>

             <div className="mt-10 flex gap-3 pt-6 border-t border-slate-50 dark:border-gray-800">
                <button className="flex-1 py-4 bg-slate-900 dark:bg-emerald-600 text-white font-black text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl hover:scale-105 transition-all">Track Attendance</button>
                <button className="flex-1 py-4 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:text-emerald-600 transition-all">View Analytics</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
