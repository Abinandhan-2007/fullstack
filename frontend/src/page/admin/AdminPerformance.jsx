import React, { useState, useEffect, useRef, useMemo } from 'react';
import Chart from 'chart.js/auto';
import api from '../../api';

export default function AdminPerformance() {
  const [marks, setMarks] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [reports, setReports] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deptFilter, setDeptFilter] = useState('');
  const [examFilter, setExamFilter] = useState('CAT-1');

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [marksRes, topRes, repRes] = await Promise.all([
        api.get(`/admin/marks?dept=${deptFilter}&examType=${examFilter}`),
        api.get(`/admin/performance/top`),
        api.get('/admin/reports/marks')
      ]);
      setMarks(marksRes.data || []);
      setTopPerformers(topRes.data || []);
      setReports(repRes.data || null);
    } catch (err) {
      setError(err.message || 'Failed to fetch performance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [deptFilter, examFilter]);

  useEffect(() => {
    if (!reports || !chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();
    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: Object.keys(reports.departmentCgpa || {}),
        datasets: [{
          label: 'Avg CGPA',
          data: Object.values(reports.departmentCgpa || {}),
          backgroundColor: '#8B5CF6',
          borderRadius: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { max: 10 } } }
    });
  }, [reports]);

  const stats = useMemo(() => {
    if (!marks.length) return { avg: 0, fail: 0, passPercent: 0 };
    let totalScore = 0, totalMax = 0, failCount = 0;
    marks.forEach(m => {
      totalScore += m.score; totalMax += m.maxScore;
      if (m.score/m.maxScore < 0.5) failCount++;
    });
    return {
      avg: totalMax ? ((totalScore/totalMax)*10).toFixed(2) : 0,
      fail: failCount,
      passPercent: Math.round(((marks.length - failCount) / marks.length) * 100) || 0
    };
  }, [marks]);

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-full space-y-6">
      <h1 className="text-2xl font-black text-slate-800">Academic Performance</h1>

      <div className="flex gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
        <select className="px-4 py-2 bg-slate-50 border rounded-xl" value={examFilter} onChange={e => setExamFilter(e.target.value)}>
          <option value="CAT-1">CAT-1</option>
          <option value="CAT-2">CAT-2</option>
          <option value="SEMESTER">SEMESTER</option>
        </select>
        <select className="px-4 py-2 bg-slate-50 border rounded-xl" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
          <option value="">All Departments</option>
          <option value="CSE">CSE</option>
          <option value="IT">IT</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border"><div className="text-slate-500 text-sm">Average CGPA</div><div className="text-3xl font-black text-purple-600 mt-2">{stats.avg}</div></div>
        <div className="bg-white p-6 rounded-2xl border"><div className="text-slate-500 text-sm">Pass Percentage</div><div className="text-3xl font-black text-green-500 mt-2">{stats.passPercent}%</div></div>
        <div className="bg-white p-6 rounded-2xl border"><div className="text-slate-500 text-sm">Fail Count</div><div className="text-3xl font-black text-red-500 mt-2">{stats.fail}</div></div>
        <div className="bg-white p-6 rounded-2xl border"><div className="text-slate-500 text-sm">Top Scorer</div><div className="text-xl font-bold text-slate-800 mt-2 truncate">{topPerformers[0]?.name || '-'}</div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border rounded-2xl flex flex-col h-[400px]">
          <h2 className="p-4 border-b font-bold shrink-0">Marks Sheet</h2>
          <div className="flex-1 overflow-auto">
            {loading ? <div className="p-6 animate-pulse bg-slate-200 h-full"></div> : error ? <div className="p-4 text-red-500">{error}</div> : (
              <table className="w-full text-left whitespace-nowrap text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500 sticky top-0">
                  <tr><th className="p-4">Student</th><th className="p-4">Subject</th><th className="p-4 text-right">Score</th><th className="p-4 text-center">Status</th></tr>
                </thead>
                <tbody className="divide-y">
                  {marks.map((m, i) => {
                    const percent = (m.score/m.maxScore)*100;
                    return (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-4 font-bold">{m.regNo} <span className="text-xs font-normal text-slate-400 block">{m.name}</span></td>
                        <td className="p-4">{m.subject}</td>
                        <td className="p-4 text-right font-bold">{m.score}/{m.maxScore} <span className="text-xs text-slate-400 block">{percent.toFixed(0)}%</span></td>
                        <td className="p-4 text-center"><span className={`px-2 py-1 rounded text-xs font-bold ${percent>=50?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{percent>=50?'PASS':'FAIL'}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="bg-white border rounded-2xl flex flex-col h-[400px]">
          <h2 className="p-4 border-b font-bold shrink-0">Top Performers</h2>
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {topPerformers.slice(0, 10).map((t, i) => (
              <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl">
                <div className="text-2xl">{i===0?'🥇':i===1?'🥈':i===2?'🥉':<span className="text-slate-400 font-bold w-6 inline-block text-center">{i+1}</span>}</div>
                <div className="flex-1"><div className="font-bold text-sm">{t.name}</div><div className="text-xs text-slate-500">{t.regNo}</div></div>
                <div className="font-black text-purple-600">{t.cgpa || (t.score/t.maxScore*10).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border h-[400px] flex flex-col">
        <h2 className="font-bold mb-4 shrink-0">Department wise CGPA Comparison</h2>
        <div className="flex-1 min-h-0 relative"><canvas ref={chartRef}></canvas></div>
      </div>
    </div>
  );
}
