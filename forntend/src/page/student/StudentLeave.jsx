import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StudentLeave({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ type: 'CASUAL', from: '', to: '', reason: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/leave/student/STUDENT_REG_001`);
      setHistory(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/leave/student/apply', { ...form, regNo: 'STUDENT_REG_001' });
      alert('Leave application submitted for faculty appraisal.');
      setForm({ type: 'CASUAL', from: '', to: '', reason: '' });
      fetchData();
    } catch (err) { alert('Submission failed'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic underline decoration-indigo-500">Absence Authorization Gateway</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Official portal for institutional leave requests and specialized attendance waivers</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-indigo-50 dark:bg-indigo-900/20 px-6 py-3 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 text-center">
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest italic">Balance</p>
              <p className="text-xl font-black text-slate-800 dark:text-white italic">12 Days</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
         <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[3rem] p-10 shadow-sm space-y-8">
            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic underline decoration-indigo-500 underline-offset-8 mb-4">Request New Absence</h3>
            
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 italic">Absence Topology</label>
                     <select 
                       value={form.type} 
                       onChange={(e) => setForm({...form, type: e.target.value})}
                       className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl px-5 py-4 text-xs font-black dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 appearance-none"
                     >
                        <option value="CASUAL">Casual Leave (CL)</option>
                        <option value="MEDICAL">Medical Emergency (ML)</option>
                        <option value="ON_DUTY">Institutional Duty (OD)</option>
                        <option value="PERMISSION">Short Permission</option>
                     </select>
                  </div>
                  <div className="space-y-2 flex flex-col justify-end">
                     <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest px-2 text-right">Mandatory Appraisal</span>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 italic">Commencement</label>
                     <input 
                       type="date" 
                       value={form.from}
                       onChange={(e) => setForm({...form, from: e.target.value})}
                       className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl px-5 py-4 text-xs font-black dark:text-white outline-none"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 italic">Conclusion</label>
                     <input 
                       type="date" 
                       value={form.to}
                       onChange={(e) => setForm({...form, to: e.target.value})}
                       className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl px-5 py-4 text-xs font-black dark:text-white outline-none"
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 italic">Justification & Context</label>
                  <textarea 
                    rows="4"
                    value={form.reason}
                    onChange={(e) => setForm({...form, reason: e.target.value})}
                    placeholder="Provide detailed rationale for institutional records..."
                    className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-[2rem] px-6 py-5 text-xs font-black dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 placeholder:opacity-30 italic"
                  />
               </div>
            </div>

            <button 
              type="submit"
              disabled={submitting}
              className="w-full py-5 bg-slate-900 dark:bg-indigo-600 text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50"
            >
               {submitting ? 'Transmitting Request...' : 'Transmit Application'}
            </button>
         </form>

         <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[3rem] shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-8 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center bg-slate-50/50 dark:bg-gray-800/30">
               <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic underline decoration-indigo-500 underline-offset-8">Leave Chronicle</h3>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Academic Year</span>
            </div>
            <div className="overflow-x-auto flex-1">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50 dark:bg-gray-800/50">
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Temporal Range</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Days</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                     {history.map((h, idx) => (
                       <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors group">
                          <td className="p-6">
                             <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight italic group-hover:text-indigo-600 transition-colors">{h.leaveType || 'General Leave'}</p>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">{h.fromDate} → {h.toDate}</p>
                          </td>
                          <td className="p-6 text-center">
                             <span className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest border ${
                               h.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : h.status === 'REJECTED' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                             }`}>
                                {h.status || 'PENDING APPRAISAL'}
                             </span>
                          </td>
                          <td className="p-6 text-right text-sm font-black text-slate-800 dark:text-white italic">{h.days || 1}d</td>
                       </tr>
                     ))}
                     {history.length === 0 && (
                        <tr><td colSpan="3" className="p-20 text-center italic opacity-30 font-black uppercase tracking-widest">No absence records in ledger.</td></tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  );
}
