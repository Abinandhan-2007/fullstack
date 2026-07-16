import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function HostelMess({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDay, setEditingDay] = useState(null);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/hostel/mess/menu');
      setMenu(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load mess menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMenu(); }, []);

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Institutional Mess & Dining</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Manage weekly nutrition plans and student feedback</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Weekly Nutrition Grid</h3>
            <button className="px-6 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl">Update Schedule</button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 dark:bg-gray-800/50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Day</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Breakfast</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Lunch</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Dinner</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {menu.map((day, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors group">
                       <td className="p-6 font-black text-slate-900 dark:text-white uppercase tracking-tight italic border-r border-slate-100 dark:border-gray-800">{day.day}</td>
                       <td className="p-6 text-xs text-slate-600 dark:text-gray-400 font-bold leading-relaxed">{day.breakfast}</td>
                       <td className="p-6 text-xs text-slate-600 dark:text-gray-400 font-bold leading-relaxed">{day.lunch}</td>
                       <td className="p-6 text-xs text-slate-600 dark:text-gray-400 font-bold leading-relaxed">{day.dinner}</td>
                    </tr>
                  ))}
                  {menu.length === 0 && (
                    <tr><td colSpan="4" className="p-20 text-center text-slate-300 italic font-medium">Weekly menu not yet uploaded.</td></tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-[2rem] p-8">
            <div className="flex items-center gap-4 mb-4">
               <span className="text-3xl">⭐</span>
               <h4 className="text-lg font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-tight">Recent Feedback</h4>
            </div>
            <div className="space-y-4">
               {[1,2].map(i => (
                 <div key={i} className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-indigo-100 dark:border-indigo-800/30">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[10px] font-black text-slate-400 uppercase">Anonymized Resident</span>
                       <span className="text-amber-500 text-xs">★★★★☆</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-gray-400 italic">"The lunch variety has improved this week. Keep it up!"</p>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 flex flex-col justify-center text-center">
            <h4 className="text-2xl font-black text-white uppercase tracking-tight mb-4 italic">Mess Inventory Status</h4>
            <p className="text-slate-400 text-sm mb-6">Provisions and grocery stocks for the current week are sufficient.</p>
            <div className="flex justify-center gap-3">
               <button className="px-6 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-indigo-500/20 transition-all hover:scale-105">Re-order Supplies</button>
            </div>
         </div>
      </div>
    </div>
  );
}
