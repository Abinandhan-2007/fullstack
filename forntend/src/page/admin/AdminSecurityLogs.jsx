import React, { useState, useEffect } from 'react';
import api from '../../api';

export default function AdminSecurityLogs() {
  const [logs, setLogs] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [dateFilter, setDateFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchEmail, setSearchEmail] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [logsRes, sesRes] = await Promise.all([
        api.get('/admin/security-logs').catch(() => ({ data: [] })),
        api.get('/admin/active-sessions').catch(() => ({ data: [] }))
      ]);
      setLogs(logsRes.data || []);
      setSessions(sesRes.data || []);
    } catch(err){} finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredLogs = logs.filter(l => {
    return (!dateFilter || l.timestamp?.startsWith(dateFilter)) &&
           (!roleFilter || l.role === roleFilter) &&
           (!statusFilter || l.status === statusFilter) &&
           (!searchEmail || l.email?.toLowerCase().includes(searchEmail.toLowerCase()));
  });

  const revokeSession = async (id) => {
    if(!window.confirm('Revoke session? User will be logged out.')) return;
    try {
      await api.delete(`/admin/active-sessions/${id}`);
      fetchData();
    } catch(err) { alert('Failed to revoke'); }
  };

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-full space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-800">Security & Access Logs</h1>
        <button className="px-4 py-2 bg-white border font-bold text-slate-700 rounded-xl shadow-sm">Export CSV</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm"><div className="text-sm text-slate-500">Logins Today</div><div className="text-3xl font-black text-slate-800">{logs.length}</div></div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm"><div className="text-sm text-slate-500">Failed Attempts</div><div className="text-3xl font-black text-red-500">{logs.filter(l=>l.status==='FAILED').length}</div></div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm"><div className="text-sm text-slate-500">Active Sessions</div><div className="text-3xl font-black text-green-500">{sessions.length}</div></div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm"><div className="text-sm text-slate-500">Suspicious Activity</div><div className="text-3xl font-black text-amber-500">{logs.filter(l=>l.status==='SUSPICIOUS').length}</div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b bg-slate-50 grid grid-cols-2 md:grid-cols-4 gap-3">
            <input type="date" className="px-3 py-2 bg-white border rounded-lg text-xs" value={dateFilter} onChange={e=>setDateFilter(e.target.value)} />
            <select className="px-3 py-2 bg-white border rounded-lg text-xs" value={roleFilter} onChange={e=>setRoleFilter(e.target.value)}><option value="">All Roles</option><option>STUDENT</option><option>STAFF</option><option>ADMIN</option></select>
            <select className="px-3 py-2 bg-white border rounded-lg text-xs" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option value="">All Statuses</option><option>SUCCESS</option><option>FAILED</option><option>SUSPICIOUS</option></select>
            <input type="text" placeholder="Search email..." className="px-3 py-2 bg-white border rounded-lg text-xs" value={searchEmail} onChange={e=>setSearchEmail(e.target.value)} />
          </div>
          <div className="flex-1 overflow-auto">
            {loading ? <div className="p-6 animate-pulse h-full bg-slate-200"></div> : (
              <table className="w-full text-left whitespace-nowrap text-sm">
                <thead className="bg-slate-50 sticky top-0 text-xs uppercase text-slate-500 shadow-sm">
                  <tr><th className="p-3">Time</th><th className="p-3">User</th><th className="p-3">Action</th><th className="p-3">IP Address</th><th className="p-3">Status</th></tr>
                </thead>
                <tbody className="divide-y">
                  {filteredLogs.map((l, i) => (
                    <tr key={i} className={`hover:bg-slate-50 ${l.status==='SUSPICIOUS'?'bg-amber-50/50':''}`}>
                      <td className="p-3 text-slate-500 text-xs">{new Date(l.timestamp).toLocaleString()}</td>
                      <td className="p-3"><div className="font-bold">{l.email}</div><div className="text-[10px] bg-slate-100 text-slate-500 inline-block px-1 rounded">{l.role}</div></td>
                      <td className="p-3 font-medium">{l.action}</td>
                      <td className="p-3 text-slate-500 text-xs font-mono">{l.ipAddress}</td>
                      <td className="p-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${l.status==='SUCCESS'?'bg-green-100 text-green-700':l.status==='FAILED'?'bg-red-100 text-red-700':'bg-amber-100 text-amber-800'}`}>{l.status}</span></td>
                    </tr>
                  ))}
                  {!filteredLogs.length && <tr><td colSpan="5" className="p-6 text-center text-slate-500">No logs found</td></tr>}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm flex flex-col h-[600px]">
          <h2 className="p-4 border-b font-bold shrink-0">Active Sessions</h2>
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {sessions.map((s, i) => (
              <div key={i} className="p-3 border rounded-xl flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-sm text-slate-800">{s.email}</div>
                    <div className="text-xs text-slate-500">{s.role} • IP: {s.ipAddress}</div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <div className="flex justify-between items-end border-t border-slate-100 pt-2 mt-1">
                  <div className="text-[10px] text-slate-400">Logged in: {new Date(s.loginTime).toLocaleTimeString()}</div>
                  <button onClick={()=>revokeSession(s.id)} className="text-xs font-bold text-red-500 hover:text-red-700">Revoke</button>
                </div>
              </div>
            ))}
            {!sessions.length && <div className="text-center text-slate-500 py-10">No active sessions.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
