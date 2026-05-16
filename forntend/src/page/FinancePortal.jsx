import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import api from '../api';

export default function FinancePortal({ loggedInEmail, handleLogout }) {
  const [activeTab, setActiveTab] = useState('Workspace');
  const [stats, setStats] = useState({});
  const [feeStructure, setFeeStructure] = useState([]);
  const [payments, setPayments] = useState([]);
  const [defaulters, setDefaulters] = useState([]);
  
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const fetchedTabs = useRef(new Set());

  useEffect(() => {
    const role = localStorage.getItem('erp_role');
    if (role !== 'ROLE_FINANCE' && role?.toUpperCase() !== 'FINANCE') window.location.href = '/';
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
      fetchData('stats', () => api.get('/fees/stats'), setStats);
      fetchData('payments', () => api.get('/fees/all'), setPayments);
      fetchedTabs.current.add('Workspace');
    }
    else if (activeTab === 'Fee Structure') {
      fetchData('structure', () => api.get('/fees/structure'), setFeeStructure);
      fetchedTabs.current.add('Fee Structure');
    }
    else if (activeTab === 'Payment Records') {
      fetchData('payments', () => api.get('/fees/all'), setPayments);
      fetchedTabs.current.add('Payment Records');
    }
    else if (activeTab === 'Defaulters') {
      fetchData('defaulters', () => api.get('/fees/defaulters'), setDefaulters);
      fetchedTabs.current.add('Defaulters');
    }
  }, [activeTab]);

  const Loader = () => <div className="p-6 animate-pulse space-y-4"><div className="h-4 bg-gray-800 rounded w-1/4"></div><div className="h-32 bg-gray-800 rounded w-full"></div></div>;
  const ErrorCard = ({ msg, retryKey }) => <div className="p-6 text-center text-red-500 bg-red-950/20 rounded-xl border border-red-900/50">{msg} <button onClick={() => fetchedTabs.current.delete(retryKey)} className="ml-2 underline">Retry</button></div>;

  const renderContent = () => {
    switch(activeTab) {
      case 'Workspace':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800"><div className="text-gray-400 text-sm">Total Collected (₹)</div><div className="text-3xl font-black text-green-500">4.5M</div></div>
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800"><div className="text-gray-400 text-sm">Pending Dues (₹)</div><div className="text-3xl font-black text-red-500">1.2M</div></div>
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800"><div className="text-gray-400 text-sm">Defaulter Count</div><div className="text-3xl font-black text-amber-500">142</div></div>
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800"><div className="text-gray-400 text-sm">Transactions Today</div><div className="text-3xl font-black text-purple-500">85</div></div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-96 overflow-auto">
               <h3 className="font-bold text-white mb-4">Recent Payments</h3>
               <table className="w-full text-left text-sm text-gray-300">
                 <thead className="bg-gray-950 text-gray-500 uppercase text-xs sticky top-0"><tr><th className="p-3">Reg No</th><th className="p-3">Amount</th><th className="p-3">Date</th><th className="p-3">Receipt No</th></tr></thead>
                 <tbody className="divide-y divide-gray-800">
                   {payments.slice(0,5).map((p,i) => <tr key={i}><td className="p-3 font-bold">{p.regNo}</td><td className="p-3 text-green-400 font-bold">₹{p.amount}</td><td className="p-3">{p.date}</td><td className="p-3 font-mono">{p.receiptNo}</td></tr>)}
                   {!payments.length && <tr><td colSpan="4" className="p-4 text-center text-gray-500">No recent payments</td></tr>}
                 </tbody>
               </table>
            </div>
          </div>
        );

      case 'Fee Structure':
        return (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl flex flex-col h-[600px]">
             <div className="p-4 border-b border-gray-800 flex justify-between items-center"><h2 className="font-bold text-white">Master Fee Structure</h2><button className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl text-sm">+ Add Fee Type</button></div>
             <div className="flex-1 overflow-auto">
               {loading.structure ? <Loader/> : errors.structure ? <ErrorCard msg={errors.structure} retryKey="Fee Structure"/> : (
                 <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                   <thead className="bg-gray-950 text-gray-500 uppercase text-xs sticky top-0"><tr><th className="p-4">Fee Type</th><th className="p-4">Dept / Year</th><th className="p-4 text-right">Amount (₹)</th><th className="p-4">Due Date</th><th className="p-4 text-right">Actions</th></tr></thead>
                   <tbody className="divide-y divide-gray-800">
                     {feeStructure.map((f,i) => <tr key={i} className="hover:bg-gray-800/50"><td className="p-4 font-bold text-white">{f.type}</td><td className="p-4 text-gray-400">{f.dept} / {f.year}</td><td className="p-4 text-right font-bold text-purple-400">₹{f.amount}</td><td className="p-4">{f.dueDate}</td><td className="p-4 text-right"><button className="text-blue-400 font-bold">Edit</button></td></tr>)}
                     {!feeStructure.length && <tr><td colSpan="5" className="p-6 text-center text-gray-500">No fee structures found</td></tr>}
                   </tbody>
                 </table>
               )}
             </div>
          </div>
        );

      case 'Defaulters':
        return (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl flex flex-col h-[600px]">
             <div className="p-4 border-b border-gray-800 flex justify-between items-center"><h2 className="font-bold text-red-500">Pending Dues & Defaulters</h2><button className="px-4 py-2 bg-red-600/20 text-red-500 border border-red-500/50 font-bold rounded-xl text-sm">Bulk Send Reminders</button></div>
             <div className="flex-1 overflow-auto">
               {loading.defaulters ? <Loader/> : errors.defaulters ? <ErrorCard msg={errors.defaulters} retryKey="Defaulters"/> : (
                 <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                   <thead className="bg-gray-950 text-gray-500 uppercase text-xs sticky top-0"><tr><th className="p-4">Reg No</th><th className="p-4">Name</th><th className="p-4 text-right">Pending Amount</th><th className="p-4">Overdue Since</th><th className="p-4 text-right">Action</th></tr></thead>
                   <tbody className="divide-y divide-gray-800">
                     {defaulters.map((d,i) => <tr key={i} className="hover:bg-gray-800/50"><td className="p-4 font-bold text-white">{d.regNo}</td><td className="p-4">{d.name}</td><td className="p-4 text-right font-bold text-red-400">₹{d.pendingAmount}</td><td className="p-4 text-amber-500">{d.overdueSince}</td><td className="p-4 text-right"><button className="text-blue-400 font-bold">Send Reminder</button></td></tr>)}
                     {!defaulters.length && <tr><td colSpan="5" className="p-6 text-center text-green-500 font-bold">No defaulters! All dues cleared.</td></tr>}
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
          <div className="w-12 h-12 rounded-full bg-gray-800 text-purple-500 flex items-center justify-center font-black border-2 border-purple-500">₹</div>
          <div><h2 className="font-bold text-white leading-tight">Finance</h2><p className="text-xs text-gray-500">Accounts & Billing</p></div>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          {['Workspace', 'Fee Structure', 'Payment Records', 'Defaulters', 'Receipt Management', 'Reports'].map(tab => (
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
