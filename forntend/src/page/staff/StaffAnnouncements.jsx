import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StaffAnnouncements({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/staff/announcements');
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
        {[1,2,3].map(i => <div key={i} className="h-40 bg-slate-200 dark:bg-gray-800 rounded-[2rem]"></div>)}
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-6 text-center text-rose-600 font-bold font-bold">
      {error}
      <button onClick={fetchData} className="block mx-auto mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg">Retry</button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Staff Notice Board</h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm">Official circulars, meeting invites, and department updates</p>
      </div>

      <div className="space-y-4">
        {data.map((ann, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2rem] p-8 shadow-sm hover:shadow-lg transition-all border-l-8 border-l-emerald-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                  ann.priority === 'HIGH' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {ann.priority || 'NORMAL'} Priority
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{ann.sentAt}</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-slate-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-xs">🎓</div>
                 <span className="text-xs font-bold text-slate-600 dark:text-gray-400 uppercase tracking-tight">{ann.sentBy || 'Registrar Office'}</span>
              </div>
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-4">
              {ann.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
              {ann.message}
            </p>
            <div className="mt-8 flex justify-between items-center">
              <div className="flex gap-2">
                 <span className="px-3 py-1 bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-lg text-[9px] font-black text-slate-500 uppercase">Circular</span>
                 <span className="px-3 py-1 bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-lg text-[9px] font-black text-slate-500 uppercase">Academic</span>
              </div>
              <button className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest hover:underline">
                Read Full Document →
              </button>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="py-20 text-center bg-slate-50 dark:bg-gray-800/30 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-gray-800">
             <span className="text-4xl block mb-4">📭</span>
             <p className="text-slate-400 italic font-medium">No active circulars at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
