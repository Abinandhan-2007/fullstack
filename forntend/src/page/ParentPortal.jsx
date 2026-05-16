import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import api from '../api';

export default function ParentPortal({ loggedInEmail, handleLogout }) {
  const [activeTab, setActiveTab] = useState('Workspace');
  const [child, setChild] = useState(null);
  const [marks, setMarks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [fees, setFees] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const fetchedTabs = useRef(new Set());

  useEffect(() => {
    const role = localStorage.getItem('erp_role');
    if (role !== 'ROLE_PARENT' && role?.toUpperCase() !== 'PARENT') window.location.href = '/';
  }, []);

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
    if (!child) {
      fetchData('child', () => api.get('/parent/child-profile'), setChild).then(data => {
        if (!data) setChild({ name: 'Student Name', regNo: '411421104000', department: 'CSE', semester: 'IV', mentor: 'Prof. Smith' });
      });
    }
  }, []);

  useEffect(() => {
    if (!child || fetchedTabs.current.has(activeTab)) return;
    
    if (activeTab === 'Workspace') {
      fetchData('marks', () => api.get(`/marks/student/${child.regNo}`), setMarks);
      fetchData('attendance', () => api.get(`/attendance/student/${child.regNo}`), setAttendance);
      fetchData('fees', () => api.get(`/fees/student/${child.regNo}`), setFees);
      fetchedTabs.current.add('Workspace');
    }
    else if (activeTab === 'Marks') {
      fetchData('marks', () => api.get(`/marks/student/${child.regNo}`), setMarks);
      fetchedTabs.current.add('Marks');
    }
    else if (activeTab === 'Attendance') {
      fetchData('attendance', () => api.get(`/attendance/student/${child.regNo}`), setAttendance);
      fetchedTabs.current.add('Attendance');
    }
    else if (activeTab === 'Fee Status') {
      fetchData('fees', () => api.get(`/fees/student/${child.regNo}`), setFees);
      fetchedTabs.current.add('Fee Status');
    }
    else if (activeTab === 'Announcements') {
      fetchData('announcements', () => api.get('/announcements'), setAnnouncements);
      fetchedTabs.current.add('Announcements');
    }
  }, [activeTab, child]);

  const Loader = () => <div className="p-6 animate-pulse space-y-4"><div className="h-4 bg-gray-800 rounded w-1/4"></div><div className="h-32 bg-gray-800 rounded w-full"></div></div>;
  const ErrorCard = ({ msg, retryKey }) => <div className="p-6 text-center text-red-500 bg-red-950/20 rounded-xl border border-red-900/50">{msg} <button onClick={() => fetchedTabs.current.delete(retryKey)} className="ml-2 underline">Retry</button></div>;

  const renderContent = () => {
    if (!child) return <Loader/>;

    switch(activeTab) {
      case 'Workspace':
        return (
          <div className="space-y-6">
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 flex gap-6 items-center">
              <div className="w-20 h-20 rounded-full bg-gray-800 border-2 border-purple-500 flex items-center justify-center text-2xl font-black text-purple-400">{child.name.charAt(0)}</div>
              <div>
                <h2 className="text-2xl font-bold text-white">{child.name}</h2>
                <p className="text-gray-400 font-mono text-sm">{child.regNo} • {child.department} • Semester {child.semester}</p>
                <div className="mt-2 text-xs text-gray-500">Mentor: <span className="font-bold text-gray-300">{child.mentor}</span></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800"><div className="text-gray-400 text-sm">CGPA</div><div className="text-3xl font-black text-purple-500">8.42</div></div>
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800"><div className="text-gray-400 text-sm">Attendance %</div><div className="text-3xl font-black text-green-500">88%</div></div>
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800"><div className="text-gray-400 text-sm">Pending Fees (₹)</div><div className="text-3xl font-black text-red-500">0</div></div>
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800"><div className="text-gray-400 text-sm">Active Backlogs</div><div className="text-3xl font-black text-white">0</div></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-80 overflow-auto"><h3 className="font-bold text-white mb-4 text-red-400">Attendance Alerts</h3><p className="text-gray-500 text-sm">Attendance is well maintained above 75% in all subjects.</p></div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-80 overflow-auto"><h3 className="font-bold text-white mb-4">Upcoming Exams</h3><p className="text-gray-500 text-sm">No upcoming exams within 7 days.</p></div>
            </div>
          </div>
        );

      case 'Marks':
        return (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl flex flex-col h-[600px]">
             <div className="p-4 border-b border-gray-800"><h2 className="font-bold text-white">Academic Performance</h2></div>
             <div className="flex-1 overflow-auto">
               {loading.marks ? <Loader/> : errors.marks ? <ErrorCard msg={errors.marks} retryKey="Marks"/> : (
                 <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                   <thead className="bg-gray-950 text-gray-500 uppercase text-xs sticky top-0"><tr><th className="p-4">Subject</th><th className="p-4">Exam Type</th><th className="p-4 text-right">Score/Max</th><th className="p-4 text-center">Status</th></tr></thead>
                   <tbody className="divide-y divide-gray-800">
                     {marks.map((m,i) => <tr key={i} className="hover:bg-gray-800/50"><td className="p-4 font-bold text-white">{m.subject}</td><td className="p-4 text-gray-400">{m.examType}</td><td className="p-4 text-right font-mono font-bold text-purple-400">{m.score}/{m.maxScore}</td><td className="p-4 text-center"><span className="px-2 py-1 text-[10px] font-bold rounded bg-green-500/20 text-green-400 border border-green-500/20">PASS</span></td></tr>)}
                     {!marks.length && <tr><td colSpan="4" className="p-6 text-center text-gray-500">No marks published yet</td></tr>}
                   </tbody>
                 </table>
               )}
             </div>
          </div>
        );

      case 'Fee Status':
        return (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl flex flex-col h-[600px]">
             <div className="p-6 border-b border-gray-800 bg-gray-950/50 flex justify-between items-center">
               <div><h2 className="text-2xl font-black text-green-500">All Dues Cleared</h2><p className="text-sm text-gray-500">Total Pending: ₹0</p></div>
               <button className="px-5 py-2.5 bg-gray-800 text-gray-300 font-bold rounded-xl" disabled>Pay Online</button>
             </div>
             <div className="flex-1 overflow-auto p-6">
               <h3 className="font-bold text-white mb-4">Payment History</h3>
               {loading.fees ? <Loader/> : errors.fees ? <ErrorCard msg={errors.fees} retryKey="Fee Status"/> : (
                 <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                   <thead className="bg-gray-950 text-gray-500 uppercase text-xs"><tr><th className="p-3">Type</th><th className="p-3">Amount</th><th className="p-3">Date Paid</th><th className="p-3 text-right">Receipt No</th></tr></thead>
                   <tbody className="divide-y divide-gray-800">
                     {fees.map((f,i) => <tr key={i}><td className="p-3 font-bold text-white">{f.type}</td><td className="p-3 text-green-400 font-bold">₹{f.amount}</td><td className="p-3">{f.date}</td><td className="p-3 text-right font-mono">{f.receiptNo}</td></tr>)}
                     {!fees.length && <tr><td colSpan="4" className="p-4 text-center text-gray-500">No payment records found</td></tr>}
                   </tbody>
                 </table>
               )}
             </div>
          </div>
        );

      case 'Announcements':
        return (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 min-h-[500px]">
             <h2 className="font-bold text-white mb-6">College Announcements</h2>
             {loading.announcements ? <Loader/> : errors.announcements ? <ErrorCard msg={errors.announcements} retryKey="Announcements" /> : (
               <div className="space-y-4">
                 {announcements.map((a,i) => (
                   <div key={i} className="p-4 border border-gray-800 rounded-xl bg-gray-950">
                     <div className="flex justify-between items-start mb-2"><h3 className="font-bold text-purple-400">{a.title}</h3></div>
                     <p className="text-sm text-gray-400 whitespace-pre-wrap">{a.message}</p>
                   </div>
                 ))}
                 {!announcements.length && <p className="text-gray-500">No announcements</p>}
               </div>
             )}
          </div>
        );

      default: return <div className="text-gray-500 text-center py-20">Section under construction</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-200 font-sans overflow-hidden">
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-800 text-purple-500 flex items-center justify-center font-black border-2 border-purple-500">PA</div>
          <div><h2 className="font-bold text-white leading-tight">Parent</h2><p className="text-xs text-gray-500">Observer Portal</p></div>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          {['Workspace', 'Marks', 'Attendance', 'Fee Status', 'Exam Schedule', 'Leave Status', 'Announcements'].map(tab => (
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
