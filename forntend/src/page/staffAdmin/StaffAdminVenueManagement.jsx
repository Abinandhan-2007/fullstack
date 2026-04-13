import React from 'react';

export default function StaffAdminVenueManagement() {
  const venues = [
     { id: '1', name: 'Lab 4 (Systems)', type: 'Laboratory', capacity: 60, status: 'Occupied', current: 'Dr. Hopper (CS501)' },
     { id: '2', name: 'Room 205', type: 'Lecture Hall', capacity: 120, status: 'Available', current: '-' },
     { id: '3', name: 'Seminar Hall 2', type: 'Auditorium', capacity: 250, status: 'Booked', current: 'Guest Lecture (2 PM)' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Venue Management</h1>
            <p className="text-slate-500 font-medium">Classrooms, labs, and seminar halls booking.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 overflow-x-auto">
             <table className="w-full text-left border-collapse min-w-[600px]">
                 <thead><tr className="border-b-2 border-slate-100">
                     <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Venue</th>
                     <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Capacity</th>
                     <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Status</th>
                     <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Current / Next</th>
                     <th className="py-3 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-right">Action</th>
                 </tr></thead>
                 <tbody>
                      {venues.map(v => (
                          <tr key={v.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                              <td className="py-4 font-bold text-slate-800">{v.name} <br/><span className="text-[10px] font-black text-slate-400">{v.type}</span></td>
                              <td className="py-4 font-black tracking-widest text-slate-500">{v.capacity} Seats</td>
                              <td className="py-4">
                                  <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-md ${v.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : v.status === 'Booked' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>{v.status}</span>
                              </td>
                              <td className="py-4 font-bold text-slate-600">{v.current}</td>
                              <td className="py-4 text-right">
                                  {v.status === 'Available' && <button className="text-indigo-600 font-bold text-sm hover:underline">Book Now</button>}
                              </td>
                          </tr>
                      ))}
                 </tbody>
             </table>
         </div>

         <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6">
             <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Quick Book</h3>
             <form className="space-y-4">
                 <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Venue</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm font-bold outline-none focus:border-indigo-500"><option>Room 205</option></select>
                 </div>
                 <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Date</label>
                    <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm font-bold outline-none focus:border-indigo-500" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Purpose</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm font-bold outline-none focus:border-indigo-500" placeholder="e.g. Extra Class" />
                 </div>
                 <button type="button" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:bg-indigo-700 transition">Confirm Booking</button>
             </form>
         </div>
      </div>
    </div>
  );
}
