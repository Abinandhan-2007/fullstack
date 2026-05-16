import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StudentMessMenu({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const meals = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];
  const currentDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/student/mess-menu');
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load mess menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getMenuItem = (day, meal) => {
    return data.find(m => m.dayOfWeek === day && m.mealType === meal.toUpperCase());
  };

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-48 bg-slate-200 dark:bg-gray-800 rounded-lg"></div>
      <div className="h-[500px] bg-slate-200 dark:bg-gray-800 rounded-2xl"></div>
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Mess Menu</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Weekly dining schedule and menu items</p>
        </div>
        <div className="px-4 py-2 bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest">Mess Hall Open</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2rem] shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-gray-800/50">
              <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400 border-r border-slate-100 dark:border-gray-800 w-32">Day</th>
              {meals.map(meal => (
                <th key={meal} className="p-4 text-center">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{meal}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
            {days.map(day => (
              <tr key={day} className={`group transition-colors ${currentDay === day ? 'bg-emerald-50/20 dark:bg-emerald-900/10' : ''}`}>
                <td className={`p-6 border-r border-slate-100 dark:border-gray-800 text-center ${currentDay === day ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20' : 'bg-slate-50/50 dark:bg-gray-800/30 text-slate-500 dark:text-gray-400'}`}>
                  <span className="text-xs font-black uppercase tracking-widest">{day.slice(0, 3)}</span>
                  {currentDay === day && <span className="block text-[8px] font-black uppercase mt-1 tracking-tighter">Today</span>}
                </td>
                {meals.map(meal => {
                  const item = getMenuItem(day, meal);
                  return (
                    <td key={meal} className="p-4 h-24">
                      <div className={`h-full p-4 rounded-2xl border transition-all ${
                        currentDay === day 
                        ? 'bg-white dark:bg-gray-800 border-emerald-100 dark:border-emerald-800 shadow-sm' 
                        : 'bg-slate-50 dark:bg-gray-800/50 border-transparent'
                      }`}>
                        <p className="text-xs font-black text-slate-800 dark:text-white leading-tight uppercase tracking-tight line-clamp-2">
                          {item?.menuItems || '-'}
                        </p>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
           <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🥣</span>
              <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-tight text-sm">Breakfast</h4>
           </div>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Timings</p>
           <p className="text-sm font-black text-slate-700 dark:text-gray-300">07:30 AM - 09:00 AM</p>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
           <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🍛</span>
              <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-tight text-sm">Lunch</h4>
           </div>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Timings</p>
           <p className="text-sm font-black text-slate-700 dark:text-gray-300">12:30 PM - 02:00 PM</p>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
           <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">☕</span>
              <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-tight text-sm">Tea & Snacks</h4>
           </div>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Timings</p>
           <p className="text-sm font-black text-slate-700 dark:text-gray-300">04:30 PM - 05:30 PM</p>
        </div>
      </div>
    </div>
  );
}
