import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StaffProfile({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/staff/profile');
      setData(res.data);
      setFormData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put('/api/staff/profile', formData);
      setEditing(false);
      fetchProfile();
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Update failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-emerald-500 to-teal-600 opacity-10"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-8">
           <div className="w-40 h-40 bg-white dark:bg-gray-800 rounded-[3rem] border-8 border-white dark:border-gray-900 shadow-2xl flex items-center justify-center text-6xl font-black text-emerald-600">
              {data?.name?.charAt(0) || 'S'}
           </div>
           <div className="flex-1 text-center md:text-left mb-4">
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{data?.name}</h1>
              <p className="text-emerald-600 font-black uppercase tracking-[0.3em] text-sm mt-2">{data?.designation || 'Senior Professor'}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                 <span className="px-4 py-2 bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 rounded-xl text-xs font-bold border border-slate-200 dark:border-gray-700">ID: {data?.staffId || 'STF-1024'}</span>
                 <span className="px-4 py-2 bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 rounded-xl text-xs font-bold border border-slate-200 dark:border-gray-700">Dept: {data?.department?.name || 'Computer Science'}</span>
              </div>
           </div>
           {!editing && (
              <button 
                onClick={() => setEditing(true)}
                className="mb-4 px-8 py-3 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
              >
                Edit Profile
              </button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2rem] p-8 shadow-sm">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Contact Info</h3>
               <div className="space-y-4">
                  <div className="flex items-center gap-4">
                     <span className="text-lg">📧</span>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Personal Email</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-white">{data?.email}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="text-lg">📱</span>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Mobile Number</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-white">{data?.phoneNumber || '+91 98765 43210'}</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-10 shadow-sm h-full">
               <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-8">{editing ? 'Update Profile' : 'Professional Details'}</h3>
               
               <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Qualifications</label>
                     <input 
                        disabled={!editing}
                        value={formData.qualifications || 'Ph.D in AI/ML'}
                        onChange={(e) => setFormData({...formData, qualifications: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-xl px-5 py-4 text-sm font-bold text-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all disabled:opacity-70"
                     />
                  </div>
                  <div>
                     <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Experience (Years)</label>
                     <input 
                        disabled={!editing}
                        type="number"
                        value={formData.experience || 12}
                        onChange={(e) => setFormData({...formData, experience: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-xl px-5 py-4 text-sm font-bold text-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all disabled:opacity-70"
                     />
                  </div>
                  <div className="md:col-span-2">
                     <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Address</label>
                     <textarea 
                        disabled={!editing}
                        rows="3"
                        value={formData.address || '123 Faculty Quarters, Institution Campus.'}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-xl px-5 py-4 text-sm font-bold text-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all disabled:opacity-70"
                     ></textarea>
                  </div>

                  {editing && (
                    <div className="md:col-span-2 flex gap-4 pt-4">
                       <button 
                          type="submit" 
                          disabled={submitting}
                          className="flex-1 py-4 bg-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-500/20"
                       >
                          {submitting ? 'Saving...' : 'Save Changes'}
                       </button>
                       <button 
                          type="button"
                          onClick={() => setEditing(false)}
                          className="flex-1 py-4 bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 font-black text-xs uppercase tracking-widest rounded-2xl border border-slate-200 dark:border-gray-700"
                       >
                          Cancel
                       </button>
                    </div>
                  )}
               </form>
            </div>
         </div>
      </div>
    </div>
  );
}
