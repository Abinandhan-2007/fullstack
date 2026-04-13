import React, { useState, useEffect } from 'react';

const FinancePortal = ({ handleLogout, apiUrl, loggedInEmail, token, userName }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [feeStructures, setFeeStructures] = useState([]);
  const [payments, setPayments] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);

  // Common Headers
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [feeStructRes, paymentsRes, payrollsRes] = await Promise.all([
          fetch(`${apiUrl}/api/host/all-feestructures`, { headers }).catch(() => null),
          fetch(`${apiUrl}/api/host/all-feepayments`, { headers }).catch(() => null),
          fetch(`${apiUrl}/api/host/all-staffpayrolls`, { headers }).catch(() => null)
        ]);

        if (feeStructRes?.ok) setFeeStructures(await feeStructRes.json() || []);
        if (paymentsRes?.ok) setPayments(await paymentsRes.json() || []);
        if (payrollsRes?.ok) setPayrolls(await payrollsRes.json() || []);
      } catch (err) {
        console.error("Failed to load Finance dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [apiUrl, token]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'collection', label: 'Fee Collection', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'dues', label: 'Pending Dues', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'structure', label: 'Fee Structure Manager', icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z' },
    { id: 'payroll', label: 'Staff Payroll', icon: 'M17 20h5V4a2 2 0 00-2-2H4a2 2 0 00-2 2v16h5m8 0v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2m8 0h-8' },
    { id: 'reports', label: 'Financial Reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }
  ];

  /* ---------------- MODULE: DASHBOARD ---------------- */
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Collected This Month', value: `₹${(payments.reduce((a, b) => a + (b.amountPaid || 0), 0)).toLocaleString()}`, color: 'text-emerald-500' },
          { label: 'Total Pending Dues', value: '₹12,45,000', color: 'text-rose-500' },
          { label: 'Defaulters Count', value: '142', color: 'text-amber-500' },
          { label: 'Salaries Paid', value: `₹${(payrolls.filter(p=>p.status==='Paid').reduce((a, b) => a + (b.netSalary || 0), 0)).toLocaleString()}`, color: 'text-indigo-600' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <p className="text-sm font-medium text-slate-500 mb-2">{kpi.label}</p>
            <p className={`text-3xl font-black ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
          <h3 className="font-bold text-slate-800 mb-6">Monthly Collection Trend</h3>
          <div className="flex items-end space-x-2 lg:space-x-4 h-64 mt-4 px-2 border-b border-slate-200 pb-2">
            {[45, 60, 40, 80, 55, 90, 75, 85, 30, 65, 50, 70].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group relative">
                <div className="absolute -top-8 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                  ₹{h}k
                </div>
                <div className="w-full bg-emerald-500 hover:bg-emerald-400 rounded-t-md transition-all duration-500 ease-in-out" style={{height: `${h}%`}}></div>
                <span className="text-xs text-slate-500 mt-2 rotate-45 md:rotate-0 origin-left">
                  {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-bold text-slate-800">Recent Transactions</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {(payments || []).slice(0, 5).map((pay, idx) => (
              <div key={idx} className="p-4 px-6 flex justify-between items-center hover:bg-slate-50 transition-colors">
                <div>
                  <h4 className="font-medium text-slate-800 text-sm">{pay.studentName}</h4>
                  <div className="text-xs text-slate-500 mt-0.5">{pay.registerNumber} • Receipt: {pay.receiptNumber}</div>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-emerald-600">+₹{pay.amountPaid}</span>
                  <span className="text-xs text-slate-400">{pay.paymentDate}</span>
                </div>
              </div>
            ))}
            {!payments?.length && <div className="p-8 text-center text-slate-500">No recent transactions.</div>}
          </div>
        </div>
      </div>
    </div>
  );

  /* ---------------- MODULE: FEE COLLECTION ---------------- */
  const [searchRoll, setSearchRoll] = useState('');
  const [colStudent, setColStudent] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMode, setPayMode] = useState('Online');
  const [receipt, setReceipt] = useState(null);

  const mockSearchStudent = () => {
    if(searchRoll.length > 3) {
      setColStudent({
        name: 'Alex Johnson',
        registerNumber: searchRoll,
        department: 'CSE',
        batch: '2024',
        tuition: 85000,
        hostel: 45000,
        exam: 2500,
        paid: 50000
      });
      setPayAmount('82500'); // the remaining
    }
  };

  const handleCollectFee = async (e) => {
    e.preventDefault();
    const mockReceipt = {
      receiptNo: 'REC' + Math.floor(Math.random() * 90000 + 10000),
      date: new Date().toISOString().split('T')[0],
      amount: payAmount,
      mode: payMode,
      student: colStudent
    };
    
    // Simulate API POST
    const newPayment = {
      studentName: colStudent.name,
      registerNumber: colStudent.registerNumber,
      department: colStudent.department,
      batch: colStudent.batch,
      amountPaid: parseFloat(payAmount),
      paymentDate: mockReceipt.date,
      receiptNumber: mockReceipt.receiptNo,
      paymentMode: payMode,
      academicYear: '2023-2024',
      status: 'Success'
    };

    setPayments([newPayment, ...payments]);
    setReceipt(mockReceipt);
  };

  const renderCollection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-end space-x-4">
        <div className="flex-1 max-w-sm">
          <label className="block text-sm font-medium text-slate-700 mb-1">Search Student Register No</label>
          <div className="flex space-x-2">
            <input type="text" value={searchRoll} onChange={e => setSearchRoll(e.target.value)} placeholder="e.g. REG2024..." className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
            <button onClick={mockSearchStudent} className="bg-slate-800 hover:bg-slate-900 text-white px-4 rounded-lg font-medium transition-colors">Search</button>
          </div>
        </div>
      </div>

      {colStudent && !receipt && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Student Profile & Fee Details</h3>
            <div className="space-y-3 mb-6">
              <p><span className="text-slate-500 w-24 inline-block">Name:</span> <span className="font-medium text-slate-800">{colStudent.name}</span></p>
              <p><span className="text-slate-500 w-24 inline-block">Reg No:</span> <span className="font-medium text-slate-800">{colStudent.registerNumber}</span></p>
              <p><span className="text-slate-500 w-24 inline-block">Dept/Batch:</span> <span className="font-medium text-slate-800">{colStudent.department} / {colStudent.batch}</span></p>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm border border-slate-100 mb-2">
              <div className="flex justify-between"><span className="text-slate-600">Tuition Fee</span><span className="font-medium">₹{colStudent.tuition}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">Hostel Fee</span><span className="font-medium">₹{colStudent.hostel}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">Exam Fee</span><span className="font-medium">₹{colStudent.exam}</span></div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-bold"><span className="text-slate-800">Total Expected</span><span>₹{colStudent.tuition + colStudent.hostel + colStudent.exam}</span></div>
              <div className="flex justify-between text-emerald-600 font-medium"><span className="">Amount Paid</span><span>₹{colStudent.paid}</span></div>
              <div className="flex justify-between pt-2 text-rose-600 font-bold text-base border-t border-slate-200"><span className="">Pending Due</span><span>₹{(colStudent.tuition + colStudent.hostel + colStudent.exam) - colStudent.paid}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-center">
            <h3 className="font-bold text-slate-800 mb-4">Process Payment</h3>
            <form onSubmit={handleCollectFee} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount to Collect (₹)</label>
                <input required type="number" value={payAmount} onChange={e => setPayAmount(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 font-bold text-emerald-600 text-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Mode</label>
                <select value={payMode} onChange={e => setPayMode(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400">
                  <option>Online</option>
                  <option>Cash</option>
                  <option>Demand Draft</option>
                  <option>Cheque</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-6 py-3 transition-colors mt-2 shadow-sm text-lg">
                Confirm & Generate Receipt
              </button>
            </form>
          </div>
        </div>
      )}

      {receipt && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in max-w-2xl mx-auto">
          <div className="px-6 py-4 border-b border-slate-200 bg-emerald-50 flex justify-between items-center text-emerald-700">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              <h3 className="font-bold">Payment Successful</h3>
            </div>
            <button onClick={() => window.print()} className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg px-4 py-1.5 text-sm transition-colors">
              Print Receipt
            </button>
          </div>
          <div className="p-8">
            <div className="text-center pb-6 border-b border-slate-200 mb-6 border-dashed">
              <h1 className="text-2xl font-black text-slate-800 uppercase">Apex University</h1>
              <p className="text-sm font-bold text-slate-500">OFFICIAL FEE RECEIPT</p>
            </div>
            <div className="grid grid-cols-2 gap-y-4 text-sm mb-8">
              <div><span className="text-slate-500">Receipt No:</span> <span className="font-bold text-slate-800">{receipt.receiptNo}</span></div>
              <div className="text-right"><span className="text-slate-500">Date:</span> <span className="font-bold text-slate-800">{receipt.date}</span></div>
              <div><span className="text-slate-500">Student Name:</span> <span className="font-bold text-slate-800">{receipt.student.name}</span></div>
              <div className="text-right"><span className="text-slate-500">Reg No:</span> <span className="font-bold text-slate-800">{receipt.student.registerNumber}</span></div>
              <div><span className="text-slate-500">Department:</span> <span className="font-bold text-slate-800">{receipt.student.department} / {receipt.student.batch}</span></div>
              <div className="text-right"><span className="text-slate-500">Mode:</span> <span className="font-bold text-slate-800">{receipt.mode}</span></div>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-12 text-center">
              <p className="text-slate-500 text-sm mb-1">Amount Received</p>
              <h2 className="text-4xl font-black text-slate-800">₹{receipt.amount}</h2>
            </div>
            <div className="flex justify-between items-end">
              <div className="text-xs text-slate-400">Computer generated receipt. Signature not required.</div>
              <button className="text-blue-600 font-medium text-sm hover:underline" onClick={() => {setReceipt(null); setSearchRoll(''); setColStudent(null);}}>Create New Payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /* ---------------- MODULE: PENDING DUES ---------------- */
  const renderDues = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">Pending Dues Register</h3>
        <select className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-400">
          <option>All Departments</option>
          <option>CSE</option>
          <option>ECE</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 font-semibold text-slate-700">Student Name</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Dept & Batch</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Total Due</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Days Overdue</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Mock Dues Data */}
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-4"><div className="font-medium text-slate-800">Marcus Wright</div><div className="text-xs text-slate-500">REG2024101</div></td>
              <td className="px-6 py-4 text-slate-600">CSE (2024)</td>
              <td className="px-6 py-4 font-bold text-rose-600">₹45,000</td>
              <td className="px-6 py-4 text-slate-600"><span className="bg-rose-100 text-rose-700 px-2 py-1 rounded text-xs font-bold">14 Days</span></td>
              <td className="px-6 py-4">
                <button className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-md font-medium text-xs transition-colors">Send Reminder</button>
              </td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-4"><div className="font-medium text-slate-800">Sarah Connor</div><div className="text-xs text-slate-500">REG2024412</div></td>
              <td className="px-6 py-4 text-slate-600">ECE (2024)</td>
              <td className="px-6 py-4 font-bold text-rose-600">₹8,500</td>
              <td className="px-6 py-4 text-slate-600"><span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">3 Days</span></td>
              <td className="px-6 py-4">
                <button className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-md font-medium text-xs transition-colors">Send Reminder</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  /* ---------------- MODULE: FEE STRUCTURE MANAGER ---------------- */
  const [structForm, setStructForm] = useState({ department: 'CSE', batch: '2025', academicYear: '2023-2024', tuitionFee: 0, hostelFee: 0, examFee: 0, otherFee: 0 });

  const handleAddStructure = async (e) => {
    e.preventDefault();
    const totalFee = Number(structForm.tuitionFee) + Number(structForm.hostelFee) + Number(structForm.examFee) + Number(structForm.otherFee);
    try {
      const res = await fetch(`${apiUrl}/api/host/add-feestructure`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...structForm, totalFee })
      });
      if(res.ok) {
        setFeeStructures([...feeStructures, await res.json()]);
        alert('Structure added successfully');
      }
    } catch(err) {}
  };

  const renderStructure = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-bold text-slate-800">Define New Fee Structure</h3>
        </div>
        <form onSubmit={handleAddStructure} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <select value={structForm.department} onChange={e => setStructForm({...structForm, department: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400">
                {['CSE', 'ECE', 'MECH', 'CIVIL', 'IT'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Batch</label>
              <input type="text" value={structForm.batch} onChange={e => setStructForm({...structForm, batch: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Academic Year</label>
              <input type="text" value={structForm.academicYear} onChange={e => setStructForm({...structForm, academicYear: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tuition Fee</label>
              <input type="number" value={structForm.tuitionFee} onChange={e => setStructForm({...structForm, tuitionFee: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hostel Fee</label>
              <input type="number" value={structForm.hostelFee} onChange={e => setStructForm({...structForm, hostelFee: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Exam Fee</label>
              <input type="number" value={structForm.examFee} onChange={e => setStructForm({...structForm, examFee: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Other Fees</label>
              <input type="number" value={structForm.otherFee} onChange={e => setStructForm({...structForm, otherFee: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Total Fee (Auto)</label>
              <input type="text" disabled value={Number(structForm.tuitionFee) + Number(structForm.hostelFee) + Number(structForm.examFee) + Number(structForm.otherFee)} className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-bold text-slate-800 cursor-not-allowed" />
            </div>
          </div>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-6 py-2.5 transition-colors shadow-sm">Save Structure</button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-bold text-slate-800">Defined Structures</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate-700">Dept & Batch</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Ac. Year</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Tuition</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Hostel</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(feeStructures || []).map((fs, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-800">{fs.department} ({fs.batch})</td>
                  <td className="px-6 py-4 text-slate-600">{fs.academicYear}</td>
                  <td className="px-6 py-4 text-slate-600">₹{fs.tuitionFee}</td>
                  <td className="px-6 py-4 text-slate-600">₹{fs.hostelFee}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">₹{fs.totalFee}</td>
                </tr>
              ))}
              {!feeStructures?.length && <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No fee structures defined.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  /* ---------------- MODULE: PAYROLL ---------------- */
  const renderPayroll = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">Staff Payroll processing</h3>
        <div className="space-x-2">
          <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">Download Report</button>
          <button className="bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">Bulk Mark Paid</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 font-semibold text-slate-700">Staff Info</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Details (Basic/Allow/Deduct)</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Net Salary</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Status</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(payrolls || []).map((pr, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800">{pr.staffName}</div>
                  <div className="text-xs text-slate-500">{pr.employeeId} • {pr.department}</div>
                </td>
                <td className="px-6 py-4 text-slate-600 text-xs space-y-1">
                  <div>Basic: ₹{pr.basicSalary}</div>
                  <div className="text-emerald-500">+ Allowances: ₹{pr.allowances}</div>
                  <div className="text-rose-500">- Deductions: ₹{pr.deductions}</div>
                </td>
                <td className="px-6 py-4 font-black text-indigo-600 text-lg">₹{pr.netSalary}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${pr.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{pr.status}</span>
                </td>
                <td className="px-6 py-4">
                  {pr.status !== 'Paid' && (
                    <button className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-md font-medium text-xs transition-colors">Mark Paid</button>
                  )}
                </td>
              </tr>
            ))}
            {!payrolls?.length && <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No payroll records.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* ---------------- MODULE: REPORTS ---------------- */
  const renderReports = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Export Financial Statements</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group">
              <div className="flex items-center text-slate-700 group-hover:text-blue-700 font-medium">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                Monthly Revenue Report
              </div>
              <span className="text-xs font-bold bg-slate-100 group-hover:bg-blue-100 text-slate-500 group-hover:text-blue-600 px-2 py-1 rounded">CSV</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group">
              <div className="flex items-center text-slate-700 group-hover:text-blue-700 font-medium">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                Defaulters List (Department Wise)
              </div>
              <span className="text-xs font-bold bg-slate-100 group-hover:bg-blue-100 text-slate-500 group-hover:text-blue-600 px-2 py-1 rounded">PDF</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group">
              <div className="flex items-center text-slate-700 group-hover:text-blue-700 font-medium">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5V4a2 2 0 00-2-2H4a2 2 0 00-2 2v16h5m8 0v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2m8 0h-8"/></svg>
                Staff Salary Disbursal Report
              </div>
              <span className="text-xs font-bold bg-slate-100 group-hover:bg-blue-100 text-slate-500 group-hover:text-blue-600 px-2 py-1 rounded">EXCEL</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col pt-6 pb-2 px-6 justify-between">
          <div>
             <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 mb-6">Year-to-Date Summary</h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center"><span className="text-slate-500 font-medium">Expected Revenue (Total Fees)</span><span className="font-bold text-slate-800">₹8,50,00,000</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-500 font-medium">Actual Revenue Collected</span><span className="font-bold text-emerald-600">₹6,20,50,000</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-500 font-medium">Outstanding Dues</span><span className="font-bold text-rose-600">₹2,29,50,000</span></div>
             </div>
          </div>
          <div className="mt-8 mb-4">
             <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden">
               <div className="bg-emerald-500 h-3 rounded-full" style={{width: '73%'}}></div>
             </div>
             <div className="text-xs text-center font-bold text-emerald-600">73% Target Achieved (FY 23-24)</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col shadow-lg md:shadow-none`}>
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h1 className="text-xl font-black text-emerald-600 tracking-tight">Finance<span className="text-slate-800">Portal</span></h1>
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
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeMenu === item.id ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <svg className={`w-5 h-5 ${activeMenu === item.id ? 'text-emerald-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <p className="text-xs text-slate-500">Finance Officer</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold border-2 border-emerald-200">
              {userName?.charAt(0) || 'F'}
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <svg className="animate-spin h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto pb-12">
              {activeMenu === 'dashboard' && renderDashboard()}
              {activeMenu === 'collection' && renderCollection()}
              {activeMenu === 'dues' && renderDues()}
              {activeMenu === 'structure' && renderStructure()}
              {activeMenu === 'payroll' && renderPayroll()}
              {activeMenu === 'reports' && renderReports()}
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

export default FinancePortal;
