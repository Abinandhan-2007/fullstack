import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StaffAdminSettings({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [settings, setSettings] = useState({
    attendanceEntryOpen: true,
    resultEntryActive: false,
    studentProfileEdit: true,
    timetablePublic: true,
    facultyEvaluationLocked: true
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/staff-admin/settings');
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
      await api.put('/api/staff-admin/settings', settings);
      alert('Departmental operational parameters updated!');
    } catch (err) { alert('Update failed'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight italic underline decoration-sky-500">Departmental Policy Architect</h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm">Configure departmental gateways, academic access tokens and security parameters</p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[3rem] p-10 shadow-sm space-y-10">
         <div className="space-y-6">
            {[
              { id: 'attendanceEntryOpen', label: 'Faculty Attendance Logins', desc: 'Allows faculty members to submit daily attendance for their assigned sessions.', icon: '📊' },
              { id: 'resultEntryActive', label: 'Academic Result Gateway', desc: 'Enables the submission of internal and end-semester examination marks.', icon: '📝' },
              { id: 'studentProfileEdit', label: 'Scholar Profile Mobility', desc: 'Allows students to update their personal contact and address information.', icon: '🎓' },
              { id: 'timetablePublic', label: 'Public Timetable Feed', desc: 'Publishes the master department timetable to the institutional dashboard.', icon: '📅' },
              { id: 'facultyEvaluationLocked', label: 'Evaluation Audit Lock', desc: 'Prevents retroactive modification of faculty performance and feedback logs.', icon: '🔒' },
            ].map((s) => (
              <div key={s.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-gray-800/50 rounded-3xl border border-slate-100 dark:border-gray-700 group hover:border-sky-200 transition-all">
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center text-xl shadow-sm border border-slate-100 dark:border-gray-700">
                       {s.icon}
                    </div>
                    <div>
                       <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight italic">{s.label}</h4>
                       <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 max-w-md font-medium">{s.desc}</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => handleToggle(s.id)}
                   className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${settings[s.id] ? 'bg-sky-600 shadow-lg shadow-sky-500/20' : 'bg-slate-300 dark:bg-gray-700'}`}
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
              className="px-10 py-5 bg-slate-900 dark:bg-sky-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all disabled:opacity-50"
            >
               {submitting ? 'Applying Policy...' : 'Save Dept Configuration'}
            </button>
         </div>
      </div>
    </div>
  );
}
