import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function LibraryEContent({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/library/e-content');
      setData(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = data.filter(e => e.title?.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic">Digital Knowledge Repository</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Access institutional e-books, journals, and open-source research papers</p>
        </div>
        <button className="px-6 py-3 bg-violet-600 text-white rounded-xl font-bold shadow-xl flex items-center gap-2">
           <span>☁️</span> Upload Resource
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2rem] p-6 shadow-sm">
         <input 
            type="text"
            placeholder="Search digital titles or journals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-violet-500/10"
         />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col group hover:border-violet-500 transition-all">
             <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-violet-50 dark:bg-violet-900/20 text-violet-600 rounded-2xl flex items-center justify-center text-3xl shadow-inner italic font-black group-hover:scale-110 transition-transform">
                   {item.type === 'PDF' ? '📕' : item.type === 'VIDEO' ? '🎬' : '📄'}
                </div>
                <span className="px-2 py-1 bg-slate-50 dark:bg-gray-800 text-[8px] font-black uppercase text-slate-400 rounded-lg">{item.type || 'E-BOOK'}</span>
             </div>
             <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2 line-clamp-2 italic">{item.title}</h3>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.author || 'Institutional Resource'}</p>
             
             <div className="mt-8 flex gap-2">
                <button className="flex-1 py-3 bg-slate-900 dark:bg-violet-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">
                   <span>📥</span> Download
                </button>
                <button className="flex-1 py-3 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:text-violet-600">Preview</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
