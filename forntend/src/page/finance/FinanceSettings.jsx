import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function FinanceSettings({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [settings, setSettings] = useState({
    onlinePaymentEnabled: true,
    payrollModuleActive: true,
    expenseLoggingAllowed: true,
    vendorPortalEnabled: false,
    auditTrailLocked: true
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/finance/settings');
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
      await api.put('/api/finance/settings', settings);
      alert('Financial system configuration updated!');
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
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Financial System Configuration</h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm">Control revenue gateways, operational modules, and security parameters</p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[3rem] p-10 shadow-sm space-y-10">
         <div className="space-y-6">
            {[
              { id: 'onlinePaymentEnabled', label: 'Online Fee Gateway', desc: 'Allows students to pay tuition and other fees via the student portal.', icon: '💳' },
              { id: 'payrollModuleActive', label: 'Payroll Disbursement', desc: 'Enables the processing and release of monthly staff salaries.', icon: '💸' },
              { id: 'expenseLoggingAllowed', label: 'Operational Expenditure', desc: 'Allows finance officers to record and categorize daily expenses.', icon: '📉' },
              { id: 'vendorPortalEnabled', label: 'Vendor Management', desc: 'Enables external vendors to submit invoices digitally.', icon: '🤝' },
              { id: 'auditTrailLocked', label: 'Audit Trail Locking', desc: 'Prevents the modification of transaction history for completed months.', icon: '🔒' },
            ].map((s) => (
              <div key={s.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-gray-800/50 rounded-3xl border border-slate-100 dark:border-gray-700 group hover:border-amber-200 transition-all">
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
                   className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${settings[s.id] ? 'bg-amber-600 shadow-lg shadow-amber-500/20' : 'bg-slate-300 dark:bg-gray-700'}`}
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
              className="px-10 py-5 bg-slate-900 dark:bg-amber-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all disabled:opacity-50"
            >
               {submitting ? 'Applying Changes...' : 'Save System Parameters'}
            </button>
         </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-[2rem] p-8 flex gap-5">
         <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-lg shadow-amber-500/20">🛡️</div>
         <div>
            <h4 className="font-black text-amber-800 dark:text-amber-300 text-sm uppercase tracking-tight">Compliance & Integrity</h4>
            <p className="text-amber-600 dark:text-amber-400 text-xs mt-2 leading-relaxed italic font-medium">
               This configuration panel is restricted to the Chief Finance Officer. All modifications are logged in the <strong>Permanent System Audit Log</strong> for regulatory compliance.
            </p>
         </div>
      </div>
    </div>
  );
}
