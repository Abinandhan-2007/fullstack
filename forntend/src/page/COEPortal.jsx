import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import api from '../api';

export default function COEPortal({ loggedInEmail, handleLogout }) {
  const [activeTab, setActiveTab] = useState('Workspace');
  const [stats, setStats] = useState({});
  const [examSchedule, setExamSchedule] = useState([]);
  const [results, setResults] = useState([]);
  const [hallTickets, setHallTickets] = useState([]);
  
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const fetchedTabs = useRef(new Set());

  useEffect(() => {
    const role = localStorage.getItem('erp_role');
    if (role !== 'ROLE_COE' && role?.toUpperCase() !== 'COE') window.location.href = '/';
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
      fetchData('stats', () => api.get('/admin/reports/marks'), setStats);
      fetchData('schedule', () => api.get('/exam-schedule'), setExamSchedule);
      fetchedTabs.current.add('Workspace');
    }
    else if (activeTab === 'Exam Schedule') {
      fetchData('schedule', () => api.get('/exam-schedule'), setExamSchedule);
      fetchedTabs.current.add('Exam Schedule');
    }
    else if (activeTab === 'Results') {
      fetchData('results', () => api.get('/results'), setResults);
      fetchedTabs.current.add('Results');
    }
    else if (activeTab === 'Hall Tickets') {
      fetchData('tickets', () => api.get('/hall-tickets'), setHallTickets);
      fetchedTabs.current.add('Hall Tickets');
    }
  }, [activeTab]);

  const handlePublishResults = async () => {
    if(!window.confirm('Publish results for all students?')) return;
    try {
      await api.post('/results/publish');
      showToast('Results published successfully');
      fetchData('results', () => api.get('/results'), setResults);
    } catch(err) { showToast('Publishing failed'); }
  };

  const handleReleaseTickets = async () => {
    if(!window.confirm('Release hall tickets?')) return;
    try {
      await api.post('/hall-tickets/release');
      showToast('Hall tickets released');
      fetchData('tickets', () => api.get('/hall-tickets'), setHallTickets);
    } catch(err) { showToast('Release failed'); }
  };

  const Loader = () => <div className="p-6 animate-pulse space-y-4"><div className="h-4 bg-gray-800 rounded w-1/4"></div><div className="h-32 bg-gray-800 rounded w-full"></div></div>;
  const ErrorCard = ({ msg, retryKey }) => <div className="p-6 text-center text-red-500 bg-red-950/20 rounded-xl border border-red-900/50">{msg} <button onClick={() => fetchedTabs.current.delete(retryKey)} className="ml-2 underline">Retry</button></div>;

  const renderContent = () => {
    switch(activeTab) {
      case 'Workspace':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800"><div className="text-gray-400 text-sm">Exams Scheduled</div><div className="text-3xl font-black text-purple-500">{examSchedule.length}</div></div>
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800"><div className="text-gray-400 text-sm">Results Published</div><div className="text-3xl font-black text-green-500">14</div></div>
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800"><div className="text-gray-400 text-sm">Hall Tickets Released</div><div className="text-3xl font-black text-blue-500">850</div></div>
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800"><div className="text-gray-400 text-sm">Pending Approvals</div><div className="text-3xl font-black text-amber-500">3</div></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-96 overflow-auto">
                <h3 className="font-bold text-white mb-4">Upcoming Exams (Next 5)</h3>
                {examSchedule.slice(0,5).map((e,i) => (
                  <div key={i} className="p-4 bg-gray-950 border border-gray-800 rounded-xl mb-3 flex justify-between items-center">
                    <div><div className="font-bold text-purple-400">{e.subject}</div><div className="text-sm text-gray-500">{e.date} • {e.time}</div></div>
                    <div className="text-amber-500 font-bold text-sm bg-amber-500/10 px-2 py-1 rounded">2 days left</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'Exam Schedule':
        return (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col h-[600px]">
             <div className="p-4 border-b border-gray-800 flex justify-between items-center"><h2 className="font-bold text-white">Master Schedule</h2><button className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl text-sm">+ Add Exam</button></div>
             <div className="flex-1 overflow-auto">
               {loading.schedule ? <Loader/> : errors.schedule ? <ErrorCard msg={errors.schedule} retryKey="Exam Schedule"/> : (
                 <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                   <thead className="bg-gray-950 text-gray-500 uppercase text-xs sticky top-0"><tr><th className="p-4">Subject</th><th className="p-4">Type</th><th className="p-4">Date & Time</th><th className="p-4">Venue</th><th className="p-4 text-center">Status</th></tr></thead>
                   <tbody className="divide-y divide-gray-800">
                     {examSchedule.map((e,i) => <tr key={i} className="hover:bg-gray-800/50"><td className="p-4 font-bold text-white">{e.subject}</td><td className="p-4">{e.type}</td><td className="p-4 text-gray-400">{e.date} • {e.time}</td><td className="p-4">{e.venue}</td><td className="p-4 text-center"><span className="px-2 py-1 text-[10px] font-bold rounded bg-green-500/20 text-green-400 border border-green-500/20">{e.status || 'SCHEDULED'}</span></td></tr>)}
                     {!examSchedule.length && <tr><td colSpan="5" className="p-6 text-center text-gray-500">No exams scheduled</td></tr>}
                   </tbody>
                 </table>
               )}
             </div>
          </div>
        );

      case 'Results':
        return (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col h-[600px]">
             <div className="p-4 border-b border-gray-800 flex justify-between items-center">
               <div className="flex gap-4"><select className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-1.5 text-sm"><option>All Depts</option></select><select className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-1.5 text-sm"><option>All Exams</option></select></div>
               <button onClick={handlePublishResults} className="px-4 py-2 bg-green-600 text-white font-bold rounded-xl text-sm">Publish All Results</button>
             </div>
             <div className="flex-1 overflow-auto">
               {loading.results ? <Loader/> : errors.results ? <ErrorCard msg={errors.results} retryKey="Results"/> : (
                 <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                   <thead className="bg-gray-950 text-gray-500 uppercase text-xs sticky top-0"><tr><th className="p-4">Reg No</th><th className="p-4">Name</th><th className="p-4">Subject</th><th className="p-4 text-right">Score</th><th className="p-4 text-center">Status</th></tr></thead>
                   <tbody className="divide-y divide-gray-800">
                     {results.map((r,i) => <tr key={i} className="hover:bg-gray-800/50"><td className="p-4 font-bold text-white">{r.regNo}</td><td className="p-4">{r.name}</td><td className="p-4 text-purple-400 font-bold">{r.subject}</td><td className="p-4 text-right font-mono">{r.score}/{r.maxScore}</td><td className="p-4 text-center"><span className={`px-2 py-1 text-[10px] font-bold rounded ${r.published?'bg-green-500/20 text-green-400':'bg-amber-500/20 text-amber-400'}`}>{r.published?'PUBLISHED':'DRAFT'}</span></td></tr>)}
                     {!results.length && <tr><td colSpan="5" className="p-6 text-center text-gray-500">No results found</td></tr>}
                   </tbody>
                 </table>
               )}
             </div>
          </div>
        );

      case 'Hall Tickets':
        return (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col h-[600px]">
             <div className="p-4 border-b border-gray-800 flex justify-between items-center"><h2 className="font-bold text-white">Hall Ticket Generation</h2><button onClick={handleReleaseTickets} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-sm">Release Hall Tickets</button></div>
             <div className="flex-1 overflow-auto">
               {loading.tickets ? <Loader/> : errors.tickets ? <ErrorCard msg={errors.tickets} retryKey="Hall Tickets"/> : (
                 <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                   <thead className="bg-gray-950 text-gray-500 uppercase text-xs sticky top-0"><tr><th className="p-4">Reg No</th><th className="p-4">Name</th><th className="p-4">Exam</th><th className="p-4 text-center">Status</th><th className="p-4 text-right">Action</th></tr></thead>
                   <tbody className="divide-y divide-gray-800">
                     {hallTickets.map((h,i) => <tr key={i} className="hover:bg-gray-800/50"><td className="p-4 font-bold text-white">{h.regNo}</td><td className="p-4">{h.name}</td><td className="p-4 text-gray-400">{h.exam}</td><td className="p-4 text-center"><span className={`px-2 py-1 text-[10px] font-bold rounded ${h.released?'bg-green-500/20 text-green-400':'bg-gray-800 text-gray-400'}`}>{h.released?'RELEASED':'UNRELEASED'}</span></td><td className="p-4 text-right"><button className="text-blue-400 hover:text-blue-300 font-bold">Download PDF</button></td></tr>)}
                     {!hallTickets.length && <tr><td colSpan="5" className="p-6 text-center text-gray-500">No records found</td></tr>}
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
          <div className="w-12 h-12 rounded-full bg-gray-800 text-purple-500 flex items-center justify-center font-black border-2 border-purple-500">COE</div>
          <div><h2 className="font-bold text-white leading-tight">COE Portal</h2><p className="text-xs text-gray-500">Controller of Exams</p></div>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-6 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Main</div>
          {['Workspace', 'Exam Schedule', 'Results', 'Hall Tickets', 'Seating Arrangement', 'Reports'].map(tab => (
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
