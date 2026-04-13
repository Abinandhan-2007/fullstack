import React from 'react';

export default function StaffAdminSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Department Settings</h1>
            <p className="text-slate-500 font-medium">HOD controls and moderation policies.</p>
         </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-8">
         
         <div>
             <h3 className="text-lg font-black text-slate-800 mb-4 border-b border-slate-100 pb-2">Academic Rules</h3>
             <div className="space-y-4">
                 <div className="flex justify-between items-center">
                     <div>
                         <p className="font-bold text-slate-700">Minimum Attendance Threshold</p>
                         <p className="text-xs text-slate-400">Triggers automatic warnings and red flags.</p>
                     </div>
                     <input type="number" defaultValue={75} className="w-20 bg-slate-50 border border-slate-200 p-2 rounded-lg font-black text-center outline-none focus:border-indigo-500" />
                 </div>
                 <div className="flex justify-between items-center">
                     <div>
                         <p className="font-bold text-slate-700">Allow Faculty Overrides</p>
                         <p className="text-xs text-slate-400">Can faculty change attendance after submission.</p>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                     </label>
                 </div>
             </div>
         </div>

         <div>
             <h3 className="text-lg font-black text-slate-800 mb-4 border-b border-slate-100 pb-2">Notifications</h3>
             <div className="space-y-4">
                 <div className="flex justify-between items-center">
                     <div>
                         <p className="font-bold text-slate-700">Daily Attendance Summary Email</p>
                         <p className="text-xs text-slate-400">Send HOD digest at 5 PM.</p>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                     </label>
                 </div>
             </div>
         </div>
         
         <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-md">Save Settings Configuration</button>

      </div>
    </div>
  );
}
