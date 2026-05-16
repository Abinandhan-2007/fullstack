import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import Chart from 'chart.js/auto';
import { useTheme } from '../../context/ThemeContext';

export default function FinanceFeeCollection({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const trendChartRef = useRef(null);
  const trendChartInstance = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mocked fee collection data
      setData({
        metrics: {
          today: '₹12,45,000',
          totalThisMonth: '₹1.8 Cr',
          pending: '₹84.2 L',
          successRate: '99.2%'
        },
        dailyTrend: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          data: [12, 18, 15, 24, 20, 12] // Lakhs
        },
        transactions: [
          { id: 'FEE-9021', student: 'Abinandhan', regNo: '7376211CS101', amount: 45000, method: 'ONLINE', status: 'SUCCESS', date: '10:45 AM' },
          { id: 'FEE-9022', student: 'Rajesh K', regNo: '7376211CS145', amount: 45000, method: 'CHALLAN', status: 'PENDING', date: '11:15 AM' },
          { id: 'FEE-9023', student: 'Priya S', regNo: '7376211IT202', amount: 12000, method: 'ONLINE', status: 'SUCCESS', date: '12:30 PM' }
        ]
      });
    } catch (err) {
      setError(err.message || 'Failed to load collection data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!data || !trendChartRef.current) return;
    if (trendChartInstance.current) trendChartInstance.current.destroy();
    
    trendChartInstance.current = new Chart(trendChartRef.current, {
      type: 'line',
      data: {
        labels: data.dailyTrend.labels,
        datasets: [{
          label: 'Daily Collection (Lakhs)',
          data: data.dailyTrend.data,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 6,
          pointBackgroundColor: '#f59e0b'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: isDark ? '#1f2937' : '#f1f5f9' }, ticks: { color: '#94a3b8' } },
          x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
        }
      }
    });

    return () => { if (trendChartInstance.current) trendChartInstance.current.destroy(); };
  }, [data, isDark]);

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-24 bg-slate-200 dark:bg-gray-800 rounded-2xl"></div>)}
      </div>
      <div className="h-80 bg-slate-200 dark:bg-gray-800 rounded-3xl"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Real-time Fee Collection</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Monitoring daily revenue streams and payment verifications</p>
        </div>
        <div className="flex gap-3">
           <button className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2">
              <span>🧾</span> Reconcile Payments
           </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Today\'s Collection', value: data.metrics.today, color: 'text-amber-600', icon: '⚡' },
          { label: 'MTD Revenue', value: data.metrics.totalThisMonth, color: 'text-emerald-600', icon: '📈' },
          { label: 'Pending Dues', value: data.metrics.pending, color: 'text-rose-600', icon: '⏳' },
          { label: 'Success Rate', value: data.metrics.successRate, color: 'text-blue-600', icon: '🎯' }
        ].map((m, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
             <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</span>
                <span className="text-lg">{m.icon}</span>
             </div>
             <p className={`text-xl font-black ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Trend Chart */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm h-96 flex flex-col">
         <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-8 italic">7-Day Collection Trend</h3>
         <div className="relative flex-1"><canvas ref={trendChartRef}></canvas></div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Today's Transactions</h3>
            <div className="flex gap-2">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live Update
               </span>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 dark:bg-gray-800/50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction ID</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Info</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Method</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Amount</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {data.transactions.map((t, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
                       <td className="p-6">
                          <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{t.id}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{t.date}</p>
                       </td>
                       <td className="p-6">
                          <p className="text-sm font-bold text-slate-800 dark:text-gray-200">{t.student}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.regNo}</p>
                       </td>
                       <td className="p-6">
                          <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 px-2 py-1 rounded-lg">
                             {t.method}
                          </span>
                       </td>
                       <td className="p-6 text-center">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            t.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                             {t.status}
                          </span>
                       </td>
                       <td className="p-6 text-right font-black text-slate-800 dark:text-white">
                          ₹{t.amount.toLocaleString()}
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
