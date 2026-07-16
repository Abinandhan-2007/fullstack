import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StaffAdminTimetable({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState('MONDAY');

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const periods = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8'];

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/staff-admin/timetable');
      setData(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const getSlot = (day, period) => {
    return data.find(s => s.day === day && s.period === period);
  };

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic underline decoration-sky-500">Departmental Academic Planner</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Master schedule management for all curriculum sessions and laboratory blocks</p>
        </div>
        <div className="flex gap-2">
           <button className="px-6 py-3 bg-sky-600 text-white rounded-xl font-bold shadow-xl shadow-sky-500/20 text-xs uppercase tracking-widest">
              <span>➕</span> Add New Session
           </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
         {days.map(d => (
           <button 
             key={d}
             onClick={() => setActiveDay(d)}
             className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap ${
               activeDay === d 
               ? 'bg-sky-600 border-sky-600 text-white shadow-lg shadow-sky-500/20 scale-105' 
               : 'bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-800 text-slate-400'
             }`}
           >
             {d}
           </button>
         ))}
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden p-8">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {periods.map(p => {
               const slot = getSlot(activeDay, p);
               return (
                 <div key={p} className="bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-700 rounded-3xl p-6 flex flex-col relative group hover:border-sky-500 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-6">
                       <span className="text-[10px] font-black text-sky-600 bg-sky-50 dark:bg-sky-900/20 px-2 py-1 rounded-lg uppercase tracking-widest">{p}</span>
                       <button className="text-slate-300 hover:text-sky-500 transition-colors">✏️</button>
                    </div>
                    
                    {slot ? (
                      <div className="space-y-4">
                         <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight italic line-clamp-2">{slot.course?.name || 'Academic Session'}</h4>
                         <div className="pt-4 border-t border-slate-200/50 dark:border-gray-700 space-y-2">
                            <div className="flex items-center gap-2">
                               <span className="text-xs">👨‍🏫</span>
                               <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase italic">{slot.staff?.name || 'Faculty Member'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <span className="text-xs">📍</span>
                               <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">{slot.venue || 'Lecture Hall'}</span>
                            </div>
                         </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-30 italic">
                         <span className="text-2xl mb-2">💤</span>
                         <p className="text-[10px] font-black uppercase tracking-widest">Free Slot</p>
                      </div>
                    )}
                 </div>
               );
            })}
         </div>
      </div>
    </div>
  );
}
