import React, { useState, useEffect, useRef, useMemo } from 'react';
import Chart from 'chart.js/auto';
import api from '../../api';

export default function AdminAttendance({ apiUrl, token }) {
  const [attendance, setAttendance] = useState([]);
  const [defaulters, setDefaulters] = useState([]);
  const [reports, setReports] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deptFilter, setDeptFilter] = useState('');
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [attRes, defRes, repRes] = await Promise.all([
        api.get(`/admin/attendance?dept=${deptFilter}&date=${dateFilter}`),
        api.get('/admin/attendance/defaulters'),
        api.get('/admin/reports/attendance')
      ]);
      setAttendance(attRes.data || []);
      setDefaulters(defRes.data || []);
      setReports(repRes.data || null);
    } catch (err) {
      setError(err.message || 'Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [deptFilter, dateFilter]);

  useEffect(() => {
    if (!reports || !chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(reports.departmentWise || {}),
        datasets: [{
          label: 'Attendance %',
          data: Object.values(reports.departmentWise || {}),
          backgroundColor: '#3B82F6',
          borderRadius: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { max: 100 } } }
    });
  }, [reports]);

  const stats = useMemo(() => {
    if (!attendance.length) return { present: 0, absent: 0, overall: 0 };
    const p = attendance.filter(a => a.status === 'PRESENT').length;
    const a = attendance.filter(a => a.status === 'ABSENT').length;
    return { present: p, absent: a, overall: Math.round((p/(p+a))*100) || 0 };
  }, [attendance]);

  const Loader = () => <div className="animate-pulse h-64 bg-slate-200 rounded-xl w-full"></div>;
  const ErrorCard = () => <div className="p-6 bg-red-50 text-red-500 rounded-xl text-center">{error} <button onClick={fetchData} className="ml-2 underline">Retry</button></div>;

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-full space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Attendance Monitoring</h1>
        </div>
        <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm">Export CSV</button>
      </div>

      <div className="flex gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
        <input type="date" className="px-4 py-2 bg-slate-50 border rounded-xl" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
        <select className="px-4 py-2 bg-slate-50 border rounded-xl" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
          <option value="">All Departments</option>
          <option value="CSE">CSE</option>
          <option value="IT">IT</option>
          <option value="ECE">ECE</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm"><div className="text-slate-500 text-sm">Overall Today</div><div className="text-3xl font-black text-blue-600 mt-2">{stats.overall}%</div></div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm"><div className="text-slate-500 text-sm">Present</div><div className="text-3xl font-black text-green-500 mt-2">{stats.present}</div></div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm"><div className="text-slate-500 text-sm">Absent</div><div className="text-3xl font-black text-red-500 mt-2">{stats.absent}</div></div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm"><div className="text-slate-500 text-sm">Below 75% Defaulters</div><div className="text-3xl font-black text-amber-500 mt-2">{defaulters.length}</div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border rounded-2xl shadow-sm p-0 flex flex-col h-[500px]">
          <h2 className="p-4 border-b font-bold text-slate-800 shrink-0">Daily Logs</h2>
          <div className="flex-1 overflow-auto">
            {loading ? <Loader /> : error ? <ErrorCard /> : (
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500 sticky top-0">
                  <tr><th className="p-4">Reg No</th><th className="p-4">Name</th><th className="p-4">Subject</th><th className="p-4">Status</th></tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {attendance.map((a, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-4 font-bold">{a.regNo}</td>
                      <td className="p-4">{a.name}</td>
                      <td className="p-4">{a.subject}</td>
                      <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${a.status==='PRESENT'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{a.status}</span></td>
                    </tr>
                  ))}
                  {!attendance.length && <tr><td colSpan="4" className="p-4 text-center text-slate-500">No records found.</td></tr>}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm flex flex-col h-[500px]">
          <h2 className="p-4 border-b font-bold text-slate-800 shrink-0">Defaulters List</h2>
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {loading ? <Loader /> : error ? <ErrorCard /> : defaulters.map((d, i) => (
              <div key={i} className="p-3 bg-red-50 border border-red-100 rounded-xl flex justify-between items-center">
                <div><div className="font-bold text-red-800 text-sm">{d.name}</div><div className="text-xs text-red-600">{d.regNo}</div></div>
                <div className="text-right"><div className="font-black text-red-600">{d.percentage}%</div><div className="text-[10px] text-red-500 uppercase font-bold">Needs {d.classesNeeded} classes</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border shadow-sm h-[400px] flex flex-col">
        <h2 className="font-bold mb-4 shrink-0">Department Wise Trend</h2>
        <div className="flex-1 min-h-0 relative"><canvas ref={chartRef}></canvas></div>
      </div>

    </div>
  );
}
