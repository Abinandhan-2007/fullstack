import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StaffAdminSeating({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/staff-admin/venues');
      setHalls(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic">Examination Seating Architecture</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Coordinate hall arrangements, student positioning and invigilation zones</p>
        </div>
        <button className="px-6 py-3 bg-sky-600 text-white rounded-xl font-bold shadow-xl flex items-center gap-2">
           <span>🪑</span> Run Seating Algorithm
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {halls.map((hall, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[3rem] p-10 shadow-sm flex flex-col relative group">
             <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-4">
                   <div className="w-16 h-16 bg-sky-50 dark:bg-sky-900/20 text-sky-600 rounded-[2rem] flex items-center justify-center text-3xl font-black shadow-inner">
                      🏛️
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic underline decoration-sky-100 dark:decoration-sky-900/50">{hall.name || `Hall ${idx+101}`}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Institutional Block A</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacity</p>
                   <p className="text-2xl font-black text-sky-600 italic leading-none">{hall.capacity || 60}</p>
                </div>
             </div>

             <div className="bg-slate-50 dark:bg-gray-800/50 rounded-[2rem] p-8 border border-slate-100 dark:border-gray-700/50 flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 italic">Seating Grid Preview</p>
                <div className="grid grid-cols-6 gap-2 opacity-40 group-hover:opacity-80 transition-opacity">
                   {Array.from({length: 24}).map((_, i) => (
                     <div key={i} className="aspect-square bg-white dark:bg-gray-900 rounded-lg border border-slate-200 dark:border-gray-700 shadow-sm flex items-center justify-center text-[8px] font-black text-slate-300 italic">{i+1}</div>
                   ))}
                </div>
             </div>

             <div className="mt-8 flex gap-3">
                <button className="flex-1 py-4 bg-slate-900 dark:bg-sky-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl hover:scale-105 transition-all">Download Hall Plan</button>
                <button className="flex-1 py-4 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl">Modify Layout</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
