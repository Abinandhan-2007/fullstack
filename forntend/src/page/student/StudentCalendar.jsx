import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StudentCalendar({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/student/events');
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

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Padding for first week
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`pad-${i}`} className="h-24 md:h-32 border-r border-b border-slate-100 dark:border-gray-800 bg-slate-50/30 dark:bg-gray-800/20"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = data.filter(e => e.date === dateStr);
      const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();

      days.push(
        <div key={d} className={`h-24 md:h-32 border-r border-b border-slate-100 dark:border-gray-800 p-2 relative group hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors ${isToday ? 'bg-purple-50/50 dark:bg-purple-900/10' : ''}`}>
          <span className={`text-sm font-black ${isToday ? 'bg-purple-600 text-white w-7 h-7 rounded-full flex items-center justify-center' : 'text-slate-400 dark:text-gray-500'}`}>
            {d}
          </span>
          <div className="mt-1 space-y-1 overflow-y-auto h-[calc(100%-1.5rem)] custom-scrollbar">
            {dayEvents.map((ev, idx) => (
              <div key={idx} className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 border-l-2 border-purple-500 rounded text-[9px] font-black text-purple-700 dark:text-purple-400 truncate uppercase tracking-tighter cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-900/50">
                {ev.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Events & Calendar</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Track academic holidays and campus events</p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-gray-900 p-2 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-xl transition-colors">◀</button>
          <span className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white min-w-[150px] text-center">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-xl transition-colors">▶</button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-xl overflow-hidden">
        <div className="grid grid-cols-7 border-b border-slate-100 dark:border-gray-800">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="p-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500 border-r border-slate-100 dark:border-gray-800 last:border-0">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 border-l border-t border-transparent">
          {renderCalendar()}
        </div>
      </div>

      <div className="flex flex-wrap gap-6 mt-8">
         <div className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-md bg-purple-600"></span>
            <span className="text-xs font-bold text-slate-500">Institution Events</span>
         </div>
         <div className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-md bg-emerald-500"></span>
            <span className="text-xs font-bold text-slate-500">Academic Deadlines</span>
         </div>
         <div className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-md bg-rose-500"></span>
            <span className="text-xs font-bold text-slate-500">Holidays</span>
         </div>
      </div>
    </div>
  );
}
