import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StudentHallTicket({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Endpoint /api/student/hall-tickets returns list of hall tickets
      const res = await api.get('/api/student/hall-tickets');
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load hall tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDownload = (htId) => {
    // Logic to download PDF
    alert(`Downloading Hall Ticket ID: ${htId}`);
  };

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-48 bg-slate-200 dark:bg-gray-800 rounded-lg"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-200 dark:bg-gray-800 rounded-2xl"></div>)}
      </div>
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
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Hall Tickets</h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm">Download your admit cards for upcoming examinations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((ht, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2rem] p-8 shadow-sm relative overflow-hidden group">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-[4rem] group-hover:scale-110 transition-transform duration-500"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-inner shadow-white/20 mb-6">
                🎫
              </div>
              
              <h3 className="text-xl font-black text-slate-800 dark:text-white leading-tight uppercase tracking-tight">
                {ht.examName || 'Semester End Examination'}
              </h3>
              <p className="text-slate-400 font-bold text-xs mt-1 uppercase tracking-widest">Academic Year 2025-26</p>
              
              <div className="mt-8 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium">Issue Date</span>
                  <span className="text-slate-800 dark:text-gray-300 font-bold">{ht.issueDate || 'Today'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium">Status</span>
                  <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800/30">Available</span>
                </div>
              </div>

              <button 
                onClick={() => handleDownload(ht.id)}
                className="w-full mt-8 flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 dark:bg-purple-600 hover:bg-slate-800 dark:hover:bg-purple-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 dark:shadow-purple-500/10"
              >
                <span>📥</span> Download PDF
              </button>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="col-span-full bg-white dark:bg-gray-900 border border-dashed border-slate-200 dark:border-gray-800 rounded-[2rem] p-12 text-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-gray-800/50 text-slate-300 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              📭
            </div>
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">No Hall Tickets Found</h3>
            <p className="text-slate-500 dark:text-gray-400 text-sm mt-2 max-w-sm mx-auto">Hall tickets are usually published 7 days before the commencement of the first examination.</p>
          </div>
        )}
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-6 flex gap-4">
        <div className="w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center text-xl shrink-0">💡</div>
        <div>
          <h4 className="font-black text-amber-800 dark:text-amber-300 text-sm uppercase tracking-tight">Important Notice</h4>
          <p className="text-amber-600 dark:text-amber-400 text-sm mt-1 leading-relaxed">
            Please ensure all your dues are cleared to download the hall ticket. If you face any issues, contact the COE office or check the <strong>Fee Payment</strong> section.
          </p>
        </div>
      </div>
    </div>
  );
}
