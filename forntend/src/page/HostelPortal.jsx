import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import api from '../api';

export default function HostelPortal({ loggedInEmail, handleLogout }) {
  const [activeTab, setActiveTab] = useState('Workspace');
  const [rooms, setRooms] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [messMenu, setMessMenu] = useState([]);
  
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const fetchedTabs = useRef(new Set());

  useEffect(() => {
    const role = localStorage.getItem('erp_role');
    if (role !== 'ROLE_HOSTEL' && role?.toUpperCase() !== 'HOSTEL') window.location.href = '/';
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
      fetchData('rooms', () => api.get('/hostel/rooms'), setRooms);
      fetchData('complaints', () => api.get('/hostel/complaints'), setComplaints);
      fetchedTabs.current.add('Workspace');
    }
    else if (activeTab === 'Room Allocation' || activeTab === 'Occupancy') {
      fetchData('rooms', () => api.get('/hostel/rooms'), setRooms);
      fetchedTabs.current.add(activeTab);
    }
    else if (activeTab === 'Complaints') {
      fetchData('complaints', () => api.get('/hostel/complaints'), setComplaints);
      fetchedTabs.current.add('Complaints');
    }
    else if (activeTab === 'Mess Menu') {
      fetchData('menu', () => api.get('/hostel/mess-menu'), setMessMenu);
      fetchedTabs.current.add('Mess Menu');
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
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800"><div className="text-gray-400 text-sm">Total Rooms</div><div className="text-3xl font-black text-white">{rooms.length || 0}</div></div>
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800"><div className="text-gray-400 text-sm">Occupied Beds</div><div className="text-3xl font-black text-purple-500">450</div></div>
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800"><div className="text-gray-400 text-sm">Vacant Beds</div><div className="text-3xl font-black text-green-500">120</div></div>
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800"><div className="text-gray-400 text-sm">Pending Complaints</div><div className="text-3xl font-black text-red-500">{complaints.filter(c=>c.status==='OPEN').length}</div></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-96 overflow-auto">
                <h3 className="font-bold text-white mb-4">Recent Maintenance Issues</h3>
                {complaints.slice(0,5).map((c,i) => (
                  <div key={i} className="p-3 bg-gray-950 border border-gray-800 rounded-xl mb-3 flex justify-between">
                    <div><div className="font-bold text-purple-400">Room {c.room} - {c.type}</div><div className="text-xs text-gray-500">{c.description}</div></div>
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded h-fit font-bold">{c.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'Room Allocation':
        return (
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex gap-4 items-end">
              <div className="flex-1"><label className="text-xs text-gray-400 font-bold mb-2 block uppercase tracking-wider">Search Student</label><input type="text" placeholder="Enter Register Number" className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white" /></div>
              <div className="flex-1"><label className="text-xs text-gray-400 font-bold mb-2 block uppercase tracking-wider">Available Rooms</label><select className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white"><option>A Block - Room 101 (2 beds left)</option></select></div>
              <button className="px-5 py-2 bg-purple-600 text-white font-bold rounded-xl h-[42px]">Allocate</button>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col h-[500px]">
               <div className="p-4 border-b border-gray-800 flex justify-between items-center"><h2 className="font-bold text-white">Current Allocations</h2></div>
               <div className="flex-1 overflow-auto">
                 {loading.rooms ? <Loader/> : errors.rooms ? <ErrorCard msg={errors.rooms} retryKey="Room Allocation"/> : (
                   <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                     <thead className="bg-gray-950 text-gray-500 uppercase text-xs sticky top-0"><tr><th className="p-4">Reg No</th><th className="p-4">Name</th><th className="p-4">Block / Room</th><th className="p-4">Bed</th><th className="p-4 text-right">Actions</th></tr></thead>
                     <tbody className="divide-y divide-gray-800">
                       <tr className="hover:bg-gray-800/50"><td className="p-4 font-bold text-white">411421104001</td><td className="p-4">John Doe</td><td className="p-4 text-gray-400">A Block / 101</td><td className="p-4 font-bold text-purple-400">Bed 1</td><td className="p-4 text-right"><button className="text-red-400 font-bold">Deallocate</button></td></tr>
                     </tbody>
                   </table>
                 )}
               </div>
            </div>
          </div>
        );

      case 'Occupancy':
        return (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-[600px] flex flex-col">
            <h2 className="font-bold text-white mb-6">Occupancy Map</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 overflow-auto pb-4">
               {[...Array(24)].map((_,i) => {
                 const beds = Math.floor(Math.random()*4);
                 const status = beds === 0 ? 'bg-red-500/10 border-red-500/50 text-red-500' : beds === 1 ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' : 'bg-green-500/10 border-green-500/50 text-green-500';
                 return (
                   <div key={i} className={`p-4 rounded-xl border text-center cursor-pointer hover:bg-gray-800 transition-colors ${status}`}>
                     <div className="font-bold mb-1">A-{101+i}</div>
                     <div className="text-xs font-bold">{beds} beds free</div>
                   </div>
                 );
               })}
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
          <div className="w-12 h-12 rounded-full bg-gray-800 text-purple-500 flex items-center justify-center font-black border-2 border-purple-500">🏠</div>
          <div><h2 className="font-bold text-white leading-tight">Hostel</h2><p className="text-xs text-gray-500">Accommodation</p></div>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          {['Workspace', 'Room Allocation', 'Occupancy', 'Complaints', 'Mess Menu', 'Reports'].map(tab => (
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
