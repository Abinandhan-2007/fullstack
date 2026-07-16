import React, { useState, useEffect } from 'react';
import api from '../../api';

export default function AdminSettings() {
  const [settings, setSettings] = useState({ name: '', address: '', phone: '', email: '', academicYear: '', semester: '' });
  const [fees, setFees] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingFees, setSavingFees] = useState(false);
  const [backingUp, setBackingUp] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [setRes, feeRes] = await Promise.all([
        api.get('/admin/settings').catch(() => ({ data: { name:'Apex University', academicYear:'2025-2026', semester:'ODD' } })),
        api.get('/fees/structure').catch(() => ({ data: [{id:1, type:'Tuition Fee', amount:45000}, {id:2, type:'Hostel Fee', amount:25000}] }))
      ]);
      setSettings(setRes.data || {});
      setFees(feeRes.data || []);
    } catch(err) {} finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault(); setSavingSettings(true);
    try {
      await api.put('/admin/settings', settings);
      alert('Settings saved!');
    } catch(err) { alert('Failed to save'); } finally { setSavingSettings(false); }
  };

  const handleSaveFees = async () => {
    setSavingFees(true);
    try {
      await api.put('/fees/structure', fees);
      alert('Fee structure updated!');
    } catch(err) { alert('Failed to update fees'); } finally { setSavingFees(false); }
  };

  const handleBackup = async () => {
    setBackingUp(true);
    try {
      await api.post('/admin/backup');
      alert('Backup completed successfully!');
    } catch(err) { alert('Backup failed'); } finally { setBackingUp(false); }
  };

  if (loading) return <div className="p-6 bg-[#F8FAFC] min-h-full"><div className="animate-pulse h-96 bg-slate-200 rounded-2xl w-full"></div></div>;

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-full space-y-6">
      <h1 className="text-2xl font-black text-slate-800">System Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Institute Profile */}
        <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
          <h2 className="font-bold text-lg border-b pb-4">Institution Profile</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Institution Name</label>
               <input className="w-full px-4 py-2 border rounded-xl bg-slate-50 font-bold" value={settings.name||''} onChange={e=>setSettings({...settings,name:e.target.value})} />
            </div>
            <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Academic Year</label>
               <input className="w-full px-4 py-2 border rounded-xl bg-slate-50" value={settings.academicYear||''} onChange={e=>setSettings({...settings,academicYear:e.target.value})} />
            </div>
            <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Current Semester</label>
               <select className="w-full px-4 py-2 border rounded-xl bg-slate-50" value={settings.semester||''} onChange={e=>setSettings({...settings,semester:e.target.value})}>
                 <option>ODD</option><option>EVEN</option>
               </select>
            </div>
            <div className="col-span-2">
               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contact Email</label>
               <input type="email" className="w-full px-4 py-2 border rounded-xl bg-slate-50" value={settings.email||''} onChange={e=>setSettings({...settings,email:e.target.value})} />
            </div>
            <div className="col-span-2">
               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Address</label>
               <textarea rows="2" className="w-full px-4 py-2 border rounded-xl bg-slate-50" value={settings.address||''} onChange={e=>setSettings({...settings,address:e.target.value})}></textarea>
            </div>
          </div>
          <div className="pt-4 border-t flex justify-end">
             <button type="submit" disabled={savingSettings} className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl">{savingSettings?'Saving...':'Save Profile'}</button>
          </div>
        </form>

        {/* Global Configuration */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <div className="flex justify-between items-center mb-4"><h2 className="font-bold text-lg">Fee Structure Configuration</h2><button onClick={handleSaveFees} disabled={savingFees} className="px-4 py-1.5 bg-green-600 text-white text-sm font-bold rounded-lg">{savingFees?'Saving...':'Save All'}</button></div>
            <div className="space-y-3">
              {fees.map((f, i) => (
                <div key={f.id || i} className="flex gap-4 items-center">
                  <input className="flex-1 px-4 py-2 bg-slate-50 border rounded-xl font-medium" value={f.type} onChange={e=>{const nf=[...fees]; nf[i].type=e.target.value; setFees(nf);}} />
                  <span className="font-bold text-slate-400">₹</span>
                  <input type="number" className="w-32 px-4 py-2 bg-slate-50 border rounded-xl font-bold text-right" value={f.amount} onChange={e=>{const nf=[...fees]; nf[i].amount=parseInt(e.target.value); setFees(nf);}} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border shadow-sm border-red-200">
            <h2 className="font-bold text-lg text-red-600 mb-4">System Backup</h2>
            <p className="text-sm text-slate-600 mb-6">Create a full snapshot of the database. This action cannot be undone and may take a few minutes.</p>
            <button onClick={handleBackup} disabled={backingUp} className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold rounded-xl transition-colors">{backingUp?'Generating Backup...':'Run Manual Backup Now'}</button>
          </div>
        </div>

      </div>
    </div>
  );
}
