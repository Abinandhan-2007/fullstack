import React, { useState, useEffect, useMemo } from 'react';
import api from '../../api';

export default function AdminUsers({ apiUrl, token, user }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeTab, setActiveTab] = useState('All Users');
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentUser, setCurrentUser] = useState({ id: null, name: '', email: '', role: 'STUDENT', department: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedIds, setSelectedIds] = useState(new Set());

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesTab = activeTab === 'All Users' || u.role?.toUpperCase() === activeTab.toUpperCase();
      const matchesSearch = u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = deptFilter === '' || u.department === deptFilter;
      return matchesTab && matchesSearch && matchesDept;
    });
  }, [users, activeTab, searchQuery, deptFilter]);

  const departments = useMemo(() => [...new Set(users.map(u => u.department).filter(Boolean))], [users]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (modalMode === 'add') {
        await api.post('/admin/users', currentUser);
      } else {
        const payload = { ...currentUser };
        delete payload.password; // Don't send password on edit unless changing
        await api.put(`/admin/users/${currentUser.id}`, payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (userObj) => {
    try {
      const newStatus = userObj.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await api.put(`/admin/users/${userObj.id}/status`, { status: newStatus });
      fetchData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const toggleSelect = (id) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredUsers.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredUsers.map(u => u.id)));
  };

  const handleBulkDeactivate = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Deactivate ${selectedIds.size} users?`)) return;
    try {
      await Promise.all(Array.from(selectedIds).map(id => 
        api.put(`/admin/users/${id}/status`, { status: 'INACTIVE' })
      ));
      setSelectedIds(new Set());
      fetchData();
    } catch (err) {
      alert('Bulk action partially failed');
      fetchData();
    }
  };

  const Loader = () => (
    <div className="space-y-4 animate-pulse">
      {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-slate-200 rounded-xl w-full"></div>)}
    </div>
  );

  const ErrorCard = () => (
    <div className="flex flex-col items-center justify-center p-8 bg-white border border-red-200 rounded-2xl text-center">
      <p className="text-red-500 mb-4 font-bold">{error}</p>
      <button onClick={fetchData} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Retry</button>
    </div>
  );

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-full space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">User Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage student and staff accounts</p>
        </div>
        <div className="flex gap-3">
          {selectedIds.size > 0 && (
            <button onClick={handleBulkDeactivate} className="px-5 py-2.5 bg-amber-100 text-amber-700 font-bold rounded-xl hover:bg-amber-200 transition-colors">
              Deactivate Selected ({selectedIds.size})
            </button>
          )}
          <button onClick={() => { setModalMode('add'); setCurrentUser({ id: null, name: '', email: '', role: 'STUDENT', department: '', password: '' }); setIsModalOpen(true); }} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-colors">
            + Add User
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col">
        
        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-4 pt-4 gap-6">
          {['Students', 'Staff', 'All Users'].map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setSelectedIds(new Set()); }} className={`pb-3 font-bold text-sm px-2 border-b-2 transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Search name or email..." 
            className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          />
          <select className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
            <option value="">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          {loading ? <div className="p-6"><Loader /></div> : error ? <div className="p-6"><ErrorCard /></div> : (
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <th className="px-6 py-4 w-10"><input type="checkbox" onChange={toggleSelectAll} checked={filteredUsers.length > 0 && selectedIds.size === filteredUsers.length} className="rounded" /></th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4"><input type="checkbox" checked={selectedIds.has(u.id)} onChange={() => toggleSelect(u.id)} className="rounded" /></td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{u.name}</div>
                      <div className="text-xs text-slate-500">{u.email}</div>
                    </td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">{u.role}</span></td>
                    <td className="px-6 py-4 text-slate-600">{u.department || '-'}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleStatus(u)} className={`px-2 py-1 rounded-full text-xs font-bold ${u.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {u.status || 'ACTIVE'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{new Date(u.joinedDate || Date.now()).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => { setModalMode('edit'); setCurrentUser(u); setIsModalOpen(true); }} className="text-blue-600 font-semibold px-2">Edit</button>
                      <button onClick={() => handleDelete(u.id)} className="text-red-500 font-semibold px-2">Delete</button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && <tr><td colSpan="7" className="p-6 text-center text-slate-500">No users found.</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50"><h2 className="font-bold">{modalMode === 'add' ? 'Add User' : 'Edit User'}</h2></div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <input required type="text" placeholder="Name" className="w-full px-4 py-2 bg-slate-50 border rounded-xl" value={currentUser.name} onChange={e => setCurrentUser({...currentUser, name: e.target.value})} />
              <input required type="email" placeholder="Email" className="w-full px-4 py-2 bg-slate-50 border rounded-xl" value={currentUser.email} onChange={e => setCurrentUser({...currentUser, email: e.target.value})} />
              <select className="w-full px-4 py-2 bg-slate-50 border rounded-xl" value={currentUser.role} onChange={e => setCurrentUser({...currentUser, role: e.target.value})}>
                <option value="STUDENT">Student</option>
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Admin</option>
              </select>
              <input type="text" placeholder="Department (e.g. CSE)" className="w-full px-4 py-2 bg-slate-50 border rounded-xl" value={currentUser.department} onChange={e => setCurrentUser({...currentUser, department: e.target.value})} />
              {modalMode === 'add' && <input required type="password" placeholder="Password" className="w-full px-4 py-2 bg-slate-50 border rounded-xl" value={currentUser.password} onChange={e => setCurrentUser({...currentUser, password: e.target.value})} />}
            </form>
            <div className="p-4 border-t bg-slate-50 flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-xl">Cancel</button>
              <button onClick={handleSave} disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl">{isSubmitting ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
