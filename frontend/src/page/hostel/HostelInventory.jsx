import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function HostelInventory({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/hostel/assets');
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load asset inventory');
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
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Hostel Asset Registry</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Inventory tracking for furniture, electricals, and maintenance supplies</p>
        </div>
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-xl flex items-center gap-2">
           <span>📦</span> Register New Asset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((item, idx) => (
          <div key={idx} className={`bg-white dark:bg-gray-900 border ${item.quantity < 10 ? 'border-rose-200 dark:border-rose-900/50' : 'border-slate-200 dark:border-gray-800'} rounded-[2rem] p-8 shadow-sm flex flex-col relative overflow-hidden group transition-all hover:scale-105`}>
             <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-bl-[2.5rem]"></div>
             
             <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                   <div className="w-12 h-12 bg-slate-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                      {item.category === 'Electrical' ? '⚡' : item.category === 'Furniture' ? '🪑' : '🛠️'}
                   </div>
                   {item.quantity < 10 && (
                     <span className="px-2 py-1 bg-rose-100 text-rose-600 text-[8px] font-black uppercase rounded animate-pulse">Low Stock</span>
                   )}
                </div>
                
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">{item.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.category}</p>
                
                <div className="mt-8 mb-8 flex items-baseline gap-2">
                   <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{item.quantity}</p>
                   <p className="text-xs font-bold text-slate-400 uppercase">In-Stock</p>
                </div>

                <div className="mt-auto flex gap-2">
                   <button className="flex-1 py-3 bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 hover:text-white transition-all">Audit</button>
                   <button className="px-3 py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl">✏️</button>
                </div>
             </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-gray-800/30 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-gray-800">
             <p className="text-slate-400 italic font-medium">No asset records found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
