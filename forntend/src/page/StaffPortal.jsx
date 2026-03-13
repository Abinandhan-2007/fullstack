import React from 'react';

export default function StaffPortal({ handleLogout, user }) {
  return (
    <div className="min-h-screen bg-green-50 text-slate-900 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm mb-8">
          <div>
            <h1 className="text-2xl font-bold text-green-700">Staff & Faculty Portal</h1>
            <p className="text-slate-500">Welcome back, {user?.name || "Professor"}</p>
          </div>
          <button onClick={handleLogout} className="text-red-600 font-bold border border-red-200 px-4 py-2 rounded hover:bg-red-50 transition">
            Sign Out
          </button>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-sm text-center py-20 border border-green-100">
          <h2 className="text-xl text-slate-400 mb-2">Staff Dashboard is empty</h2>
          <p className="text-sm text-slate-500">This is where you can build out the academic and placement management features.</p>
        </div>
      </div>
    </div>
  );
}