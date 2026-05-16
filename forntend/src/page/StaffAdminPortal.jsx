import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import api from '../api';

export default function StaffAdminPortal({ loggedInEmail, handleLogout }) {
  const [activeTab, setActiveTab] = useState('Workspace');
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const fetchedTabs = useRef(new Set());

  useEffect(() => {
    const role = localStorage.getItem('erp_role');
    if (role !== 'ROLE_STAFFADMIN' && role?.toUpperCase() !== 'STAFFADMIN') window.location.href = '/';
  }, []);

  const showToast = (msg) => { alert(msg); };

  const fetchData = async (key, apiCall, setter) => {
    setLoading(prev => ({ ...prev, [key]: true }));
    setErrors(prev => ({ ...prev, [key]: null }));
    try {
      const res = await apiCall();
      setter(res.data);
      return res.data;
    } catch (err) {
      setErrors(prev => ({ ...prev, [key]: err.message || 'Failed' }));
      return null;
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  useEffect(() => {
    if (fetchedTabs.current.has(activeTab)) return;
    if (activeTab === 'Workspace') {
      fetchData('leaveRequests', () => api.get('/staffadmin/leave-requests'), setLeaveRequests);
      fetchedTabs.current.add('Workspace');
    }
    else if (activeTab === 'Leave Management') {
      fetchData('leaveRequests', () => api.get('/staffadmin/leave-requests'), setLeaveRequests);
      fetchedTabs.current.add('Leave Management');
    }
    else if (activeTab === 'Staff Attendance' || activeTab === 'Payroll') {
      fetchData('staffList', () => api.get('/staffadmin/staff'), setStaffList);
      fetchedTabs.current.add(activeTab);
    }
    else if (activeTab === 'Announcements') {
      fetchData('announcements', () => api.get('/announcements'), setAnnouncements);
      fetchedTabs.current.add('Announcements');
    }
  }, [activeTab]);

  const Loader = () => <div className="p-6 animate-pulse space-y-4"><div className="h-4 bg-gray-800 rounded w-1/4"></div><div className="h-32 bg-gray-800 rounded w-full"></div></div>;
  const ErrorCard = ({ msg, retryKey }) => <div className="p-6 text-center text-red-500 bg-red-950/20 rounded-xl border border-red-900/50">{msg} <button onClick={() => fetchedTabs.current.delete(retryKey)} className="ml-2 underline">Retry</button></div>;

  const handleApproveLeave = async (id) => {
    try {
      await api.put(`/staffadmin/leave-requests/${id}/approve`);
      showToast('Leave Approved');
      fetchData('leaveRequests', () => api.get('/staffadmin/leave-requests'), setLeaveRequests);
    } catch(err) { showToast('Approval failed'); }
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'Workspace':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800"><div className="text-gray-400 text-sm">Staff Present Today</div><div className="text-3xl font-black text-green-500">145</div></div>
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800"><div className="text-gray-400 text-sm">Leave Requests Pending</div><div className="text-3xl font-black text-amber-500">{leaveRequests.filter(l=>l.status==='PENDING').length}</div></div>
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800"><div className="text-gray-400 text-sm">On Duty Today</div><div className="text-3xl font-black text-blue-500">8</div></div>
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800"><div className="text-gray-400 text-sm">Total Staff</div><div className="text-3xl font-black text-white">160</div></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-96 overflow-auto">
                <h3 className="font-bold text-white mb-4 text-amber-400">Action Required: Leave Approvals</h3>
                {leaveRequests.filter(l=>l.status==='PENDING').slice(0,5).map((l,i) => (
                  <div key={i} className="p-4 bg-gray-950 border border-gray-800 rounded-xl mb-3 flex justify-between items-center">
                    <div><div className="font-bold text-white">{l.staffName}</div><div className="text-xs text-gray-500">{l.type} • {l.days} days</div></div>
                    <div className="flex gap-2"><button onClick={()=>handleApproveLeave(l.id)} className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/50 rounded text-xs font-bold hover:bg-green-500 hover:text-white transition-colors">Approve</button></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'Leave Management':
        return (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col h-[600px]">
             <div className="p-4 border-b border-gray-800"><h2 className="font-bold text-white">All Leave Requests</h2></div>
             <div className="flex-1 overflow-auto">
               {loading.leaveRequests ? <Loader/> : errors.leaveRequests ? <ErrorCard msg={errors.leaveRequests} retryKey="Leave Management"/> : (
                 <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                   <thead className="bg-gray-950 text-gray-500 uppercase text-xs sticky top-0"><tr><th className="p-4">Staff Name</th><th className="p-4">Leave Type</th><th className="p-4">From - To</th><th className="p-4 text-center">Days</th><th className="p-4 text-center">Status</th><th className="p-4 text-right">Actions</th></tr></thead>
                   <tbody className="divide-y divide-gray-800">
                     {leaveRequests.map((l,i) => <tr key={i} className="hover:bg-gray-800/50"><td className="p-4 font-bold text-white">{l.staffName}</td><td className="p-4">{l.type}</td><td className="p-4 text-gray-400">{l.from} to {l.to}</td><td className="p-4 text-center font-bold text-purple-400">{l.days}</td><td className="p-4 text-center"><span className={`px-2 py-1 text-[10px] font-bold rounded ${l.status==='APPROVED'?'bg-green-500/20 text-green-400':l.status==='REJECTED'?'bg-red-500/20 text-red-400':'bg-amber-500/20 text-amber-400'}`}>{l.status}</span></td><td className="p-4 text-right">{l.status==='PENDING' && <button onClick={()=>handleApproveLeave(l.id)} className="text-green-400 font-bold px-2">Approve</button>}</td></tr>)}
                     {!leaveRequests.length && <tr><td colSpan="6" className="p-6 text-center text-gray-500">No leave requests found</td></tr>}
                   </tbody>
                 </table>
               )}
             </div>
          </div>
        );

      case 'Payroll':
        return (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl flex flex-col h-[600px]">
             <div className="p-4 border-b border-gray-800 flex justify-between items-center"><h2 className="font-bold text-white">Payroll Processing</h2><button className="px-4 py-2 bg-green-600 text-white font-bold rounded-xl text-sm">Process Payroll</button></div>
             <div className="flex-1 overflow-auto">
               {loading.staffList ? <Loader/> : errors.staffList ? <ErrorCard msg={errors.staffList} retryKey="Payroll"/> : (
                 <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                   <thead className="bg-gray-950 text-gray-500 uppercase text-xs sticky top-0"><tr><th className="p-4">Staff Name</th><th className="p-4">Designation</th><th className="p-4 text-right">Net Pay (₹)</th><th className="p-4 text-center">Status</th></tr></thead>
                   <tbody className="divide-y divide-gray-800">
                     {staffList.map((s,i) => <tr key={i} className="hover:bg-gray-800/50"><td className="p-4 font-bold text-white">{s.name}</td><td className="p-4 text-gray-400">{s.designation}</td><td className="p-4 text-right font-bold text-green-500">55,000</td><td className="p-4 text-center"><span className="px-2 py-1 text-[10px] font-bold rounded bg-amber-500/20 text-amber-400">PENDING</span></td></tr>)}
                     {!staffList.length && <tr><td colSpan="4" className="p-6 text-center text-gray-500">No staff found</td></tr>}
                   </tbody>
                 </table>
               )}
             </div>
          </div>
        );

      default: return <div className="text-gray-500 text-center py-20">Section under construction</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-200 font-sans overflow-hidden">
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-800 text-purple-500 flex items-center justify-center font-black border-2 border-purple-500">HR</div>
          <div><h2 className="font-bold text-white leading-tight">Staff Admin</h2><p className="text-xs text-gray-500">HR Management</p></div>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          {['Workspace', 'Leave Management', 'Staff Attendance', 'Payroll', 'Announcements', 'Profile'].map(tab => (
            <button key={tab} onClick={()=>setActiveTab(tab)} className={`w-full text-left px-6 py-2.5 text-sm font-semibold transition-colors ${activeTab===tab?'bg-purple-500/10 text-purple-400 border-r-4 border-purple-500':'text-gray-400 hover:text-white hover:bg-gray-800'}`}>{tab}</button>
          ))}
        </div>
        <div className="p-4 border-t border-gray-800">
          <button onClick={()=>{localStorage.clear(); window.location.href='/';}} className="w-full py-2.5 bg-gray-800 hover:bg-red-900/50 hover:text-red-400 text-gray-400 font-bold rounded-xl transition-colors">Logout</button>
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 bg-gray-900 border-b border-gray-800 flex items-center px-8 shrink-0"><h1 className="text-xl font-black text-white">{activeTab}</h1></div>
        <div className="flex-1 overflow-y-auto p-8">{renderContent()}</div>
      </div>
    </div>
  );
}
