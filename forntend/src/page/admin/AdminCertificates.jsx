import React, { useState, useEffect } from 'react';
import api from '../../api';

export default function AdminCertificates() {
  const [certType, setCertType] = useState('Bonafide');
  const [regNo, setRegNo] = useState('');
  const [student, setStudent] = useState(null);
  const [history, setHistory] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    setLoading(true); setError(null);
    try {
      const res = await api.get('/admin/certificates/history');
      setHistory(res.data || []);
    } catch(err) { setError(err.message || 'Failed to load history'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!regNo) return;
    setSearching(true);
    try {
      const res = await api.get(`/admin/users`);
      const std = res.data.find(s => s.regNo === regNo || s.email?.startsWith(regNo));
      if (std) setStudent(std);
      else alert('Student not found');
    } catch(err) { alert('Error searching student'); }
    finally { setSearching(false); }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/admin/certificates/generate', { type: certType, regNo: student.regNo || student.email }, { responseType: 'blob' });
      // download logic
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${certType}_${student.name}.pdf`);
      document.body.appendChild(link);
      link.click();
      fetchHistory();
    } catch (err) { alert('Generation failed'); }
    finally { setGenerating(false); }
  };

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-full space-y-6">
      <h1 className="text-2xl font-black text-slate-800">Certificate Generation</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-6 flex flex-col h-fit">
          <form onSubmit={handleSearch} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Student Reg No</label>
              <input required type="text" className="w-full px-4 py-2 bg-slate-50 border rounded-xl" value={regNo} onChange={e => setRegNo(e.target.value)} placeholder="Enter Register Number" />
            </div>
            <button type="submit" disabled={searching} className="px-5 py-2.5 bg-slate-800 text-white font-bold rounded-xl">{searching?'...':'Search'}</button>
          </form>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Certificate Type</label>
            <select className="w-full px-4 py-2 bg-slate-50 border rounded-xl" value={certType} onChange={e => setCertType(e.target.value)}>
              <option>Bonafide</option>
              <option>Transfer</option>
              <option>Course Completion</option>
              <option>Character</option>
            </select>
          </div>

          {student && (
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <div className="font-bold text-blue-900">{student.name}</div>
              <div className="text-blue-700 text-sm mb-4">{student.department || 'N/A'} • {student.email}</div>
              <button onClick={handleGenerate} disabled={generating} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-sm">{generating ? 'Generating PDF...' : 'Generate & Download PDF'}</button>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col">
          <h2 className="font-bold mb-4">Preview</h2>
          <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center relative bg-slate-50">
            {student ? (
              <div className="bg-white w-full h-full p-8 shadow-sm border border-slate-200 flex flex-col">
                 <h1 className="text-2xl font-serif font-bold text-slate-800 uppercase tracking-widest border-b pb-4 mb-8 text-center">{certType} Certificate</h1>
                 <p className="text-slate-600 leading-loose flex-1 font-serif text-lg">
                   This is to certify that <span className="font-bold border-b border-black px-2">{student.name}</span>, 
                   bearing Register Number <span className="font-bold border-b border-black px-2">{student.regNo || student.email}</span>, 
                   is a bona fide student of our institution...
                 </p>
                 <div className="flex justify-between mt-auto pt-8">
                   <div className="border-t border-black pt-2 text-xs font-bold uppercase">Date</div>
                   <div className="border-t border-black pt-2 text-xs font-bold uppercase">Principal Signature</div>
                 </div>
              </div>
            ) : (
              <p className="text-slate-400 font-bold">Search a student to preview</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <h2 className="p-4 border-b font-bold">Generation History</h2>
        {loading ? <div className="p-6 animate-pulse h-40 bg-slate-200"></div> : error ? <div className="p-4 text-red-500">{error}</div> : (
          <table className="w-full text-left whitespace-nowrap text-sm">
            <thead className="bg-slate-50 border-b text-slate-500 uppercase">
              <tr><th className="p-4">Student</th><th className="p-4">Type</th><th className="p-4">Generated On</th><th className="p-4">Generated By</th></tr>
            </thead>
            <tbody className="divide-y">
              {history.map((h, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-4 font-bold">{h.studentName}</td>
                  <td className="p-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">{h.type}</span></td>
                  <td className="p-4 text-slate-500">{new Date(h.date).toLocaleString()}</td>
                  <td className="p-4">{h.generatedBy}</td>
                </tr>
              ))}
              {!history.length && <tr><td colSpan="4" className="p-6 text-center text-slate-400">No history found</td></tr>}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
