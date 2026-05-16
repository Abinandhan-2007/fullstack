import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import Chart from 'chart.js/auto';
import { useTheme } from '../../context/ThemeContext';

export default function FinanceDashboard({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mainChartRef = useRef(null);
  const mainChartInstance = useRef(null);
  const donutChartRef = useRef(null);
  const donutChartInstance = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mocked finance dashboard data
      setData({
        metrics: {
          totalRevenue: '₹4.2 Cr',
          outstandingFees: '₹85.4 L',
          monthlyPayroll: '₹1.2 Cr',
          otherExpenses: '₹24.5 L'
        },
        revenueTrends: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          revenue: [85, 92, 78, 120, 110, 145],
          expenses: [60, 65, 62, 70, 68, 72]
        },
        collectionBreakdown: {
          labels: ['Tuition', 'Hostel', 'Exam', 'Transport', 'Others'],
          data: [65, 20, 8, 4, 3]
        },
        recentTransactions: [
          { id: 'TXN-1024', type: 'Credit', amount: 45000, desc: 'Student Fee Payment', date: '2026-05-16' },
          { id: 'TXN-1025', type: 'Debit', amount: 12000, desc: 'Vendor Payment: Stationary', date: '2026-05-15' },
          { id: 'TXN-1026', type: 'Credit', amount: 8000, desc: 'Exam Fee Collection', date: '2026-05-14' }
        ]
      });
    } catch (err) {
      setError(err.message || 'Failed to load finance dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!data) return;

    // Revenue vs Expenses Line Chart
    if (mainChartRef.current) {
      if (mainChartInstance.current) mainChartInstance.current.destroy();
      mainChartInstance.current = new Chart(mainChartRef.current, {
        type: 'line',
        data: {
          labels: data.revenueTrends.labels,
          datasets: [
            {
              label: 'Revenue (Lakhs)',
              data: data.revenueTrends.revenue,
              borderColor: '#f59e0b',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              fill: true,
              tension: 0.4
            },
            {
              label: 'Expenses (Lakhs)',
              data: data.revenueTrends.expenses,
              borderColor: isDark ? '#4b5563' : '#94a3b8',
              backgroundColor: 'transparent',
              borderDash: [5, 5],
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top', labels: { color: '#94a3b8', font: { weight: 'bold' } } } },
          scales: {
            y: { grid: { color: isDark ? '#1f2937' : '#f1f5f9' }, ticks: { color: '#94a3b8' } },
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
          }
        }
      });
    }

    // Fee Collection Donut
    if (donutChartRef.current) {
      if (donutChartInstance.current) donutChartInstance.current.destroy();
      donutChartInstance.current = new Chart(donutChartRef.current, {
        type: 'doughnut',
        data: {
          labels: data.collectionBreakdown.labels,
          datasets: [{
            data: data.collectionBreakdown.data,
            backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#6366f1', '#f43f5e'],
            borderWidth: 0,
            cutout: '75%'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    }

    return () => {
      if (mainChartInstance.current) mainChartInstance.current.destroy();
      if (donutChartInstance.current) donutChartInstance.current.destroy();
    };
  }, [data, isDark]);

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-28 bg-slate-200 dark:bg-gray-800 rounded-3xl"></div>)}
      </div>
      <div className="h-96 bg-slate-200 dark:bg-gray-800 rounded-[2.5rem]"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: data.metrics.totalRevenue, color: 'text-amber-600', icon: '💰' },
          { label: 'Outstanding Fees', value: data.metrics.outstandingFees, color: 'text-rose-600', icon: '⏳' },
          { label: 'Monthly Payroll', value: data.metrics.monthlyPayroll, color: 'text-blue-600', icon: '💸' },
          { label: 'Operational Cost', value: data.metrics.otherExpenses, color: 'text-emerald-600', icon: '📊' }
        ].map((m, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-6 shadow-sm group hover:scale-105 transition-all">
             <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl flex items-center justify-center text-xl">{m.icon}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none text-right">{m.label}</span>
             </div>
             <p className={`text-2xl font-black ${m.color} tracking-tight`}>{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[3rem] p-10 shadow-sm flex flex-col h-[500px]">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight uppercase italic">Cash Flow Analysis</h3>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase">Revenue</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase">Expenses</span>
                 </div>
              </div>
           </div>
           <div className="relative flex-1"><canvas ref={mainChartRef}></canvas></div>
        </div>

        {/* Collection Breakdown */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[3rem] p-10 shadow-sm flex flex-col items-center h-[500px]">
           <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight uppercase mb-10 w-full">Fee Distribution</h3>
           <div className="relative flex-1 w-full flex items-center justify-center">
              <canvas ref={donutChartRef}></canvas>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-4">
                 <span className="text-4xl font-black text-slate-800 dark:text-white">65%</span>
                 <span className="text-[10px] font-black text-amber-500 uppercase mt-1">Tuition Fee</span>
              </div>
           </div>
           <div className="mt-8 space-y-3 w-full">
              {data.collectionBreakdown.labels.slice(0,3).map((l, i) => (
                <div key={i} className="flex justify-between items-center">
                   <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${['bg-amber-500', 'bg-blue-500', 'bg-emerald-500'][i]}`}></span>
                      <span className="text-xs font-bold text-slate-500 uppercase">{l}</span>
                   </div>
                   <span className="text-xs font-black text-slate-800 dark:text-white">{data.collectionBreakdown.data[i]}%</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Recent Ledger */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Recent Financial Activity</h3>
            <button className="px-6 py-2 bg-slate-900 dark:bg-amber-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">Export CSV</button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 dark:bg-gray-800/50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction ID</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Description</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Amount</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {data.recentTransactions.map((t, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
                       <td className="p-6 text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{t.id}</td>
                       <td className="p-6 font-bold text-slate-600 dark:text-gray-400 text-sm">{t.desc}</td>
                       <td className="p-6 text-xs font-bold text-slate-400">{t.date}</td>
                       <td className={`p-6 text-right font-black text-sm ${t.type === 'Credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {t.type === 'Credit' ? '+' : '-'} ₹{t.amount.toLocaleString()}
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
