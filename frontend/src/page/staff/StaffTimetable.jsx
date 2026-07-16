import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StaffTimetable({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = [1, 2, 3, 4, 5, 6, 7];
  const currentDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/staff/timetable');
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load timetable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getSlot = (day, period) => {
    return data.find(s => s.dayOfWeek === day && s.period === period);
  };

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-48 bg-slate-200 dark:bg-gray-800 rounded-lg"></div>
      <div className="h-[600px] bg-slate-200 dark:bg-gray-800 rounded-[2.5rem]"></div>
    </div>
  );

  if (error) return (
    <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-6 text-center">
      <p className="text-rose-600 dark:text-rose-400 font-medium">{error}</p>
      <button onClick={fetchData} className="mt-3 px-4 py-2 bg-rose-600 text-white rounded-lg font-bold">Retry</button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Faculty Timetable</h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm">Your weekly teaching schedule and lecture hours</p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-xl overflow-hidden overflow-x-auto">
        <table className="w-full border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-gray-800/50 border-b border-slate-100 dark:border-gray-800">
              <th className="p-8 text-xs font-black uppercase tracking-widest text-slate-400 border-r border-slate-100 dark:border-gray-800 w-40">Working Day</th>
              {periods.map(p => (
                <th key={p} className="p-4 text-center">
                  <span className="block text-xs font-black text-slate-400 uppercase tracking-widest">Period {p}</span>
                  <span className="text-[10px] text-slate-300 font-bold uppercase mt-1 block">Lecture hr</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
            {days.map(day => (
              <tr key={day} className={`group transition-colors ${currentDay === day ? 'bg-emerald-50/20 dark:bg-emerald-900/10' : ''}`}>
                <td className={`p-8 border-r border-slate-100 dark:border-gray-800 text-center ${currentDay === day ? 'bg-emerald-600 text-white shadow-2xl' : 'bg-slate-50/50 dark:bg-gray-800/30 text-slate-500'}`}>
                  <span className="text-sm font-black uppercase tracking-widest">{day}</span>
                  {currentDay === day && <span className="block text-[10px] font-black uppercase mt-1 tracking-tighter opacity-80">Teaching Now</span>}
                </td>
                {periods.map(p => {
                  const slot = getSlot(day, p);
                  return (
                    <td key={p} className="p-3 h-28 min-w-[150px] relative">
                      {slot ? (
                        <div className={`h-full p-4 rounded-2xl border flex flex-col justify-center transition-all shadow-sm ${
                          currentDay === day 
                          ? 'bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-800 shadow-emerald-500/5' 
                          : 'bg-slate-50 dark:bg-gray-800/50 border-transparent'
                        }`}>
                          <p className="text-xs font-black text-slate-800 dark:text-white leading-tight uppercase tracking-tight line-clamp-2">{slot.course?.name}</p>
                          <div className="mt-3 flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">{slot.roomNumber}</span>
                             </div>
                             <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded">Core</span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full rounded-2xl border border-dashed border-slate-100 dark:border-gray-800 flex items-center justify-center">
                          <span className="text-[10px] font-black text-slate-200 dark:text-gray-800 uppercase tracking-widest">Free Slot</span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
         <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl flex items-center justify-center text-xl">📚</div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weekly Load</p>
               <p className="text-lg font-black text-slate-800 dark:text-white">{data.length} Hours</p>
            </div>
         </div>
         <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center text-xl">🏫</div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unique Courses</p>
               <p className="text-lg font-black text-slate-800 dark:text-white">3 Subjects</p>
            </div>
         </div>
         <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl flex items-center justify-center text-xl">👨‍🏫</div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lab Sessions</p>
               <p className="text-lg font-black text-slate-800 dark:text-white">2 Slots</p>
            </div>
         </div>
      </div>
    </div>
  );
}
