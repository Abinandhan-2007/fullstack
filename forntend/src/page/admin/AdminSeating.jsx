import React, { useState, useEffect } from 'react';
import api from '../../api';

export default function AdminSeating() {
  const [exams, setExams] = useState([{id:1, name:'CAT-1'}, {id:2, name:'SEMESTER'}]);
  const [selectedExam, setSelectedExam] = useState('1');
  const [seating, setSeating] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);

  const fetchData = async () => {
    if (!selectedExam) return;
    setLoading(true); setError(null);
    try {
      const res = await api.get(`/admin/seating/${selectedExam}`);
      setSeating(res.data || []);
    } catch (err) { setError(err.message || 'Failed to fetch seating'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [selectedExam]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await api.post('/admin/seating/generate', { examId: selectedExam });
      fetchData();
    } catch (err) { alert('Failed to generate seating'); }
    finally { setGenerating(false); }
  };

  const handleReassign = async (seat) => {
    const newReg = window.prompt("Enter new Register Number to assign to this seat:", seat.regNo);
    if (!newReg || newReg === seat.regNo) return;
    try {
      await api.put(`/admin/seating/${seat.id}`, { regNo: newReg });
      fetchData();
    } catch(err) { alert('Failed to reassign'); }
  };

  // Group by hall
  const halls = [...new Set(seating.map(s => s.hall))];

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-full space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Exam Seating Allocation</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => window.print()} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm">Print</button>
          <button onClick={handleGenerate} disabled={generating} className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-sm">{generating?'Generating...':'Auto-Generate'}</button>
        </div>
      </div>

      <div className="p-4 bg-white border rounded-xl shadow-sm">
        <select className="px-4 py-2 bg-slate-50 border rounded-xl w-full max-w-sm" value={selectedExam} onChange={e => setSelectedExam(e.target.value)}>
          {exams.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </div>

      {loading ? <div className="p-6 animate-pulse h-96 bg-slate-200 rounded-2xl"></div> : error ? <div className="p-6 text-red-500 bg-red-50 rounded-xl text-center">{error}</div> : (
        <div className="space-y-8">
          {halls.length === 0 && <div className="text-slate-500 text-center p-10 bg-white border rounded-2xl">No seating generated for this exam yet. Click Auto-Generate.</div>}
          
          {halls.map(hall => {
            const hallSeats = seating.filter(s => s.hall === hall);
            const rows = Math.max(...hallSeats.map(s => s.row));
            const cols = Math.max(...hallSeats.map(s => s.column));
            
            return (
              <div key={hall} className="bg-white p-6 rounded-2xl border shadow-sm">
                <h2 className="text-xl font-bold mb-6 text-slate-800">Hall: {hall}</h2>
                <div className="overflow-x-auto">
                  <div className="inline-grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(100px, 1fr))` }}>
                    {hallSeats.map(seat => (
                      <div key={seat.id} onClick={() => handleReassign(seat)} className="p-3 border-2 border-slate-200 rounded-xl bg-slate-50 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors text-center flex flex-col items-center justify-center min-h-[80px]">
                        <span className="text-xs text-slate-400 font-bold mb-1">Seat {seat.seatNo}</span>
                        <span className="font-black text-slate-800">{seat.regNo || '-'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {seating.length > 0 && (
            <div className="bg-white border rounded-2xl shadow-sm overflow-hidden mt-6">
              <h2 className="p-4 border-b font-bold">List View</h2>
              <table className="w-full text-left whitespace-nowrap text-sm">
                <thead className="bg-slate-50 border-b text-slate-500 uppercase">
                  <tr><th className="p-4">Hall</th><th className="p-4">Seat No</th><th className="p-4">Row/Col</th><th className="p-4">Reg No</th><th className="p-4">Student Name</th></tr>
                </thead>
                <tbody className="divide-y">
                  {seating.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-4 font-bold">{s.hall}</td>
                      <td className="p-4">{s.seatNo}</td>
                      <td className="p-4 text-slate-500">R{s.row} / C{s.column}</td>
                      <td className="p-4 font-bold text-blue-600">{s.regNo || 'Empty'}</td>
                      <td className="p-4">{s.studentName || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
