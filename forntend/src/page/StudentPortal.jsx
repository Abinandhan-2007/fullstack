import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import api from '../api';

const StudentPortal = ({ user, handleLogout }) => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Workspace');
  const [studentProfile, setStudentProfile] = useState(null);
  const [marks, setMarks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [fees, setFees] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [examSchedule, setExamSchedule] = useState([]);
  const [library, setLibrary] = useState({ borrowed: [], history: [] });
  const [hostel, setHostel] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [newComplaint, setNewComplaint] = useState('');
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [leaveForm, setLeaveForm] = useState({ type:'', from:'', to:'', reason:'' });
  const [leaveFilter, setLeaveFilter] = useState('ALL');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const fetchedTabs = useRef(new Set());
  const sgpaChartRef = useRef(null);
  const sgpaChartInstance = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const role = localStorage.getItem('erp_role');
    if (role !== 'ROLE_STUDENT') {
      navigate('/');
    }
  }, [navigate]);

  const fetchData = async (key, apiCall) => {
    setLoading(prev => ({ ...prev, [key]: true }));
    setErrors(prev => ({ ...prev, [key]: null }));
    try {
      const res = await apiCall();
      return res.data;
    } catch (err) {
      setErrors(prev => ({ ...prev, [key]: err.message || "Failed to fetch data" }));
      return null;
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  useEffect(() => {
    const initProfile = async () => {
      const data = await fetchData('profile', () => api.get('/host/all-students'));
      if (data) {
        const userEmail = user?.email || localStorage.getItem('erp_username');
        const myData = data.find(s => s.email?.toLowerCase() === userEmail?.toLowerCase());
        if (myData) {
          setStudentProfile(myData);
          const regNo = myData.registerNumber;
          Promise.all([
            fetchData('marks', () => api.get(`/marks/student/${regNo}`)).then(d => d && setMarks(d)),
            fetchData('attendance', () => api.get(`/attendance/student/${regNo}`)).then(d => d && setAttendance(d)),
            fetchData('fees', () => api.get(`/fees/student/${regNo}`)).then(d => d && setFees(d)),
            fetchData('timetable', () => api.get(`/timetable`)).then(d => d && setTimetable(d)),
            fetchData('examSchedule', () => api.get(`/exam-schedule`)).then(d => d && setExamSchedule(d))
          ]).then(() => {
            fetchedTabs.current.add('Workspace');
          });
        } else {
           setErrors(prev => ({ ...prev, profile: "Profile not found" }));
        }
      }
    };
    if (!studentProfile) initProfile();
  }, [user]);

  useEffect(() => {
    if (!studentProfile) return;
    const regNo = studentProfile.registerNumber;
    
    if (activeTab === 'Marks & Results' && !fetchedTabs.current.has('Marks & Results')) {
      fetchData('marks', () => api.get(`/marks/student/${regNo}`)).then(d => d && setMarks(d));
      fetchedTabs.current.add('Marks & Results');
    }
    else if (activeTab === 'Attendance' && !fetchedTabs.current.has('Attendance')) {
      fetchData('attendance', () => api.get(`/attendance/student/${regNo}`)).then(d => d && setAttendance(d));
      fetchedTabs.current.add('Attendance');
    }
    else if (activeTab === 'Timetable' && !fetchedTabs.current.has('Timetable')) {
      fetchData('timetable', () => api.get(`/timetable`)).then(d => d && setTimetable(d));
      fetchedTabs.current.add('Timetable');
    }
    else if (activeTab === 'Fee Payment' && !fetchedTabs.current.has('Fee Payment')) {
      fetchData('fees', () => api.get(`/fees/student/${regNo}`)).then(d => d && setFees(d));
      fetchedTabs.current.add('Fee Payment');
    }
    else if (activeTab === 'Exam Schedule' && !fetchedTabs.current.has('Exam Schedule')) {
      fetchData('examSchedule', () => api.get(`/exam-schedule`)).then(d => d && setExamSchedule(d));
      fetchedTabs.current.add('Exam Schedule');
    }
    else if (activeTab === 'Library' && !fetchedTabs.current.has('Library')) {
      fetchData('library', () => api.get(`/library/student/${regNo}`)).then(d => {
        if (d) {
           const borrowed = d.filter(b => !b.returnDate);
           const history = d.filter(b => b.returnDate);
           setLibrary({ borrowed, history });
        }
      });
      fetchedTabs.current.add('Library');
    }
    else if (activeTab === 'Hostel' && !fetchedTabs.current.has('Hostel')) {
      fetchData('hostel', () => api.get(`/hostel/student/${regNo}`)).then(d => d && setHostel(d));
      fetchData('complaints', () => api.get(`/hostel/complaints/student/${regNo}`)).then(d => d && setComplaints(d));
      fetchedTabs.current.add('Hostel');
    }
    else if (activeTab === 'Leave Application' && !fetchedTabs.current.has('Leave Application')) {
      fetchData('leaveHistory', () => api.get(`/leave/student/${regNo}`)).then(d => d && setLeaveHistory(d));
      fetchedTabs.current.add('Leave Application');
    }
  }, [activeTab, studentProfile]);

  const cgpa = useMemo(() => {
    if (!marks.length) return 'N/A';
    return (marks.reduce((s,m) => s + (m.score/m.maxScore)*10, 0) / marks.length).toFixed(2);
  }, [marks]);

  const overallAttendance = useMemo(() => {
    if (!attendance.length) return 0;
    const total = attendance.reduce((s,a) => s + a.totalClasses, 0);
    const present = attendance.reduce((s,a) => s + a.present, 0);
    return total ? Math.round((present/total)*100) : 0;
  }, [attendance]);

  const pendingFees = useMemo(() =>
    fees.filter(f => f.status === 'PENDING' || f.status === 'OVERDUE')
        .reduce((s,f) => s + f.amount, 0), [fees]);

  const arrearCount = useMemo(() =>
    [...new Set(marks.filter(m => (m.score/m.maxScore)*100 < 50).map(m => m.courseCode))].length,
  [marks]);

  const lowAttendance = useMemo(() =>
    attendance.filter(a => Math.round((a.present/a.totalClasses)*100) < 75).map(a => ({
      subject: a.courseCode,
      percent: Math.round((a.present/a.totalClasses)*100),
      needed: Math.ceil((0.75*a.totalClasses - a.present)/0.25)
    })), [attendance]);

  const upcomingExams = useMemo(() =>
    examSchedule.filter(e => new Date(e.date) >= new Date())
      .sort((a,b) => new Date(a.date)-new Date(b.date)).slice(0,3)
      .map(e => ({ ...e, daysLeft: Math.ceil((new Date(e.date)-new Date())/(86400000)) })),
  [examSchedule]);

  const todayClasses = useMemo(() => {
    const day = new Date().toLocaleDateString('en-US',{weekday:'long'}).toUpperCase();
    return timetable.filter(t => t.day?.toUpperCase() === day).sort((a,b) => a.period-b.period);
  }, [timetable]);

  const semesterData = useMemo(() => {
    const grouped = {};
    marks.forEach(m => {
      const s = m.semester || 'I';
      if (!grouped[s]) grouped[s] = { total:0, count:0 };
      grouped[s].total += (m.score/m.maxScore)*10;
      grouped[s].count++;
    });
    return Object.entries(grouped).map(([sem,d]) => ({ sem, sgpa: parseFloat((d.total/d.count).toFixed(2)) }));
  }, [marks]);

  useEffect(() => {
    if (activeTab !== 'Workspace' || !marks.length || !sgpaChartRef.current) return;
    if (sgpaChartInstance.current) sgpaChartInstance.current.destroy();
    const ctx = sgpaChartRef.current.getContext('2d');
    sgpaChartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: semesterData.map(d => d.sem),
        datasets: [{ data: semesterData.map(d => d.sgpa), backgroundColor: '#5b8dd9', borderRadius: 4 }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { min: 0, max: 10, grid: { color: '#1f2937' }, ticks: { color: '#9ca3af' } },
          x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
        },
        plugins: { 
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx) => `SGPA: ${ctx.raw}` } }
        }
      }
    });
  }, [activeTab, marks, semesterData]);

  const handleLogoutClick = () => {
    localStorage.clear();
    if (handleLogout) handleLogout();
    navigate('/');
  };

  const submitComplaint = async () => {
    if (!newComplaint.trim()) return;
    try {
      await api.post('/hostel/complaints', {
        regNo: studentProfile.registerNumber,
        description: newComplaint
      });
      showToast('Complaint submitted successfully');
      setNewComplaint('');
      fetchData('complaints', () => api.get(`/hostel/complaints/student/${studentProfile.registerNumber}`)).then(d => d && setComplaints(d));
    } catch (err) {
      showToast('Failed to submit complaint', 'error');
      console.error(err);
    }
  };

  const handleLeaveSubmit = async () => {
    if (!leaveForm.type || !leaveForm.from || !leaveForm.to || !leaveForm.reason) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    const fromDate = new Date(leaveForm.from);
    fromDate.setHours(0,0,0,0);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (fromDate < today) {
      showToast('From date cannot be in the past', 'error');
      return;
    }
    if (new Date(leaveForm.to) < new Date(leaveForm.from)) {
      showToast('To date must be after From date', 'error');
      return;
    }
    const diffTime = Math.abs(new Date(leaveForm.to) - new Date(leaveForm.from));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    try {
      const payload = {
        regNo: studentProfile.registerNumber,
        leaveType: leaveForm.type,
        fromDate: leaveForm.from,
        toDate: leaveForm.to,
        days: diffDays,
        reason: leaveForm.reason
      };
      await api.post('/leave/student/apply', payload);
      showToast('Leave application submitted', 'success');
      setLeaveForm({ type:'', from:'', to:'', reason:'' });
      fetchData('leaveHistory', () => api.get(`/leave/student/${studentProfile.registerNumber}`)).then(d => d && setLeaveHistory(d));
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit application', 'error');
    }
  };

  const leaveDaysCount = useMemo(() => {
    if (!leaveForm.from || !leaveForm.to) return 0;
    const diffTime = new Date(leaveForm.to) - new Date(leaveForm.from);
    if (diffTime < 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [leaveForm.from, leaveForm.to]);

  const navGroups = {
    Main: ['Workspace'],
    Academic: ['Marks & Results', 'Attendance', 'Timetable', 'Fee Payment', 'Exam Schedule'],
    Campus: ['Library', 'Hostel', 'Leave Application']
  };

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const Loader = () => (
    <div className="flex flex-col gap-4 p-6 animate-pulse">
      <div className="h-8 bg-gray-800 rounded w-1/4"></div>
      <div className="h-32 bg-gray-800 rounded w-full"></div>
      <div className="h-32 bg-gray-800 rounded w-full"></div>
    </div>
  );

  const ErrorCard = ({ message, onRetry }) => (
    <div className="p-6 bg-gray-900 rounded-xl border border-red-500/30 flex flex-col items-center justify-center gap-4">
      <p className="text-red-400">{message || "Something went wrong"}</p>
      <button onClick={onRetry} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
        Retry
      </button>
    </div>
  );

  if (!studentProfile) {
    return <div className="flex h-screen bg-gray-950 items-center justify-center"><div className="text-purple-500 animate-pulse text-2xl">Loading Profile...</div></div>;
  }

  const renderContent = () => {
    if (loading[activeTab === 'Marks & Results' ? 'marks' : activeTab === 'Fee Payment' ? 'fees' : activeTab === 'Leave Application' ? 'leaveHistory' : activeTab.toLowerCase()]) return <Loader />;
    const errKey = activeTab === 'Marks & Results' ? 'marks' : activeTab === 'Fee Payment' ? 'fees' : activeTab === 'Leave Application' ? 'leaveHistory' : activeTab.toLowerCase();
    if (errors[errKey]) return <ErrorCard message={errors[errKey]} onRetry={() => fetchedTabs.current.delete(activeTab)} />;

    switch (activeTab) {
      case 'Workspace':
        return (
          <div className="flex flex-col gap-6">
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">{getGreeting()}, {studentProfile.name}</h1>
                <p className="text-gray-400">{studentProfile.registerNumber} • {studentProfile.department} • Semester {studentProfile.semester || 'N/A'}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-white">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="text-gray-400">Attendance: <span className="text-white font-bold">{overallAttendance}%</span></span>
                  <span className="text-gray-400">Backlogs: <span className="text-white font-bold">{arrearCount}</span></span>
                  <span className="text-gray-400">Next Exam: <span className="text-white font-bold">{upcomingExams.length ? `${upcomingExams[0].daysLeft} days` : 'None'}</span></span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center text-2xl font-bold text-purple-400 border-2 border-purple-500 shrink-0">
                    {studentProfile.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{studentProfile.name}</h2>
                    <p className="text-gray-400">{studentProfile.registerNumber}</p>
                    <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded-full mt-2">Continuing</span>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Department</span><span className="text-gray-300">{studentProfile.department}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Semester</span><span className="text-gray-300">{studentProfile.semester || 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Batch</span><span className="text-gray-300">{studentProfile.batch || 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Blood Group</span><span className="text-gray-300">{studentProfile.bloodGroup || 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="text-gray-300">{studentProfile.email}</span></div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 flex flex-col">
                <h2 className="text-lg font-bold text-white mb-4">Semester Grade Point Average</h2>
                <div className="flex-1 min-h-[200px] relative">
                  <canvas ref={sgpaChartRef}></canvas>
                </div>
                <div className="mt-4 text-center">
                  <span className="text-4xl font-black text-white">{cgpa}</span>
                  <span className="text-gray-500 ml-2">CGPA</span>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 flex-1 overflow-auto">
                  <h2 className="text-lg font-bold text-white mb-4">Today's Classes</h2>
                  {todayClasses.length === 0 ? (
                    <p className="text-gray-500 italic">No classes today</p>
                  ) : (
                    <div className="space-y-3">
                      {todayClasses.map((t, i) => (
                        <div key={i} className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-lg">
                          <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center text-purple-400 font-bold shrink-0">{t.period}</div>
                          <div className="flex-1 truncate">
                            <div className="text-sm font-bold text-gray-200 truncate">{t.subject}</div>
                            <div className="text-xs text-gray-500">Room {t.room}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 flex-1 overflow-auto">
                  <h2 className="text-lg font-bold text-white mb-4">Upcoming Exams</h2>
                  {upcomingExams.length === 0 ? (
                    <p className="text-gray-500 italic">No upcoming exams</p>
                  ) : (
                    <div className="space-y-3">
                      {upcomingExams.map((e, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg">
                          <div className="truncate">
                            <div className="text-sm font-bold text-gray-200 truncate">{e.subject}</div>
                            <div className="text-xs text-gray-500">{new Date(e.date).toLocaleDateString()}</div>
                          </div>
                          <span className={`px-2 py-1 text-xs font-bold rounded-md ${e.daysLeft <= 3 ? 'bg-red-500/20 text-red-400' : e.daysLeft <= 7 ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}>
                            {e.daysLeft} days
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'CGPA', value: cgpa, color: 'text-purple-400' },
                { label: 'Overall Attendance', value: `${overallAttendance}%`, color: overallAttendance < 75 ? 'text-red-400' : 'text-green-400' },
                { label: 'Arrear Count', value: arrearCount, color: arrearCount > 0 ? 'text-red-400' : 'text-gray-300' },
                { label: 'Fees Due (₹)', value: pendingFees.toLocaleString(), color: pendingFees > 0 ? 'text-amber-400' : 'text-green-400' }
              ].map((m, i) => (
                <div key={i} className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                  <div className="text-gray-500 text-sm mb-1">{m.label}</div>
                  <div className={`text-3xl font-black ${m.color}`}>{m.value}</div>
                </div>
              ))}
            </div>

            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <h2 className="text-lg font-bold text-white mb-4">Attendance Alerts</h2>
              {lowAttendance.length === 0 ? (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 font-bold">
                  All subjects safe!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-500 text-sm">
                        <th className="pb-3 font-medium">Subject</th>
                        <th className="pb-3 font-medium">Current %</th>
                        <th className="pb-3 font-medium">Classes Needed</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowAttendance.map((a, i) => (
                        <tr key={i} className="border-b border-gray-800/50">
                          <td className="py-3 text-gray-300">{a.subject}</td>
                          <td className="py-3 text-gray-300 font-bold">{a.percent}%</td>
                          <td className="py-3 text-gray-300">{a.needed}</td>
                          <td className="py-3">
                            <span className="px-2 py-1 text-xs font-bold rounded-md bg-red-500/20 text-red-400">Detained Risk</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );

      case 'Marks & Results':
        return (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Marks & Results</h2>
            {marks.length === 0 ? (
              <p className="text-gray-500 italic">No marks records found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-500 text-sm">
                      <th className="pb-3 font-medium">Subject</th>
                      <th className="pb-3 font-medium">Exam Type</th>
                      <th className="pb-3 font-medium">Score</th>
                      <th className="pb-3 font-medium">Max Score</th>
                      <th className="pb-3 font-medium">%</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks.map((m, i) => {
                      const pct = Math.round((m.score / m.maxScore) * 100);
                      return (
                        <tr key={i} className="border-b border-gray-800/50">
                          <td className="py-3 text-gray-300">{m.courseCode}</td>
                          <td className="py-3 text-gray-300">{m.examType}</td>
                          <td className="py-3 text-white font-bold">{m.score}</td>
                          <td className="py-3 text-gray-500">{m.maxScore}</td>
                          <td className="py-3 text-gray-300">{pct}%</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 text-xs font-bold rounded-md ${pct >= 50 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                              {pct >= 50 ? 'PASS' : 'FAIL'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      case 'Attendance':
        return (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Overall %', value: `${overallAttendance}%`, color: overallAttendance < 75 ? 'text-red-400' : 'text-purple-400' },
                { label: 'Total Classes', value: attendance.reduce((s,a)=>s+(a.totalClasses||1),0), color: 'text-gray-300' },
                { label: 'Total Present', value: attendance.reduce((s,a)=>s+(a.present===true?1:a.present===false?0:a.present),0), color: 'text-green-400' },
                { label: 'Total Absent', value: attendance.reduce((s,a)=>s+((a.totalClasses||1)-(a.present===true?1:a.present===false?0:a.present)),0), color: 'text-red-400' }
              ].map((m, i) => (
                <div key={i} className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                  <div className="text-gray-500 text-sm mb-1">{m.label}</div>
                  <div className={`text-3xl font-black ${m.color}`}>{m.value}</div>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <h2 className="text-xl font-bold text-white mb-6">Subject-wise Attendance</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-500 text-sm">
                      <th className="pb-3 font-medium">Subject</th>
                      <th className="pb-3 font-medium">Total Classes</th>
                      <th className="pb-3 font-medium">Present</th>
                      <th className="pb-3 font-medium">Absent</th>
                      <th className="pb-3 font-medium">%</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((a, i) => {
                      const total = a.totalClasses || 1;
                      const present = a.present === true ? 1 : a.present === false ? 0 : a.present;
                      const pct = Math.round((present / total) * 100);
                      const statusColor = pct >= 75 ? 'bg-green-500/20 text-green-400' : pct >= 65 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400';
                      const statusText = pct >= 75 ? 'Safe' : pct >= 65 ? 'At Risk' : 'Detained';
                      return (
                        <tr key={i} className="border-b border-gray-800/50">
                          <td className="py-3 text-gray-300">{a.courseCode}</td>
                          <td className="py-3 text-gray-500">{total}</td>
                          <td className="py-3 text-green-400">{present}</td>
                          <td className="py-3 text-red-400">{total - present}</td>
                          <td className="py-3 text-white font-bold">{pct}%</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 text-xs font-bold rounded-md ${statusColor}`}>{statusText}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'Timetable': {
        const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        const periods = [1, 2, 3, 4, 5, 6, 7, 8];
        const todayDay = new Date().toLocaleDateString('en-US',{weekday:'long'}).toUpperCase();
        return (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 overflow-x-auto">
            <h2 className="text-xl font-bold text-white mb-6">Weekly Timetable</h2>
            <table className="w-full text-center border-collapse min-w-[800px]">
              <thead>
                <tr>
                  <th className="border border-gray-800 p-3 text-gray-500 bg-gray-950 w-24">Period</th>
                  {days.map(d => (
                    <th key={d} className={`border border-gray-800 p-3 text-gray-300 bg-gray-950 ${d === todayDay ? 'bg-purple-950/30 text-purple-400 border-purple-800/50' : ''}`}>
                      {d.substring(0,3)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map(p => (
                  <tr key={p}>
                    <td className="border border-gray-800 p-3 text-gray-500 font-bold bg-gray-950">{p}</td>
                    {days.map(d => {
                      const cell = timetable.find(t => t.day?.toUpperCase() === d && t.period === p);
                      return (
                        <td key={d} className={`border border-gray-800 p-3 ${d === todayDay ? 'bg-purple-950/10 border-purple-800/30' : ''}`}>
                          {cell ? (
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-bold text-gray-200">{cell.subject}</span>
                              <span className="text-xs text-gray-500">{cell.room}</span>
                            </div>
                          ) : (
                            <span className="text-gray-700">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      case 'Fee Payment':
        return (
          <div className="flex flex-col gap-6">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 flex items-center justify-between">
              <div>
                <div className="text-gray-500 text-sm mb-1">Total Due</div>
                <div className="text-4xl font-black text-red-500">₹{pendingFees.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-gray-500 text-sm mb-1">Total Paid</div>
                <div className="text-2xl font-bold text-green-500">
                  ₹{fees.filter(f => f.status === 'PAID' || f.status === 'Paid').reduce((s,f) => s + f.amount, 0).toLocaleString()}
                </div>
              </div>
            </div>

            {pendingFees === 0 && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 font-bold flex items-center gap-2">
                <span>✅</span> No pending fees!
              </div>
            )}

            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <h2 className="text-xl font-bold text-white mb-6">Fee Records</h2>
              {fees.length === 0 ? (
                <p className="text-gray-500 italic">No fee records found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-500 text-sm">
                        <th className="pb-3 font-medium">Fee Type</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Due Date</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fees.map((f, i) => {
                        const isPaid = f.status === 'PAID' || f.status === 'Paid';
                        const isOverdue = f.status === 'OVERDUE' || f.status === 'Overdue';
                        return (
                          <tr key={i} className="border-b border-gray-800/50">
                            <td className="py-4 text-gray-300">{f.feeType || 'Tuition Fee'}</td>
                            <td className="py-4 text-white font-bold">₹{f.amount.toLocaleString()}</td>
                            <td className="py-4 text-gray-500">{new Date(f.dueDate).toLocaleDateString()}</td>
                            <td className="py-4">
                              <span className={`px-2 py-1 text-xs font-bold rounded-md ${isPaid ? 'bg-green-500/20 text-green-400' : isOverdue ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                {f.status}
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              {isPaid ? (
                                <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm transition-colors" onClick={() => showToast('Downloading receipt...')}>
                                  Receipt
                                </button>
                              ) : (
                                <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors">
                                  Pay Now
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );

      case 'Exam Schedule':
        return (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Exam Schedule</h2>
            {examSchedule.length === 0 ? (
              <p className="text-gray-500 italic">No exams scheduled</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-500 text-sm">
                      <th className="pb-3 font-medium">Subject</th>
                      <th className="pb-3 font-medium">Exam Type</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Time</th>
                      <th className="pb-3 font-medium">Venue</th>
                      <th className="pb-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examSchedule.sort((a,b)=>new Date(a.date)-new Date(b.date)).map((e, i) => {
                      const daysLeft = Math.ceil((new Date(e.date)-new Date())/(86400000));
                      const isSoon = daysLeft >= 0 && daysLeft <= 3;
                      const isComing = daysLeft > 3 && daysLeft <= 7;
                      return (
                        <tr key={i} className={`border-b border-gray-800/50 ${isSoon ? 'border-l-4 border-l-red-500' : isComing ? 'border-l-4 border-l-amber-500' : ''}`}>
                          <td className="py-4 text-gray-300 pl-4">
                            <div className="flex items-center gap-2">
                              {e.subject}
                              {isSoon && <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded uppercase">Soon</span>}
                            </div>
                          </td>
                          <td className="py-4 text-gray-400">{e.examType}</td>
                          <td className="py-4 text-white font-bold">{new Date(e.date).toLocaleDateString()}</td>
                          <td className="py-4 text-gray-500">{e.time || '10:00 AM'}</td>
                          <td className="py-4 text-gray-500">{e.venue || 'Main Hall'}</td>
                          <td className="py-4 text-right">
                            <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors">
                              Hall Ticket
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      case 'Library':
        return (
          <div className="flex flex-col gap-6">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <h2 className="text-xl font-bold text-white mb-6">Currently Borrowed</h2>
              {library.borrowed.length === 0 ? (
                <p className="text-gray-500 italic">No books currently borrowed</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-500 text-sm">
                        <th className="pb-3 font-medium">Book Title</th>
                        <th className="pb-3 font-medium">Author</th>
                        <th className="pb-3 font-medium">Issue Date</th>
                        <th className="pb-3 font-medium">Due Date</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {library.borrowed.map((b, i) => {
                        const daysLeft = Math.ceil((new Date(b.dueDate)-new Date())/(86400000));
                        return (
                          <tr key={i} className="border-b border-gray-800/50">
                            <td className="py-4 text-gray-200 font-medium">{b.title}</td>
                            <td className="py-4 text-gray-500">{b.author}</td>
                            <td className="py-4 text-gray-400">{new Date(b.issueDate).toLocaleDateString()}</td>
                            <td className="py-4 text-white font-bold">{new Date(b.dueDate).toLocaleDateString()}</td>
                            <td className="py-4">
                              <span className={`px-2 py-1 text-xs font-bold rounded-md ${daysLeft < 0 ? 'bg-red-500/20 text-red-400' : daysLeft <= 7 ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}>
                                {daysLeft < 0 ? `Overdue (${Math.abs(daysLeft)} days)` : `${daysLeft} days left`}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <h2 className="text-xl font-bold text-white mb-6">Borrow History</h2>
              {library.history.length === 0 ? (
                <p className="text-gray-500 italic">No past borrowing history</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-500 text-sm">
                        <th className="pb-3 font-medium">Book Title</th>
                        <th className="pb-3 font-medium">Issue Date</th>
                        <th className="pb-3 font-medium">Return Date</th>
                        <th className="pb-3 font-medium">Fine Paid</th>
                      </tr>
                    </thead>
                    <tbody>
                      {library.history.map((b, i) => (
                        <tr key={i} className="border-b border-gray-800/50">
                          <td className="py-3 text-gray-300">{b.title}</td>
                          <td className="py-3 text-gray-500">{new Date(b.issueDate).toLocaleDateString()}</td>
                          <td className="py-3 text-gray-400">{new Date(b.returnDate).toLocaleDateString()}</td>
                          <td className={`py-3 font-bold ${b.fine > 0 ? 'text-red-400' : 'text-green-400'}`}>
                            ₹{b.fine || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );

      case 'Hostel':
        return (
          <div className="flex flex-col gap-6">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <h2 className="text-xl font-bold text-white mb-6">Hostel Allocation</h2>
              {!hostel ? (
                <p className="text-gray-500 italic">No hostel allocation found</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Room No</div>
                    <div className="text-2xl font-bold text-white">{hostel.roomNo}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Block</div>
                    <div className="text-2xl font-bold text-white">{hostel.block}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Floor</div>
                    <div className="text-2xl font-bold text-white">{hostel.floor}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Bed No</div>
                    <div className="text-2xl font-bold text-white">{hostel.bedNo}</div>
                  </div>
                  <div className="col-span-2 md:col-span-4 mt-2">
                    <div className="text-gray-500 text-sm mb-2">Roommates</div>
                    <div className="flex flex-wrap gap-2">
                      {(hostel.roommates || []).map((rm, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">{rm}</span>
                      ))}
                      {(!hostel.roommates || hostel.roommates.length === 0) && <span className="text-gray-500">None</span>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                <h2 className="text-lg font-bold text-white mb-4">New Complaint</h2>
                <textarea 
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 resize-none h-32 mb-2"
                  placeholder="Describe your issue..."
                  value={newComplaint}
                  onChange={e => e.target.value.length <= 500 && setNewComplaint(e.target.value)}
                ></textarea>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{newComplaint.length}/500</span>
                  <button onClick={submitComplaint} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-bold text-sm">
                    Submit
                  </button>
                </div>
              </div>

              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 lg:col-span-2">
                <h2 className="text-lg font-bold text-white mb-4">Complaint History</h2>
                {complaints.length === 0 ? (
                  <p className="text-gray-500 italic">No complaints raised</p>
                ) : (
                  <div className="space-y-4">
                    {complaints.map((c, i) => (
                      <div key={i} className="bg-gray-950 p-4 rounded-xl border border-gray-800 flex justify-between items-start gap-4">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">{new Date(c.date || c.createdAt).toLocaleDateString()}</div>
                          <p className="text-gray-300 text-sm">{c.description.length > 60 ? c.description.substring(0, 60) + '...' : c.description}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-bold rounded-md whitespace-nowrap ${c.status === 'Resolved' ? 'bg-green-500/20 text-green-400' : c.status === 'In Progress' ? 'bg-purple-500/20 text-purple-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {c.status || 'Open'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'Leave Application':
        return (
          <div className="flex flex-col gap-6">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <h2 className="text-xl font-bold text-white mb-6">Apply for Leave</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Leave Type</label>
                  <select 
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                    value={leaveForm.type} onChange={e => setLeaveForm({...leaveForm, type: e.target.value})}
                  >
                    <option value="">Select Type</option>
                    <option value="Medical">Medical</option>
                    <option value="Casual">Casual</option>
                    <option value="Duty">Duty</option>
                    <option value="Emergency">Emergency</option>
                    <option value="On Duty">On Duty</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">From Date</label>
                    <input type="date" className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 [color-scheme:dark]" 
                      value={leaveForm.from} onChange={e => setLeaveForm({...leaveForm, from: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">To Date</label>
                    <input type="date" className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 [color-scheme:dark]" 
                      value={leaveForm.to} onChange={e => setLeaveForm({...leaveForm, to: e.target.value})} />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-sm font-medium text-gray-400">Reason</label>
                    {leaveDaysCount > 0 && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded-md">
                        {leaveDaysCount} Days
                      </span>
                    )}
                  </div>
                  <textarea 
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 resize-none h-24 mb-2"
                    placeholder="Detailed reason (min 20 chars)..."
                    value={leaveForm.reason}
                    onChange={e => e.target.value.length <= 300 && setLeaveForm({...leaveForm, reason: e.target.value})}
                  ></textarea>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{leaveForm.reason.length}/300</span>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Supporting Document (Optional)</label>
                  <input type="file" accept=".pdf,image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-gray-800 file:text-purple-400 hover:file:bg-gray-700 cursor-pointer" />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={handleLeaveSubmit} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors font-bold shadow-lg shadow-purple-500/20">
                  Submit Application
                </button>
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Leave History</h2>
                <select className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-1 text-sm text-gray-300 focus:outline-none focus:border-purple-500"
                  value={leaveFilter} onChange={e => setLeaveFilter(e.target.value)}>
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              
              {leaveHistory.filter(l => leaveFilter === 'ALL' || l.status?.toUpperCase() === leaveFilter).length === 0 ? (
                <p className="text-gray-500 italic">No leave applications found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-500 text-sm">
                        <th className="pb-3 font-medium">Leave Type</th>
                        <th className="pb-3 font-medium">From</th>
                        <th className="pb-3 font-medium">To</th>
                        <th className="pb-3 font-medium">Days</th>
                        <th className="pb-3 font-medium">Reason</th>
                        <th className="pb-3 font-medium">Applied On</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveHistory.filter(l => leaveFilter === 'ALL' || l.status?.toUpperCase() === leaveFilter).map((l, i) => (
                        <tr key={i} className="border-b border-gray-800/50">
                          <td className="py-4 text-gray-300 font-medium">{l.leaveType}</td>
                          <td className="py-4 text-gray-400">{new Date(l.fromDate).toLocaleDateString()}</td>
                          <td className="py-4 text-gray-400">{new Date(l.toDate).toLocaleDateString()}</td>
                          <td className="py-4 text-white font-bold">{l.days}</td>
                          <td className="py-4 text-gray-400 max-w-[200px] truncate" title={l.reason}>{l.reason}</td>
                          <td className="py-4 text-gray-500 text-sm">{l.appliedOn ? new Date(l.appliedOn).toLocaleDateString() : 'N/A'}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 text-xs font-bold rounded-md whitespace-nowrap ${l.status?.toUpperCase() === 'APPROVED' ? 'bg-green-500/20 text-green-400' : l.status?.toUpperCase() === 'REJECTED' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                              {l.status || 'PENDING'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 font-sans text-gray-300 relative">
      {toast && (
        <div className={`absolute top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-2xl font-bold text-sm text-white flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
          <span>{toast.type === 'error' ? '❌' : '✅'}</span> {toast.message}
        </div>
      )}

      <div className="w-72 bg-gray-900 border-r border-gray-800 flex flex-col h-full shrink-0">
        <div className="p-6 border-b border-gray-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-lg font-bold text-purple-400 border-2 border-purple-500 shrink-0">
            {studentProfile.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <div className="font-bold text-white truncate" title={studentProfile.name}>{studentProfile.name}</div>
            <div className="text-xs text-gray-500 truncate">{studentProfile.registerNumber}</div>
            <div className="text-[10px] font-bold text-purple-400 mt-1 uppercase tracking-wider">{studentProfile.department}</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
          {Object.entries(navGroups).map(([group, items]) => (
            <div key={group}>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 pl-3">{group}</div>
              <div className="space-y-1">
                {items.map(item => (
                  <button
                    key={item}
                    onClick={() => setActiveTab(item)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === item ? 'bg-gray-800 text-purple-400 border-l-2 border-purple-500' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogoutClick} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-colors text-sm font-bold">
            Logout
            <span className="text-xs font-normal text-gray-500 truncate max-w-[120px]">({studentProfile.email})</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;
