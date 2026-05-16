import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function COEHallTickets({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [releasing, setReleasing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/coe/hall-tickets');
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load hall tickets status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRelease = async () => {
    if (!window.confirm('Release hall tickets for all eligible students?')) return;
    setReleasing(true);
    try {
      await api.post('/api/coe/hall-tickets/release-all');
      alert('Hall tickets released successfully!');
      fetchData();
    } catch (err) {
      alert('Release failed: ' + err.message);
    } finally {
      setReleasing(false);
    }
  };

  const filteredData = selectedDept === 'ALL' 
    ? data 
    : data.filter(h => h.student?.department?.shortForm === selectedDept);

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-full bg-slate-200 dark:bg-gray-800 rounded-xl"></div>
      <div className="h-96 bg-slate-200 dark:bg-gray-800 rounded-[2.5rem]"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Hall Ticket Management</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Release and track examination admit cards</p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={handleRelease}
             disabled={releasing}
             className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
           >
              <span>🎫</span> {releasing ? 'Processing...' : 'Release All Hall Tickets'}
           </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-8 border-b border-slate-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
           <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Issuance List</h3>
           <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filter Dept:</span>
              <select 
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-xl px-4 py-2 text-xs font-bold dark:text-white outline-none"
              >
                <option value="ALL">All Departments</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
              </select>
           </div>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-gray-800/50">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Roll No</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Name / Dept</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
              {filteredData.map((h, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="p-6 text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{h.student?.regNo || '7376...'}</td>
                  <td className="p-6">
                    <p className="text-sm font-bold text-slate-800 dark:text-gray-200">{h.student?.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h.student?.department?.shortForm}</p>
                  </td>
                  <td className="p-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      h.status === 'RELEASED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}>
                      {h.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center gap-2">
                       <button className="px-4 py-2 bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-200 transition-all">Download PDF</button>
                       <button className="w-10 h-10 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-xl flex items-center justify-center hover:bg-rose-100 transition-all">Revoke</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && !loading && (
                <tr><td colSpan="4" className="p-20 text-center text-slate-300 italic font-medium">No records matching the filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
