import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StaffAttendanceEntry({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [period, setPeriod] = useState(1);
  const [attendance, setAttendance] = useState({}); // { studentId: 'PRESENT' | 'ABSENT' }
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/staff/courses');
      setCourses(res.data);
      if (res.data.length > 0) setSelectedCourse(res.data[0].id);
    } catch (err) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    if (!selectedCourse) return;
    setLoading(true);
    try {
      const res = await api.get(`/api/staff/courses/${selectedCourse}/students`);
      setStudents(res.data);
      // Default all to PRESENT
      const initialAttendance = {};
      res.data.forEach(s => { initialAttendance[s.id] = 'PRESENT'; });
      setAttendance(initialAttendance);
    } catch (err) {
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInitialData(); }, []);
  useEffect(() => { fetchStudents(); }, [selectedCourse]);

  const toggleAttendance = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'PRESENT' ? 'ABSENT' : 'PRESENT'
    }));
  };

  const bulkMark = (status) => {
    const newAttendance = {};
    students.forEach(s => { newAttendance[s.id] = status; });
    setAttendance(newAttendance);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = Object.keys(attendance).map(studentId => ({
        studentId,
        courseId: selectedCourse,
        date: attendanceDate,
        period,
        status: attendance[studentId]
      }));
      await api.post('/api/staff/attendance/bulk', payload);
      alert('Attendance recorded successfully!');
    } catch (err) {
      alert('Failed to record attendance: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && courses.length === 0) return (
    <div className="space-y-6 animate-pulse">
       <div className="h-10 w-64 bg-slate-200 dark:bg-gray-800 rounded-xl"></div>
       <div className="h-96 bg-slate-200 dark:bg-gray-800 rounded-[2rem]"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Daily Attendance Entry</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Real-time attendance tracking for your sessions</p>
        </div>
        <div className="flex flex-wrap gap-3">
           <input 
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 dark:text-gray-200"
           />
           <select 
              value={period}
              onChange={(e) => setPeriod(parseInt(e.target.value))}
              className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 dark:text-gray-200"
           >
              {[1,2,3,4,5,6,7].map(p => <option key={p} value={p}>Period {p}</option>)}
           </select>
           <select 
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 dark:text-gray-200"
           >
              {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.courseCode})</option>)}
           </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        <div className="p-8 border-b border-slate-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-6">
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Student Attendance</h3>
              <div className="flex gap-2">
                 <button onClick={() => bulkMark('PRESENT')} className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100 transition-all">Mark All Present</button>
                 <button onClick={() => bulkMark('ABSENT')} className="px-3 py-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-rose-100 dark:border-rose-800 hover:bg-rose-100 transition-all">Mark All Absent</button>
              </div>
           </div>
           <button 
             onClick={handleSubmit}
             disabled={submitting || students.length === 0}
             className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50"
           >
             {submitting ? 'Recording...' : 'Submit Attendance'}
           </button>
        </div>

        <div className="overflow-x-auto flex-1">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-slate-50 dark:bg-gray-800/50">
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Roll Number</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Name</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Current %</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center w-64">Status</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                 {students.map((s, idx) => (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
                       <td className="p-6 text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{s.regNo || `STU-${idx+101}`}</td>
                       <td className="p-6">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-slate-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-xs font-black text-slate-400">{s.name?.charAt(0)}</div>
                             <p className="text-sm font-bold text-slate-800 dark:text-gray-200">{s.name}</p>
                          </div>
                       </td>
                       <td className="p-6 text-center">
                          <span className={`text-xs font-black ${idx % 5 === 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                             {idx % 5 === 0 ? '72%' : '88%'}
                          </span>
                       </td>
                       <td className="p-6">
                          <div className="flex gap-2 justify-center">
                             <button 
                                onClick={() => setAttendance({...attendance, [s.id]: 'PRESENT'})}
                                className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                   attendance[s.id] === 'PRESENT' 
                                   ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                                   : 'bg-slate-50 dark:bg-gray-800 border-slate-100 dark:border-gray-700 text-slate-400'
                                }`}
                             >
                                Present
                             </button>
                             <button 
                                onClick={() => setAttendance({...attendance, [s.id]: 'ABSENT'})}
                                className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                   attendance[s.id] === 'ABSENT' 
                                   ? 'bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-500/20' 
                                   : 'bg-slate-50 dark:bg-gray-800 border-slate-100 dark:border-gray-700 text-slate-400'
                                }`}
                             >
                                Absent
                             </button>
                          </div>
                       </td>
                    </tr>
                 ))}
                 {students.length === 0 && !loading && (
                    <tr>
                       <td colSpan="4" className="p-20 text-center text-slate-300 italic font-medium">Please select a course to load the student list.</td>
                    </tr>
                 )}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}
