import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StaffLeave({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [newLeave, setNewLeave] = useState({ startDate: '', endDate: '', reason: '', type: 'CASUAL' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/staff/leaves');
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load leave history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/staff/leaves', newLeave);
      setNewLeave({ startDate: '', endDate: '', reason: '', type: 'CASUAL' });
      fetchData();
      alert('Leave application submitted!');
    } catch (err) {
      alert('Failed to submit application: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="space-y-6 animate-pulse">
       <div className="h-32 bg-slate-200 dark:bg-gray-800 rounded-3xl"></div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-96 bg-slate-200 dark:bg-gray-800 rounded-3xl"></div>
          <div className="h-96 bg-slate-200 dark:bg-gray-800 rounded-3xl"></div>
       </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Leave Management</h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm">Track your leave balance and apply for new requests</p>
      </div>

      {/* Leave Balance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-6 rounded-[2rem] shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Casual Leave</p>
            <p className="text-3xl font-black text-emerald-600 mt-1">08 / 12</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1">AVAILABLE</p>
         </div>
         <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-6 rounded-[2rem] shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical Leave</p>
            <p className="text-3xl font-black text-blue-600 mt-1">05 / 10</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1">AVAILABLE</p>
         </div>
         <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-6 rounded-[2rem] shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duty Leave (OD)</p>
            <p className="text-3xl font-black text-purple-600 mt-1">04</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1">TAKEN THIS SEMESTER</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Leave Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm h-full">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-8">Apply for Leave</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">From</label>
                  <input required type="date" value={newLeave.startDate} onChange={(e) => setNewLeave({...newLeave, startDate: e.target.value})} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">To</label>
                  <input required type="date" value={newLeave.endDate} onChange={(e) => setNewLeave({...newLeave, endDate: e.target.value})} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Leave Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {['CASUAL', 'MEDICAL', 'DUTY', 'VACATION'].map(type => (
                    <button key={type} type="button" onClick={() => setNewLeave({...newLeave, type})} className={`py-3 rounded-xl text-[10px] font-black tracking-widest border transition-all ${newLeave.type === type ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-gray-800 border-slate-100 dark:border-gray-700 text-slate-400'}`}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Reason</label>
                <textarea required rows="4" placeholder="Detail the reason for your leave..." value={newLeave.reason} onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10" />
              </div>
              <button type="submit" disabled={submitting} className="w-full bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-all disabled:opacity-50 shadow-xl">
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>

        {/* Leave History */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden h-full">
            <div className="p-8 border-b border-slate-100 dark:border-gray-800">
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Recent Applications</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-gray-800/50">
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Duration</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Type</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Reason</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {data.map((l, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="p-6 text-xs font-black text-slate-800 dark:text-white">{l.startDate} <span className="text-slate-400">→ {l.endDate}</span></td>
                      <td className="p-6 text-[10px] font-black text-emerald-600 uppercase tracking-widest">{l.leaveType || 'CASUAL'}</td>
                      <td className="p-6 text-xs font-medium text-slate-500 max-w-xs truncate">{l.reason}</td>
                      <td className="p-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          l.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          l.status === 'REJECTED' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                          'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {data.length === 0 && (
                    <tr><td colSpan="4" className="p-20 text-center text-slate-300 italic">No previous applications found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
