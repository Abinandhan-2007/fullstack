import React from 'react';
import HostPortal from '../page/HostPortal';

export default function HostManagementLayout({ user, handleLogout }) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Dark Sidebar */}
      <aside className="w-72 border-r border-slate-800 p-8 flex flex-col">
        <h1 className="text-xl font-black text-blue-500 mb-10">HOST SYSTEM</h1>
        <nav className="flex-1 space-y-4">
          <div className="bg-blue-600 text-white p-4 rounded-2xl font-bold text-sm cursor-pointer">👥 Student Registry</div>
          <div className="text-slate-500 p-4 font-bold text-sm hover:text-white cursor-not-allowed">📝 Manage Tests</div>
        </nav>
        <div className="mt-auto pt-6 border-t border-slate-800 text-center">
          <img src={user.picture} className="w-10 h-10 rounded-full mx-auto mb-2 border-2 border-blue-500" />
          <p className="text-xs font-bold text-white mb-4">{user.name}</p>
          <button onClick={handleLogout} className="text-rose-500 font-bold text-xs uppercase tracking-widest hover:underline">Exit Portal</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-slate-50 rounded-l-[3.5rem] my-2 shadow-inner overflow-y-auto">
        <HostPortal />
      </main>
    </div>
  );
}