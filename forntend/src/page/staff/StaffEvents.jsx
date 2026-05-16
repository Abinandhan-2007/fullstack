import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StaffEvents({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/staff/events');
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-48 bg-slate-200 dark:bg-gray-800 rounded-lg"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-48 bg-slate-200 dark:bg-gray-800 rounded-[2.5rem]"></div>)}
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-6 text-center text-rose-600 font-bold">
      {error}
      <button onClick={fetchData} className="block mx-auto mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg font-bold">Retry</button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Events & Activities</h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm">Upcoming academic conferences, workshops, and institutional events</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((ev, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
               <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex flex-col items-center justify-center shadow-inner">
                  <span className="text-[10px] font-black uppercase leading-none">{ev.date?.split('-')[1] || 'MAY'}</span>
                  <span className="text-xl font-black mt-1">{ev.date?.split('-')[2] || (idx + 10)}</span>
               </div>
               <span className="px-3 py-1 bg-slate-50 dark:bg-gray-800 text-[10px] font-black text-slate-400 uppercase tracking-widest rounded-lg border border-slate-100 dark:border-gray-800">Workshop</span>
            </div>
            
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-3 group-hover:text-emerald-600 transition-colors">
               {ev.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed line-clamp-3">
               {ev.description || 'Join us for a comprehensive session on the latest advancements in technology and research methodology.'}
            </p>
            
            <div className="mt-8 pt-6 border-t border-slate-50 dark:border-gray-800 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <span className="text-lg">📍</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ev.venue || 'Main Auditorium'}</span>
               </div>
               <button className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest hover:underline">
                  Register →
               </button>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-gray-800/30 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-gray-800">
             <p className="text-slate-400 italic font-medium">No upcoming events scheduled for the next 30 days.</p>
          </div>
        )}
      </div>
    </div>
  );
}
