import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import Chart from 'chart.js/auto';
import { useTheme } from '../../context/ThemeContext';

export default function COEDashboard({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const chartRef1 = useRef(null);
  const chartInstance1 = useRef(null);
  const chartRef2 = useRef(null);
  const chartInstance2 = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mocked COE summary data
      setData({
        metrics: {
          totalExams: 42,
          hallTicketsIssued: '4,250 / 4,300',
          resultsPublished: '38 / 42',
          pendingEvaluations: 4
        },
        upcomingExams: [
          { date: '2026-06-02', subject: 'Digital Signal Processing', dept: 'ECE', students: 120 },
          { date: '2026-06-03', subject: 'Advanced Java', dept: 'CSE', students: 180 },
          { date: '2026-06-04', subject: 'Thermodynamics', dept: 'MECH', students: 90 }
        ],
        publicationStats: { published: 38, pending: 4 },
        evaluationStats: { completed: 85, pending: 15 }
      });
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!data) return;

    // Results Publication Donut
    if (chartRef1.current) {
      if (chartInstance1.current) chartInstance1.current.destroy();
      chartInstance1.current = new Chart(chartRef1.current, {
        type: 'doughnut',
        data: {
          labels: ['Published', 'Pending'],
          datasets: [{
            data: [data.publicationStats.published, data.publicationStats.pending],
            backgroundColor: ['#f97316', isDark ? '#374151' : '#e2e8f0'],
            borderWidth: 0,
            cutout: '80%'
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
      });
    }

    // Evaluation Progress Donut
    if (chartRef2.current) {
      if (chartInstance2.current) chartInstance2.current.destroy();
      chartInstance2.current = new Chart(chartRef2.current, {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'Pending'],
          datasets: [{
            data: [data.evaluationStats.completed, data.evaluationStats.pending],
            backgroundColor: ['#10b981', isDark ? '#374151' : '#e2e8f0'],
            borderWidth: 0,
            cutout: '80%'
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
      });
    }

    return () => {
      if (chartInstance1.current) chartInstance1.current.destroy();
      if (chartInstance2.current) chartInstance2.current.destroy();
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
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Examinations', value: data.metrics.totalExams, color: 'text-orange-600', icon: '📝' },
          { label: 'Hall Tickets Issued', value: data.metrics.hallTicketsIssued, color: 'text-blue-600', icon: '🎫' },
          { label: 'Results Published', value: data.metrics.resultsPublished, color: 'text-emerald-600', icon: '📊' },
          { label: 'Pending Evaluations', value: data.metrics.pendingEvaluations, color: 'text-rose-600', icon: '⏳' }
        ].map((m, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2rem] p-6 shadow-sm">
             <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 bg-slate-50 dark:bg-gray-800/50 rounded-xl flex items-center justify-center text-lg">{m.icon}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none text-right">{m.label}</span>
             </div>
             <p className={`text-2xl font-black ${m.color} tracking-tight`}>{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Results Analytics */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center justify-center h-96 relative">
           <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8 w-full">Publication Status</h3>
           <div className="relative w-48 h-48">
              <canvas ref={chartRef1}></canvas>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-4">
                 <span className="text-4xl font-black text-slate-800 dark:text-white">{Math.round((data.publicationStats.published/data.metrics.totalExams)*100)}%</span>
                 <span className="text-[10px] font-black text-orange-500 uppercase mt-1">Live</span>
              </div>
           </div>
           <div className="mt-8 flex gap-6 w-full justify-center">
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                 <span className="text-[10px] font-black text-slate-400 uppercase">Published</span>
              </div>
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-gray-800"></span>
                 <span className="text-[10px] font-black text-slate-400 uppercase">Awaiting</span>
              </div>
           </div>
        </div>

        {/* Evaluation Progress */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center justify-center h-96 relative">
           <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8 w-full">Evaluation Progress</h3>
           <div className="relative w-48 h-48">
              <canvas ref={chartRef2}></canvas>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-4">
                 <span className="text-4xl font-black text-slate-800 dark:text-white">{data.evaluationStats.completed}%</span>
                 <span className="text-[10px] font-black text-emerald-500 uppercase mt-1">Verified</span>
              </div>
           </div>
           <p className="mt-8 text-xs font-bold text-slate-400 text-center uppercase tracking-widest">Digital Valuation in Progress</p>
        </div>

        {/* Upcoming Exams Feed */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm h-96 flex flex-col">
           <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Upcoming Next 48hrs</h3>
           <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
              {data.upcomingExams.map((ex, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-gray-800/50 rounded-2xl border border-slate-100 dark:border-gray-700">
                   <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest px-2 py-0.5 bg-orange-50 dark:bg-orange-900/20 rounded">{ex.dept}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase">{ex.date}</span>
                   </div>
                   <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">{ex.subject}</h4>
                   <p className="text-[10px] font-bold text-slate-500 mt-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                      {ex.students} Students Registered
                   </p>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="bg-slate-900 dark:bg-orange-900/20 border border-slate-800 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
         <div>
            <h4 className="text-xl font-black text-white tracking-tight uppercase">Ready to publish results?</h4>
            <p className="text-slate-400 text-sm mt-1">Semester VII - Computer Science Department evaluation is 100% complete.</p>
         </div>
         <button className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-orange-500/20">
            Publish Results Now
         </button>
      </div>
    </div>
  );
}
