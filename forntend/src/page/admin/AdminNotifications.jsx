import React, { useState } from 'react';

export default function AdminNotifications() {
  const [recipient, setRecipient] = useState('All');
  const [severity, setSeverity] = useState('Info');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const [history, setHistory] = useState([
      { id: 1, title: 'Fee Deadline Extended', msg: 'Semester fee deadline has been extended to 30th April.', severity: 'Important', time: new Date().toLocaleTimeString(), read: true },
      { id: 2, title: 'Server Maintenance', msg: 'Portal will be down from 2 AM to 4 AM.', severity: 'Urgent', time: new Date(Date.now()-3600000).toLocaleTimeString(), read: false },
      { id: 3, title: 'New Course Added', msg: 'Machine Learning basics added to Electives.', severity: 'Success', time: new Date(Date.now()-86400000).toLocaleTimeString(), read: true },
  ]);

  const handleDispatch = (e) => {
      e.preventDefault();
      if (!title || !message) return alert("Title and Message required.");
      if (scheduleTime) {
          alert(`Message implicitly scheduled for ${scheduleTime}`);
      } else {
          setHistory([{ id: Date.now(), title, msg: message, severity, time: new Date().toLocaleTimeString(), read: false }, ...history]);
          setTitle(''); setMessage(''); setScheduleTime('');
      }
  };

  const toggleRead = (id) => {
      setHistory(history.map(h => h.id === id ? { ...h, read: !h.read } : h));
  };

  const sevConfig = {
      'Urgent': 'bg-rose-50 border-rose-200 text-rose-800',
      'Important': 'bg-amber-50 border-amber-200 text-amber-800',
      'Info': 'bg-blue-50 border-blue-200 text-blue-800',
      'Success': 'bg-emerald-50 border-emerald-200 text-emerald-800',
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Notification Center</h1>
            <p className="text-slate-500 font-medium mt-1">Dispatch targeted push notifications and manage critical announcements.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         
         {/* Composer Panel */}
         <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col">
             <h2 className="text-xl font-black text-slate-800 mb-6 border-b border-slate-100 pb-4">Dispatch New Alert</h2>
             <form onSubmit={handleDispatch} className="flex-1 flex flex-col">
                 <div className="grid grid-cols-2 gap-4 mb-4">
                     <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Target Audience</label>
                         <select value={recipient} onChange={e => setRecipient(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 shadow-sm">
                             <option value="All">All Users (Campus)</option><option value="Staff">All Staff / Faculty</option><option value="Students">All Students</option><option value="CSE">CSE Department Only</option>
                         </select>
                     </div>
                     <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Severity Level</label>
                         <select value={severity} onChange={e => setSeverity(e.target.value)} className={`w-full p-3 rounded-xl text-sm font-bold outline-none shadow-sm border ${sevConfig[severity]}`}>
                             <option value="Info" className="bg-white text-slate-800">Info (Blue)</option>
                             <option value="Important" className="bg-white text-slate-800">Important (Amber)</option>
                             <option value="Urgent" className="bg-white text-slate-800">Urgent (Red)</option>
                             <option value="Success" className="bg-white text-slate-800">Success (Green)</option>
                         </select>
                     </div>
                 </div>

                 <div className="mb-4">
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Alert Title</label>
                     <input type="text" placeholder="e.g., Campus Closure Alert" value={title} onChange={e=>setTitle(e.target.value)} className="w-full bg-white border border-slate-200 p-3 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-indigo-500 shadow-inner" />
                 </div>
                 
                 <div className="mb-4 flex-1">
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Message Body</label>
                     <textarea placeholder="Write announcement details here..." value={message} onChange={e=>setMessage(e.target.value)} className="w-full h-32 bg-white border border-slate-200 p-3 rounded-xl text-sm font-medium text-slate-600 outline-none focus:border-indigo-500 shadow-inner resize-none custom-scrollbar"></textarea>
                 </div>

                 <div className="mb-6">
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Schedule Time (Optional)</label>
                     <input type="datetime-local" value={scheduleTime} onChange={e=>setScheduleTime(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-bold text-slate-500 outline-none focus:border-indigo-500 shadow-sm" />
                 </div>

                 <button type="submit" className="w-full py-4 bg-indigo-600 text-white text-sm font-black rounded-xl shadow-lg hover:bg-indigo-700 transition shadow-indigo-500/30 flex justify-center items-center gap-2"><span>🚀</span> Broadcast Notification</button>
             </form>
         </div>

         {/* Log Panel */}
         <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
             <h2 className="text-xl font-black text-slate-800 mb-6 border-b border-slate-100 pb-4">Dispatch History</h2>
             <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                 {history.map(h => (
                     <div key={h.id} className={`p-4 rounded-2xl border flex flex-col relative group transition-all ${h.read ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'}`}>
                         <button onClick={() => toggleRead(h.id)} className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest bg-slate-200 text-slate-600 hover:bg-slate-300 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                             Mark {h.read ? 'Unread' : 'Read'}
                         </button>
                         <div className="flex items-center gap-2 mb-2">
                            <span className={`w-2 h-2 rounded-full ${h.severity==='Urgent'?'bg-rose-500':h.severity==='Important'?'bg-amber-500':h.severity==='Success'?'bg-emerald-500':'bg-blue-500'}`}></span>
                            <h4 className="text-sm font-black text-slate-800 tracking-tight">{h.title}</h4>
                         </div>
                         <p className="text-xs font-medium text-slate-600 leading-relaxed mb-3">{h.msg}</p>
                         <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-auto">{h.time}</span>
                     </div>
                 ))}
             </div>
         </div>

      </div>
    </div>
  );
}
