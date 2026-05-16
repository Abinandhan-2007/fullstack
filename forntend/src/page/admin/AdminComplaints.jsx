import React, { useState, useEffect, useMemo } from 'react';
import api from '../../api';

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComp, setSelectedComp] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true); setError(null);
    try {
      const res = await api.get('/admin/complaints');
      setComplaints(res.data || []);
    } catch (err) { setError(err.message || 'Failed to fetch complaints'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const stats = useMemo(() => {
    return {
      total: complaints.length,
      open: complaints.filter(c => c.status === 'OPEN').length,
      progress: complaints.filter(c => c.status === 'IN_PROGRESS').length,
      resolved: complaints.filter(c => c.status === 'RESOLVED').length
    };
  }, [complaints]);

  const filtered = useMemo(() => {
    if (activeTab === 'All') return complaints;
    if (activeTab === 'In Progress') return complaints.filter(c => c.status === 'IN_PROGRESS');
    return complaints.filter(c => c.status === activeTab.toUpperCase());
  }, [complaints, activeTab]);

  const handleUpdate = async (statusOverride = null) => {
    if (!selectedComp) return;
    setIsSubmitting(true);
    try {
      const payload = { ...selectedComp, resolutionNotes: resolutionNote };
      if (statusOverride) payload.status = statusOverride;
      
      await api.put(`/admin/complaints/${selectedComp.id}`, payload);
      setIsModalOpen(false);
      fetchData();
    } catch(err) { alert('Failed to update complaint'); }
    finally { setIsSubmitting(false); }
  };

  const getPriorityColor = (p) => {
    if(p==='HIGH') return 'bg-red-100 text-red-700';
    if(p==='MEDIUM') return 'bg-amber-100 text-amber-700';
    return 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-full space-y-6">
      <h1 className="text-2xl font-black text-slate-800">Helpdesk & Complaints</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm"><div className="text-slate-500 text-sm">Total</div><div className="text-3xl font-black text-slate-800">{stats.total}</div></div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm"><div className="text-slate-500 text-sm">Open</div><div className="text-3xl font-black text-red-500">{stats.open}</div></div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm"><div className="text-slate-500 text-sm">In Progress</div><div className="text-3xl font-black text-amber-500">{stats.progress}</div></div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm"><div className="text-slate-500 text-sm">Resolved</div><div className="text-3xl font-black text-green-500">{stats.resolved}</div></div>
      </div>

      <div className="bg-white border rounded-2xl shadow-sm flex flex-col">
        <div className="flex border-b px-4 pt-4 gap-6">
          {['All', 'Open', 'In Progress', 'Resolved'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 font-bold text-sm px-2 border-b-2 transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{tab}</button>
          ))}
        </div>

        <div className="overflow-x-auto">
          {loading ? <div className="p-6 animate-pulse h-64 bg-slate-200"></div> : error ? <div className="p-6 text-red-500 bg-red-50">{error}</div> : (
            <table className="w-full text-left whitespace-nowrap text-sm">
              <thead className="bg-slate-50 border-b text-slate-500 uppercase">
                <tr><th className="p-4">ID</th><th className="p-4">User</th><th className="p-4">Type</th><th className="p-4">Priority</th><th className="p-4">Date</th><th className="p-4">Status</th><th className="p-4">Assign To</th></tr>
              </thead>
              <tbody className="divide-y cursor-pointer">
                {filtered.map(c => (
                  <tr key={c.id} onClick={() => { setSelectedComp(c); setResolutionNote(c.resolutionNotes||''); setIsModalOpen(true); }} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-blue-600">#{c.id}</td>
                    <td className="p-4 font-bold">{c.userEmail}</td>
                    <td className="p-4">{c.type}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${getPriorityColor(c.priority)}`}>{c.priority}</span></td>
                    <td className="p-4 text-slate-500">{new Date(c.date).toLocaleDateString()}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${c.status==='OPEN'?'bg-red-100 text-red-700':c.status==='RESOLVED'?'bg-green-100 text-green-700':'bg-amber-100 text-amber-700'}`}>{c.status}</span></td>
                    <td className="p-4" onClick={e=>e.stopPropagation()}>
                       <select className="px-2 py-1 bg-white border rounded outline-none" value={c.assignedTo||''} onChange={async (e) => {
                         await api.put(`/admin/complaints/${c.id}`, {...c, assignedTo: e.target.value});
                         fetchData();
                       }}>
                         <option value="">Unassigned</option>
                         <option value="IT_SUPPORT">IT Support</option>
                         <option value="MAINTENANCE">Maintenance</option>
                         <option value="WARDEN">Warden</option>
                       </select>
                    </td>
                  </tr>
                ))}
                {!filtered.length && <tr><td colSpan="7" className="p-6 text-center text-slate-400">No complaints found.</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && selectedComp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
              <div><h2 className="font-bold text-slate-800">Complaint #{selectedComp.id}</h2><div className="text-xs text-slate-500">{new Date(selectedComp.date).toLocaleString()}</div></div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-1">From</h3>
                <p className="font-bold text-slate-800">{selectedComp.userEmail}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-1">Type & Priority</h3>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-slate-100 rounded text-sm font-bold">{selectedComp.type}</span>
                  <span className={`px-2 py-1 rounded text-sm font-bold ${getPriorityColor(selectedComp.priority)}`}>{selectedComp.priority}</span>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-1">Description</h3>
                <p className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">{selectedComp.description}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Resolution Notes</h3>
                <textarea rows="4" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500" placeholder="Type notes here..." value={resolutionNote} onChange={e=>setResolutionNote(e.target.value)}></textarea>
              </div>
            </div>
            <div className="p-4 border-t bg-slate-50 flex flex-wrap justify-end gap-2">
              <button onClick={() => handleUpdate('OPEN')} disabled={isSubmitting} className="px-4 py-2 bg-red-100 text-red-700 font-bold rounded-xl hover:bg-red-200">Reopen</button>
              <button onClick={() => handleUpdate('IN_PROGRESS')} disabled={isSubmitting} className="px-4 py-2 bg-amber-100 text-amber-700 font-bold rounded-xl hover:bg-amber-200">Mark In Progress</button>
              <button onClick={() => handleUpdate('RESOLVED')} disabled={isSubmitting} className="px-4 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700">Resolve & Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
