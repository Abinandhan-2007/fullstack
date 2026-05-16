import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import api from '../../api';

export default function AdminPlacements() {
  const [companies, setCompanies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '', driveDate: '', cgpaRequired: 0, package: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const fetchData = async () => {
    setLoading(true); setError(null);
    try {
      const [compRes, appRes, statRes] = await Promise.all([
        api.get('/placement/companies'),
        api.get('/placement/applications'),
        api.get('/placement/stats')
      ]);
      setCompanies(compRes.data || []);
      setApplications(appRes.data || []);
      setStats(statRes.data || { companies: 0, placed: 0, offers: 0, avgPackage: '0 LPA' });
    } catch (err) { setError(err.message || 'Failed to load placement data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!stats || !stats.deptWise || !chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();
    chartInstance.current = new Chart(chartRef.current, {
      type: 'pie',
      data: {
        labels: Object.keys(stats.deptWise),
        datasets: [{
          data: Object.values(stats.deptWise),
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'],
          borderWidth: 0
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }, [stats]);

  const handleSave = async (e) => {
    e.preventDefault(); setIsSubmitting(true);
    try {
      await api.post('/placement/companies', newCompany);
      setIsModalOpen(false); fetchData();
    } catch (err) { alert('Failed to add company'); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-full space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-800">Placement Cell</h1>
        <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl">+ Add Drive</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm"><div className="text-sm text-slate-500">Companies Visited</div><div className="text-3xl font-black text-blue-600">{stats?.companies || 0}</div></div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm"><div className="text-sm text-slate-500">Students Placed</div><div className="text-3xl font-black text-green-500">{stats?.placed || 0}</div></div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm"><div className="text-sm text-slate-500">Total Offers</div><div className="text-3xl font-black text-purple-600">{stats?.offers || 0}</div></div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm"><div className="text-sm text-slate-500">Avg Package</div><div className="text-3xl font-black text-amber-500">{stats?.avgPackage || '0 LPA'}</div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border rounded-2xl shadow-sm flex flex-col h-[500px]">
          <h2 className="p-4 border-b font-bold shrink-0">Company Drives</h2>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left whitespace-nowrap text-sm">
              <thead className="bg-slate-50 border-b text-slate-500 uppercase sticky top-0">
                <tr><th className="p-4">Company</th><th className="p-4">Drive Date</th><th className="p-4 text-center">CGPA Req</th><th className="p-4 text-right">Package</th></tr>
              </thead>
              <tbody className="divide-y">
                {companies.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold">{c.name}</td>
                    <td className="p-4 text-slate-500">{new Date(c.driveDate).toLocaleDateString()}</td>
                    <td className="p-4 text-center"><span className="px-2 py-1 bg-amber-100 text-amber-700 rounded font-bold text-xs">&gt; {c.cgpaRequired}</span></td>
                    <td className="p-4 text-right font-bold text-green-600">{c.package}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm flex flex-col h-[500px] p-6">
          <h2 className="font-bold mb-4 shrink-0">Placements by Dept</h2>
          <div className="flex-1 min-h-0 relative"><canvas ref={chartRef}></canvas></div>
        </div>
      </div>

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <h2 className="p-4 border-b font-bold">Placed Students</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap text-sm">
            <thead className="bg-slate-50 border-b text-slate-500 uppercase">
              <tr><th className="p-4">Reg No</th><th className="p-4">Name</th><th className="p-4">Company</th><th className="p-4">Package</th><th className="p-4 text-center">Status</th></tr>
            </thead>
            <tbody className="divide-y">
              {applications.map(a => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold">{a.regNo}</td>
                  <td className="p-4">{a.name}</td>
                  <td className="p-4 text-slate-600 font-bold">{a.company}</td>
                  <td className="p-4 text-green-600 font-bold">{a.package}</td>
                  <td className="p-4 text-center"><span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">SELECTED</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <form onSubmit={handleSave} className="bg-white rounded-2xl w-full max-w-sm">
            <div className="p-4 border-b bg-slate-50"><h2 className="font-bold">Add Company Drive</h2></div>
            <div className="p-6 space-y-4">
              <input required type="text" placeholder="Company Name" className="w-full px-4 py-2 border rounded-xl" value={newCompany.name} onChange={e=>setNewCompany({...newCompany,name:e.target.value})} />
              <input required type="date" className="w-full px-4 py-2 border rounded-xl text-slate-500" value={newCompany.driveDate} onChange={e=>setNewCompany({...newCompany,driveDate:e.target.value})} />
              <input required type="number" step="0.1" placeholder="CGPA Required" className="w-full px-4 py-2 border rounded-xl" value={newCompany.cgpaRequired} onChange={e=>setNewCompany({...newCompany,cgpaRequired:parseFloat(e.target.value)})} />
              <input required type="text" placeholder="Package (e.g. 10 LPA)" className="w-full px-4 py-2 border rounded-xl" value={newCompany.package} onChange={e=>setNewCompany({...newCompany,package:e.target.value})} />
            </div>
            <div className="p-4 border-t bg-slate-50 flex justify-end gap-2">
              <button type="button" onClick={()=>setIsModalOpen(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-xl">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl">{isSubmitting?'...':'Save'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
