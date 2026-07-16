import React, { useState, useEffect } from 'react';

export default function StaffAttendance({ apiUrl }) {
  const [sessions, setSessions] = useState([
     { id: 1, timeSlot: 'FN (09:00-10:00)', subjectCode: 'CS501', subjectName: 'Data Structures', venue: 'Lab 4', department: 'CSE', seatAllocation: [] },
     { id: 2, timeSlot: 'AN (02:00-03:00)', subjectCode: 'EC204', subjectName: 'Signals & Systems', venue: 'Room 205', department: 'ECE', seatAllocation: [] }
  ]);
  const [activeSession, setActiveSession] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  const startAttendance = (s) => {
      // Mock generating seat allocation
      const mockSeats = Array.from({length: 40}, (_, i) => ({
          seat: `${String.fromCharCode(65+(i%5))}${Math.floor(i/5)+1}`,
          roll: `CS${100+i}`,
      }));
      setActiveSession({ ...s, seatAllocation: mockSeats });
      
      const rec = {};
      mockSeats.forEach(m => rec[m.roll] = 'Present');
      setAttendance(rec);
  };

  const processSubmit = () => {
      setSubmitStatus('Submitting...');
      setTimeout(() => {
          setSubmitStatus('Success');
          setTimeout(() => {
              setActiveSession(null);
              setSubmitStatus(null);
          }, 1500);
      }, 1000);
  };

  return (
    <div className="space-y-6">
      {!activeSession ? (
         <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
             <h2 className="text-3xl font-black text-slate-800 mb-6">Today's Classes</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {sessions.map(s => (
                     <div key={s.id} className="border border-slate-200 rounded-[2rem] p-6 shadow-sm overflow-hidden relative">
                         <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
                         <div className="flex justify-between items-start mb-4">
                            <span className="bg-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md">{s.timeSlot}</span>
                            <span className="text-xs font-bold text-slate-500">📍 {s.venue}</span>
                         </div>
                         <h3 className="text-xl font-black text-slate-800 mb-1">{s.subjectName}</h3>
                         <p className="text-sm font-bold text-emerald-600 mb-4">{s.subjectCode} • {s.department}</p>
                         <button onClick={()=>startAttendance(s)} className="w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold py-3 rounded-xl transition shadow-inner">📝 Mark Attendance</button>
                     </div>
                 ))}
             </div>
         </div>
      ) : (
         <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-2xl font-black text-slate-800">{activeSession.subjectName}</h2>
                    <p className="font-bold text-slate-500">{activeSession.timeSlot} • {activeSession.venue}</p>
                 </div>
                 <button onClick={()=>setActiveSession(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕ Close</button>
             </div>

             <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                 <button onClick={()=>{const n={}; Object.keys(attendance).forEach(k=>n[k]='Present'); setAttendance(n);}} className="p-3 border border-emerald-200 bg-emerald-50 text-emerald-700 font-bold rounded-xl text-sm">✅ Mark All Present</button>
                 <button onClick={()=>{const n={}; Object.keys(attendance).forEach(k=>n[k]='Absent'); setAttendance(n);}} className="p-3 border border-rose-200 bg-rose-50 text-rose-700 font-bold rounded-xl text-sm">❌ Mark All Absent</button>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
                 {activeSession.seatAllocation.map(seat => (
                     <div key={seat.roll} onClick={()=>setAttendance(p=>({...p, [seat.roll]: p[seat.roll]==='Present'?'Absent':'Present'}))} className={`p-4 border rounded-xl cursor-pointer shadow-sm transition-all text-center ${attendance[seat.roll]==='Present' ? 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100' : 'bg-rose-500 border-rose-600 text-white shadow-md transform scale-[0.98]'}`}>
                         <div className="text-[10px] font-black opacity-60 mb-1">{seat.seat}</div>
                         <div className="font-bold text-xs">{seat.roll}</div>
                     </div>
                 ))}
             </div>

             <button onClick={processSubmit} disabled={submitStatus!==null} className={`w-full py-4 text-white font-black text-lg rounded-xl shadow-md transition ${submitStatus==='Success'?'bg-emerald-600':submitStatus==='Submitting...'?'bg-amber-500':'bg-indigo-600 hover:bg-indigo-700'}`}>
                 {submitStatus || 'Submit Attendance'}
             </button>
         </div>
      )}
    </div>
  );
}
