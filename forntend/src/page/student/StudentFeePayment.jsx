import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import Chart from 'chart.js/auto';
import { useTheme } from '../../context/ThemeContext';

export default function StudentFeePayment({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const donutChartRef = useRef(null);
  const donutChartInstance = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/student/fees');
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load fee information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalFees = data.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalPaid = data.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalPending = totalFees - totalPaid;

  useEffect(() => {
    if (!donutChartRef.current || !data.length) return;

    const ctx = donutChartRef.current.getContext('2d');
    if (donutChartInstance.current) donutChartInstance.current.destroy();

    donutChartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Paid', 'Pending'],
        datasets: [{
          data: [totalPaid, totalPending],
          backgroundColor: [
            'rgba(16, 185, 129, 0.8)', // Emerald
            'rgba(244, 63, 94, 0.8)'   // Rose
          ],
          borderWidth: 0,
          cutout: '75%'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: isDark ? '#94a3b8' : '#64748b', padding: 20 } }
        }
      }
    });

    return () => { if (donutChartInstance.current) donutChartInstance.current.destroy(); };
  }, [data, isDark, totalPaid, totalPending]);

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 bg-slate-200 dark:bg-gray-800 rounded-2xl"></div>
        <div className="h-64 bg-slate-200 dark:bg-gray-800 rounded-2xl"></div>
      </div>
      <div className="h-96 bg-slate-200 dark:bg-gray-800 rounded-2xl"></div>
    </div>
  );

  if (error) return (
    <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-6 text-center">
      <p className="text-rose-600 dark:text-rose-400 font-medium">{error}</p>
      <button onClick={fetchData} className="mt-3 px-4 py-2 bg-rose-600 text-white rounded-lg font-bold">Retry</button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Fee Management</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Monitor your academic fees and payment history</p>
        </div>
        <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2">
          <span>💳</span> Quick Pay Online
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Statistics Card */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Fee Summary</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Payable</p>
                <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">₹{totalFees.toLocaleString()}</p>
              </div>
              <div className="flex justify-between items-center py-3 border-y border-slate-50 dark:border-gray-800">
                <div>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Total Paid</p>
                  <p className="text-lg font-black text-emerald-600 mt-0.5">₹{totalPaid.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Total Pending</p>
                  <p className="text-lg font-black text-rose-600 mt-0.5">₹{totalPending.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-bold leading-relaxed">
              * Payments made via offline channels may take up to 48 hours to reflect in the portal.
            </p>
          </div>
        </div>

        {/* Chart Card */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col h-80">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Payment Distribution</h3>
          <div className="relative flex-1 w-full flex items-center justify-center">
            <div className="h-full w-full max-w-[300px]"><canvas ref={donutChartRef}></canvas></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-10">
               <span className="text-3xl font-black text-slate-800 dark:text-white">{Math.round((totalPaid/totalFees)*100)}%</span>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Paid</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Transaction History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-gray-800/50">
                <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-400">Receipt ID</th>
                <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-400">Description</th>
                <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-400">Date</th>
                <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Amount</th>
                <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
              {data.map((f, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="p-4 text-sm font-bold text-slate-900 dark:text-white">{f.receiptNumber || `R-2025-${idx+101}`}</td>
                  <td className="p-4 text-sm font-medium text-slate-600 dark:text-gray-300">{f.feeType || 'Tuition Fee'}</td>
                  <td className="p-4 text-sm font-medium text-slate-500">{f.paymentDate || 'Pending'}</td>
                  <td className="p-4 text-sm font-black text-right text-slate-900 dark:text-white">₹{f.paidAmount.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      f.status === 'PAID' 
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400'
                    }`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {f.status === 'PAID' ? (
                      <button className="text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest hover:underline flex items-center justify-center gap-1 mx-auto">
                        <span>🧾</span> Receipt
                      </button>
                    ) : (
                      <button className="text-purple-600 dark:text-purple-400 text-xs font-black uppercase tracking-widest hover:underline flex items-center justify-center gap-1 mx-auto">
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
