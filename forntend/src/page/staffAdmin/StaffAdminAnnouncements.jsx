import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StaffAdminAnnouncements({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/staff-admin/announcements');
      setData(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic underline decoration-sky-500 underline-offset-4">Departmental Bulletin Board</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Official communication channel for faculty and student synchronization</p>
        </div>
        <button className="px-6 py-3 bg-sky-600 text-white rounded-xl font-bold shadow-xl flex items-center gap-2">
           <span>📢</span> Broadcast Update
        </button>
      </div>

      <div className="space-y-4">
        {data.map((ann, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-10 shadow-sm hover:shadow-xl transition-all border-l-8 border-l-sky-500 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <span className="text-8xl italic font-black text-slate-400 leading-none">#{idx+1}</span>
            </div>
            
            <div className="relative z-10">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                 <div className="flex items-center gap-3">
                   <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] ${
                     ann.priority === 'HIGH' ? 'bg-rose-100 text-rose-600' : 'bg-sky-100 text-sky-600'
                   }`}>
                     {ann.priority || 'OFFICIAL'} Notice
                   </span>
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{ann.sentAt || 'Today, 11:30 AM'}</span>
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-gray-800 rounded-lg border border-slate-100 dark:border-gray-700">
                    <div className="w-6 h-6 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center text-[10px]">🏢</div>
                    <span className="text-[9px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-tight italic">Head of Department</span>
                 </div>
               </div>
               
               <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4 italic leading-tight">
                 {ann.title}
               </h3>
               <p className="text-base text-slate-600 dark:text-gray-300 leading-relaxed italic font-medium">
                 {ann.message}
               </p>
               
               <div className="mt-10 flex justify-between items-center border-t border-slate-50 dark:border-gray-800 pt-6">
                 <div className="flex gap-2">
                    <span className="px-3 py-1 bg-sky-50 dark:bg-sky-900/20 text-sky-600 text-[9px] font-black uppercase rounded-lg">Academic</span>
                    <span className="px-3 py-1 bg-sky-50 dark:bg-sky-900/20 text-sky-600 text-[9px] font-black uppercase rounded-lg">Official</span>
                 </div>
                 <button className="text-[10px] font-black text-sky-600 uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                   Manage Engagement <span className="text-xl">→</span>
                 </button>
               </div>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="py-20 text-center bg-slate-50 dark:bg-gray-800/30 rounded-[3rem] border border-dashed border-slate-200 dark:border-gray-800 opacity-50">
             <p className="text-slate-400 italic font-bold uppercase tracking-widest">The department bulletin is currently clear.</p>
          </div>
        )}
      </div>
    </div>
  );
}
