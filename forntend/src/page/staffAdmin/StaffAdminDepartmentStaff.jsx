import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StaffAdminDepartmentStaff({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/staff-admin/staff');
      setData(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic">Faculty Human Resource Directory</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Comprehensive registry of departmental academic and research staff</p>
        </div>
        <button className="px-6 py-3 bg-sky-600 text-white rounded-xl font-bold shadow-xl flex items-center gap-2">
           <span>👨‍🏫</span> Onboard Faculty
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((staff, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col relative overflow-hidden group hover:border-sky-500 transition-all">
             <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-bl-[3rem] group-hover:scale-110 transition-transform"></div>
             
             <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                   <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 text-sky-600 rounded-2xl flex items-center justify-center text-3xl shadow-inner font-black italic">
                      {staff.name?.charAt(0)}
                   </div>
                   <span className="px-3 py-1 bg-sky-50 dark:bg-sky-900/20 text-sky-600 text-[8px] font-black uppercase rounded-lg border border-sky-100 dark:border-sky-800">FACULTY</span>
                </div>
                
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight mb-1 group-hover:text-sky-600 transition-colors">{staff.name}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{staff.designation || 'Asst. Professor'}</p>
                
                <div className="mt-8 space-y-4 flex-1">
                   <div>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Staff Identifier</p>
                      <p className="text-xs font-bold text-slate-600 dark:text-gray-400 italic">{staff.staffId || `STF-${idx+101}`}</p>
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Expertise Domain</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                         <span className="px-2 py-0.5 bg-slate-50 dark:bg-gray-800 text-[8px] font-bold text-slate-500 rounded border border-slate-100 dark:border-gray-700">Algorithms</span>
                         <span className="px-2 py-0.5 bg-slate-50 dark:bg-gray-800 text-[8px] font-bold text-slate-500 rounded border border-slate-100 dark:border-gray-700">AI</span>
                      </div>
                   </div>
                </div>

                <div className="mt-10 flex gap-2 pt-6 border-t border-slate-50 dark:border-gray-800">
                   <button className="flex-1 py-3 bg-slate-900 dark:bg-sky-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl">Performance</button>
                   <button className="px-4 py-3 bg-slate-100 dark:bg-gray-800 text-slate-400 rounded-xl hover:text-sky-600 transition-all">⚙️</button>
                </div>
             </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-gray-800/30 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-gray-800">
             <p className="text-slate-400 italic font-medium uppercase tracking-widest">No faculty records found for this department.</p>
          </div>
        )}
      </div>
    </div>
  );
}
