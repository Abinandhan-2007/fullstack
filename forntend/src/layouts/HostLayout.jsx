import React, { useState, useEffect } from 'react';

export default function HostLayout({ user }) {
  const [staff, setStaff] = useState([]);
  const [newStaff, setNewStaff] = useState({ email: '', name: '', department: '' });

  const fetchStaff = () => {
    fetch('https://fullstack-q3c5.onrender.com/api/host/all-staff')
      .then(res => res.json())
      .then(data => setStaff(data));
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleAddStaff = () => {
    fetch('https://fullstack-q3c5.onrender.com/api/host/add-staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStaff)
    }).then(() => {
      fetchStaff();
      setNewStaff({ email: '', name: '', department: '' });
    });
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white font-sans">
      <aside className="w-64 border-r border-slate-800 p-8">
        <h1 className="text-xl font-black text-blue-500">HOST ADMIN</h1>
        <nav className="mt-10 space-y-4">
          <div className="bg-blue-600 p-3 rounded-xl font-bold">Manage Staff</div>
        </nav>
      </aside>
      <main className="flex-1 bg-white text-slate-900 p-12 overflow-y-auto">
        <h2 className="text-3xl font-bold mb-8">Staff Management</h2>
        
        {/* Form to Add Staff */}
        <div className="grid grid-cols-3 gap-4 mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <input placeholder="Staff Email" className="p-3 border rounded-xl" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} />
          <input placeholder="Staff Name" className="p-3 border rounded-xl" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} />
          <button onClick={handleAddStaff} className="bg-slate-900 text-white rounded-xl font-bold">Add Teacher</button>
        </div>

        {/* List of Staff */}
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-slate-400 text-xs uppercase font-bold">
              <th className="pb-4">Name</th>
              <th className="pb-4">Email</th>
              <th className="pb-4 text-right">Access Level</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(s => (
              <tr key={s.email} className="border-b">
                <td className="py-4 font-bold">{s.name}</td>
                <td className="py-4 text-slate-500">{s.email}</td>
                <td className="py-4 text-right text-emerald-600 font-bold">TEACHER</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}