import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StudentCertificates({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [certType, setCertType] = useState('Bonafide');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real scenario, we'd fetch from /api/student/certificates
      const res = await api.get('/api/student/certificates');
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load certificates history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRequest = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/student/certificates', { type: certType, reason });
      setReason('');
      fetchData();
      alert('Certificate request submitted!');
    } catch (err) {
      alert('Request failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-48 bg-slate-200 dark:bg-gray-800 rounded-3xl"></div>
      <div className="h-96 bg-slate-200 dark:bg-gray-800 rounded-3xl"></div>
    </div>
  );

  if (error) return (
    <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-6 text-center">
      <p className="text-rose-600 dark:text-rose-400 font-medium">{error}</p>
      <button onClick={fetchData} className="mt-3 px-4 py-2 bg-rose-600 text-white rounded-lg font-bold">Retry</button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Academic Certificates</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Request and download official documents</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Request Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-6">Request Document</h3>
            <form onSubmit={handleRequest} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Document Type</label>
                <div className="space-y-2">
                  {['Bonafide', 'Conduct', 'Course Completion', 'Transfer Certificate', 'Fee Structure'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setCertType(type)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                        certType === type 
                        ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400' 
                        : 'bg-slate-50 dark:bg-gray-800 border-slate-100 dark:border-gray-700 text-slate-500'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Purpose of Request</label>
                <textarea 
                  required
                  placeholder="e.g., Opening Bank Account, Passport Verification..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-purple-500/10 transition-all dark:text-gray-200"
                ></textarea>
              </div>
              <button 
                type="submit"
                disabled={submitting}
                className="w-full bg-slate-900 dark:bg-purple-600 hover:bg-slate-800 dark:hover:bg-purple-700 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-all disabled:opacity-50 shadow-xl shadow-slate-900/10 dark:shadow-purple-500/10"
              >
                {submitting ? 'Processing Request...' : 'Confirm Request'}
              </button>
            </form>
          </div>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2rem] shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-8 border-b border-slate-100 dark:border-gray-800">
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Request History</h3>
            </div>
            <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-gray-800/50">
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Request Date</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Certificate</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {data.map((c, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="p-6 text-xs font-bold text-slate-500">{c.requestDate || '2026-05-16'}</td>
                      <td className="p-6">
                        <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">{c.type || 'Bonafide'}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5 line-clamp-1">{c.reason}</p>
                      </td>
                      <td className="p-6 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          c.status === 'READY' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100 dark:border-emerald-800' :
                          c.status === 'REJECTED' ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 border-rose-100 dark:border-rose-800' :
                          'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100 dark:border-amber-800'
                        }`}>
                          {c.status || 'PENDING'}
                        </span>
                      </td>
                      <td className="p-6 text-center">
                        {c.status === 'READY' ? (
                          <button className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest hover:underline flex items-center justify-center gap-1 mx-auto">
                            <span>📥</span> Download
                          </button>
                        ) : (
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Unavailable</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {data.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-20 text-center text-slate-300 italic font-medium">No previous requests found.</td>
                    </tr>
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
