import React, { useState, useEffect, useMemo } from 'react';
import api from '../../api';

export default function AdminDepartments({ apiUrl, token, user }) {
  const [departments, setDepartments] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentDept, setCurrentDept] = useState({ id: null, code: '', name: '', hod: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [deptRes, staffRes] = await Promise.all([
        api.get('/admin/departments'),
        api.get('/admin/staff').catch(() => ({ data: [] })) // Fallback if staff API isn't ready
      ]);
      setDepartments(deptRes.data || []);
      setStaffList(staffRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredDepartments = useMemo(() => {
    return departments.filter(d => 
      d.code?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      d.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [departments, searchQuery]);

  const openAddModal = () => {
    setModalMode('add');
    setCurrentDept({ id: null, code: '', name: '', hod: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (dept) => {
    setModalMode('edit');
    setCurrentDept({ ...dept });
    setIsModalOpen(true);
  };

  const openDeleteModal = (dept) => {
    setDeptToDelete(dept);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (modalMode === 'add') {
        await api.post('/admin/departments', currentDept);
      } else {
        await api.put(`/admin/departments/${currentDept.id}`, currentDept);
      }
      setIsModalOpen(false);
      fetchData(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save department');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await api.delete(`/admin/departments/${deptToDelete.id}`);
      setIsDeleteModalOpen(false);
      fetchData(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete department');
    } finally {
      setIsSubmitting(false);
    }
  };

  const Loader = () => (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="h-16 bg-slate-200 rounded-xl w-full"></div>
      ))}
    </div>
  );

  const ErrorCard = () => (
    <div className="flex flex-col items-center justify-center p-8 bg-white border border-red-200 rounded-2xl text-center">
      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-2xl mb-4">⚠️</div>
      <p className="text-slate-800 font-bold text-lg mb-2">Something went wrong</p>
      <p className="text-slate-500 mb-6">{error}</p>
      <button onClick={fetchData} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold shadow-sm shadow-blue-600/20">
        Retry
      </button>
    </div>
  );

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-full space-y-6">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Departments</h1>
          <p className="text-slate-500 text-sm mt-1">Manage academic departments and HOD assignments</p>
        </div>
        <button onClick={openAddModal} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm shadow-blue-600/20 transition-colors flex items-center gap-2">
          <span className="text-lg leading-none">+</span> Add Department
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              🔍
            </div>
            <input 
              type="text" 
              placeholder="Search by code or name..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-slate-700 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Data Area */}
        <div className="p-0 flex-1 overflow-x-auto">
          {loading ? (
            <div className="p-6"><Loader /></div>
          ) : error ? (
            <div className="p-6"><ErrorCard /></div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Dept Code</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">HOD</th>
                  <th className="px-6 py-4 text-right">Students</th>
                  <th className="px-6 py-4 text-right">Staff</th>
                  <th className="px-6 py-4 text-right">Courses</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredDepartments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500 italic">No departments found matching your criteria.</td>
                  </tr>
                ) : (
                  filteredDepartments.map((dept, i) => (
                    <tr key={dept.id || i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">{dept.code}</td>
                      <td className="px-6 py-4 text-slate-600 font-medium">{dept.name}</td>
                      <td className="px-6 py-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                            {dept.hod?.charAt(0) || '-'}
                          </div>
                          {dept.hod || 'Unassigned'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-600 font-medium">{dept.totalStudents || 0}</td>
                      <td className="px-6 py-4 text-right text-slate-600 font-medium">{dept.totalStaff || 0}</td>
                      <td className="px-6 py-4 text-right text-slate-600 font-medium">{dept.coursesCount || 0}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => openEditModal(dept)} className="text-blue-600 hover:text-blue-800 font-semibold px-3 py-1 rounded hover:bg-blue-50 transition-colors mr-2">Edit</button>
                        <button onClick={() => openDeleteModal(dept)} className="text-red-500 hover:text-red-700 font-semibold px-3 py-1 rounded hover:bg-red-50 transition-colors">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">{modalMode === 'add' ? 'Add Department' : 'Edit Department'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold leading-none">&times;</button>
            </div>
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Department Code</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. CSE"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium"
                  value={currentDept.code}
                  onChange={e => setCurrentDept({...currentDept, code: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Department Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Computer Science and Engineering"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                  value={currentDept.name}
                  onChange={e => setCurrentDept({...currentDept, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Head of Department (HOD)</label>
                <select 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                  value={currentDept.hod}
                  onChange={e => setCurrentDept({...currentDept, hod: e.target.value})}
                >
                  <option value="">-- Select HOD --</option>
                  {staffList.map(staff => (
                    <option key={staff.id || staff.email} value={staff.name}>{staff.name} ({staff.email})</option>
                  ))}
                  {/* Fallback if staff list empty but we have an existing hod */}
                  {staffList.length === 0 && currentDept.hod && <option value={currentDept.hod}>{currentDept.hod}</option>}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  rows="3"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 resize-none"
                  value={currentDept.description}
                  onChange={e => setCurrentDept({...currentDept, description: e.target.value})}
                ></textarea>
              </div>
            </form>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={isSubmitting} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-sm shadow-blue-600/20 transition-colors flex items-center gap-2">
                {isSubmitting ? 'Saving...' : 'Save Department'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm border border-slate-200 overflow-hidden flex flex-col text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🗑️</div>
              <h2 className="text-xl font-black text-slate-800 mb-2">Delete Department?</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-slate-800">{deptToDelete?.name}</span>? This action cannot be undone and may affect associated students and staff.
              </p>
            </div>
            <div className="p-4 bg-slate-50 flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleDelete} disabled={isSubmitting} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold rounded-xl shadow-sm shadow-red-600/20 transition-colors">
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
