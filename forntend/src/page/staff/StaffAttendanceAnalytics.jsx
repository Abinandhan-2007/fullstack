import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import Chart from 'chart.js/auto';
import { useTheme } from '../../context/ThemeContext';

export default function StaffAttendanceAnalytics({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const barChartRef = useRef(null);
  const barChartInstance = useRef(null);
  const lineChartRef = useRef(null);
  const lineChartInstance = useRef(null);
  const donutChartRef = useRef(null);
  const donutChartInstance = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mocked attendance analytics data
      setData({
        subjectAttendance: [
          { subject: 'Cloud Comp', pct: 92 },
          { subject: 'Network Sec', pct: 85 },
          { subject: 'OS Lab', pct: 98 },
          { subject: 'Data Struct', pct: 78 }
        ],
        dailyTrend: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          data: [95, 88, 92, 85, 90, 82]
        },
        thresholdStats: { below75: 16, above75: 108 }
      });
    } catch (err) {
      setError(err.message || 'Failed to load attendance analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!data) return;

    // Subject Attendance Bar Chart
    if (barChartRef.current) {
      if (barChartInstance.current) barChartInstance.current.destroy();
      barChartInstance.current = new Chart(barChartRef.current, {
        type: 'bar',
        data: {
          labels: data.subjectAttendance.map(s => s.subject),
          datasets: [{
            label: 'Attendance %',
            data: data.subjectAttendance.map(s => s.pct),
            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.7)' : 'rgba(37, 99, 235, 0.7)',
            borderRadius: 6
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

    // Daily Trend Line Chart
    if (lineChartRef.current) {
      if (lineChartInstance.current) lineChartInstance.current.destroy();
      lineChartInstance.current = new Chart(lineChartRef.current, {
        type: 'line',
        data: {
          labels: data.dailyTrend.labels,
          datasets: [{
            label: 'Daily Attendance %',
            data: data.dailyTrend.data,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 5
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

    // Threshold Donut Chart
    if (donutChartRef.current) {
      if (donutChartInstance.current) donutChartInstance.current.destroy();
      donutChartInstance.current = new Chart(donutChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Above 75%', 'Below 75%'],
          datasets: [{
            data: [data.thresholdStats.above75, data.thresholdStats.below75],
            backgroundColor: ['#10b981', '#f43f5e'],
            borderWidth: 0,
            cutout: '70%'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { weight: 'bold' } } } }
        }
      });
    }

    return () => {
      if (barChartInstance.current) barChartInstance.current.destroy();
      if (lineChartInstance.current) lineChartInstance.current.destroy();
      if (donutChartInstance.current) donutChartInstance.current.destroy();
    };
  }, [data, isDark]);

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-80 bg-slate-200 dark:bg-gray-800 rounded-3xl"></div>
        <div className="h-80 bg-slate-200 dark:bg-gray-800 rounded-3xl"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Attendance Analytics</h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm">Monitor student presence and identify irregular patterns</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Attendance */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm h-96 flex flex-col">
          <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-6">Attendance per Subject</h3>
          <div className="relative flex-1"><canvas ref={barChartRef}></canvas></div>
        </div>

        {/* Threshold Donut */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm h-96 flex flex-col items-center">
          <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-6 w-full text-left">Condonation Risk</h3>
          <div className="relative flex-1 w-full"><canvas ref={donutChartRef}></canvas></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-12">
             <span className="text-3xl font-black text-rose-500">{data.thresholdStats.below75}</span>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Students &lt; 75%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Trend */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm h-96 flex flex-col">
          <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-6">Weekly Trend</h3>
          <div className="relative flex-1"><canvas ref={lineChartRef}></canvas></div>
        </div>

        {/* Quick Insights */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-center">
           <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-8">Strategic Insights</h3>
           <div className="space-y-6">
              <div className="flex items-start gap-4">
                 <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl flex items-center justify-center text-xl shrink-0">📅</div>
                 <div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Highest Attendance</h4>
                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Monday remains the most active day with 95% average student presence.</p>
                 </div>
              </div>
              <div className="flex items-start gap-4">
                 <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-xl flex items-center justify-center text-xl shrink-0">📉</div>
                 <div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Weekend Drop</h4>
                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Saturday shows a significant dip to 82%, requiring potential engagement strategy.</p>
                 </div>
              </div>
              <div className="flex items-start gap-4">
                 <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center text-xl shrink-0">🎓</div>
                 <div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Course Highlight</h4>
                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">OS Lab sessions have consistent near-100% attendance across all batches.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
