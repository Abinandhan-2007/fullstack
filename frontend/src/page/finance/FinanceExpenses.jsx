import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import Chart from 'chart.js/auto';
import { useTheme } from '../../context/ThemeContext';

export default function FinanceExpenses({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ category: 'Utilities', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
  const [submitting, setSubmitting] = useState(false);

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/finance/expenses');
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (data.length === 0 || !chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const categories = ['Utilities', 'Maintenance', 'Events', 'Academic', 'Others'];
    const counts = categories.map(cat => data.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0));

    chartInstance.current = new Chart(chartRef.current, {
      type: 'doughnut',
      data: {
        labels: categories,
        datasets: [{
          data: counts.every(v => v === 0) ? [1,1,1,1,1] : counts,
          backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#6366f1', '#f43f5e'],
          borderWidth: 0,
          cutout: '70%'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 12, padding: 20 } } }
      }
    });

    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [data, isDark]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/finance/expenses', formData);
      setIsModalOpen(false);
      fetchData();
      alert('Expense logged successfully!');
    } catch (err) {
      alert('Logging failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Institutional Expenditure</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Track operational costs and maintenance expenses</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-slate-900 dark:bg-amber-600 text-white rounded-xl font-bold shadow-xl flex items-center gap-2">
           <span>➕</span> Log New Expense
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Donut */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm h-96 flex flex-col items-center">
           <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-8 w-full">Expense Distribution</h3>
           <div className="relative flex-1 w-full flex items-center justify-center">
              <canvas ref={chartRef}></canvas>
           </div>
        </div>

        {/* Expense Log */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col h-96">
           <div className="p-8 border-b border-slate-100 dark:border-gray-800">
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Transaction Audit Log</h3>
           </div>
           <div className="overflow-y-auto custom-scrollbar flex-1">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50 dark:bg-gray-800/50 sticky top-0 z-10">
                       <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                       <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                       <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Description</th>
                       <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Amount</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50 dark:divide-gray-800">
                    {data.map((e, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
                         <td className="p-6 text-xs font-bold text-slate-400">{e.date}</td>
                         <td className="p-6">
                            <span className="px-2 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 text-[9px] font-black rounded uppercase tracking-widest">
                               {e.category}
                            </span>
                         </td>
                         <td className="p-6 text-sm font-bold text-slate-700 dark:text-gray-300 line-clamp-1">{e.description}</td>
                         <td className="p-6 text-right font-black text-slate-800 dark:text-white">₹{e.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                    {data.length === 0 && (
                      <tr><td colSpan="4" className="p-20 text-center text-slate-300 italic font-medium">No expenses logged yet.</td></tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 italic">New Operational Expense</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Expense Category</label>
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-xl px-5 py-4 text-sm font-bold dark:text-white outline-none">
                       {['Utilities', 'Maintenance', 'Events', 'Academic', 'Others'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Amount (₹)</label>
                       <input required type="number" placeholder="00" value={formData.amount} onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-xl px-5 py-4 text-sm font-bold dark:text-white outline-none" />
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Date</label>
                       <input required type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-xl px-5 py-4 text-sm font-bold dark:text-white outline-none" />
                    </div>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                    <textarea required placeholder="Briefly describe the expenditure..." rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-xl px-5 py-4 text-sm font-bold dark:text-white outline-none"></textarea>
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button type="submit" disabled={submitting} className="flex-1 py-4 bg-amber-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-amber-500/20 transition-all">Record Expense</button>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 dark:bg-gray-800 text-slate-500 font-black text-xs uppercase tracking-widest rounded-2xl border border-slate-200 dark:border-gray-700">Cancel</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
