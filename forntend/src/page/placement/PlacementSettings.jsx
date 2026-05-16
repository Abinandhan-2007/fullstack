import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function PlacementSettings({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [settings, setSettings] = useState({
    registrationsOpen: true,
    offerAccessEnabled: true,
    analyticsPublic: false,
    trainingPortalActive: true,
    maintenanceMode: false
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/placement/settings');
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
      await api.put('/api/placement/settings', settings);
      alert('Placement portal parameters updated successfully!');
    } catch (err) { alert('Update failed'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic">Placement System Controls</h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm">Configure recruitment gateways, student access parameters, and data visibility</p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[3rem] p-10 shadow-sm space-y-10">
         <div className="space-y-6">
            {[
              { id: 'registrationsOpen', label: 'Drive Registrations', desc: 'Allows students to register for live campus recruitment drives.', icon: '🚀' },
              { id: 'offerAccessEnabled', label: 'Digital Offer Letters', desc: 'Enables students to view and download verified offer letters.', icon: '📑' },
              { id: 'analyticsPublic', label: 'Placement Transparency', desc: 'Displays placement analytics on the institutional public dashboard.', icon: '📊' },
              { id: 'trainingPortalActive', label: 'Training & Skill Dev', desc: 'Enables the training and workshop registration module.', icon: '🎓' },
              { id: 'maintenanceMode', label: 'Portal Lockdown', desc: 'Suspends all student activities for system maintenance/updates.', icon: '🔒' },
            ].map((s) => (
              <div key={s.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-gray-800/50 rounded-3xl border border-slate-100 dark:border-gray-700 group hover:border-emerald-200 transition-all">
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
                   className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${settings[s.id] ? 'bg-emerald-600 shadow-lg shadow-emerald-500/20' : 'bg-slate-300 dark:bg-gray-700'}`}
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
              className="px-10 py-5 bg-slate-900 dark:bg-emerald-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all disabled:opacity-50"
            >
               {submitting ? 'Applying Changes...' : 'Save Placement Config'}
            </button>
         </div>
      </div>

      <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-[2rem] p-8 flex gap-5">
         <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center text-2xl shrink-0">🛡️</div>
         <div>
            <h4 className="font-black text-emerald-800 dark:text-emerald-300 text-sm uppercase tracking-tight">Access Integrity</h4>
            <p className="text-emerald-600 dark:text-emerald-400 text-xs mt-2 leading-relaxed italic font-medium">
               This panel is strictly for the Training & Placement Officer. All configuration changes are cryptographically logged for auditing.
            </p>
         </div>
      </div>
    </div>
  );
}
