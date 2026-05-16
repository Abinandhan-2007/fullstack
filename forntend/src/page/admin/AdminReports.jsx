import React, { useState } from 'react';
import api from '../../api';

export default function AdminReports() {
  const [activeReport, setActiveReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [dateRange, setDateRange] = useState('This Month');
  const [dept, setDept] = useState('');

  const reportTypes = [
    { id: 'attendance', title: 'Attendance Report', desc: 'Daily, weekly and monthly attendance analysis', icon: '📅', api: '/admin/reports/attendance' },
    { id: 'marks', title: 'Marks Report', desc: 'CGPA trends and exam performance metrics', icon: '📊', api: '/admin/reports/marks' },
    { id: 'fees', title: 'Fee Collection', desc: 'Fee status, pending dues and collection analysis', icon: '💰', api: '/admin/reports/fees' },
    { id: 'placement', title: 'Placement Summary', desc: 'Company offers, packages and placement rates', icon: '🎓', api: '/admin/reports/placement' },
    { id: 'department', title: 'Department Summary', desc: 'Staff, student ratio and departmental health', icon: '🏢', api: '/admin/reports/department' }
  ];

  const handleGenerate = async (report) => {
    setActiveReport(report);
    setLoading(true); setError(null); setReportData(null);
    try {
      const res = await api.get(report.api);
      setReportData(res.data || {});
    } catch (err) {
      setError(err.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    alert(`Downloading ${activeReport?.title} as CSV... (Mock implementation)`);
  };

  const handleDownloadPDF = () => {
    alert(`Downloading ${activeReport?.title} as PDF... (Mock implementation)`);
  };

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-full space-y-6">
      <h1 className="text-2xl font-black text-slate-800">Advanced Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map(rt => (
          <div key={rt.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:border-blue-400 transition-colors">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl shrink-0">{rt.icon}</div>
              <div>
                <h3 className="font-bold text-slate-800">{rt.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{rt.desc}</p>
              </div>
            </div>
            <div className="mt-auto space-y-3 pt-4 border-t border-slate-100">
              <div className="flex gap-2">
                <select className="flex-1 px-3 py-1.5 bg-slate-50 border rounded-lg text-xs" value={dateRange} onChange={e=>setDateRange(e.target.value)}>
                  <option>Today</option><option>This Week</option><option>This Month</option><option>This Year</option>
                </select>
                <select className="flex-1 px-3 py-1.5 bg-slate-50 border rounded-lg text-xs" value={dept} onChange={e=>setDept(e.target.value)}>
                  <option value="">All Depts</option><option>CSE</option><option>IT</option>
                </select>
              </div>
              <button onClick={() => handleGenerate(rt)} className="w-full py-2 bg-slate-800 text-white font-bold rounded-lg text-sm hover:bg-slate-900 shadow-sm">
                Generate Report
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeReport && (
        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden flex flex-col mt-8">
          <div className="p-6 border-b flex justify-between items-center bg-slate-50">
            <div>
              <h2 className="text-xl font-bold text-slate-800">{activeReport.title} Preview</h2>
              <p className="text-sm text-slate-500 mt-1">Filters: {dateRange} • {dept || 'All Depts'}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleDownloadCSV} className="px-4 py-2 bg-white border border-slate-200 font-bold text-slate-700 rounded-xl shadow-sm">↓ CSV</button>
              <button onClick={handleDownloadPDF} className="px-4 py-2 bg-blue-600 font-bold text-white rounded-xl shadow-sm">↓ PDF</button>
            </div>
          </div>
          
          <div className="p-6 overflow-auto bg-slate-50/50 min-h-[300px]">
            {loading ? (
              <div className="flex flex-col gap-4 animate-pulse">
                <div className="h-8 bg-slate-200 rounded w-1/4"></div>
                <div className="h-40 bg-slate-200 rounded w-full"></div>
              </div>
            ) : error ? (
              <div className="p-6 bg-red-50 text-red-500 font-bold rounded-xl text-center border border-red-100">{error}</div>
            ) : reportData ? (
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 font-mono text-sm overflow-auto">
                  <pre>{JSON.stringify(reportData, null, 2)}</pre>
                </div>
                <p className="text-center text-slate-400 italic text-sm">Note: Report preview shows JSON structure. Download CSV/PDF for formatted output.</p>
              </div>
            ) : null}
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl border shadow-sm mt-6">
        <h2 className="font-bold text-slate-800 mb-4">Scheduled Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select className="px-4 py-2 bg-slate-50 border rounded-xl"><option>Attendance Report</option><option>Marks Report</option></select>
          <select className="px-4 py-2 bg-slate-50 border rounded-xl"><option>Daily</option><option>Weekly</option><option>Monthly</option></select>
          <div className="flex gap-2">
            <input type="email" placeholder="Email recipient" className="flex-1 px-4 py-2 bg-slate-50 border rounded-xl" />
            <button className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl whitespace-nowrap">Schedule</button>
          </div>
        </div>
      </div>
    </div>
  );
}
