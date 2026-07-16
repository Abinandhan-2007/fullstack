import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function LibraryIssueReturn({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [issueData, setIssueData] = useState({ studentRegNo: '', bookIsbn: '' });
  const [returnIsbn, setReturnIsbn] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentTxns, setRecentTxns] = useState([]);

  const handleIssue = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/library/issue', issueData);
      alert('Book issued successfully!');
      setIssueData({ studentRegNo: '', bookIsbn: '' });
      fetchRecent();
    } catch (err) {
      alert('Issue failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/library/return', { isbn: returnIsbn });
      alert('Book returned successfully!');
      setReturnIsbn('');
      fetchRecent();
    } catch (err) {
      alert('Return failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecent = async () => {
    try {
      const res = await api.get('/api/library/recent-transactions');
      setRecentTxns(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchRecent(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic">Circulation Management</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Process institutional resource lending and recovery</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Issue Section */}
         <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[3rem] p-10 shadow-sm">
            <div className="flex items-center gap-4 mb-10">
               <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-inner">📤</div>
               <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Issue Resource</h3>
            </div>
            <form onSubmit={handleIssue} className="space-y-6">
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Patron ID (Student/Staff)</label>
                  <input required type="text" placeholder="7376..." value={issueData.studentRegNo} onChange={(e) => setIssueData({...issueData, studentRegNo: e.target.value})} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10" />
               </div>
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Resource ISBN / Accession No</label>
                  <input required type="text" placeholder="ISBN 978..." value={issueData.bookIsbn} onChange={(e) => setIssueData({...issueData, bookIsbn: e.target.value})} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10" />
               </div>
               <button type="submit" disabled={loading} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[2rem] shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Authorize Lending
               </button>
            </form>
         </div>

         {/* Return Section */}
         <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[3rem] p-10 shadow-sm flex flex-col">
            <div className="flex items-center gap-4 mb-10">
               <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl flex items-center justify-center text-xl shadow-inner">📥</div>
               <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Return Resource</h3>
            </div>
            <form onSubmit={handleReturn} className="space-y-6 mb-10">
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Resource Accession No</label>
                  <input required type="text" placeholder="Scan barcode or type ID..." value={returnIsbn} onChange={(e) => setReturnIsbn(e.target.value)} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10" />
               </div>
               <button type="submit" disabled={loading} className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[2rem] shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Process Recovery
               </button>
            </form>
            <div className="mt-auto p-6 bg-slate-50 dark:bg-gray-800/50 rounded-3xl border border-slate-100 dark:border-gray-700">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Self-Return Kiosk Mode</p>
               <p className="text-xs text-slate-500 mt-2 font-medium italic leading-relaxed">Ensure all returned books are placed in the <strong>Sanitization Bin</strong> before shelving.</p>
            </div>
         </div>
      </div>

      {/* Recent Ledger */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic underline decoration-violet-500">Live Circulation Stream</h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing Last 5 Activities</span>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 dark:bg-gray-800/50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Patron</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Resource</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Operation</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Timestamp</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {recentTxns.slice(0, 5).map((t, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
                       <td className="p-6">
                          <p className="text-sm font-bold text-slate-800 dark:text-gray-200">{t.studentName || 'Student Name'}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase">{t.studentId || '7376...'}</p>
                       </td>
                       <td className="p-6 text-xs font-bold text-slate-600 dark:text-gray-400 italic line-clamp-1">{t.bookTitle || 'Book Title'}</td>
                       <td className="p-6 text-center">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            t.type === 'ISSUE' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          }`}>
                             {t.type}
                          </span>
                       </td>
                       <td className="p-6 text-right text-xs font-bold text-slate-400 italic">Today, 02:45 PM</td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
