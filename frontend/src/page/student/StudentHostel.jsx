import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StudentHostel({ apiUrl, token, user, linkedId }) {
  const { isDark } = useTheme();
  const [hostel, setHostel] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!linkedId) return;
    setLoading(true);
    try {
      const [hRes, cRes] = await Promise.all([
        api.get(`/api/hostel/student/${linkedId}`),
        api.get(`/api/hostel/complaints/student/${linkedId}`)
      ]);
      setHostel(hRes.data);
      setComplaints(cRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden group col-span-1 lg:col-span-1 flex flex-col justify-between min-h-[400px]">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 mb-6 italic">Residential Hub</h3>
               <div className="flex items-center gap-6 mb-10">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[2rem] flex items-center justify-center text-4xl border border-white/30 shadow-xl">🏨</div>
                  <div>
                     <p className="text-4xl font-black italic tracking-tighter">{hostel?.roomNumber || 'RM-402'}</p>
                     <p className="text-xs font-bold text-indigo-100 uppercase tracking-widest mt-1">{hostel?.blockName || 'Institutional Block C'}</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between text-xs font-black uppercase tracking-tight italic text-indigo-100 border-b border-white/10 pb-3"><span>Room Category</span><span>Premium Quad</span></div>
                  <div className="flex justify-between text-xs font-black uppercase tracking-tight italic text-indigo-100 border-b border-white/10 pb-3"><span>Resident Status</span><span>Active</span></div>
               </div>
            </div>
            <button className="relative z-10 w-full py-4 bg-white text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-50 transition-colors shadow-lg mt-10">Download Hostel Pass</button>
         </div>

         <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[3rem] p-10 shadow-sm col-span-1 lg:col-span-2 flex flex-col">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic underline decoration-indigo-500 underline-offset-8">Weekly Nutritional Matrix</h3>
               <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-lg border border-emerald-100 dark:border-emerald-800/30">VEG & NON-VEG MIX</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
               {['Monday', 'Tuesday', 'Wednesday', 'Thursday'].map(d => (
                 <div key={d} className="bg-slate-50 dark:bg-gray-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-gray-700/50 group hover:border-indigo-500 transition-all">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">{d}</p>
                    <div className="space-y-3">
                       <p className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-tight italic">🥣 Morning: Continental</p>
                       <p className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-tight italic">🍛 Afternoon: Regional</p>
                       <p className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-tight italic">🥘 Evening: Fusion</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[3rem] p-10 shadow-sm">
         <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic underline decoration-indigo-500 underline-offset-8">Grievance Redressal Audit</h3>
            <button className="px-8 py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl">Lodge New Ticket</button>
         </div>
         <div className="space-y-4">
            {complaints.map((c, idx) => (
              <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-slate-50 dark:bg-gray-800/50 rounded-3xl border border-slate-100 dark:border-gray-700 group hover:border-indigo-500 transition-all">
                 <div className="flex items-center gap-8">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner border ${
                      c.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                       {c.status === 'RESOLVED' ? '✅' : '⏳'}
                    </div>
                    <div>
                       <h4 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-tight italic leading-tight">{c.description || 'Infrastructure Issue'}</h4>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Ticket ID: #TK-00{idx+1} • {new Date().toLocaleDateString()}</p>
                    </div>
                 </div>
                 <div className="mt-6 md:mt-0">
                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                      c.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                       {c.status || 'IN ANALYSIS'}
                    </span>
                 </div>
              </div>
            ))}
            {complaints.length === 0 && (
              <div className="py-20 text-center opacity-30 italic font-black uppercase tracking-[0.3em]">No active grievances found in the registry.</div>
            )}
         </div>
      </div>
    </div>
  );
}
