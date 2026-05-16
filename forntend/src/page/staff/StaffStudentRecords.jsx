import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function StaffStudentRecords({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/staff/students');
      setStudents(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load student records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudentFullDetails = async (studentId) => {
    if (expandedId === studentId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(studentId);
    setDetailsLoading(true);
    try {
      // In a real app, fetch marks and attendance for this specific student
      const [marksRes, attendanceRes] = await Promise.all([
        api.get(`/api/staff/students/${studentId}/marks`),
        api.get(`/api/staff/students/${studentId}/attendance/summary`)
      ]);
      setStudentDetails({ marks: marksRes.data, attendance: attendanceRes.data });
    } catch (err) {
      console.error(err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.regNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-full bg-slate-200 dark:bg-gray-800 rounded-xl"></div>
      <div className="h-96 bg-slate-200 dark:bg-gray-800 rounded-[2.5rem]"></div>
    </div>
  );

  if (error) return (
    <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-6 text-center text-rose-600 font-bold">
      {error}
      <button onClick={fetchStudents} className="block mx-auto mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg">Retry</button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Student Records</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Comprehensive view of student academic history</p>
        </div>
        <div className="w-full md:w-96 relative">
           <input 
              type="text"
              placeholder="Search by name or registration number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl px-12 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 dark:text-gray-200 shadow-sm transition-all"
           />
           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 dark:bg-gray-800/50">
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Roll No</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Name</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Course / Dept</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Attendance</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {filteredStudents.map((s, idx) => (
                    <React.Fragment key={s.id}>
                      <tr className={`hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer ${expandedId === s.id ? 'bg-slate-50 dark:bg-gray-800/50' : ''}`} onClick={() => fetchStudentFullDetails(s.id)}>
                         <td className="p-6 text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{s.regNo}</td>
                         <td className="p-6">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center text-xs font-black shadow-inner">
                                  {s.name?.charAt(0)}
                               </div>
                               <div>
                                  <p className="text-sm font-bold text-slate-800 dark:text-gray-200">{s.name}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.email}</p>
                               </div>
                            </div>
                         </td>
                         <td className="p-6">
                            <p className="text-xs font-bold text-slate-600 dark:text-gray-400 uppercase">{s.department?.shortForm || 'CS'}</p>
                            <p className="text-[10px] text-slate-400 font-medium">Semester {s.currentSemester || 'IV'}</p>
                         </td>
                         <td className="p-6 text-center">
                            <div className="flex flex-col items-center">
                               <span className="text-xs font-black text-slate-800 dark:text-white">88%</span>
                               <div className="w-16 h-1 bg-slate-100 dark:bg-gray-800 rounded-full mt-1.5 overflow-hidden">
                                  <div className="h-full bg-emerald-500 rounded-full" style={{width: '88%'}}></div>
                               </div>
                            </div>
                         </td>
                         <td className="p-6 text-center">
                            <button className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${expandedId === s.id ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-gray-800 text-slate-400'}`}>
                               {expandedId === s.id ? '−' : '+'}
                            </button>
                         </td>
                      </tr>
                      {expandedId === s.id && (
                        <tr>
                          <td colSpan="5" className="p-8 bg-slate-50/50 dark:bg-gray-900/50 border-y border-slate-100 dark:border-gray-800">
                             {detailsLoading ? (
                               <div className="flex justify-center p-10"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>
                             ) : (
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-4 duration-300">
                                  <div>
                                     <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Performance Summary</h4>
                                     <div className="space-y-3">
                                        {['Internal 1', 'Internal 2', 'Assignment'].map(exam => (
                                          <div key={exam} className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm">
                                             <span className="text-xs font-bold text-slate-600 dark:text-gray-400 uppercase">{exam}</span>
                                             <span className="text-sm font-black text-slate-900 dark:text-white">92 / 100</span>
                                          </div>
                                        ))}
                                     </div>
                                  </div>
                                  <div>
                                     <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Quick Statistics</h4>
                                     <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
                                           <p className="text-[10px] font-black text-emerald-600 uppercase">Current CGPA</p>
                                           <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1">8.75</p>
                                        </div>
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                                           <p className="text-[10px] font-black text-blue-600 uppercase">Backlogs</p>
                                           <p className="text-2xl font-black text-blue-700 dark:text-blue-400 mt-1">0</p>
                                        </div>
                                     </div>
                                     <button className="w-full mt-4 py-3 bg-slate-900 dark:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all">View Full Academic Report</button>
                                  </div>
                               </div>
                             )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr><td colSpan="5" className="p-20 text-center text-slate-400 italic font-medium">No students found matching your search.</td></tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
