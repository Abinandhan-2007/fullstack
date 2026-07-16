import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StaffAdminAttendanceMapping({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('P1');
  const [attendance, setAttendance] = useState({}); // { studentId: boolean }

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/staff-admin/students');
      setStudents(res.data);
      // Initialize attendance state
      const initial = {};
      res.data.forEach(s => initial[s.id] = true);
      setAttendance(initial);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const toggleAttendance = (id) => {
    setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = async () => {
    try {
      await api.post('/api/staff-admin/attendance/bulk', { period: selectedPeriod, data: attendance });
      alert('Attendance matrix synchronized successfully!');
    } catch (err) { alert('Sync failed'); }
  };

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic underline decoration-sky-500">Attendance Synchronization Matrix</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Synchronize physical classroom participation with digital institutional records</p>
        </div>
        <button onClick={handleSave} className="px-10 py-4 bg-sky-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-sky-500/20 hover:scale-105 transition-all">
           Commit Matrix Update
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-6 shadow-sm flex items-center gap-4">
         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 italic border-r border-slate-100 dark:border-gray-800">Target Session</span>
         <div className="flex gap-2">
            {['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8'].map(p => (
              <button 
                key={p} 
                onClick={() => setSelectedPeriod(p)}
                className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all border ${
                  selectedPeriod === p 
                  ? 'bg-sky-600 border-sky-600 text-white shadow-lg shadow-sky-500/20' 
                  : 'bg-slate-50 dark:bg-gray-800 border-slate-100 dark:border-gray-700 text-slate-400'
                }`}
              >
                {p}
              </button>
            ))}
         </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
         <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 dark:bg-gray-800/50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Scholar Identity</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Toggle Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {students.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors group">
                       <td className="p-6">
                          <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{s.name}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">{s.regNo}</p>
                       </td>
                       <td className="p-6 text-center">
                          <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                            attendance[s.id] ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                          }`}>
                             {attendance[s.id] ? 'PRESENT' : 'ABSENT'}
                          </span>
                       </td>
                       <td className="p-6 text-right">
                          <button 
                            onClick={() => toggleAttendance(s.id)}
                            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                              attendance[s.id] ? 'text-rose-500 hover:bg-rose-50' : 'text-emerald-500 hover:bg-emerald-50'
                            }`}
                          >
                             Mark as {attendance[s.id] ? 'Absent' : 'Present'}
                          </button>
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
