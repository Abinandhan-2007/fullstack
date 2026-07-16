import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import Chart from 'chart.js/auto';
import { useTheme } from '../../context/ThemeContext';

export default function StudentDashboard({ apiUrl, token, user, linkedId }) {
  const { isDark } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const fetchData = async () => {
    if (!linkedId) return;
    setLoading(true);
    try {
      // Fetch multi-domain data
      const [studentRes, attendRes, marksRes, announceRes] = await Promise.all([
        api.get(`/api/students/profile/${linkedId}`),
        api.get(`/api/attendance/student/${linkedId}`),
        api.get(`/api/marks/student/${linkedId}`),
        api.get(`/api/announcements`)
      ]);

      const attendancePct = attendRes.data.length ? Math.round(attendRes.data.reduce((s, a) => s + (a.present/a.totalClasses)*100, 0) / attendRes.data.length) : 0;
      
      // Calculate trend from SEM_ SGPA marks
      const gpaTrend = marksRes.data
        .filter(m => m.examType.includes('SGPA'))
        .sort((a, b) => a.examType.localeCompare(b.examType))
        .map(m => m.score / 10.0);

      setData({
        profile: { 
          cgpa: studentRes.data.cgpa || '0.00', 
          attendance: attendancePct, 
          backlogs: 0, 
          semester: studentRes.data.semester || 'IV',
          department: studentRes.data.department
        },
        schedule: [
          { time: '09:00 AM', subject: 'Cloud Computing', room: 'L-201', type: 'Lecture' },
          { time: '11:15 AM', subject: 'Network Security', room: 'L-203', type: 'Lecture' },
          { time: '02:00 PM', subject: 'Lab: OS', room: 'CS-Lab 1', type: 'Laboratory' }
        ],
        notices: announceRes.data.slice(0, 2).map(n => ({
          title: n.title,
          date: n.sentAt,
          tag: n.sentBy
        })),
        gpaTrend: gpaTrend.length ? gpaTrend : [7.5, 7.8, 8.2, 8.1, 8.4]
      });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!chartRef.current || !data) return;
    if (chartInstance.current) chartInstance.current.destroy();
    
    chartInstance.current = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'],
        datasets: [{
          label: 'GPA',
          data: data.gpaTrend,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 6,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#6366f1',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 0, max: 10, grid: { color: isDark ? '#1f2937' : '#f1f5f9' }, ticks: { color: '#94a3b8' } },
          x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
        }
      }
    });
    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [data, isDark]);

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-6">
      <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
         <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full -translate-y-24 translate-x-24 blur-3xl"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-4xl border border-white/30 shadow-xl">
               🎓
            </div>
            <div className="text-center md:text-left">
               <h1 className="text-4xl font-black tracking-tight italic">Welcome, {user.name}</h1>
               <p className="text-indigo-100 font-bold mt-2 uppercase tracking-[0.2em] text-xs">Computer Science Engineering • Semester {data.profile.semester}</p>
            </div>
            <div className="flex-1"></div>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[120px]">
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Current CGPA</p>
                  <p className="text-2xl font-black mt-1 italic">{data.profile.cgpa}</p>
               </div>
               <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[120px]">
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Attendance</p>
                  <p className="text-2xl font-black mt-1 italic">{data.profile.attendance}%</p>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic underline decoration-indigo-500 underline-offset-8">Academic Trajectory</h3>
               <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-lg">Performance Index</span>
            </div>
            <div className="h-64 relative">
               <canvas ref={chartRef}></canvas>
            </div>
         </div>

         <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic mb-8">Daily Session Planner</h3>
            <div className="space-y-4">
               {data.schedule.map((s, i) => (
                 <div key={i} className="flex items-center gap-6 p-5 bg-slate-50 dark:bg-gray-800/50 rounded-3xl border border-slate-100 dark:border-gray-700 hover:border-indigo-500 transition-all group">
                    <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-2xl flex flex-col items-center justify-center border border-slate-100 dark:border-gray-800 shadow-sm shrink-0">
                       <span className="text-[8px] font-black text-slate-400 uppercase leading-none">START</span>
                       <span className="text-sm font-black text-slate-800 dark:text-white mt-1 italic">{s.time.split(' ')[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight truncate italic">{s.subject}</h4>
                       <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{s.type}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">📍 {s.room}</span>
                       </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-indigo-500/30">→</div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
         <div className="absolute right-0 bottom-0 opacity-10">
            <span className="text-[10rem] font-black italic select-none tracking-tighter">ALERTS</span>
         </div>
         <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
               <h3 className="text-2xl font-black uppercase tracking-tight italic mb-2 flex items-center gap-3 text-indigo-400">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  Institutional Broadcast
               </h3>
               <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Real-time synchronization with faculty bulletins</p>
            </div>
            <div className="flex flex-col gap-3">
               {data.notices.map((n, i) => (
                 <div key={i} className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 flex justify-between items-center group cursor-pointer hover:bg-white/10 transition-all">
                    <div>
                       <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors italic">{n.title}</p>
                       <p className="text-[10px] font-black text-slate-500 uppercase mt-1 tracking-widest">{n.tag}</p>
                    </div>
                    <span className="text-[10px] font-black text-indigo-400 italic bg-indigo-900/40 px-2 py-1 rounded-lg">NEW</span>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
