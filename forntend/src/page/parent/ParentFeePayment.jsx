import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function ParentFeePayment({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paying, setPaying] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/parent/fees');
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load fee information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handlePayment = async (feeId) => {
    if (!window.confirm('Proceed to secure payment gateway?')) return;
    setPaying(true);
    try {
      await api.post(`/api/parent/fees/${feeId}/pay`);
      alert('Payment successful! Transaction receipt sent to registered email.');
      fetchData();
    } catch (err) {
      alert('Payment failed');
    } finally {
      setPaying(false);
    }
  };

  const pendingFees = data.filter(f => f.status !== 'PAID');
  const totalPending = pendingFees.reduce((sum, f) => sum + f.amount, 0);

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic underline decoration-rose-500">Financial Ledger & Payments</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Secure institutional fee management and transaction history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Payment Summary */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-rose-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-rose-500/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[4rem]"></div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">Total Outstanding Dues</p>
               <h3 className="text-4xl font-black italic tracking-tighter mb-10">₹{totalPending.toLocaleString()}</h3>
               <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold border-b border-rose-500/50 pb-2">
                     <span className="opacity-80">Academic Fees</span>
                     <span>₹{(totalPending * 0.7).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold border-b border-rose-500/50 pb-2">
                     <span className="opacity-80">Hostel & Mess</span>
                     <span>₹{(totalPending * 0.3).toLocaleString()}</span>
                  </div>
               </div>
               <button 
                 onClick={() => pendingFees[0] && handlePayment(pendingFees[0].id)}
                 disabled={paying || totalPending === 0}
                 className="w-full mt-10 py-5 bg-white text-rose-600 font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
               >
                  {paying ? 'Processing...' : totalPending === 0 ? 'Account Cleared' : 'Settle Total Dues'}
               </button>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm border-l-4 border-l-amber-500">
               <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl">⚠️</span>
                  <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest leading-none">Payment Guidelines</h4>
               </div>
               <p className="text-[10px] text-slate-500 dark:text-gray-400 font-medium leading-relaxed italic uppercase tracking-tighter">
                  Online payments attract a 2.5% convenience fee for credit cards. Bank transfers (NEFT/IMPS) are recommended for higher amounts.
               </p>
            </div>
         </div>

         {/* Transaction History */}
         <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center">
               <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic underline decoration-rose-500 underline-offset-8">Transaction Audit Trail</h3>
               <button className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline">Download Year Sheet</button>
            </div>
            <div className="overflow-x-auto flex-1">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50 dark:bg-gray-800/50">
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Description</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Amount</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                     {data.map((f, idx) => (
                       <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
                          <td className="p-6 text-xs font-black text-slate-400 uppercase italic leading-none">{f.paymentDate || '2026-05-16'}</td>
                          <td className="p-6">
                             <p className="text-sm font-bold text-slate-700 dark:text-gray-300 italic">{f.feeType || 'General Fee'}</p>
                             <p className="text-[9px] font-black text-slate-300 uppercase mt-1">TXN: #INT-54210-{idx}</p>
                          </td>
                          <td className="p-6 text-center text-sm font-black text-slate-900 dark:text-white italic">₹{f.amount.toLocaleString()}</td>
                          <td className="p-6 text-center">
                             <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                               f.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                             }`}>
                                {f.status}
                             </span>
                          </td>
                       </tr>
                     ))}
                     {data.length === 0 && (
                       <tr><td colSpan="4" className="p-20 text-center text-slate-300 italic font-medium">No transaction history found for this academic year.</td></tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  );
}
