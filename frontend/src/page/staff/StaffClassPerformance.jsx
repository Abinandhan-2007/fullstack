import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import Chart from 'chart.js/auto';
import { useTheme } from '../../context/ThemeContext';

export default function StaffClassPerformance({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('ALL');

  const barChartRef = useRef(null);
  const barChartInstance = useRef(null);
  const donutChartRef = useRef(null);
  const donutChartInstance = useRef(null);
  const lineChartRef = useRef(null);
  const lineChartInstance = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mocked analytics data
      setData({
        subjectAverages: [
          { subject: 'Cloud Comp', avg: 82 },
          { subject: 'Network Sec', avg: 75 },
          { subject: 'OS Lab', avg: 90 },
          { subject: 'Data Struct', avg: 68 }
        ],
        passFail: { pass: 108, fail: 16 },
        topStudents: [
          { name: 'Abina', score: 98 },
          { name: 'Rajesh', score: 96 },
          { name: 'Priya', score: 95 },
          { name: 'Suresh', score: 94 },
          { name: 'Divya', score: 92 }
        ],
        examTrends: {
          labels: ['Int 1', 'Int 2', 'Model', 'Sem End'],
          data: [72, 78, 75, 84]
        }
      });
    } catch (err) {
      setError(err.message || 'Failed to load performance analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!data) return;

    // Subject Averages Bar Chart
    if (barChartRef.current) {
      if (barChartInstance.current) barChartInstance.current.destroy();
      barChartInstance.current = new Chart(barChartRef.current, {
        type: 'bar',
        data: {
          labels: data.subjectAverages.map(s => s.subject),
          datasets: [{
            label: 'Class Average',
            data: data.subjectAverages.map(s => s.avg),
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.7)' : 'rgba(5, 150, 105, 0.7)',
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

    // Pass/Fail Donut Chart
    if (donutChartRef.current) {
      if (donutChartInstance.current) donutChartInstance.current.destroy();
      donutChartInstance.current = new Chart(donutChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Pass', 'Fail'],
          datasets: [{
            data: [data.passFail.pass, data.passFail.fail],
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

    // Exam Trend Line Chart
    if (lineChartRef.current) {
      if (lineChartInstance.current) lineChartInstance.current.destroy();
      lineChartInstance.current = new Chart(lineChartRef.current, {
        type: 'line',
        data: {
          labels: data.examTrends.labels,
          datasets: [{
            label: 'Performance Trend',
            data: data.examTrends.data,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
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

    return () => {
      if (barChartInstance.current) barChartInstance.current.destroy();
      if (donutChartInstance.current) donutChartInstance.current.destroy();
      if (lineChartInstance.current) lineChartInstance.current.destroy();
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Class Performance Analytics</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Visual insights into student academic achievement</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-gray-900 p-1.5 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm">
           {['ALL', 'Section A', 'Section B'].map(sec => (
             <button 
                key={sec}
                onClick={() => setSelectedCourse(sec)}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${selectedCourse === sec ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-gray-800'}`}
             >
                {sec}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Averages */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm h-96 flex flex-col">
          <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-6">Subject Averages</h3>
          <div className="relative flex-1"><canvas ref={barChartRef}></canvas></div>
        </div>

        {/* Pass/Fail Donut */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm h-96 flex flex-col items-center">
          <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-6 w-full text-left">Result Status</h3>
          <div className="relative flex-1 w-full"><canvas ref={donutChartRef}></canvas></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-12">
             <span className="text-3xl font-black text-slate-800 dark:text-white">{Math.round((data.passFail.pass / (data.passFail.pass + data.passFail.fail)) * 100)}%</span>
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Pass Rate</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm">
           <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-6">Top Performers</h3>
           <div className="space-y-4">
              {data.topStudents.map((s, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-gray-800/50 rounded-2xl border border-slate-100 dark:border-gray-700">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${idx === 0 ? 'bg-yellow-100 text-yellow-600' : 'bg-white dark:bg-gray-900 text-slate-400'}`}>
                    #{idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">{s.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Computer Science</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-500">{s.score}%</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Avg Score</p>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Performance Trend */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm h-full flex flex-col">
          <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-6">Examination Trend</h3>
          <div className="relative flex-1"><canvas ref={lineChartRef}></canvas></div>
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30">
             <p className="text-xs font-bold text-blue-600 dark:text-blue-400 leading-relaxed">
               📈 The class performance has shown a steady 12% improvement since the first internal assessment.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
