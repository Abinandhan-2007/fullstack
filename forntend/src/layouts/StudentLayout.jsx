import React from 'react';

export default function StudentPortalLayout({ user, handleLogout, children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-slate-200 px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-800">Student<span className="text-blue-600">Portal</span></h1>
        <button onClick={handleLogout} className="text-sm font-semibold text-rose-500">Sign out</button>
      </header>
      <main className="flex-1 p-6">
        {/* If you are using the switch-case logic in App.jsx, 
            make sure you pass the components here */}
        <h2 className="text-xl font-bold mb-4">Welcome, {user.name}</h2>
        <p>This is your student dashboard.</p>
      </main>
    </div>
  );
}