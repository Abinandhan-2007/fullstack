import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function HostelMaintenance({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/hostel/maintenance');
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load maintenance tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/api/hostel/maintenance/${id}/status`, { status });
      fetchData();
    } catch (err) {
      alert('Update failed');
    }
  };

  const filteredTickets = filterStatus === 'ALL' 
    ? data 
    : data.filter(t => t.status === filterStatus);

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Maintenance Support Desk</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Track and resolve infrastructure issues across all hostel wings</p>
        </div>
        <div className="flex gap-2">
           {['ALL', 'PENDING', 'IN_PROGRESS', 'RESOLVED'].map(s => (
             <button 
               key={s}
               onClick={() => setFilterStatus(s)}
               className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                 filterStatus === s 
                 ? 'bg-indigo-600 border-indigo-600 text-white' 
                 : 'bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-800 text-slate-400'
               }`}
             >
               {s.replace('_', ' ')}
             </button>
           ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
         <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 dark:bg-gray-800/50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Ticket ID</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Room / Student</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Description</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {filteredTickets.map((t, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
                       <td className="p-6 text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{t.id}</td>
                       <td className="p-6">
                          <p className="text-sm font-black text-indigo-600">{t.roomNumber}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{t.student?.name || 'Academic Resident'}</p>
                       </td>
                       <td className="p-6 max-w-xs">
                          <p className="text-xs font-black text-slate-700 dark:text-gray-300 uppercase tracking-tighter mb-1">{t.category}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">{t.description}</p>
                       </td>
                       <td className="p-6 text-center">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            t.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                            t.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                            'bg-rose-50 text-rose-600 border-rose-100'
                          }`}>
                             {t.status}
                          </span>
                       </td>
                       <td className="p-6">
                          <div className="flex justify-center gap-2">
                             <button onClick={() => handleUpdateStatus(t.id, 'IN_PROGRESS')} className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-all">🏗️</button>
                             <button onClick={() => handleUpdateStatus(t.id, 'RESOLVED')} className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-all">✅</button>
                          </div>
                       </td>
                    </tr>
                  ))}
                  {filteredTickets.length === 0 && (
                    <tr><td colSpan="5" className="p-20 text-center text-slate-300 italic font-medium">No maintenance tickets matching the current filter.</td></tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
