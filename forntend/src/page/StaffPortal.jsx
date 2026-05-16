import React, { useState, useEffect, useRef, useMemo } from 'react';
import Chart from 'chart.js/auto';
import api from '../api';

export default function StaffPortal({ loggedInEmail, handleLogout }) {
  const [activeTab, setActiveTab] = useState('Workspace');
  const [profile, setProfile] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const fetchedTabs = useRef(new Set());

  // Form states
  const [markEntryForm, setMarkEntryForm] = useState({ subject: '', examType: 'CAT-1', year: '1' });
  const [attendanceForm, setAttendanceForm] = useState({ subject: '', date: new Date().toISOString().split('T')[0], section: 'A' });
  const [leaveForm, setLeaveForm] = useState({ type: 'Casual', from: '', to: '', reason: '' });

  // Role guard
  useEffect(() => {
    const role = localStorage.getItem('erp_role');
    if (role !== 'ROLE_STAFF' && role?.toUpperCase() !== 'STAFF') window.location.href = '/';
  }, []);

  const showToast = (msg) => { alert(msg); };

  const fetchData = async (key, apiCall, setter) => {
    setLoading(prev => ({ ...prev, [key]: true }));
    setErrors(prev => ({ ...prev, [key]: null }));
    try {
      const res = await apiCall();
      setter(res.data);
      return res.data;
    } catch (err) {
      setErrors(prev => ({ ...prev, [key]: err.message || 'Failed' }));
      return null;
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  useEffect(() => {
    if (!profile) {
      fetchData('profile', () => api.get('/staff/profile'), setProfile).then(data => {
        if (!data) setProfile({ name: 'Staff User', designation: 'Assistant Professor', department: 'CSE', staffId: 'STF1001' }); // Mock fallback if API fails so UI loads
      });
    }
  }, []);

  useEffect(() => {
    if (!profile || fetchedTabs.current.has(activeTab)) return;
    
    if (activeTab === 'Workspace') {
      fetchData('timetable', () => api.get(`/timetable/staff/${profile.staffId}`), setTimetable);
      fetchData('leave', () => api.get(`/leave/staff/${profile.staffId}`), setLeaveHistory);
      fetchedTabs.current.add('Workspace');
    }
    else if (activeTab === 'My Timetable') {
      fetchData('timetable', () => api.get(`/timetable/staff/${profile.staffId}`), setTimetable);
      fetchedTabs.current.add('My Timetable');
    }
    else if (activeTab === 'Leave Application') {
      fetchData('leave', () => api.get(`/leave/staff/${profile.staffId}`), setLeaveHistory);
      fetchedTabs.current.add('Leave Application');
    }
    else if (activeTab === 'Student Records') {
      fetchData('students', () => api.get(`/staff/students/${profile.staffId}`), setStudents);
      fetchedTabs.current.add('Student Records');
    }
    else if (activeTab === 'Announcements') {
      fetchData('announcements', () => api.get('/announcements'), setAnnouncements);
      fetchedTabs.current.add('Announcements');
    }
  }, [activeTab, profile]);

  const loadStudentsForMarks = () => fetchData('markEntry', () => api.get(`/students/by-subject/${markEntryForm.subject}`), setStudents);
  const loadStudentsForAttendance = () => fetchData('attEntry', () => api.get(`/students/by-subject/${attendanceForm.subject}`), setStudents);

  const handleMarkSubmit = async () => {
    try {
      await api.post('/marks/upload', marks);
      showToast('Marks uploaded successfully');
    } catch(err) { showToast('Upload failed'); }
  };

  const handleAttendanceSubmit = async () => {
    try {
      await api.post('/attendance/mark', students);
      showToast('Attendance submitted');
    } catch(err) { showToast('Submit failed'); }
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    try {
      const days = Math.ceil((new Date(leaveForm.to) - new Date(leaveForm.from)) / 86400000) + 1;
      await api.post('/leave/apply', { ...leaveForm, staffId: profile.staffId, days });
      showToast('Leave applied successfully');
      setLeaveForm({ type: 'Casual', from: '', to: '', reason: '' });
      fetchData('leave', () => api.get(`/leave/staff/${profile.staffId}`), setLeaveHistory);
    } catch(err) { showToast('Leave application failed'); }
  };

  const Loader = () => <div className="p-6 animate-pulse space-y-4"><div className="h-4 bg-gray-800 rounded w-1/4"></div><div className="h-32 bg-gray-800 rounded w-full"></div></div>;
  const ErrorCard = ({ msg, retryKey }) => <div className="p-6 text-center text-red-500 bg-red-950/20 rounded-xl border border-red-900/50">{msg} <button onClick={() => fetchedTabs.current.delete(retryKey)} className="ml-2 underline">Retry</button></div>;

  const renderContent = () => {
    if (!profile) return <Loader />;

    switch(activeTab) {
      case 'Workspace':
        return (
          <div className="space-y-6">
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">Welcome back, {profile.name}</h2>
                <p className="text-gray-400">{profile.designation} • {profile.department} • {profile.staffId}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800"><div className="text-gray-400 text-sm">Classes Today</div><div className="text-3xl font-black text-purple-500">{timetable.length || 0}</div></div>
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800"><div className="text-gray-400 text-sm">Total Students</div><div className="text-3xl font-black text-white">120</div></div>
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800"><div className="text-gray-400 text-sm">Pending Leaves</div><div className="text-3xl font-black text-amber-500">{leaveHistory.filter(l=>l.status==='PENDING').length}</div></div>
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800"><div className="text-gray-400 text-sm">Marks Pending Entry</div><div className="text-3xl font-black text-red-500">2</div></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-96 overflow-auto"><h3 className="font-bold text-white mb-4">Today's Schedule</h3>
                {timetable.map((t,i) => <div key={i} className="p-3 bg-gray-950 rounded-xl mb-3 border border-gray-800"><div className="font-bold text-purple-400">{t.subject}</div><div className="text-xs text-gray-500">P{t.period} • {t.room}</div></div>)}
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-96 overflow-auto"><h3 className="font-bold text-white mb-4">Recent Mark Entries</h3><p className="text-gray-500 text-sm">No recent entries</p></div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-96 overflow-auto"><h3 className="font-bold text-white mb-4">Leave Status</h3>
                {leaveHistory.map((l,i) => <div key={i} className="p-3 bg-gray-950 rounded-xl mb-3 border border-gray-800"><div className="font-bold text-white">{l.type}</div><div className="text-xs text-gray-500">{l.from} to {l.to}</div><span className="text-xs text-amber-500">{l.status}</span></div>)}
              </div>
            </div>
          </div>
        );

      case 'Mark Entry':
        return (
          <div className="space-y-6">
            <div className="flex gap-4 p-4 bg-gray-900 border border-gray-800 rounded-xl">
              <input type="text" placeholder="Subject Code" className="px-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white" value={markEntryForm.subject} onChange={e=>setMarkEntryForm({...markEntryForm,subject:e.target.value})} />
              <select className="px-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white" value={markEntryForm.examType} onChange={e=>setMarkEntryForm({...markEntryForm,examType:e.target.value})}><option>CAT-1</option><option>SEMESTER</option></select>
              <button onClick={loadStudentsForMarks} className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl">Load Students</button>
            </div>
            {loading.markEntry ? <Loader /> : students.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-gray-800 flex justify-between">
                  <button className="px-4 py-1.5 bg-gray-800 text-white rounded font-bold text-sm">Set Max Score All</button>
                  <button onClick={handleMarkSubmit} className="px-4 py-1.5 bg-green-600 text-white rounded font-bold text-sm">Submit Marks</button>
                </div>
                <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                  <thead className="bg-gray-950 border-b border-gray-800 uppercase text-xs text-gray-500">
                    <tr><th className="p-4">Reg No</th><th className="p-4">Name</th><th className="p-4">Max Score</th><th className="p-4">Score</th><th className="p-4">Grade</th><th className="p-4">Absent</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {students.map((s,i) => (
                      <tr key={i} className="hover:bg-gray-800/50">
                        <td className="p-4 font-bold text-white">{s.regNo}</td><td className="p-4">{s.name}</td>
                        <td className="p-4"><input type="number" className="w-20 px-2 py-1 bg-gray-950 border border-gray-700 rounded text-white" /></td>
                        <td className="p-4"><input type="number" className="w-20 px-2 py-1 bg-gray-950 border border-gray-700 rounded text-white" /></td>
                        <td className="p-4 font-bold text-purple-400">-</td>
                        <td className="p-4"><input type="checkbox" className="rounded" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      case 'Attendance Entry':
        return (
          <div className="space-y-6">
            <div className="flex gap-4 p-4 bg-gray-900 border border-gray-800 rounded-xl">
              <input type="text" placeholder="Subject" className="px-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white" value={attendanceForm.subject} onChange={e=>setAttendanceForm({...attendanceForm,subject:e.target.value})} />
              <input type="date" className="px-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white" value={attendanceForm.date} onChange={e=>setAttendanceForm({...attendanceForm,date:e.target.value})} />
              <button onClick={loadStudentsForAttendance} className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl">Load Students</button>
            </div>
            {loading.attEntry ? <Loader /> : students.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                  <div className="flex gap-2">
                     <button className="px-4 py-1.5 bg-green-900/50 text-green-500 border border-green-900 rounded font-bold text-sm">Mark All Present</button>
                     <button className="px-4 py-1.5 bg-red-900/50 text-red-500 border border-red-900 rounded font-bold text-sm">Mark All Absent</button>
                  </div>
                  <button onClick={handleAttendanceSubmit} className="px-4 py-1.5 bg-purple-600 text-white rounded font-bold text-sm">Submit Attendance</button>
                </div>
                <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                  <thead className="bg-gray-950 border-b border-gray-800 uppercase text-xs text-gray-500">
                    <tr><th className="p-4">Reg No</th><th className="p-4">Name</th><th className="p-4 text-center">Status (Toggle)</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {students.map((s,i) => (
                      <tr key={i} className="hover:bg-gray-800/50">
                        <td className="p-4 font-bold text-white">{s.regNo}</td><td className="p-4">{s.name}</td>
                        <td className="p-4 text-center"><button className="w-8 h-8 rounded-full bg-green-500 text-white font-bold">P</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      case 'Leave Application':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form onSubmit={handleLeaveSubmit} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 h-fit space-y-4">
              <h2 className="font-bold text-white mb-4">Apply Leave</h2>
              <select required className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white" value={leaveForm.type} onChange={e=>setLeaveForm({...leaveForm,type:e.target.value})}><option>Casual</option><option>Medical</option><option>Duty</option></select>
              <input required type="date" className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-gray-400" value={leaveForm.from} onChange={e=>setLeaveForm({...leaveForm,from:e.target.value})} />
              <input required type="date" className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-gray-400" value={leaveForm.to} onChange={e=>setLeaveForm({...leaveForm,to:e.target.value})} />
              <textarea required rows="3" placeholder="Reason" className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white" value={leaveForm.reason} onChange={e=>setLeaveForm({...leaveForm,reason:e.target.value})}></textarea>
              <button type="submit" className="w-full py-2 bg-purple-600 text-white font-bold rounded-xl">Submit Leave</button>
            </form>
            <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden h-[500px] flex flex-col">
              <h2 className="p-4 border-b border-gray-800 font-bold text-white">Leave History</h2>
              <div className="flex-1 overflow-auto">
                {loading.leave ? <Loader/> : errors.leave ? <ErrorCard msg={errors.leave} retryKey="Leave Application" /> : (
                  <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-gray-950 text-gray-500 uppercase text-xs sticky top-0"><tr><th className="p-4">Type</th><th className="p-4">From</th><th className="p-4">To</th><th className="p-4">Days</th><th className="p-4">Status</th></tr></thead>
                    <tbody className="divide-y divide-gray-800">
                      {leaveHistory.map((l,i) => <tr key={i}><td className="p-4 font-bold text-white">{l.type}</td><td className="p-4">{l.from}</td><td className="p-4">{l.to}</td><td className="p-4">{l.days}</td><td className="p-4"><span className="px-2 py-1 text-xs rounded bg-gray-800 text-gray-300">{l.status}</span></td></tr>)}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        );

      case 'Announcements':
        return (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 min-h-[500px]">
             <h2 className="font-bold text-white mb-6">Announcements Feed</h2>
             {loading.announcements ? <Loader/> : errors.announcements ? <ErrorCard msg={errors.announcements} retryKey="Announcements" /> : (
               <div className="space-y-4">
                 {announcements.map((a,i) => (
                   <div key={i} className="p-4 border border-gray-800 rounded-xl bg-gray-950">
                     <div className="flex justify-between items-start mb-2"><h3 className="font-bold text-purple-400">{a.title}</h3><span className="text-[10px] uppercase bg-gray-800 text-gray-300 px-2 rounded">{a.priority}</span></div>
                     <p className="text-sm text-gray-400 whitespace-pre-wrap">{a.message}</p>
                   </div>
                 ))}
                 {!announcements.length && <p className="text-gray-500">No announcements</p>}
               </div>
             )}
          </div>
        );

      default: return <div className="text-gray-400">Section under construction</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-200 font-sans overflow-hidden">
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-800 text-purple-500 flex items-center justify-center font-black border-2 border-purple-500">ST</div>
          <div><h2 className="font-bold text-white leading-tight">Staff Portal</h2><p className="text-xs text-gray-500">Anti-Gravity ERP</p></div>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-6 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Main</div>
          {['Workspace', 'My Timetable', 'Leave Application'].map(tab => (
            <button key={tab} onClick={()=>setActiveTab(tab)} className={`w-full text-left px-6 py-2.5 text-sm font-semibold transition-colors ${activeTab===tab?'bg-purple-500/10 text-purple-400 border-r-4 border-purple-500':'text-gray-400 hover:text-white hover:bg-gray-800'}`}>{tab}</button>
          ))}
          <div className="px-6 mb-2 mt-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Academic</div>
          {['Mark Entry', 'Attendance Entry', 'Student Records'].map(tab => (
            <button key={tab} onClick={()=>setActiveTab(tab)} className={`w-full text-left px-6 py-2.5 text-sm font-semibold transition-colors ${activeTab===tab?'bg-purple-500/10 text-purple-400 border-r-4 border-purple-500':'text-gray-400 hover:text-white hover:bg-gray-800'}`}>{tab}</button>
          ))}
          <div className="px-6 mb-2 mt-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Admin</div>
          {['Announcements', 'Profile'].map(tab => (
            <button key={tab} onClick={()=>setActiveTab(tab)} className={`w-full text-left px-6 py-2.5 text-sm font-semibold transition-colors ${activeTab===tab?'bg-purple-500/10 text-purple-400 border-r-4 border-purple-500':'text-gray-400 hover:text-white hover:bg-gray-800'}`}>{tab}</button>
          ))}
        </div>
        <div className="p-4 border-t border-gray-800">
          <button onClick={()=>{localStorage.clear(); window.location.href='/';}} className="w-full py-2.5 bg-gray-800 hover:bg-red-900/50 hover:text-red-400 text-gray-400 font-bold rounded-xl transition-colors">Logout</button>
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 bg-gray-900 border-b border-gray-800 flex items-center px-8 shrink-0"><h1 className="text-xl font-black text-white">{activeTab}</h1></div>
        <div className="flex-1 overflow-y-auto p-8">{renderContent()}</div>
      </div>
    </div>
  );
}