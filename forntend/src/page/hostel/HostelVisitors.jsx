import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function HostelVisitors({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ visitorName: '', studentRegNo: '', purpose: '', phone: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/hostel/visitors');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCheckOut = async (id) => {
    try {
      await api.patch(`/api/hostel/visitors/${id}/checkout`);
      fetchData();
    } catch (err) {
      alert('Checkout failed');
    }
  };

  const activeVisitors = data.filter(v => v.status === 'CHECKED_IN');
  const history = data.filter(v => v.status === 'CHECKED_OUT');

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Security & Visitor Registry</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Monitor campus access and non-resident entry logs</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-xl flex items-center gap-2">
           <span>👤</span> New Visitor Entry
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Active Visitors */}
         <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm flex flex-col h-[500px]">
            <div className="p-8 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center">
               <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Currently On-Campus</h3>
               <span className="text-[10px] font-black text-emerald-500 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800 uppercase tracking-widest">{activeVisitors.length} Active</span>
            </div>
            <div className="p-8 space-y-4 overflow-y-auto custom-scrollbar flex-1">
               {activeVisitors.map((v, idx) => (
                 <div key={idx} className="p-6 bg-slate-50 dark:bg-gray-800/50 rounded-3xl border border-slate-100 dark:border-gray-700 flex justify-between items-center group">
                    <div>
                       <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{v.visitorName}</h4>
                       <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 italic">Visiting: {v.student?.name || 'Resident'}</p>
                       <p className="text-[10px] font-black text-indigo-500 uppercase mt-2 tracking-widest">{v.purpose || 'General'}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-black text-slate-400 mb-3">{v.checkInTime}</p>
                       <button onClick={() => handleCheckOut(v.id)} className="px-4 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-rose-600 hover:text-white transition-all">Check Out</button>
                    </div>
                 </div>
               ))}
               {activeVisitors.length === 0 && (
                 <p className="text-center text-slate-300 italic py-20 font-medium">No active visitors at the moment.</p>
               )}
            </div>
         </div>

         {/* Historical Log */}
         <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm flex flex-col h-[500px]">
            <div className="p-8 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center">
               <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Daily Access Log</h3>
               <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:underline">Full History →</button>
            </div>
            <div className="overflow-x-auto flex-1">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50 dark:bg-gray-800/50">
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Visitor</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Resident</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Duration</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-gray-800">
                     {history.slice(0, 6).map((v, idx) => (
                       <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
                          <td className="p-6 text-sm font-bold text-slate-700 dark:text-gray-300">{v.visitorName}</td>
                          <td className="p-6 text-xs font-black text-slate-400 uppercase tracking-tight">{v.student?.regNo || '---'}</td>
                          <td className="p-6 text-center text-xs font-bold text-slate-400 italic">Completed</td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  );
}
