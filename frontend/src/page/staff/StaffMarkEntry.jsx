import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StaffMarkEntry({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [examType, setExamType] = useState('INTERNAL_1');
  const [marks, setMarks] = useState({}); // { studentId: score }
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch courses taught by this staff
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
      // Fetch students enrolled in selected course
      const res = await api.get(`/api/staff/courses/${selectedCourse}/students`);
      setStudents(res.data);
      // Initialize marks state
      const initialMarks = {};
      res.data.forEach(s => { initialMarks[s.id] = ''; });
      setMarks(initialMarks);
    } catch (err) {
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInitialData(); }, []);
  useEffect(() => { fetchStudents(); }, [selectedCourse]);

  const handleMarkChange = (studentId, value) => {
    setMarks({ ...marks, [studentId]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = Object.keys(marks).map(studentId => ({
        studentId,
        courseId: selectedCourse,
        examType,
        marksObtained: marks[studentId],
        maxMarks: 100 // Default or from exam config
      }));
      await api.post('/api/staff/marks/bulk', payload);
      alert('Marks submitted successfully!');
    } catch (err) {
      alert('Failed to submit marks: ' + err.message);
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
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Examination Mark Entry</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Submit and update student performance records</p>
        </div>
        <div className="flex flex-wrap gap-3">
           <select 
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 dark:text-gray-200"
           >
              {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.courseCode})</option>)}
           </select>
           <select 
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 dark:text-gray-200"
           >
              <option value="INTERNAL_1">Internal Assessment 1</option>
              <option value="INTERNAL_2">Internal Assessment 2</option>
              <option value="MODEL">Model Exam</option>
              <option value="SEMESTER_END">Semester End Exam</option>
              <option value="ASSIGNMENT">Assignment / Quiz</option>
           </select>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-4 text-rose-600 text-sm font-bold text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
           <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Student Score List</h3>
           <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Students: {students.length}</span>
              <button 
                type="submit" 
                disabled={submitting || students.length === 0}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Save All Changes'}
              </button>
           </div>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-gray-800/50">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Roll Number</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Name</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Previous Avg</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right w-40">Marks (Max 100)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
              {students.map((s, idx) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="p-6 text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{s.regNo || `STU-${idx+100}`}</td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-400">{s.name?.charAt(0)}</div>
                      <p className="text-sm font-bold text-slate-800 dark:text-gray-200">{s.name}</p>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <span className="text-xs font-black text-slate-400">8.4 CGPA</span>
                  </td>
                  <td className="p-6 text-right">
                    <input 
                      type="number" 
                      max="100" 
                      min="0"
                      required
                      placeholder="00"
                      value={marks[s.id] || ''}
                      onChange={(e) => handleMarkChange(s.id, e.target.value)}
                      className="w-24 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-3 text-center text-sm font-black text-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all"
                    />
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
      </form>
    </div>
  );
}
