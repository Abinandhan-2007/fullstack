import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StaffAdminVenueManagement({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/staff-admin/venues');
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
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic underline decoration-sky-500">Institutional Infrastructure Registry</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Centralized management of lecture halls, specialized laboratories and seminar venues</p>
        </div>
        <button className="px-6 py-3 bg-sky-600 text-white rounded-xl font-bold shadow-xl flex items-center gap-2">
           <span>📍</span> Register New Venue
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((venue, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col relative group hover:border-sky-500 transition-all overflow-hidden">
             <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="w-14 h-14 bg-slate-50 dark:bg-gray-800 text-sky-600 rounded-2xl flex items-center justify-center text-3xl shadow-inner font-black italic">
                   {venue.type === 'LAB' ? '🧪' : '🏫'}
                </div>
                <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                  venue.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                }`}>
                   {venue.status || 'ACTIVE'}
                </span>
             </div>
             
             <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1 italic leading-tight group-hover:text-sky-600 transition-colors">{venue.name}</h3>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{venue.location || 'Science Block'}</p>
             
             <div className="mt-8 space-y-4 flex-1 relative z-10">
                <div className="flex justify-between items-center border-b border-slate-50 dark:border-gray-800 pb-3">
                   <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Max Capacity</p>
                   <p className="text-sm font-black text-slate-800 dark:text-white italic">{venue.capacity || 60} Pax</p>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                   {['WIFI', 'AC', 'PROJECTOR'].map(f => (
                     <span key={f} className="px-2 py-0.5 bg-slate-50 dark:bg-gray-800 text-[8px] font-black text-slate-400 rounded border border-slate-100 dark:border-gray-700">{f}</span>
                   ))}
                </div>
             </div>

             <div className="mt-10 flex gap-2 pt-6 border-t border-slate-50 dark:border-gray-800 relative z-10">
                <button className="flex-1 py-3 bg-slate-100 dark:bg-gray-800 text-slate-500 dark:text-gray-400 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-sky-600 hover:text-white transition-all shadow-sm">View Schedule</button>
                <button className="px-4 py-3 bg-slate-100 dark:bg-gray-800 text-slate-400 rounded-xl hover:text-sky-600 transition-all">⚙️</button>
             </div>
             
             <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-sky-500/5 rounded-full group-hover:scale-150 transition-transform"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
