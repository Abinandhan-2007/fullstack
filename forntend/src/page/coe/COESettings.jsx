import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function COESettings({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [settings, setSettings] = useState({
    allowMarkEntry: true,
    releaseHallTickets: false,
    publishResults: false,
    examRegistrationOpen: true,
    maintenanceMode: false
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/coe/settings');
      setSettings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      await api.put('/api/coe/settings', settings);
      alert('Global configuration updated successfully!');
    } catch (err) {
      alert('Save failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Global Examination Settings</h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm">Control institutional-level access and publication schedules</p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-10 shadow-sm space-y-8">
         <div className="space-y-6">
            {[
              { id: 'allowMarkEntry', label: 'Faculty Mark Entry', desc: 'Allows teaching staff to enter and submit internal/exam marks.', icon: '📝' },
              { id: 'releaseHallTickets', label: 'Student Hall Tickets', desc: 'Makes admit cards available for students to download.', icon: '🎫' },
              { id: 'publishResults', label: 'Semester Results', desc: 'Publishes finalized semester grades to student and parent portals.', icon: '📊' },
              { id: 'examRegistrationOpen', label: 'Exam Registration', desc: 'Allows students to register for upcoming examinations.', icon: '✍️' },
              { id: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Temporarily restricts access to the examination portal modules.', icon: '🚧' },
            ].map((s) => (
              <div key={s.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-gray-800/50 rounded-3xl border border-slate-100 dark:border-gray-700 group hover:border-orange-200 transition-all">
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center text-xl shadow-sm border border-slate-100 dark:border-gray-700">
                       {s.icon}
                    </div>
                    <div>
                       <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">{s.label}</h4>
                       <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 max-w-md">{s.desc}</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => handleToggle(s.id)}
                   className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${settings[s.id] ? 'bg-orange-600 shadow-lg shadow-orange-500/20' : 'bg-slate-300 dark:bg-gray-700'}`}
                 >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-sm ${settings[s.id] ? 'left-7' : 'left-1'}`}></div>
                 </button>
              </div>
            ))}
         </div>

         <div className="pt-8 border-t border-slate-100 dark:border-gray-800 flex justify-end">
            <button 
              onClick={handleSave}
              disabled={submitting}
              className="px-10 py-4 bg-slate-900 dark:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:scale-105 transition-all disabled:opacity-50"
            >
               {submitting ? 'Updating System...' : 'Apply Global Configuration'}
            </button>
         </div>
      </div>

      <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-2xl p-6 flex gap-4">
         <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center text-xl shrink-0">⚠️</div>
         <div>
            <h4 className="font-black text-orange-800 dark:text-orange-300 text-sm uppercase tracking-tight">Security Protocol</h4>
            <p className="text-orange-600 dark:text-orange-400 text-sm mt-1 leading-relaxed italic font-medium">
               Changes to these settings are logged and immediately affect the live system for over 4,000+ users. Use caution when publishing results or hall tickets.
            </p>
         </div>
      </div>
    </div>
  );
}
