import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function HostelAllocation({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/hostel/rooms');
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load room allocations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const floors = [...new Set(data.map(r => r.floor))].sort();
  const filteredRooms = data.filter(r => r.floor === selectedFloor);

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Room Allocation Visualizer</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Manage student housing and wing-wise occupancy</p>
        </div>
        <div className="flex gap-2">
           {floors.map(f => (
             <button 
               key={f}
               onClick={() => setSelectedFloor(f)}
               className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
                 selectedFloor === f 
                 ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                 : 'bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-800 text-slate-400'
               }`}
             >
               Floor {f}
             </button>
           ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-10 shadow-sm">
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredRooms.map((room, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-gray-800/50 border border-slate-100 dark:border-gray-700 rounded-3xl p-6 flex flex-col items-center justify-center text-center hover:border-indigo-500 transition-all cursor-pointer group relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-2">
                    <span className={`w-2 h-2 rounded-full block ${
                      room.status === 'FULL' ? 'bg-rose-500' : room.status === 'VACANT' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}></span>
                 </div>
                 
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 group-hover:text-indigo-500 transition-colors">ROOM {room.roomNumber}</span>
                 <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">
                    {room.occupiedCount} / {room.capacity}
                 </p>
                 <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Students</p>
                 
                 <div className="mt-4 flex gap-1">
                    {[...Array(room.capacity)].map((_, i) => (
                       <div key={i} className={`w-3 h-3 rounded-full border border-white dark:border-gray-800 ${i < room.occupiedCount ? 'bg-indigo-500 shadow-sm' : 'bg-slate-200 dark:bg-gray-700'}`}></div>
                    ))}
                 </div>
              </div>
            ))}
            {filteredRooms.length === 0 && (
              <div className="col-span-full py-20 text-center text-slate-300 italic font-medium">No rooms mapped for this floor.</div>
            )}
         </div>

         <div className="mt-12 pt-8 border-t border-slate-50 dark:border-gray-800 flex flex-wrap gap-8 justify-center">
            <div className="flex items-center gap-3">
               <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fully Vacant</span>
            </div>
            <div className="flex items-center gap-3">
               <span className="w-3 h-3 rounded-full bg-amber-500"></span>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Partially Occupied</span>
            </div>
            <div className="flex items-center gap-3">
               <span className="w-3 h-3 rounded-full bg-rose-500"></span>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fully Occupied</span>
            </div>
         </div>
      </div>

      <div className="bg-indigo-900 dark:bg-indigo-900/20 border border-indigo-800 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
         <div>
            <h4 className="text-xl font-black text-white tracking-tight uppercase italic underline decoration-indigo-500">Bulk Reallocation Wizard</h4>
            <p className="text-indigo-200 text-sm mt-1">Start the end-of-semester room shuffling and alumni checkout process.</p>
         </div>
         <button className="px-8 py-4 bg-white text-indigo-900 hover:bg-indigo-50 font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl">
            Launch Wizard
         </button>
      </div>
    </div>
  );
}
