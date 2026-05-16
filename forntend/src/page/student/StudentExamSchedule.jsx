import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StudentExamSchedule({ apiUrl, token, user, linkedId }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!linkedId) return;
    setLoading(true);
    try {
      const res = await api.get('/api/exam-schedule');
      setData(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic underline decoration-indigo-500">Summative Assessment Roadmap</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Official institutional schedule for end-semester evaluations and specialized assessments</p>
        </div>
        <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all">
           Download Hall Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {data.map((exam, idx) => {
           const daysLeft = Math.ceil((new Date(exam.date) - new Date()) / (86400000));
           return (
             <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col relative overflow-hidden group hover:border-indigo-500 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-[3rem] group-hover:scale-110 transition-transform"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                   <div className="flex justify-between items-start mb-8">
                      <div className="flex flex-col">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Temporal Stamp</span>
                         <span className="text-lg font-black text-slate-900 dark:text-white italic leading-none mt-1">{new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                        daysLeft <= 3 ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                      }`}>
                         {daysLeft} Days Left
                      </span>
                   </div>
                   
                   <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{exam.subjectName || 'Advanced Computation'}</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{exam.examType || 'End-Sem Theory'}</p>
                   
                   <div className="mt-auto pt-8 flex flex-col gap-3">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 italic">
                         <span>Session Timing</span>
                         <span className="text-slate-800 dark:text-gray-300">10:00 AM - 01:00 PM</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 italic">
                         <span>Allocated Venue</span>
                         <span className="text-indigo-600">Main Hall - B2</span>
                      </div>
                   </div>
                   
                   <div className="mt-8 flex gap-2">
                      <button className="flex-1 py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl">Syllabus</button>
                      <button className="px-4 py-3 bg-slate-100 dark:bg-gray-800 text-slate-400 rounded-xl hover:text-indigo-600 transition-all">📋</button>
                   </div>
                </div>
             </div>
           );
         })}
         {data.length === 0 && (
           <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-gray-800/30 rounded-[3rem] border border-dashed border-slate-200 dark:border-gray-800 opacity-50 italic">
              No examination cycles are currently scheduled.
           </div>
         )}
      </div>
    </div>
  );
}
