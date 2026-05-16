import React, { useState, useEffect } from 'react';
import api from '../../api';

export default function AdminTimetable() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deptFilter, setDeptFilter] = useState('CSE');
  const [yearFilter, setYearFilter] = useState('1');
  const [sectionFilter, setSectionFilter] = useState('A');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlot, setCurrentSlot] = useState({ id: null, day: 'MONDAY', period: 1, subject: '', staff: '', room: '', department: 'CSE', year: 1, section: 'A' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const periods = [1, 2, 3, 4, 5, 6, 7, 8];

  const fetchData = async () => {
    setLoading(true); setError(null);
    try {
      const res = await api.get(`/admin/timetable?dept=${deptFilter}&year=${yearFilter}&section=${sectionFilter}`);
      setTimetable(res.data || []);
    } catch (err) { setError(err.message || 'Failed to fetch timetable'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [deptFilter, yearFilter, sectionFilter]);

  const handleSave = async (e) => {
    e.preventDefault(); setIsSubmitting(true);
    try {
      if (currentSlot.id) await api.put(`/admin/timetable/${currentSlot.id}`, currentSlot);
      else await api.post('/admin/timetable', currentSlot);
      setIsModalOpen(false); fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Failed to save or conflict detected'); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete slot?')) return;
    try { await api.delete(`/admin/timetable/${id}`); fetchData(); }
    catch (err) { alert('Failed to delete'); }
  };

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-full space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-800">Timetable Builder</h1>
        <button onClick={() => { setCurrentSlot({ id: null, day: 'MONDAY', period: 1, subject: '', staff: '', room: '', department: deptFilter, year: parseInt(yearFilter), section: sectionFilter }); setIsModalOpen(true); }} className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-sm">+ Add Slot</button>
      </div>

      <div className="flex gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
        <select className="px-4 py-2 bg-slate-50 border rounded-xl" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}><option>CSE</option><option>IT</option><option>ECE</option></select>
        <select className="px-4 py-2 bg-slate-50 border rounded-xl" value={yearFilter} onChange={e => setYearFilter(e.target.value)}><option>1</option><option>2</option><option>3</option><option>4</option></select>
        <select className="px-4 py-2 bg-slate-50 border rounded-xl" value={sectionFilter} onChange={e => setSectionFilter(e.target.value)}><option>A</option><option>B</option><option>C</option></select>
      </div>

      <div className="bg-white border rounded-2xl shadow-sm overflow-x-auto p-0">
        {loading ? <div className="p-6 animate-pulse h-96 bg-slate-200"></div> : error ? <div className="p-6 text-red-500 text-center">{error}</div> : (
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-bold border-b">
                <th className="p-4 border-r">Day / Period</th>
                {periods.map(p => <th key={p} className="p-4 border-r">{p}</th>)}
              </tr>
            </thead>
            <tbody>
              {days.map(day => (
                <tr key={day} className="border-b">
                  <td className="p-4 font-bold bg-slate-50 border-r text-slate-700 text-sm">{day}</td>
                  {periods.map(p => {
                    const slot = timetable.find(t => t.day === day && t.period === p);
                    return (
                      <td key={p} className="border-r p-2 relative group hover:bg-slate-50 cursor-pointer min-w-[120px]" onClick={() => { if(slot) { setCurrentSlot(slot); setIsModalOpen(true); } }}>
                        {slot ? (
                          <div className="flex flex-col text-xs bg-blue-50 text-blue-800 p-2 rounded border border-blue-200">
                            <span className="font-bold">{slot.subject}</span>
                            <span className="text-blue-600 truncate">{slot.staff}</span>
                            <span className="text-slate-500">{slot.room}</span>
                          </div>
                        ) : <span className="text-slate-300">-</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white rounded-2xl w-full max-w-sm">
            <div className="p-4 border-b bg-slate-50"><h2 className="font-bold">{currentSlot.id ? 'Edit Slot' : 'Add Slot'}</h2></div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="flex gap-4">
                <select required className="w-full px-4 py-2 bg-slate-50 border rounded-xl" value={currentSlot.day} onChange={e => setCurrentSlot({...currentSlot, day: e.target.value})}>
                  {days.map(d => <option key={d}>{d}</option>)}
                </select>
                <select required className="w-full px-4 py-2 bg-slate-50 border rounded-xl" value={currentSlot.period} onChange={e => setCurrentSlot({...currentSlot, period: parseInt(e.target.value)})}>
                  {periods.map(p => <option key={p} value={p}>P{p}</option>)}
                </select>
              </div>
              <input required type="text" placeholder="Subject" className="w-full px-4 py-2 bg-slate-50 border rounded-xl" value={currentSlot.subject} onChange={e => setCurrentSlot({...currentSlot, subject: e.target.value})} />
              <input required type="text" placeholder="Staff" className="w-full px-4 py-2 bg-slate-50 border rounded-xl" value={currentSlot.staff} onChange={e => setCurrentSlot({...currentSlot, staff: e.target.value})} />
              <input required type="text" placeholder="Room" className="w-full px-4 py-2 bg-slate-50 border rounded-xl" value={currentSlot.room} onChange={e => setCurrentSlot({...currentSlot, room: e.target.value})} />
            </form>
            <div className="p-4 border-t bg-slate-50 flex justify-between">
              {currentSlot.id ? <button onClick={() => handleDelete(currentSlot.id)} type="button" className="text-red-500 font-bold px-4 hover:bg-red-50 rounded-xl">Delete</button> : <div></div>}
              <div className="flex gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 font-bold">Cancel</button>
                <button onClick={handleSave} disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl">{isSubmitting?'Saving...':'Save'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
