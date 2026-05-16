import React, { useState, useEffect } from 'react';
import api from '../../api';

export default function AdminNotifications({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newNotif, setNewNotif] = useState({ title: '', message: '', target: 'ALL', priority: 'NORMAL' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true); setError(null);
    try {
      const res = await api.get('/announcements');
      setNotifications(res.data || []);
    } catch(err) { setError(err.message || 'Failed to fetch announcements'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (newNotif.message.length > 500) return alert('Message too long');
    setIsSubmitting(true);
    try {
      await api.post('/announcements', newNotif);
      setNewNotif({ title: '', message: '', target: 'ALL', priority: 'NORMAL' });
      fetchData();
    } catch (err) { alert('Failed to send notification'); }
    finally { setIsSubmitting(false); }
  };

  const getPriorityBadge = (p) => {
    if(p==='URGENT') return 'bg-red-100 text-red-700 border-red-200';
    if(p==='IMPORTANT') return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-full space-y-6">
      <h1 className="text-2xl font-black text-slate-800">Broadcast Notifications</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <form onSubmit={handleSend} className="bg-white p-6 rounded-2xl border shadow-sm space-y-5">
          <h2 className="font-bold text-slate-800 border-b pb-4">Compose New Broadcast</h2>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Title</label>
            <input required type="text" className="w-full px-4 py-2 bg-slate-50 border rounded-xl font-bold" value={newNotif.title} onChange={e=>setNewNotif({...newNotif,title:e.target.value})} placeholder="e.g. System Maintenance Notice" />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Target Audience</label>
              <select className="w-full px-4 py-2 bg-slate-50 border rounded-xl" value={newNotif.target} onChange={e=>setNewNotif({...newNotif,target:e.target.value})}>
                <option value="ALL">All Users</option>
                <option value="STUDENTS">All Students</option>
                <option value="STAFF">All Staff</option>
                <option value="CSE">CSE Department</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Priority</label>
              <select className="w-full px-4 py-2 bg-slate-50 border rounded-xl" value={newNotif.priority} onChange={e=>setNewNotif({...newNotif,priority:e.target.value})}>
                <option value="NORMAL">Normal</option>
                <option value="IMPORTANT">Important</option>
                <option value="URGENT">Urgent (Push Notif)</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-xs font-bold text-slate-500 uppercase">Message body</label>
              <span className={`text-xs font-bold ${newNotif.message.length>500?'text-red-500':'text-slate-400'}`}>{newNotif.message.length}/500</span>
            </div>
            <textarea required rows="5" className="w-full px-4 py-3 bg-slate-50 border rounded-xl resize-none" value={newNotif.message} onChange={e=>setNewNotif({...newNotif,message:e.target.value})} placeholder="Type message here..."></textarea>
          </div>

          <button type="submit" disabled={isSubmitting || newNotif.message.length>500} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-sm disabled:bg-slate-400 flex justify-center items-center gap-2">
            {isSubmitting ? 'Sending...' : '🚀 Send Broadcast'}
          </button>
        </form>

        <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 border-dashed h-full flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-4 left-4 text-slate-400 text-sm font-bold uppercase tracking-widest">Live Preview</div>
          {newNotif.title || newNotif.message ? (
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border overflow-hidden transition-all transform scale-105">
              <div className={`p-1 ${newNotif.priority==='URGENT'?'bg-red-500':newNotif.priority==='IMPORTANT'?'bg-amber-500':'bg-blue-500'}`}></div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-slate-800 leading-tight">{newNotif.title || 'Notification Title'}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPriorityBadge(newNotif.priority)}`}>{newNotif.priority}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap break-words">{newNotif.message || 'Notification message body will appear here...'}</p>
                <div className="mt-4 flex justify-between items-center text-xs text-slate-400 font-semibold border-t pt-3">
                  <span>Target: {newNotif.target}</span>
                  <span>Just now</span>
                </div>
              </div>
            </div>
          ) : (
             <div className="text-slate-400 font-bold text-center">Start typing to see preview...</div>
          )}
        </div>
      </div>

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <h2 className="p-4 border-b font-bold">Sent History</h2>
        <div className="overflow-x-auto">
          {loading ? <div className="p-6 animate-pulse h-40 bg-slate-200"></div> : error ? <div className="p-6 text-red-500">{error}</div> : (
            <table className="w-full text-left whitespace-nowrap text-sm">
              <thead className="bg-slate-50 border-b text-slate-500 uppercase">
                <tr><th className="p-4">Title</th><th className="p-4">Target</th><th className="p-4">Priority</th><th className="p-4">Date Sent</th><th className="p-4">Sent By</th><th className="p-4 text-right">Read Count</th></tr>
              </thead>
              <tbody className="divide-y">
                {notifications.map((n, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-800">{n.title}</td>
                    <td className="p-4 text-slate-500 font-medium">{n.target}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded text-[10px] font-bold border ${getPriorityBadge(n.priority)}`}>{n.priority}</span></td>
                    <td className="p-4 text-slate-500">{new Date(n.date || Date.now()).toLocaleString()}</td>
                    <td className="p-4">{n.author || 'Admin'}</td>
                    <td className="p-4 text-right font-bold text-blue-600">{n.readCount || 0}</td>
                  </tr>
                ))}
                {!notifications.length && <tr><td colSpan="6" className="p-6 text-center text-slate-400">No sent notifications found</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
