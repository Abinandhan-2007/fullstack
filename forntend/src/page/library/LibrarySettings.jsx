import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function LibrarySettings({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [settings, setSettings] = useState({
    allowLending: true,
    fineLogicActive: true,
    digitalAccessOpen: true,
    holidayMode: false,
    inventoryAuditLocked: true
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/library/settings');
      setSettings(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      await api.put('/api/library/settings', settings);
      alert('Library system parameters updated!');
    } catch (err) { alert('Save failed'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic">Library System Architecture</h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm">Control circulation policies, digital repository access and institutional logic</p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[3rem] p-10 shadow-sm space-y-10">
         <div className="space-y-6">
            {[
              { id: 'allowLending', label: 'Lending Operations', desc: 'Allows librarians to issue and renew books/resources for members.', icon: '🔄' },
              { id: 'fineLogicActive', label: 'Overdue Enforcement', desc: 'Automatically calculates and applies fines for late returns.', icon: '⚖️' },
              { id: 'digitalAccessOpen', label: 'Digital Repository', desc: 'Enables access to e-books and research papers on student portal.', icon: '☁️' },
              { id: 'holidayMode', label: 'Holiday Mode', desc: 'Temporarily suspends fine calculation during institutional holidays.', icon: '🌴' },
              { id: 'inventoryAuditLocked', label: 'Audit Trail Protection', desc: 'Locks historical circulation logs to prevent modification.', icon: '🔒' },
            ].map((s) => (
              <div key={s.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-gray-800/50 rounded-3xl border border-slate-100 dark:border-gray-700 group hover:border-violet-200 transition-all">
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center text-xl shadow-sm border border-slate-100 dark:border-gray-700">
                       {s.icon}
                    </div>
                    <div>
                       <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight italic">{s.label}</h4>
                       <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 max-w-md">{s.desc}</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => handleToggle(s.id)}
                   className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${settings[s.id] ? 'bg-violet-600 shadow-lg shadow-violet-500/20' : 'bg-slate-300 dark:bg-gray-700'}`}
                 >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-sm ${settings[s.id] ? 'left-7' : 'left-1'}`}></div>
                 </button>
              </div>
            ))}
         </div>

         <div className="pt-10 border-t border-slate-100 dark:border-gray-800 flex justify-end">
            <button 
              onClick={handleSave}
              disabled={submitting}
              className="px-10 py-5 bg-slate-900 dark:bg-violet-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all disabled:opacity-50"
            >
               {submitting ? 'Updating Policy...' : 'Save Library Configuration'}
            </button>
         </div>
      </div>
    </div>
  );
}
