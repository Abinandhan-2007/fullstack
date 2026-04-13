import React, { useState } from 'react';

export default function AdminSeating() {
  const [examName, setExamName] = useState('Mid-Semester Examinations');
  const [halls, setHalls] = useState([
     { id: 1, name: 'Main Hall A', capacity: 60, rows: 6, cols: 10 },
     { id: 2, name: 'Block B - Room 104', capacity: 40, rows: 5, cols: 8 }
  ]);
  const [selectedDepts, setSelectedDepts] = useState(['CSE', 'IT']);
  const [algorithm, setAlgorithm] = useState('alternate'); // alternate, sequential

  const [seatingGenerated, setSeatingGenerated] = useState(false);
  const [previewGrid, setPreviewGrid] = useState([]);

  const generateSeating = () => {
     // Mock sophisticated seating generation algorithm
     const grid = [];
     const activeHall = halls[0];
     let cseCounter = 101, itCounter = 201;

     for(let r = 0; r < activeHall.rows; r++) {
         const row = [];
         for(let c = 0; c < activeHall.cols; c++) {
             let occupant = null;
             if (algorithm === 'alternate') {
                 if ((r+c)%2 === 0) { occupant = { roll: `737622CS${cseCounter++}`, dept: 'CSE', color: 'bg-blue-100 text-blue-700 border-blue-200' }; }
                 else { occupant = { roll: `737622IT${itCounter++}`, dept: 'IT', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' }; }
             } else {
                 if (r < activeHall.rows/2) { occupant = { roll: `737622CS${cseCounter++}`, dept: 'CSE', color: 'bg-blue-100 text-blue-700 border-blue-200' }; }
                 else { occupant = { roll: `737622IT${itCounter++}`, dept: 'IT', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' }; }
             }
             row.push(occupant);
         }
         grid.push(row);
     }
     setPreviewGrid(grid);
     setSeatingGenerated(true);
  };

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Seating Arrangement</h1>
            <p className="text-slate-500 font-medium mt-1">Algorithmic generation of mixed seating for examinations.</p>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Configuration Panel */}
          <div className="w-full lg:w-80 shrink-0 space-y-6">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                 <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Configuration</h3>
                 
                 <div className="space-y-4">
                     <div>
                         <label className="block text-xs font-bold text-slate-600 mb-1.5">Exam Name</label>
                         <input type="text" value={examName} onChange={e => setExamName(e.target.value)} className="w-full outline-none border border-slate-200 rounded-xl p-3 text-sm font-bold shadow-sm focus:border-blue-500" />
                     </div>
                     <div>
                         <label className="block text-xs font-bold text-slate-600 mb-1.5">Target Hall</label>
                         <select className="w-full outline-none border border-slate-200 rounded-xl p-3 text-sm font-bold shadow-sm bg-white">
                             {halls.map(h => <option key={h.id} value={h.id}>{h.name} (Cap: {h.capacity})</option>)}
                         </select>
                     </div>
                     <div>
                         <label className="block text-xs font-bold text-slate-600 mb-1.5">Seating Algorithm</label>
                         <select value={algorithm} onChange={e => setAlgorithm(e.target.value)} className="w-full outline-none border border-slate-200 rounded-xl p-3 text-sm font-bold shadow-sm bg-white">
                             <option value="alternate">Mixed Alternate (Cheating Prevention)</option>
                             <option value="sequential">Sequential Cluster (By Dept)</option>
                         </select>
                     </div>
                 </div>

                 <div className="mt-8 pt-6 border-t border-slate-100">
                     <label className="block text-xs font-bold text-slate-600 mb-3">Departments to Mix</label>
                     <div className="flex flex-wrap gap-2">
                         {['CSE', 'IT', 'ECE'].map(d => (
                             <label key={d} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-100">
                                 <input type="checkbox" checked={selectedDepts.includes(d)} onChange={() => {}} className="accent-blue-600" />
                                 <span className="text-xs font-bold text-slate-700">{d}</span>
                             </label>
                         ))}
                     </div>
                 </div>

                 <button onClick={generateSeating} className="w-full mt-8 py-3.5 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all active:scale-95">Generate Layout</button>
              </div>
          </div>

          {/* Visual Preview Panel */}
          <div className="flex-1 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-black text-slate-800">Visual Seat Grid Preview</h3>
                  {seatingGenerated && (
                      <div className="flex gap-3">
                          <button className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 flex items-center gap-2 transition"><span>🔄</span> Recalculate</button>
                          <button onClick={handlePrint} className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-sm shadow-md hover:bg-slate-800 flex items-center gap-2 transition"><span>📥</span> Export PDF</button>
                      </div>
                  )}
              </div>

              {seatingGenerated ? (
                  <div className="flex-1 overflow-auto custom-scrollbar bg-slate-50 p-6 rounded-2xl border border-slate-200 grid place-items-center">
                     <div>
                         <div className="w-full text-center mb-10"><span className="bg-slate-200 px-12 py-3 rounded-full text-xs font-black uppercase tracking-widest text-slate-500">Board / Invigilator Console</span></div>
                         <div className="flex flex-col gap-3">
                             {previewGrid.map((row, ri) => (
                                 <div key={ri} className="flex gap-3">
                                     {row.map((seat, ci) => (
                                         <div key={ci} className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 flex flex-col items-center justify-center p-2 shadow-sm relative group cursor-pointer hover:-translate-y-1 transition-transform ${seat.color}`}>
                                             <span className="absolute top-1 left-1.5 text-[8px] font-black opacity-50 block">R{ri+1}C{ci+1}</span>
                                             <span className="font-bold text-[10px] md:text-xs text-center leading-tight mt-1">{seat.roll.replace('737622','')}</span>
                                             <span className="text-[9px] font-black uppercase mt-1 bg-white/50 px-1.5 rounded">{seat.dept}</span>
                                             
                                             <div className="absolute inset-0 bg-slate-900/80 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition border border-slate-900">
                                                <span className="text-white text-[10px] font-bold">Swap Seat</span>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             ))}
                         </div>
                     </div>
                  </div>
              ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 py-20">
                     <span className="text-6xl mb-4">🪑</span>
                     <p className="font-bold">No Seating Generated Yet</p>
                     <p className="text-sm font-medium">Configure parameters and click generate.</p>
                  </div>
              )}
          </div>

      </div>
    </div>
  );
}
