import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StudentAnnouncements({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/student/announcements');
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load announcements');
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
      <div className="space-y-4">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-gray-800 rounded-2xl"></div>)}
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-6 text-center">
      <p className="text-rose-600 dark:text-rose-400 font-medium">{error}</p>
      <button onClick={fetchData} className="mt-3 px-4 py-2 bg-rose-600 text-white rounded-lg font-bold">Retry</button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Notice Board</h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm">Official announcements and updates from the institution</p>
      </div>

      <div className="space-y-4">
        {data.map((ann, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  ann.priority === 'HIGH' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600' :
                  ann.priority === 'MEDIUM' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
                  'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                }`}>
                  {ann.priority} Priority
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{ann.sentAt}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-slate-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-[10px] text-slate-500">👤</div>
                <span className="text-xs font-bold text-slate-600 dark:text-gray-400">{ann.sentBy || 'Administration'}</span>
              </div>
            </div>
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2">
              {ann.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
              {ann.message}
            </p>
            <div className="mt-6 flex justify-end">
              <button className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest hover:underline">
                View Full Details →
              </button>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="py-20 text-center bg-slate-50 dark:bg-gray-800/30 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-gray-800">
             <span className="text-4xl block mb-4">📭</span>
             <p className="text-slate-400 italic font-medium">No active announcements at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
