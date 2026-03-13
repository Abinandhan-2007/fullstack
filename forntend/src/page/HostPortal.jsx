import React, { useState, useEffect } from 'react';

export default function HostPortal({ handleLogout, apiUrl }) {
  const [staffName, setStaffName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const fetchStaff = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/host/all-staff`);
      if (res.ok) {
        const data = await res.json();
        setStaffList(data);
      }
    } catch (err) {
      console.error("Failed to fetch staff", err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch(`${apiUrl}/api/host/add-staff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: staffName, email: staffEmail })
      });
      
      if (res.ok) {
        alert("✅ Staff added successfully!");
        setStaffEmail(""); 
        setStaffName("");
        fetchStaff();
      } else {
        alert("❌ Failed to add staff.");
      }
    } catch (err) { 
      alert("❌ Connection Error"); 
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10 border-b border-slate-700 pb-4">
          <h1 className="text-3xl font-bold">System Host Console</h1>
          <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded font-bold hover:bg-red-500 transition">
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Add Staff Form */}
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
            <h2 className="text-xl font-bold mb-4">Register New Staff</h2>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <input 
                type="text" placeholder="Staff Name" required
                value={staffName} onChange={(e) => setStaffName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
              <input 
                type="email" placeholder="Google Email Address" required
                value={staffEmail} onChange={(e) => setStaffEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
              <button 
                type="submit" disabled={isSaving}
                className={`w-full py-3 rounded-lg font-bold transition-all ${isSaving ? 'bg-slate-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'}`}
              >
                {isSaving ? "Saving to Database..." : "Authorize Staff Member"}
              </button>
            </form>
          </div>

          {/* Staff List */}
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
            <h2 className="text-xl font-bold mb-4">Authorized Personnel</h2>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {staffList.length === 0 ? (
                <p className="text-slate-400">No staff members registered yet.</p>
              ) : (
                staffList.map((staff, index) => (
                  <div key={index} className="bg-slate-900 p-3 rounded border border-slate-700">
                    <p className="font-bold">{staff.name}</p>
                    <p className="text-sm text-slate-400">{staff.email}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}