import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StudentTimetable({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState('MONDAY');

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const periods = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8'];

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/timetable');
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
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic underline decoration-indigo-500">Academic Schedule Architect</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Interactive master planner for curriculum sessions and specialized laboratory cycles</p>
        </div>
        <div className="flex gap-2">
           <button className="px-6 py-3 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl font-bold shadow-sm text-xs uppercase tracking-widest text-slate-600 dark:text-gray-300">Sync Calendar</button>
           <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-xl shadow-indigo-500/20 text-xs uppercase tracking-widest">Download PDF</button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
         {days.map(d => (
           <button 
             key={d}
             onClick={() => setActiveDay(d)}
             className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border whitespace-nowrap ${
               activeDay === d 
               ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-500/20 scale-105' 
               : 'bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-800 text-slate-400'
             }`}
           >
             {d}
           </button>
         ))}
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[3rem] shadow-sm overflow-hidden p-10">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {periods.map(p => {
               const slot = getSlot(activeDay, p);
               return (
                 <div key={p} className="bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-700 rounded-[2rem] p-8 flex flex-col relative group hover:border-indigo-500 transition-all cursor-pointer shadow-sm">
                    <div className="flex justify-between items-start mb-8">
                       <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-xl uppercase tracking-widest border border-indigo-100 dark:border-indigo-900/50">{p}</span>
                       <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic">Core Session</span>
                    </div>
                    
                    {slot ? (
                      <div className="space-y-6 flex-1 flex flex-col">
                         <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight italic leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">{slot.subject || 'Academic Module'}</h4>
                         <div className="mt-auto pt-6 border-t border-slate-200/50 dark:border-gray-700 space-y-3">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-xs">👤</div>
                               <span className="text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-tight italic">{slot.staff?.name || 'Lead Faculty'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 bg-slate-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-xs">📍</div>
                               <span className="text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest">Venue: {slot.room || 'L-201'}</span>
                            </div>
                         </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center py-16 opacity-30 italic">
                         <span className="text-4xl mb-4 grayscale">🍵</span>
                         <p className="text-[10px] font-black uppercase tracking-[0.3em]">Rest Interval</p>
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
