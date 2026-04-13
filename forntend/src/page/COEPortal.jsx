import React, { useState, useEffect } from 'react';

const COEPortal = ({ handleLogout, apiUrl, loggedInEmail, token, userName }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reEvaluations, setReEvaluations] = useState([]);

  // Common Headers
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [examsRes, reevalRes] = await Promise.all([
          fetch(`${apiUrl}/api/host/all-examschedules`, { headers }).catch(() => null),
          fetch(`${apiUrl}/api/host/all-reevaluationrequests`, { headers }).catch(() => null)
        ]);

        if (examsRes?.ok) setExams(await examsRes.json() || []);
        if (reevalRes?.ok) setReEvaluations(await reevalRes.json() || []);
      } catch (err) {
        console.error("Failed to load COE dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [apiUrl, token]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'schedule', label: 'Exam Schedule', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'hallticket', label: 'Hall Tickets', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
    { id: 'seating', label: 'Seating Arrangement', icon: 'M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z' },
    { id: 'results', label: 'Results Publisher', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'reevaluation', label: 'Re-evaluations', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' }
  ];

  /* ---------------- MODULE: DASHBOARD ---------------- */
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Exams Scheduled', value: exams.length || 0, color: 'text-blue-600' },
          { label: 'Hall Tickets Generated', value: '1,245', color: 'text-emerald-500' },
          { label: 'Results Published', value: '8', color: 'text-indigo-600' },
          { label: 'Pending Re-evaluations', value: (reEvaluations || []).filter(r => r.status === 'Pending').length || 0, color: 'text-amber-500' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <p className="text-sm font-medium text-slate-500 mb-2">{kpi.label}</p>
            <p className={`text-4xl font-black ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800">Upcoming Exams (Next 7 Days)</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {(exams || []).slice(0, 5).map((exam, idx) => (
            <div key={idx} className="p-6 flex flex-col md:flex-row justify-between md:items-center hover:bg-slate-50 transition-colors">
              <div>
                <h4 className="font-bold text-slate-800 text-lg">{exam?.subjectName}</h4>
                <div className="text-sm text-slate-500 mt-1 flex space-x-4">
                  <span>Code: {exam?.subjectCode}</span>
                  <span>Dept: {exam?.department}</span>
                  <span>Batch: {exam?.batch}</span>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-6 text-sm">
                <div className="flex flex-col">
                  <span className="text-slate-400">Date & Time</span>
                  <span className="font-medium text-slate-800">{exam?.examDate} at {exam?.examTime}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400">Hall</span>
                  <span className="font-medium text-slate-800">{exam?.hallNumber}</span>
                </div>
              </div>
            </div>
          ))}
          {!exams?.length && <div className="p-8 text-center text-slate-500">No scheduled exams found.</div>}
        </div>
      </div>
    </div>
  );

  /* ---------------- MODULE: EXAM SCHEDULE ---------------- */
  const [examForm, setExamForm] = useState({ subjectName: '', subjectCode: '', department: 'CSE', batch: '2024', examDate: '', examTime: '', hallNumber: '', duration: '3 Hrs' });
  
  const handleAddExam = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/api/host/add-examschedule`, {
        method: 'POST',
        headers,
        body: JSON.stringify(examForm)
      });
      if (res.ok) {
        const newExam = await res.json();
        setExams([...exams, newExam]);
        setExamForm({ subjectName: '', subjectCode: '', department: 'CSE', batch: '2024', examDate: '', examTime: '', hallNumber: '', duration: '3 Hrs' });
        alert('Exam Scheduled Successfully!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteExam = async (id) => {
    if(!window.confirm('Are you sure you want to delete this exam schedule?')) return;
    try {
      const res = await fetch(`${apiUrl}/api/host/delete-examschedule/${id}`, { method: 'DELETE', headers });
      if(res.ok) setExams(exams.filter(e => e.id !== id));
    } catch(err) {}
  };

  const renderSchedule = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-bold text-slate-800">Add New Exam</h3>
        </div>
        <form onSubmit={handleAddExam} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subject Name</label>
              <input required type="text" value={examForm.subjectName} onChange={e => setExamForm({...examForm, subjectName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subject Code</label>
              <input required type="text" value={examForm.subjectCode} onChange={e => setExamForm({...examForm, subjectCode: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <select required value={examForm.department} onChange={e => setExamForm({...examForm, department: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400">
                {['CSE', 'ECE', 'MECH', 'CIVIL', 'IT'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Batch</label>
              <input required type="text" value={examForm.batch} onChange={e => setExamForm({...examForm, batch: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Exam Date</label>
              <input required type="date" value={examForm.examDate} onChange={e => setExamForm({...examForm, examDate: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Exam Time</label>
              <input required type="time" value={examForm.examTime} onChange={e => setExamForm({...examForm, examTime: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hall Number</label>
              <input required type="text" value={examForm.hallNumber} onChange={e => setExamForm({...examForm, hallNumber: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
              <input required type="text" value={examForm.duration} onChange={e => setExamForm({...examForm, duration: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
            </div>
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-6 py-2.5 transition-colors shadow-sm">Schedule Exam</button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-bold text-slate-800">All Scheduled Exams</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate-700">Subject</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Dept & Batch</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Date & Time</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Hall & Duration</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(exams || []).map((exam, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-800"><div>{exam.subjectName}</div><div className="text-xs text-slate-500">{exam.subjectCode}</div></td>
                  <td className="px-6 py-4 text-slate-600"><div>{exam.department}</div><div className="text-xs text-slate-500">Batch: {exam.batch}</div></td>
                  <td className="px-6 py-4 text-slate-600"><div>{exam.examDate}</div><div className="text-xs font-medium text-slate-800">{exam.examTime}</div></td>
                  <td className="px-6 py-4 text-slate-600"><div>Hall: {exam.hallNumber}</div><div className="text-xs">{exam.duration}</div></td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDeleteExam(exam.id)} className="text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-md font-medium transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
              {!exams?.length && <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No exams scheduled.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  /* ---------------- MODULE: HALL TICKETS ---------------- */
  const [htDept, setHtDept] = useState('CSE');
  const [htBatch, setHtBatch] = useState('2024');
  const [htPreview, setHtPreview] = useState(false);
  const [htCount, setHtCount] = useState(0);

  const generateHt = () => {
    setHtPreview(true);
    setHtCount(prev => prev + Math.floor(Math.random() * 50) + 60); // Mock generation count
  };

  const renderHallTicket = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-end space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
          <select value={htDept} onChange={e => setHtDept(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400">
            {['CSE', 'ECE', 'MECH', 'CIVIL', 'IT'].map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Batch</label>
          <input type="text" value={htBatch} onChange={e => setHtBatch(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
        </div>
        <button onClick={generateHt} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-6 py-2.5 transition-colors shadow-sm">
          Generate Hall Tickets
        </button>
      </div>

      {htPreview && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Preview: Hall Ticket Card</h3>
            <button onClick={() => window.print()} className="bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg px-4 py-2 text-sm transition-colors flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              Print All ({htCount} Generated)
            </button>
          </div>
          <div className="p-8 bg-slate-100 flex justify-center">
            {/* Card Preview */}
            <div className="bg-white border-2 border-slate-300 w-full max-w-2xl p-6 relative shadow-lg">
              <div className="text-center border-b-2 border-slate-800 pb-4 mb-4">
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-wider">Apex University</h1>
                <p className="font-bold text-slate-600">OFFICE OF THE CONTROLLER OF EXAMINATIONS</p>
                <p className="text-sm font-bold bg-slate-800 text-white inline-block px-4 py-1 mt-2 rounded">HALL TICKET</p>
              </div>
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold text-slate-700 w-32 inline-block">Register No:</span> <span className="font-bold text-lg border-b border-black outline-none px-2">REG2024001</span></p>
                  <p><span className="font-semibold text-slate-700 w-32 inline-block">Student Name:</span> <span className="font-bold uppercase">John Doe</span></p>
                  <p><span className="font-semibold text-slate-700 w-32 inline-block">Degree & Branch:</span> <span className="font-bold">B.Tech - {htDept}</span></p>
                  <p><span className="font-semibold text-slate-700 w-32 inline-block">Batch:</span> <span className="font-bold">{htBatch}</span></p>
                </div>
                <div className="w-28 h-36 border-2 border-slate-300 flex items-center justify-center bg-slate-50 text-slate-400 text-xs text-center font-medium">
                  Photo <br/> Placeholder
                </div>
              </div>
              
              <table className="w-full text-left text-sm border-collapse border border-slate-800 mb-8">
                <thead>
                  <tr className="bg-slate-100 divide-x divide-slate-800 border-b border-slate-800 text-center">
                    <th className="p-2 font-bold uppercase w-12">No</th>
                    <th className="p-2 font-bold uppercase">Subject Code & Name</th>
                    <th className="p-2 font-bold uppercase w-24">Date</th>
                    <th className="p-2 font-bold uppercase w-24">Session</th>
                    <th className="p-2 font-bold uppercase w-32">Signature of Invigilator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-center">
                  {(exams || []).slice(0, 4).map((e, i) => (
                    <tr key={i} className="divide-x divide-slate-800">
                      <td className="p-2">{i+1}</td>
                      <td className="p-2 text-left font-medium">{e.subjectCode} - {e.subjectName}</td>
                      <td className="p-2">{e.examDate}</td>
                      <td className="p-2">{e.examTime}</td>
                      <td className="p-2"></td>
                    </tr>
                  ))}
                  {!(exams || []).length && <tr><td colSpan="5" className="p-4">No exams available for this batch.</td></tr>}
                </tbody>
              </table>

              <div className="flex justify-between items-end mt-12 pt-4">
                <div className="text-center">
                  <div className="border-b border-slate-800 w-48 mb-1"></div>
                  <p className="text-xs font-bold text-slate-600 uppercase">Signature of Candidate</p>
                </div>
                <div className="text-center">
                  <div className="border-b border-slate-800 w-48 mb-1"></div>
                  <p className="text-xs font-bold text-slate-600 uppercase">Controller of Examinations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /* ---------------- MODULE: SEATING ARRANGEMENT ---------------- */
  const [selectedExamId, setSelectedExamId] = useState('');
  const [showSeating, setShowSeating] = useState(false);

  const generateSeating = () => { if(selectedExamId) setShowSeating(true); };

  const mockSeatingGrid = Array.from({length: 25}, (_, i) => ({
    seat: `S${(i+1).toString().padStart(2, '0')}`,
    reg: `REG${Math.floor(Math.random()*9000)+1000}`,
    dept: ['CSE','ECE','MECH','CIVIL'][Math.floor(Math.random()*4)]
  }));

  const renderSeating = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row items-end space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-slate-700 mb-1">Select Scheduled Exam</label>
          <select value={selectedExamId} onChange={e => {setSelectedExamId(e.target.value); setShowSeating(false);}} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400">
            <option value="">-- Select Exam --</option>
            {exams.map(e => <option key={e.id} value={e.id}>{e.subjectCode} - {e.subjectName} ({e.examDate})</option>)}
          </select>
        </div>
        <button onClick={generateSeating} className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg px-6 py-2.5 transition-colors shadow-sm w-full md:w-auto">
          Generate Arrangement
        </button>
      </div>

      {showSeating && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Seat Allocation Grid (Hall {exams.find(e => e.id == selectedExamId)?.hallNumber})</h3>
            <button onClick={() => window.print()} className="text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 font-medium rounded-lg px-4 py-2 text-sm transition-colors">
              Export / Print
            </button>
          </div>
          <div className="p-6">
            <div className="bg-amber-50 text-amber-700 p-3 rounded-lg text-sm mb-6 font-medium">
              Algorithm active: Students from different departments mixed successfully to prevent copying.
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {mockSeatingGrid.map((cell, idx) => (
                <div key={idx} className="border border-slate-200 rounded-lg p-3 text-center bg-slate-50">
                  <div className="text-xs font-bold text-slate-400 mb-1">{cell.seat}</div>
                  <div className="font-black text-slate-800 text-lg">{cell.reg}</div>
                  <div className="text-xs bg-slate-200 text-slate-700 inline-block px-2 py-0.5 mt-1 rounded font-medium">{cell.dept}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /* ---------------- MODULE: RESULTS PUBLISHER ---------------- */
  const [csvFile, setCsvFile] = useState(null);
  const [parsedResults, setParsedResults] = useState(false);

  const handleUpload = (e) => {
    e.preventDefault();
    if(csvFile) {
      setTimeout(() => setParsedResults(true), 1000);
    }
  };

  const renderResults = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-4">Upload Marks (CSV)</h3>
        <form onSubmit={handleUpload} className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 border-2 border-dashed border-slate-200 p-8 rounded-xl bg-slate-50 text-center md:text-left justify-center">
          <input type="file" onChange={(e) => setCsvFile(e.target.files[0])} accept=".csv" required className="block w-full max-w-xs text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-6 py-2 transition-colors">
            Parse File
          </button>
        </form>
      </div>

      {parsedResults && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Preview Results & Analytics</h3>
            <button onClick={() => {alert('Results Published Successfully!'); setParsedResults(false); setCsvFile(null);}} className="bg-emerald-600 text-white font-medium rounded-lg px-6 py-2 transition-colors hover:bg-emerald-700">
              Publish Results
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100 text-center">
                <p className="text-sm font-medium text-emerald-600">Total Passed</p>
                <p className="text-3xl font-black text-emerald-700">145</p>
              </div>
              <div className="bg-rose-50 rounded-lg p-4 border border-rose-100 text-center">
                <p className="text-sm font-medium text-rose-600">Total Failed</p>
                <p className="text-3xl font-black text-rose-700">12</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 text-center">
                <p className="text-sm font-medium text-blue-600">Pass Percentage</p>
                <p className="text-3xl font-black text-blue-700">92.3%</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 text-center">
                <p className="text-sm font-medium text-amber-600">Class Average</p>
                <p className="text-3xl font-black text-amber-700">76.4</p>
              </div>
            </div>

            <h4 className="font-bold text-slate-800 mb-3">Grade Distribution Preview</h4>
            <div className="w-full bg-slate-100 h-8 rounded-lg overflow-hidden flex mb-2">
              <div className="bg-emerald-500 h-full flex items-center justify-center text-xs text-white font-bold" style={{width: '30%'}}>S (30%)</div>
              <div className="bg-blue-500 h-full flex items-center justify-center text-xs text-white font-bold" style={{width: '35%'}}>A (35%)</div>
              <div className="bg-indigo-500 h-full flex items-center justify-center text-xs text-white font-bold" style={{width: '20%'}}>B (20%)</div>
              <div className="bg-amber-500 h-full flex items-center justify-center text-xs text-white font-bold" style={{width: '10%'}}>C (10%)</div>
              <div className="bg-rose-500 h-full flex items-center justify-center text-xs text-white font-bold" style={{width: '5%'}}>F (5%)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /* ---------------- MODULE: RE-EVALUATION ---------------- */
  const [revalFilter, setRevalFilter] = useState('Pending'); // Allowed values: Pending, Approved, Rejected

  const updateRevalStatus = async (id, newStatus) => {
    if(!window.confirm(`Mark this request as ${newStatus}?`)) return;
    try {
      const target = reEvaluations.find(r => r.id === id);
      const res = await fetch(`${apiUrl}/api/host/update-reevaluationrequest/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ ...target, status: newStatus })
      });
      if(res.ok) {
        const updated = await res.json();
        setReEvaluations(reEvaluations.map(r => r.id === id ? updated : r));
      }
    } catch(err) { console.error(err); }
  };

  const renderReeval = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">Re-evaluation Requests</h3>
        <select value={revalFilter} onChange={(e) => setRevalFilter(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-400">
          {['Pending', 'Approved', 'Rejected'].map(status => <option key={status} value={status}>{status}</option>)}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 font-semibold text-slate-700">Student & Register No</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Subject</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Reason</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Applied Date</th>
              <th className="px-6 py-3 font-semibold text-slate-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(reEvaluations || []).filter(r => r.status === revalFilter).map((rev, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800">{rev.studentName}</div>
                  <div className="text-xs text-slate-500">{rev.registerNumber} • Sem {rev.semester}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800">{rev.subjectName}</div>
                  <div className="text-xs text-slate-500">{rev.subjectCode}</div>
                </td>
                <td className="px-6 py-4 text-slate-600 truncate max-w-[200px]" title={rev.reason}>{rev.reason}</td>
                <td className="px-6 py-4 text-slate-600">{rev.appliedAt}</td>
                <td className="px-6 py-4 flex justify-center space-x-2">
                  {rev.status === 'Pending' ? (
                    <>
                      <button onClick={() => updateRevalStatus(rev.id, 'Approved')} className="px-3 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-md font-medium text-xs transition-colors">Approve</button>
                      <button onClick={() => updateRevalStatus(rev.id, 'Rejected')} className="px-3 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-md font-medium text-xs transition-colors">Reject</button>
                    </>
                  ) : <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${rev.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{rev.status}</span>}
                </td>
              </tr>
            ))}
            {!(reEvaluations || []).filter(r => r.status === revalFilter).length && <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No {revalFilter} requests found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col shadow-lg md:shadow-none`}>
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h1 className="text-xl font-black text-indigo-600 tracking-tight">COE<span className="text-slate-800">Portal</span></h1>
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
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeMenu === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <svg className={`w-5 h-5 ${activeMenu === item.id ? 'text-indigo-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <p className="text-xs text-slate-500">Controller of Examinations</p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border-2 border-indigo-200">
              {userName?.charAt(0) || 'C'}
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <svg className="animate-spin h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto pb-12">
              {activeMenu === 'dashboard' && renderDashboard()}
              {activeMenu === 'schedule' && renderSchedule()}
              {activeMenu === 'hallticket' && renderHallTicket()}
              {activeMenu === 'seating' && renderSeating()}
              {activeMenu === 'results' && renderResults()}
              {activeMenu === 'reevaluation' && renderReeval()}
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

export default COEPortal;
