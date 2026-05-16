import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function LibraryInventory({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/library/assets');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic">Library Asset Registry</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Monitor institutional infrastructure, from study carrels to digital systems</p>
        </div>
        <button className="px-6 py-3 bg-violet-600 text-white rounded-xl font-bold shadow-xl flex items-center gap-2">
           <span>➕</span> Onboard Asset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col relative overflow-hidden group hover:border-violet-500 transition-all">
             <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-bl-[3rem] group-hover:scale-110 transition-transform"></div>
             
             <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                   <div className="w-14 h-14 bg-slate-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-3xl shadow-inner italic font-black">
                      {item.category === 'Electronics' ? '💻' : item.category === 'Furniture' ? '🪑' : '📑'}
                   </div>
                   <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                     item.condition === 'GOOD' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                   }`}>
                      {item.condition || 'AUDIT PENDING'}
                   </span>
                </div>
                
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">{item.name || 'Library Asset'}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">{item.category}</p>
                
                <div className="mt-8 mb-10 flex items-baseline gap-2">
                   <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{item.quantity || 12}</p>
                   <p className="text-xs font-bold text-slate-400 uppercase">Units</p>
                </div>

                <div className="mt-auto flex gap-3">
                   <button className="flex-1 py-4 bg-slate-900 dark:bg-violet-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:opacity-90 transition-opacity">Full Audit</button>
                   <button className="px-4 py-4 bg-slate-100 dark:bg-gray-800 text-slate-400 rounded-2xl hover:text-violet-600 transition-all">⚙️</button>
                </div>
             </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-gray-800/30 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-gray-800">
             <p className="text-slate-400 italic font-medium">No infrastructure assets logged in the registry.</p>
          </div>
        )}
      </div>
    </div>
  );
}
