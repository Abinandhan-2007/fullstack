import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function FinanceVendorPayments({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settling, setSettling] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/finance/vendors');
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load vendor payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSettle = async (id) => {
    if (!window.confirm('Mark this invoice as settled?')) return;
    setSettling(id);
    try {
      await api.post(`/api/finance/vendors/${id}/settle`);
      alert('Payment settled successfully!');
      fetchData();
    } catch (err) {
      alert('Settlement failed');
    } finally {
      setSettling(null);
    }
  };

  if (loading) return (
    <div className="space-y-6 animate-pulse">
       <div className="h-10 w-48 bg-slate-200 dark:bg-gray-800 rounded-xl"></div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-200 dark:bg-gray-800 rounded-[2.5rem]"></div>)}
       </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Vendor & Supply Management</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Manage external supplier invoices and payment settlements</p>
        </div>
        <button className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-xl flex items-center gap-2">
           <span>🤝</span> Onboard New Vendor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((v, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-[3rem] group-hover:scale-110 transition-transform"></div>
             
             <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                   <div className="w-12 h-12 bg-slate-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-2xl shadow-inner italic font-black text-amber-600">
                      {v.vendorName?.charAt(0)}
                   </div>
                   <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                     v.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                   }`}>
                      {v.status || 'OUTSTANDING'}
                   </span>
                </div>
                
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">{v.vendorName || 'General Supplier'}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">{v.category || 'Maintenance'}</p>
                
                <div className="mt-8 mb-8">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Invoice Amount</p>
                   <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">₹{(v.amount || 15000).toLocaleString()}</p>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-50 dark:border-gray-800 flex flex-col gap-3">
                   <button 
                     onClick={() => handleSettle(v.id)}
                     disabled={settling === v.id || v.status === 'PAID'}
                     className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                       v.status === 'PAID' 
                       ? 'bg-slate-50 dark:bg-gray-800 text-slate-300 border border-slate-100 dark:border-gray-700 cursor-not-allowed' 
                       : 'bg-slate-900 dark:bg-amber-600 text-white shadow-xl hover:scale-105 active:scale-95'
                     }`}
                   >
                      {settling === v.id ? 'Processing...' : v.status === 'PAID' ? 'Payment Settled' : 'Confirm Settlement'}
                   </button>
                </div>
             </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-gray-800/30 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-gray-800">
             <p className="text-slate-400 italic font-medium">No active vendor invoices found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
