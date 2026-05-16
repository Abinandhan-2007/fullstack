import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function PlacementCompanies({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/placement/companies');
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
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic">Corporate Relations Registry</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Institutional ecosystem of partner organizations and recruitment entities</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-xl flex items-center gap-2">
           <span>🏢</span> Onboard Corporate Partner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((company, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col relative overflow-hidden group hover:border-emerald-500 transition-all">
             <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-[3rem] group-hover:scale-110 transition-transform"></div>
             
             <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                   <div className="w-14 h-14 bg-slate-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-3xl shadow-inner italic font-black text-emerald-600">
                      {company.name?.charAt(0)}
                   </div>
                   <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-[8px] font-black uppercase rounded-lg border border-emerald-100 dark:border-emerald-800">Verified</span>
                </div>
                
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight mb-1 group-hover:text-emerald-600 transition-colors">{company.name}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{company.industry || 'Technology'}</p>
                
                <div className="mt-8 space-y-4 flex-1">
                   <div>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Point of Contact</p>
                      <p className="text-xs font-bold text-slate-600 dark:text-gray-400 italic">{company.pocName || 'HR Manager'}</p>
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Contact Email</p>
                      <p className="text-xs font-bold text-slate-600 dark:text-gray-400 italic underline decoration-slate-200">{company.pocEmail || 'hiring@org.com'}</p>
                   </div>
                </div>

                <div className="mt-10 flex gap-2 pt-6 border-t border-slate-50 dark:border-gray-800">
                   <button className="flex-1 py-3 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/10">Drive History</button>
                   <button className="px-4 py-3 bg-slate-100 dark:bg-gray-800 text-slate-400 rounded-xl hover:text-emerald-600 transition-all">⚙️</button>
                </div>
             </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-gray-800/30 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-gray-800">
             <p className="text-slate-400 italic font-medium uppercase tracking-widest">No corporate partnerships registered.</p>
          </div>
        )}
      </div>
    </div>
  );
}
