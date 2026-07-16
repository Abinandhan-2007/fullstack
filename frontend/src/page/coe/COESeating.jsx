import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function COESeating({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/coe/seating');
      setData(res.data);
      const uniqueRooms = [...new Set(res.data.map(s => s.roomNumber))];
      setRooms(uniqueRooms);
      if (uniqueRooms.length > 0) setSelectedRoom(uniqueRooms[0]);
    } catch (err) {
      setError(err.message || 'Failed to load seating arrangements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredSeating = data.filter(s => s.roomNumber === selectedRoom);

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-48 bg-slate-200 dark:bg-gray-800 rounded-xl"></div>
      <div className="h-96 bg-slate-200 dark:bg-gray-800 rounded-[2.5rem]"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Seating Arrangement</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Organize and verify examination hall allocations</p>
        </div>
        <div className="flex gap-3">
           <button className="px-6 py-3 bg-slate-900 dark:bg-orange-600 text-white rounded-xl font-bold hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-orange-500/10">
              <span>🖨️</span> Print Seating Plan
           </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
         <div className="p-8 border-b border-slate-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Hall Visualizer</h3>
            <div className="flex gap-2">
               {rooms.map(room => (
                 <button 
                   key={room}
                   onClick={() => setSelectedRoom(room)}
                   className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
                     selectedRoom === room 
                     ? 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 text-orange-600' 
                     : 'bg-slate-50 dark:bg-gray-800 border-slate-100 dark:border-gray-700 text-slate-400'
                   }`}
                 >
                   Room {room}
                 </button>
               ))}
            </div>
         </div>

         <div className="p-10 flex-1 bg-slate-50/30 dark:bg-gray-950/30">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
               {filteredSeating.map((seat, idx) => (
                 <div key={idx} className="aspect-square bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-sm hover:border-orange-300 dark:hover:border-orange-800 transition-all cursor-pointer group">
                    <span className="text-[10px] font-black text-slate-300 group-hover:text-orange-400 transition-colors">SEAT {seat.seatNumber || (idx + 1)}</span>
                    <p className="text-[10px] font-black text-slate-800 dark:text-white mt-1 uppercase tracking-tighter">{seat.student?.regNo}</p>
                    <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">{seat.student?.department?.shortForm}</p>
                 </div>
               ))}
               {filteredSeating.length === 0 && (
                  <div className="col-span-full py-20 text-center text-slate-300 italic font-medium font-medium">Select a room to visualize the seating grid.</div>
               )}
            </div>
         </div>

         <div className="p-8 border-t border-slate-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-wrap gap-6 justify-center">
            <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-orange-500"></span>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Occupied</span>
            </div>
            <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-gray-800"></span>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available</span>
            </div>
            <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-rose-500"></span>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reserved / Damaged</span>
            </div>
         </div>
      </div>
    </div>
  );
}
