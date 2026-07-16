import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function PlacementOffers({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/placement/offers');
      setData(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleVerify = async (id) => {
    setVerifying(id);
    try {
      await api.patch(`/api/placement/offers/${id}/verify`);
      fetchData();
    } catch (err) { alert('Verification failed'); }
    finally { setVerifying(null); }
  };

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic">Offer Verification Desk</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Validate corporate offer letters and finalize institutional placement records</p>
        </div>
        <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-xl flex items-center gap-2">
           <span>➕</span> Log New Offer Letter
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
         <div className="p-8 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic underline decoration-emerald-500">Offer Ledger</h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Showing Last 10 Entries</span>
         </div>
         <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 dark:bg-gray-800/50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Student / Reg No</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Corporate Partner</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Package (CTC)</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {data.map((offer, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors group">
                       <td className="p-6">
                          <p className="text-sm font-black text-slate-800 dark:text-gray-200 uppercase tracking-tight">{offer.student?.name || 'Student Name'}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase italic mt-1">{offer.student?.regNo || '7376...'}</p>
                       </td>
                       <td className="p-6">
                          <p className="text-sm font-bold text-emerald-600 italic uppercase">{offer.company?.name || 'Partner Org'}</p>
                       </td>
                       <td className="p-6 text-center">
                          <span className="text-sm font-black text-slate-900 dark:text-white italic underline decoration-amber-200">{offer.ctc || '6.5'} LPA</span>
                       </td>
                       <td className="p-6 text-center">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            offer.verified ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse'
                          }`}>
                             {offer.verified ? 'VERIFIED' : 'PENDING'}
                          </span>
                       </td>
                       <td className="p-6 text-right">
                          <div className="flex justify-end gap-2">
                             {!offer.verified && (
                               <button onClick={() => handleVerify(offer.id)} disabled={verifying === offer.id} className="px-3 py-2 bg-emerald-600 text-white text-[9px] font-black uppercase rounded-lg shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all">
                                  {verifying === offer.id ? '...' : 'Verify'}
                               </button>
                             )}
                             <button className="p-2 bg-slate-100 dark:bg-gray-800 text-slate-400 rounded-lg hover:text-emerald-600 transition-all">📥</button>
                          </div>
                       </td>
                    </tr>
                  ))}
                  {data.length === 0 && (
                    <tr><td colSpan="5" className="p-20 text-center text-slate-300 italic font-medium">No offer letter records available for validation.</td></tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
