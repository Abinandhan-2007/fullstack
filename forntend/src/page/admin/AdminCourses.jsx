import React, { useState, useEffect, useMemo } from 'react';
import api from '../../api';

export default function AdminCourses({ apiUrl, token, user }) {
  const [courses, setCourses] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState({ id: null, code: '', name: '', department: '', year: '1', semester: 'I', credits: 3, staffAssigned: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [coursesRes, staffRes] = await Promise.all([
        api.get('/admin/courses'),
        api.get('/admin/staff').catch(() => ({ data: [] }))
      ]);
      setCourses(coursesRes.data || []);
      setStaff(staffRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchSearch = c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || c.code?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDept = deptFilter === '' || c.department === deptFilter;
      const matchYear = yearFilter === '' || c.year?.toString() === yearFilter;
      return matchSearch && matchDept && matchYear;
    });
  }, [courses, searchQuery, deptFilter, yearFilter]);

  const departments = useMemo(() => [...new Set(courses.map(c => c.department).filter(Boolean))], [courses]);
  const years = useMemo(() => [...new Set(courses.map(c => c.year).filter(Boolean))].sort(), [courses]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (currentCourse.id) {
        await api.put(`/admin/courses/${currentCourse.id}`, currentCourse);
      } else {
        await api.post('/admin/courses', currentCourse);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save course');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await api.delete(`/admin/courses/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete course');
    }
  };

  const Loader = () => <div className="p-6 animate-pulse space-y-4">{[1,2,3,4].map(i => <div key={i} className="h-12 bg-slate-200 rounded"></div>)}</div>;
  const ErrorCard = () => <div className="p-6 text-center text-red-500 font-bold bg-red-50">{error} <button onClick={fetchData} className="ml-4 underline">Retry</button></div>;

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-full space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Courses</h1>
          <p className="text-slate-500 text-sm">Manage curriculum and staff assignments</p>
        </div>
        <button onClick={() => { setCurrentCourse({ id: null, code: '', name: '', department: '', year: '1', semester: 'I', credits: 3, staffAssigned: '' }); setIsModalOpen(true); }} className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">+ Add Course</button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
          <input type="text" placeholder="Search subject name or code..." className="flex-1 px-4 py-2 bg-slate-50 border rounded-xl" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          <select className="px-4 py-2 bg-slate-50 border rounded-xl" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
            <option value="">All Depts</option>
            {departments.map(d => <option key={d}>{d}</option>)}
          </select>
          <select className="px-4 py-2 bg-slate-50 border rounded-xl" value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
            <option value="">All Years</option>
            {years.map(y => <option key={y}>Year {y}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          {loading ? <Loader /> : error ? <ErrorCard /> : (
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b text-slate-500 text-xs uppercase font-bold">
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Subject Name</th>
                  <th className="px-6 py-4">Dept</th>
                  <th className="px-6 py-4">Year / Sem</th>
                  <th className="px-6 py-4">Credits</th>
                  <th className="px-6 py-4">Staff Assigned</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredCourses.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold">{c.code}</td>
                    <td className="px-6 py-4">{c.name}</td>
                    <td className="px-6 py-4">{c.department}</td>
                    <td className="px-6 py-4">Y{c.year} / {c.semester}</td>
                    <td className="px-6 py-4">{c.credits}</td>
                    <td className="px-6 py-4">{c.staffAssigned || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => { setCurrentCourse(c); setIsModalOpen(true); }} className="text-blue-600 font-bold px-2">Edit</button>
                      <button onClick={() => handleDelete(c.id)} className="text-red-500 font-bold px-2">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b bg-slate-50"><h2 className="font-bold">{currentCourse.id ? 'Edit' : 'Add'} Course</h2></div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <input required type="text" placeholder="Subject Code" className="w-full px-4 py-2 bg-slate-50 border rounded-xl" value={currentCourse.code} onChange={e => setCurrentCourse({...currentCourse, code: e.target.value})} />
              <input required type="text" placeholder="Subject Name" className="w-full px-4 py-2 bg-slate-50 border rounded-xl" value={currentCourse.name} onChange={e => setCurrentCourse({...currentCourse, name: e.target.value})} />
              <input required type="text" placeholder="Department" className="w-full px-4 py-2 bg-slate-50 border rounded-xl" value={currentCourse.department} onChange={e => setCurrentCourse({...currentCourse, department: e.target.value})} />
              <div className="flex gap-4">
                <input required type="number" placeholder="Year" className="w-full px-4 py-2 bg-slate-50 border rounded-xl" value={currentCourse.year} onChange={e => setCurrentCourse({...currentCourse, year: e.target.value})} />
                <input required type="text" placeholder="Semester (I, II)" className="w-full px-4 py-2 bg-slate-50 border rounded-xl" value={currentCourse.semester} onChange={e => setCurrentCourse({...currentCourse, semester: e.target.value})} />
                <input required type="number" placeholder="Credits" className="w-full px-4 py-2 bg-slate-50 border rounded-xl" value={currentCourse.credits} onChange={e => setCurrentCourse({...currentCourse, credits: parseInt(e.target.value)})} />
              </div>
              <select className="w-full px-4 py-2 bg-slate-50 border rounded-xl" value={currentCourse.staffAssigned} onChange={e => setCurrentCourse({...currentCourse, staffAssigned: e.target.value})}>
                <option value="">-- Assign Staff --</option>
                {staff.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </form>
            <div className="p-4 border-t bg-slate-50 flex justify-end gap-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-200 rounded-xl">Cancel</button>
              <button onClick={handleSave} disabled={isSubmitting} className="px-4 py-2 font-bold text-white bg-blue-600 rounded-xl">{isSubmitting ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
