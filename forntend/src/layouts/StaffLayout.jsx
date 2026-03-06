import React from 'react';

export default function StaffPortalLayout({ user, handleLogout }) {
  return (
    <div className="flex min-h-screen bg-emerald-50 text-slate-900">
      <aside className="w-64 bg-emerald-900 text-white p-6 flex flex-col">
        <h2 className="text-xl font-black mb-10 tracking-tighter text-emerald-400">STAFF PORTAL</h2>
        <nav className="flex-1 space-y-4">
          <div className="font-bold text-sm bg-emerald-800 p-3 rounded-xl cursor-pointer">📊 Dashboard</div>
          <div className="font-bold text-sm p-3 hover:bg-emerald-800 rounded-xl cursor-pointer">🎓 Student Marks</div>
          <div className="font-bold text-sm p-3 hover:bg-emerald-800 rounded-xl cursor-pointer">📝 Enrollment</div>
        </nav>
        <button onClick={handleLogout} className="mt-auto text-emerald-300 font-bold text-xs uppercase">Sign Out</button>
      </aside>
      <main className="flex-1 p-12">
        <h1 className="text-3xl font-bold">Welcome, Prof. {user.name}</h1>
        <p className="text-slate-500">Update academic records and manage your classes here.</p>
        {/* We will add the Student Management Table here in the next step */}
      </main>
    </div>
  );
}