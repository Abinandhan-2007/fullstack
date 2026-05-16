import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import Chart from 'chart.js/auto';
import { useTheme } from '../../context/ThemeContext';

export default function COEGradeAnalytics({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const gradeChartRef = useRef(null);
  const gradeChartInstance = useRef(null);
  const deptChartRef = useRef(null);
  const deptChartInstance = useRef(null);
  const trendChartRef = useRef(null);
  const trendChartInstance = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mocked analytics data
      setData({
        gradeDistribution: {
          labels: ['O', 'A+', 'A', 'B+', 'B', 'RA'],
          counts: [45, 120, 350, 480, 210, 45]
        },
        deptPerformance: [
          { dept: 'CSE', cgpa: 8.4 },
          { dept: 'ECE', cgpa: 7.9 },
          { dept: 'MECH', cgpa: 7.2 },
          { dept: 'CIVIL', cgpa: 7.5 },
          { dept: 'IT', cgpa: 8.1 }
        ],
        passTrends: {
          labels: ['SEM 1', 'SEM 2', 'SEM 3', 'SEM 4', 'SEM 5', 'SEM 6'],
          data: [82, 85, 88, 86, 91, 94]
        }
      });
    } catch (err) {
      setError(err.message || 'Failed to load grade analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!data) return;

    // Grade Distribution Bar Chart
    if (gradeChartRef.current) {
      if (gradeChartInstance.current) gradeChartInstance.current.destroy();
      gradeChartInstance.current = new Chart(gradeChartRef.current, {
        type: 'bar',
        data: {
          labels: data.gradeDistribution.labels,
          datasets: [{
            label: 'Students Count',
            data: data.gradeDistribution.counts,
            backgroundColor: isDark ? 'rgba(249, 115, 22, 0.7)' : 'rgba(234, 88, 12, 0.7)',
            borderRadius: 8
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

    // Dept Performance Radar or Bar
    if (deptChartRef.current) {
      if (deptChartInstance.current) deptChartInstance.current.destroy();
      deptChartInstance.current = new Chart(deptChartRef.current, {
        type: 'bar',
        data: {
          labels: data.deptPerformance.map(d => d.dept),
          datasets: [{
            label: 'Avg CGPA',
            data: data.deptPerformance.map(d => d.cgpa),
            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.7)' : 'rgba(37, 99, 235, 0.7)',
            borderRadius: 8
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { beginAtZero: true, max: 10, grid: { color: isDark ? '#1f2937' : '#f1f5f9' }, ticks: { color: '#94a3b8' } },
            y: { grid: { display: false }, ticks: { color: '#94a3b8' } }
          }
        }
      });
    }

    // Trend Line Chart
    if (trendChartRef.current) {
      if (trendChartInstance.current) trendChartInstance.current.destroy();
      trendChartInstance.current = new Chart(trendChartRef.current, {
        type: 'line',
        data: {
          labels: data.passTrends.labels,
          datasets: [{
            label: 'Pass %',
            data: data.passTrends.data,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, max: 100, grid: { color: isDark ? '#1f2937' : '#f1f5f9' }, ticks: { color: '#94a3b8' } },
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
          }
        }
      });
    }

    return () => {
      if (gradeChartInstance.current) gradeChartInstance.current.destroy();
      if (deptChartInstance.current) deptChartInstance.current.destroy();
      if (trendChartInstance.current) trendChartInstance.current.destroy();
    };
  }, [data, isDark]);

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-80 bg-slate-200 dark:bg-gray-800 rounded-3xl"></div>
        <div className="h-80 bg-slate-200 dark:bg-gray-800 rounded-3xl"></div>
      </div>
      <div className="h-96 bg-slate-200 dark:bg-gray-800 rounded-[2.5rem]"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Institutional Grade Analytics</h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm">In-depth statistical analysis of examination performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm h-96 flex flex-col">
          <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-6">Grade Distribution (Current Cycle)</h3>
          <div className="relative flex-1"><canvas ref={gradeChartRef}></canvas></div>
        </div>

        {/* Dept Performance */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm h-96 flex flex-col">
          <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-6">Department Average CGPA</h3>
          <div className="relative flex-1"><canvas ref={deptChartRef}></canvas></div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm h-[500px] flex flex-col">
        <div className="flex justify-between items-center mb-8">
           <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Institutional Pass Rate Trend</h3>
           <span className="text-[10px] font-black text-emerald-500 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800 uppercase tracking-widest">+12% Growth</span>
        </div>
        <div className="relative flex-1"><canvas ref={trendChartRef}></canvas></div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-800/30">
              <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Total S-Grades</p>
              <p className="text-2xl font-black text-orange-700 dark:text-orange-400">450</p>
           </div>
           <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30">
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Top Dept</p>
              <p className="text-2xl font-black text-blue-700 dark:text-blue-400">CSE (8.4)</p>
           </div>
           <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Global Pass %</p>
              <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400">94.2%</p>
           </div>
        </div>
      </div>
    </div>
  );
}
