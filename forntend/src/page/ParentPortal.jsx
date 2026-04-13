import React, { useState, useEffect } from 'react';

const ParentPortal = ({ handleLogout, apiUrl, loggedInEmail, token, userName }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [feeStatus, setFeeStatus] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [semesterFilter, setSemesterFilter] = useState('1');
  const [announcementFilter, setAnnouncementFilter] = useState('All');

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Child
        const studentRes = await fetch(`${apiUrl}/api/host/student-by-parent-email/${loggedInEmail}`, { headers }).catch(() => null);
        let studentData = null;
        if (studentRes?.ok) {
          studentData = await studentRes.json();
          setStudent(studentData);
        }

        const rollNo = studentData?.registerNumber || 'UNKNOWN';

        // Fetch other data in parallel
        const [attRes, marksRes, feeRes, annRes] = await Promise.all([
          fetch(`${apiUrl}/api/host/attendance-by-roll/${rollNo}`, { headers }).catch(() => null),
          fetch(`${apiUrl}/api/host/marks-by-roll/${rollNo}`, { headers }).catch(() => null),
          fetch(`${apiUrl}/api/host/fee-status/${rollNo}`, { headers }).catch(() => null),
          fetch(`${apiUrl}/api/host/all-announcements`, { headers }).catch(() => null)
        ]);

        if (attRes?.ok) setAttendance(await attRes.json() || []);
        if (marksRes?.ok) setMarks(await marksRes.json() || []);
        if (feeRes?.ok) setFeeStatus(await feeRes.json() || {});
        if (annRes?.ok) setAnnouncements(await annRes.json() || []);

      } catch (err) {
        console.error("Data fetching error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl, loggedInEmail, token]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'attendance', label: 'Attendance Report', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { id: 'academic', label: 'Academic Performance', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'fees', label: 'Fee Status', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'announcements', label: 'Announcements', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' }
  ];

  const overallAtt = attendance?.length ? (attendance.reduce((acc, curr) => acc + (curr.attended || 0), 0) / attendance.reduce((acc, curr) => acc + (curr.totalClasses || 1), 0)) * 100 : 0;
  
  const renderDashboard = () => (
    <div className="space-y-6">
      {student && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div>
            <h2 className="text-2xl font-bold">Child Profile: {student?.name}</h2>
            <p className="text-blue-100">{student?.department} • Batch {student?.batch} • Roll No: {student?.registerNumber}</p>
          </div>
        </div>
      )}

      {overallAtt < 75 && overallAtt > 0 && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl flex items-center space-x-3">
          <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Alert: {student?.name}'s overall attendance ({overallAtt.toFixed(1)}%) has dropped below the 75% required threshold.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall Attendance', value: `${overallAtt.toFixed(1)}%`, color: overallAtt >= 85 ? 'text-emerald-500' : overallAtt >= 75 ? 'text-amber-500' : 'text-rose-500' },
          { label: 'Current CGPA', value: '8.4', color: 'text-blue-600' },
          { label: 'Fee Status', value: feeStatus?.status || 'Pending', color: feeStatus?.status === 'Paid' ? 'text-emerald-500' : 'text-rose-500' },
          { label: 'Upcoming Exams', value: '2', color: 'text-slate-700' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-1">{kpi.label}</p>
            <p className={`text-3xl font-black ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-bold text-slate-800">Recent Announcements</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {(announcements || []).slice(0, 3).map((ann, idx) => (
            <div key={idx} className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-slate-800">{ann?.title}</h4>
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{ann?.postedAt}</span>
              </div>
              <p className="text-sm text-slate-600">{ann?.message}</p>
            </div>
          ))}
          {!announcements?.length && <div className="p-6 text-center text-slate-500 text-sm">No recent announcements.</div>}
        </div>
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">Attendance Report</h2>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium text-sm">
          Overall: {overallAtt.toFixed(1)}%
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 font-semibold text-slate-700">Subject</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Code</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Total Classes</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Attended</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Percentage</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(attendance || []).map((att, idx) => {
              const perc = (att?.attended / att?.totalClasses) * 100 || 0;
              return (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{att?.subjectName ?? '-'}</td>
                  <td className="px-6 py-4 text-slate-600">{att?.subjectCode ?? '-'}</td>
                  <td className="px-6 py-4 text-slate-600">{att?.totalClasses ?? 0}</td>
                  <td className="px-6 py-4 text-slate-600">{att?.attended ?? 0}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{perc.toFixed(1)}%</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${perc >= 85 ? 'bg-emerald-100 text-emerald-700' : perc >= 75 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                      {perc >= 85 ? 'Safe' : perc >= 75 ? 'At Risk' : 'Detained'}
                    </span>
                  </td>
                </tr>
              );
            })}
            {!attendance?.length && (
              <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500">No attendance data found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAcademic = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-lg font-bold text-slate-800">Academic Performance</h2>
        <div className="flex items-center space-x-4">
          <select 
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
          >
            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>
          <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium text-sm">
            Current CGPA: 8.4
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 font-semibold text-slate-700">Subject</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Int 1</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Int 2</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Assign</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Final</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Total</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Grade</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(marks || []).filter(m => m?.semester == semesterFilter).map((mark, idx) => {
              const total = (mark?.internal1 || 0) + (mark?.internal2 || 0) + (mark?.assignment || 0) + (mark?.finalExam || 0);
              const isPass = total >= 50;
              return (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{mark?.subjectName ?? '-'}</td>
                  <td className="px-6 py-4 text-slate-600">{mark?.internal1 ?? '-'}</td>
                  <td className="px-6 py-4 text-slate-600">{mark?.internal2 ?? '-'}</td>
                  <td className="px-6 py-4 text-slate-600">{mark?.assignment ?? '-'}</td>
                  <td className="px-6 py-4 text-slate-600">{mark?.finalExam ?? '-'}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{total}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{mark?.grade ?? '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${isPass ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {isPass ? 'PASS' : 'FAIL'}
                    </span>
                  </td>
                </tr>
              );
            })}
            {!(marks || []).filter(m => m?.semester == semesterFilter).length && (
              <tr><td colSpan="8" className="px-6 py-8 text-center text-slate-500">No marks recorded for this semester.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderFees = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Fee</p>
            <p className="text-2xl font-black text-slate-800">₹{feeStatus?.totalFee ?? 0}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Amount Paid</p>
            <p className="text-2xl font-black text-emerald-600">₹{feeStatus?.amountPaid ?? 0}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Pending Amount</p>
            <p className="text-2xl font-black text-rose-600">₹{(feeStatus?.totalFee ?? 0) - (feeStatus?.amountPaid ?? 0)}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Fee Breakdown</h2>
          <span className={`px-3 py-1 rounded-md text-sm font-medium ${feeStatus?.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : feeStatus?.status === 'Overdue' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
            {feeStatus?.status ?? 'Pending'}
          </span>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between pb-4 border-b border-slate-100">
              <span className="text-slate-600">Tuition Fee</span>
              <span className="font-medium text-slate-800">₹{feeStatus?.tuitionFee ?? 0}</span>
            </div>
            <div className="flex justify-between pb-4 border-b border-slate-100">
              <span className="text-slate-600">Hostel Fee</span>
              <span className="font-medium text-slate-800">₹{feeStatus?.hostelFee ?? 0}</span>
            </div>
            <div className="flex justify-between pb-4 border-b border-slate-100">
              <span className="text-slate-600">Exam Fee</span>
              <span className="font-medium text-slate-800">₹{feeStatus?.examFee ?? 0}</span>
            </div>
            <div className="flex justify-between pb-4 border-b border-slate-100">
              <span className="text-slate-600">Other Fees</span>
              <span className="font-medium text-slate-800">₹{feeStatus?.otherFee ?? 0}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="font-bold text-slate-800">Total</span>
              <span className="font-black text-blue-600">₹{feeStatus?.totalFee ?? 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">Payment History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate-700">Receipt No</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Date</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Mode</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {feeStatus?.payments?.length ? feeStatus.payments.map((pay, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-800">{pay.receiptNumber}</td>
                  <td className="px-6 py-4 text-slate-600">{pay.paymentDate}</td>
                  <td className="px-6 py-4 text-slate-600">{pay.paymentMode}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">₹{pay.amount}</td>
                </tr>
              )) : <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">No payment history found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnnouncements = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-lg font-bold text-slate-800">All Announcements</h2>
        <select 
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 min-w-[150px]"
          value={announcementFilter}
          onChange={(e) => setAnnouncementFilter(e.target.value)}
        >
          {['All', 'Students', 'Parents', 'Department'].map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
      <div className="divide-y divide-slate-100">
        {(announcements || [])
          .filter(a => announcementFilter === 'All' || a?.targetAudience === announcementFilter)
          .map((ann, idx) => (
          <div key={idx} className="p-6 hover:bg-slate-50 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-slate-800">{ann?.title}</h3>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{ann?.postedAt}</span>
            </div>
            <p className="text-slate-600 leading-relaxed mb-4">{ann?.message}</p>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md font-medium">{ann?.targetAudience}</span>
            </div>
          </div>
        ))}
        {!(announcements || []).filter(a => announcementFilter === 'All' || a?.targetAudience === announcementFilter).length && (
          <div className="p-8 text-center text-slate-500">No announcements match the selected filter.</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}>
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h1 className="text-xl font-black text-blue-600 tracking-tight">Parent<span className="text-slate-800">Portal</span></h1>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveMenu(item.id); setIsSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeMenu === item.id ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <svg className={`w-5 h-5 ${activeMenu === item.id ? 'text-blue-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}/>
                </svg>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-200">
          <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-lg font-medium hover:bg-rose-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden mr-4 text-slate-500 hover:text-slate-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            <h2 className="text-xl font-bold text-slate-800 capitalize">{menuItems.find(m => m.id === activeMenu)?.label}</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800">{userName}</p>
              <p className="text-xs text-slate-500">Parent Account</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold border-2 border-blue-200">
              {userName?.charAt(0) || 'P'}
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <svg className="animate-spin h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              {activeMenu === 'dashboard' && renderDashboard()}
              {activeMenu === 'attendance' && renderAttendance()}
              {activeMenu === 'academic' && renderAcademic()}
              {activeMenu === 'fees' && renderFees()}
              {activeMenu === 'announcements' && renderAnnouncements()}
            </div>
          )}
        </main>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </div>
  );
};

export default ParentPortal;
