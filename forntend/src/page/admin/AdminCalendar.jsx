import React, { useState, useEffect } from 'react';
import api from '../../api';

export default function AdminCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ id: null, title: '', date: '', type: 'EVENT', description: '', notifyAll: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true); setError(null);
    try {
      const res = await api.get('/admin/events');
      setEvents(res.data || []);
    } catch (err) { setError(err.message || 'Failed to load events'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (e) => {
    e.preventDefault(); setIsSubmitting(true);
    try {
      if (newEvent.id) await api.put(`/admin/events/${newEvent.id}`, newEvent);
      else await api.post('/admin/events', newEvent);
      setIsModalOpen(false); fetchData();
    } catch (err) { alert('Failed to save event'); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete event?')) return;
    try { await api.delete(`/admin/events/${id}`); fetchData(); }
    catch (err) { alert('Failed to delete event'); }
  };

  // Calendar logic
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const blanks = Array(firstDay).fill(null);
  const days = Array.from({length: daysInMonth}, (_, i) => i + 1);
  const allSlots = [...blanks, ...days];

  const getTypeColor = (type) => {
    if(type==='HOLIDAY') return 'bg-red-500';
    if(type==='EXAM') return 'bg-purple-500';
    if(type==='DEADLINE') return 'bg-amber-500';
    return 'bg-blue-500'; // EVENT
  };

  const selectedDateString = `${year}-${String(month+1).padStart(2,'0')}-${String(selectedDate.getDate()).padStart(2,'0')}`;
  const eventsForSelected = events.filter(e => e.date.startsWith(selectedDateString));
  
  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date(new Date().setHours(0,0,0,0)))
    .sort((a,b) => new Date(a.date) - new Date(b.date))
    .slice(0, 10);

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-full space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-800">Academic Calendar</h1>
        <button onClick={() => { setNewEvent({ id: null, title: '', date: selectedDateString, type: 'EVENT', description: '', notifyAll: false }); setIsModalOpen(true); }} className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-sm">+ Add Event</button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Calendar Grid */}
        <div className="xl:col-span-2 bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
            <div className="flex gap-2">
              <button onClick={() => setCurrentDate(new Date(year, month-1, 1))} className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 font-bold">&lt;</button>
              <button onClick={() => setCurrentDate(new Date())} className="px-3 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 font-bold text-sm">Today</button>
              <button onClick={() => setCurrentDate(new Date(year, month+1, 1))} className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 font-bold">&gt;</button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} className="text-center font-bold text-slate-400 text-xs uppercase py-2">{d}</div>)}
            {allSlots.map((d, i) => {
              if (!d) return <div key={i} className="aspect-square p-2 border border-slate-50 bg-slate-50/50 rounded-xl"></div>;
              
              const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
              const dayEvents = events.filter(e => e.date.startsWith(dateStr));
              const isSelected = selectedDate.getDate() === d && selectedDate.getMonth() === month;
              const isToday = new Date().getDate() === d && new Date().getMonth() === month && new Date().getFullYear() === year;

              return (
                <div key={i} onClick={() => setSelectedDate(new Date(year, month, d))} className={`aspect-square p-2 border rounded-xl cursor-pointer transition-colors flex flex-col ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-blue-300'}`}>
                  <span className={`text-sm font-bold ${isToday ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-slate-700'}`}>{d}</span>
                  <div className="flex-1 mt-1 flex flex-wrap gap-1 content-start">
                    {dayEvents.slice(0,3).map(e => (
                      <div key={e.id} className={`w-2 h-2 rounded-full ${getTypeColor(e.type)}`} title={e.title}></div>
                    ))}
                    {dayEvents.length > 3 && <div className="w-2 h-2 rounded-full bg-slate-300"></div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side Panel */}
        <div className="bg-white rounded-2xl border shadow-sm flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b bg-slate-50">
            <h2 className="font-bold text-slate-800">Events on {selectedDate.toLocaleDateString()}</h2>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {eventsForSelected.map(e => (
              <div key={e.id} className="p-3 border rounded-xl relative group">
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${getTypeColor(e.type)}`}></div>
                <div className="pl-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-800 text-sm">{e.title}</h3>
                    <div className="hidden group-hover:flex gap-2">
                      <button onClick={() => { setNewEvent(e); setIsModalOpen(true); }} className="text-blue-500 text-xs font-bold">Edit</button>
                      <button onClick={() => handleDelete(e.id)} className="text-red-500 text-xs font-bold">Del</button>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400">{e.type}</span>
                  <p className="text-sm text-slate-600 mt-1">{e.description}</p>
                </div>
              </div>
            ))}
            {!eventsForSelected.length && <p className="text-slate-500 text-sm text-center py-4">No events scheduled.</p>}
          </div>

          <div className="p-4 border-t bg-slate-50">
            <h2 className="font-bold text-slate-800 mb-3 text-sm">Upcoming (Next 10)</h2>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {upcomingEvents.map(e => (
                <div key={e.id} className="flex gap-3 items-center text-sm">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${getTypeColor(e.type)}`}></div>
                  <span className="text-slate-500 shrink-0 text-xs">{new Date(e.date).toLocaleDateString(undefined,{month:'short',day:'numeric'})}</span>
                  <span className="font-semibold text-slate-700 truncate">{e.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <form onSubmit={handleSave} className="bg-white rounded-2xl w-full max-w-sm">
            <div className="p-4 border-b bg-slate-50"><h2 className="font-bold">{newEvent.id?'Edit':'Add'} Event</h2></div>
            <div className="p-6 space-y-4">
              <input required type="text" placeholder="Event Title" className="w-full px-4 py-2 border rounded-xl" value={newEvent.title} onChange={e=>setNewEvent({...newEvent,title:e.target.value})} />
              <input required type="date" className="w-full px-4 py-2 border rounded-xl" value={newEvent.date} onChange={e=>setNewEvent({...newEvent,date:e.target.value})} />
              <select className="w-full px-4 py-2 border rounded-xl" value={newEvent.type} onChange={e=>setNewEvent({...newEvent,type:e.target.value})}>
                <option value="EVENT">General Event</option>
                <option value="HOLIDAY">Holiday</option>
                <option value="EXAM">Exam</option>
                <option value="DEADLINE">Deadline</option>
              </select>
              <textarea placeholder="Description" rows="2" className="w-full px-4 py-2 border rounded-xl" value={newEvent.description} onChange={e=>setNewEvent({...newEvent,description:e.target.value})}></textarea>
              <label className="flex items-center gap-2 text-sm text-slate-600 font-bold">
                <input type="checkbox" checked={newEvent.notifyAll} onChange={e=>setNewEvent({...newEvent,notifyAll:e.target.checked})} className="rounded" />
                Notify all users
              </label>
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
