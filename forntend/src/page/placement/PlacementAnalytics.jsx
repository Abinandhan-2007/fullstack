import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import Chart from 'chart.js/auto';
import { useTheme } from '../../context/ThemeContext';

export default function PlacementAnalytics({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);

  const trendRef = useRef(null);
  const distRef = useRef(null);
  const trendInstance = useRef(null);
  const distInstance = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    // Simulating API delay
    setTimeout(() => setLoading(false), 800);
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (loading) return;

    // Year-on-Year Trend
    if (trendRef.current) {
      if (trendInstance.current) trendInstance.current.destroy();
      trendInstance.current = new Chart(trendRef.current, {
        type: 'line',
        data: {
          labels: ['2021', '2022', '2023', '2024', '2025', '2026'],
          datasets: [{
            label: 'Students Placed',
            data: [420, 510, 580, 640, 710, 840],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4
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
    }

    // Salary Distribution
    if (distRef.current) {
      if (distInstance.current) distInstance.current.destroy();
      distInstance.current = new Chart(distRef.current, {
        type: 'doughnut',
        data: {
          labels: ['< 5 LPA', '5-10 LPA', '10-20 LPA', '20+ LPA'],
          datasets: [{
            data: [35, 45, 15, 5],
            backgroundColor: ['#64748b', '#10b981', '#3b82f6', '#f59e0b'],
            borderWidth: 0,
            cutout: '75%'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 10 } } }
        }
      });
    }

    return () => {
      if (trendInstance.current) trendInstance.current.destroy();
      if (distInstance.current) distInstance.current.destroy();
    };
  }, [loading, isDark]);

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic underline decoration-emerald-500">Corporate Intelligence Analytics</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Longitudinal study of institutional placement success and salary paradigms</p>
        </div>
        <button className="px-6 py-3 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all hover:scale-105">
           <span>📊</span> Export Annual Audit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[3rem] p-10 shadow-sm h-[450px] flex flex-col">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-8 italic">Placement Growth Trajectory</h3>
            <div className="relative flex-1"><canvas ref={trendRef}></canvas></div>
         </div>
         
         <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[3rem] p-10 shadow-sm h-[450px] flex flex-col items-center">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-8 w-full italic">Salary Bracket Distribution</h3>
            <div className="relative flex-1 w-full"><canvas ref={distRef}></canvas></div>
         </div>
      </div>

      <div className="bg-emerald-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-emerald-500/20 border border-emerald-800">
         <div className="text-center md:text-left">
            <h4 className="text-2xl font-black uppercase tracking-tight italic underline decoration-emerald-500 underline-offset-8 mb-4">Strategic Placement Outlook</h4>
            <p className="text-emerald-100 text-sm max-w-2xl leading-relaxed italic font-medium">
               Institutional projections suggest a 15% increase in Product-based hiring for the upcoming session. Focus on Core-Engineering recruitment is being prioritized to balance the corporate mix.
            </p>
         </div>
         <div className="shrink-0 flex flex-col items-center">
            <p className="text-4xl font-black tracking-tighter italic">92.4%</p>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mt-1">Projected Success</p>
         </div>
      </div>
    </div>
  );
}
