import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import api from '../api';

export default function LibraryPortal({ loggedInEmail, handleLogout }) {
  const [activeTab, setActiveTab] = useState('Workspace');
  const [books, setBooks] = useState([]);
  const [issues, setIssues] = useState([]);
  
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const fetchedTabs = useRef(new Set());

  useEffect(() => {
    const role = localStorage.getItem('erp_role');
    if (role !== 'ROLE_LIBRARY' && role?.toUpperCase() !== 'LIBRARY') window.location.href = '/';
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
      fetchData('books', () => api.get('/library/books'), setBooks);
      fetchData('issues', () => api.get('/library/issues'), setIssues);
      fetchedTabs.current.add('Workspace');
    }
    else if (activeTab === 'Book Catalogue') {
      fetchData('books', () => api.get('/library/books'), setBooks);
      fetchedTabs.current.add('Book Catalogue');
    }
    else if (activeTab === 'Issue Book' || activeTab === 'Return Book' || activeTab === 'Overdue') {
      fetchData('issues', () => api.get('/library/issues'), setIssues);
      fetchedTabs.current.add(activeTab);
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
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800"><div className="text-gray-400 text-sm">Total Books</div><div className="text-3xl font-black text-white">{books.length || 0}</div></div>
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800"><div className="text-gray-400 text-sm">Books Issued</div><div className="text-3xl font-black text-purple-500">{issues.length || 0}</div></div>
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800"><div className="text-gray-400 text-sm">Overdue Alerts</div><div className="text-3xl font-black text-red-500">{issues.filter(i=>new Date(i.dueDate) < new Date()).length}</div></div>
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800"><div className="text-gray-400 text-sm">Fines Collected (₹)</div><div className="text-3xl font-black text-green-500">2400</div></div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-96 overflow-auto">
               <h3 className="font-bold text-white mb-4">Recent Book Issues</h3>
               <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                 <thead className="bg-gray-950 text-gray-500 uppercase text-xs sticky top-0"><tr><th className="p-3">Book</th><th className="p-3">Student</th><th className="p-3">Issue Date</th><th className="p-3">Due Date</th></tr></thead>
                 <tbody className="divide-y divide-gray-800">
                   {issues.slice(0,5).map((i,idx) => <tr key={idx}><td className="p-3 font-bold">{i.bookTitle}</td><td className="p-3">{i.studentRegNo}</td><td className="p-3">{i.issueDate}</td><td className="p-3 text-purple-400">{i.dueDate}</td></tr>)}
                   {!issues.length && <tr><td colSpan="4" className="p-4 text-center text-gray-500">No recent issues</td></tr>}
                 </tbody>
               </table>
            </div>
          </div>
        );

      case 'Book Catalogue':
        return (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl flex flex-col h-[600px]">
             <div className="p-4 border-b border-gray-800 flex justify-between items-center"><h2 className="font-bold text-white">Catalogue Master</h2><button className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl text-sm">+ Add Book</button></div>
             <div className="p-4 border-b border-gray-800 bg-gray-950/50"><input type="text" placeholder="Search title, author, ISBN..." className="w-full max-w-md px-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white" /></div>
             <div className="flex-1 overflow-auto">
               {loading.books ? <Loader/> : errors.books ? <ErrorCard msg={errors.books} retryKey="Book Catalogue"/> : (
                 <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                   <thead className="bg-gray-950 text-gray-500 uppercase text-xs sticky top-0"><tr><th className="p-4">Title</th><th className="p-4">Author</th><th className="p-4">Category</th><th className="p-4 text-center">Available/Total</th><th className="p-4 text-right">Actions</th></tr></thead>
                   <tbody className="divide-y divide-gray-800">
                     {books.map((b,i) => (
                       <tr key={i} className="hover:bg-gray-800/50">
                         <td className="p-4 font-bold text-white">{b.title} <div className="text-[10px] text-gray-500 font-mono">ISBN: {b.isbn}</div></td><td className="p-4">{b.author}</td><td className="p-4 text-purple-400">{b.category}</td>
                         <td className="p-4 text-center font-mono font-bold"><span className={b.availableCopies<2?'text-red-500':'text-green-500'}>{b.availableCopies}</span> / {b.totalCopies}</td>
                         <td className="p-4 text-right"><button className="text-blue-400 font-bold px-2">Edit</button><button className="text-red-500 font-bold px-2">Del</button></td>
                       </tr>
                     ))}
                     {!books.length && <tr><td colSpan="5" className="p-6 text-center text-gray-500">No books found</td></tr>}
                   </tbody>
                 </table>
               )}
             </div>
          </div>
        );

      case 'Overdue':
        return (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl flex flex-col h-[600px]">
             <div className="p-4 border-b border-gray-800 flex justify-between items-center"><h2 className="font-bold text-red-500">Overdue Returns & Fines</h2><button className="px-4 py-2 bg-red-600/20 text-red-500 border border-red-500/50 font-bold rounded-xl text-sm">Bulk Reminders</button></div>
             <div className="flex-1 overflow-auto">
               {loading.issues ? <Loader/> : errors.issues ? <ErrorCard msg={errors.issues} retryKey="Overdue"/> : (
                 <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                   <thead className="bg-gray-950 text-gray-500 uppercase text-xs sticky top-0"><tr><th className="p-4">Student</th><th className="p-4">Book</th><th className="p-4">Due Date</th><th className="p-4 text-center">Days Overdue</th><th className="p-4 text-right">Fine (₹)</th><th className="p-4 text-right">Action</th></tr></thead>
                   <tbody className="divide-y divide-gray-800">
                     {issues.filter(i=>new Date(i.dueDate)<new Date()).map((o,i) => (
                       <tr key={i} className="hover:bg-gray-800/50"><td className="p-4 font-bold text-white">{o.studentRegNo}</td><td className="p-4">{o.bookTitle}</td><td className="p-4 text-amber-500">{o.dueDate}</td><td className="p-4 text-center font-bold text-red-500">{Math.floor((new Date()-new Date(o.dueDate))/86400000)}</td><td className="p-4 text-right font-mono font-bold text-white">₹{Math.floor((new Date()-new Date(o.dueDate))/86400000)*2}</td><td className="p-4 text-right"><button className="text-blue-400 font-bold">Remind</button></td></tr>
                     ))}
                     {!issues.filter(i=>new Date(i.dueDate)<new Date()).length && <tr><td colSpan="6" className="p-6 text-center text-green-500 font-bold">No overdue books!</td></tr>}
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
          <div className="w-12 h-12 rounded-full bg-gray-800 text-purple-500 flex items-center justify-center font-black border-2 border-purple-500">📚</div>
          <div><h2 className="font-bold text-white leading-tight">Library</h2><p className="text-xs text-gray-500">Resource Hub</p></div>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          {['Workspace', 'Book Catalogue', 'Issue Book', 'Return Book', 'Overdue', 'Reports'].map(tab => (
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
