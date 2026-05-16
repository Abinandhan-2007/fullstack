import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function COEExamSchedule({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [formData, setFormData] = useState({ subjectCode: '', date: '', time: '', venue: '', type: 'SEMESTER_END' });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/coe/exams');
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load exam schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (exam = null) => {
    if (exam) {
      setEditingExam(exam);
      setFormData({ ...exam, subjectCode: exam.course?.courseCode || '' });
    } else {
      setEditingExam(null);
      setFormData({ subjectCode: '', date: '', time: '10:00 AM', venue: 'Main Hall', type: 'SEMESTER_END' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExam) {
        await api.put(`/api/coe/exams/${editingExam.id}`, formData);
      } else {
        await api.post('/api/coe/exams', formData);
      }
      setIsModalOpen(false);
      fetchData();
      alert('Schedule updated successfully!');
    } catch (err) {
      alert('Operation failed: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this exam schedule?')) return;
    try {
      await api.delete(`/api/coe/exams/${id}`);
      fetchData();
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-48 bg-slate-200 dark:bg-gray-800 rounded-xl"></div>
      <div className="h-96 bg-slate-200 dark:bg-gray-800 rounded-[2.5rem]"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Master Exam Schedule</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Manage institutional examination dates and logistics</p>
        </div>
        <div className="flex gap-3">
           <button onClick={() => handleOpenModal()} className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2">
              <span>➕</span> Create New Schedule
           </button>
           <button className="px-6 py-3 bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 rounded-xl font-bold hover:bg-slate-200 transition-all">
              🚀 Bulk Publish
           </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-gray-800/50">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Subject</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Type</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Date & Time</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Venue</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
              {data.map((ex, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="p-6">
                    <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">{ex.course?.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{ex.course?.courseCode}</p>
                  </td>
                  <td className="p-6 text-center">
                    <span className="px-2 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded text-[9px] font-black uppercase tracking-widest">
                      {ex.type}
                    </span>
                  </td>
                  <td className="p-6 text-center">
                    <p className="text-sm font-bold text-slate-800 dark:text-gray-200">{ex.date}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{ex.time || '10:00 AM'}</p>
                  </td>
                  <td className="p-6 text-center text-sm font-bold text-slate-500">{ex.venue || 'TBA'}</td>
                  <td className="p-6">
                    <div className="flex justify-center gap-2">
                       <button onClick={() => handleOpenModal(ex)} className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-all">✏️</button>
                       <button onClick={() => handleDelete(ex.id)} className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-600 flex items-center justify-center hover:bg-rose-100 transition-all">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr><td colSpan="5" className="p-20 text-center text-slate-300 italic font-medium">No exam schedules found. Click "Create" to add one.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8">
                 {editingExam ? 'Edit Schedule' : 'New Examination'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Course Code</label>
                    <input required type="text" value={formData.subjectCode} onChange={(e) => setFormData({...formData, subjectCode: e.target.value})} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-xl px-5 py-4 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-orange-500/10" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Exam Date</label>
                       <input required type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-xl px-5 py-4 text-sm font-bold dark:text-white outline-none" />
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Exam Time</label>
                       <input required type="text" placeholder="10:00 AM" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-xl px-5 py-4 text-sm font-bold dark:text-white outline-none" />
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <button type="submit" className="flex-1 py-4 bg-orange-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-orange-500/20">Save Schedule</button>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 dark:bg-gray-800 text-slate-500 font-black text-xs uppercase tracking-widest rounded-2xl border border-slate-200 dark:border-gray-700">Cancel</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
