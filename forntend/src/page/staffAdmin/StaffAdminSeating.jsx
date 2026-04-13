import React, { useState } from 'react';

export default function StaffAdminSeating() {
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(6);
  const [mixDepts, setMixDepts] = useState(true);
  const [grid, setGrid] = useState([]);
  const [generated, setGenerated] = useState(false);

  const depts = [{name: 'CSE', color: 'bg-indigo-100 text-indigo-700'}, {name: 'ECE', color: 'bg-emerald-100 text-emerald-700'}];

  const generateSeating = () => {
      let layout = [];
      let studentCounter = 1;
      for(let r=1; r<=rows; r++) {
         let rowArr = [];
         for(let c=1; c<=cols; c++) {
             const d = mixDepts ? depts[(r+c)%2] : depts[0];
             rowArr.push({ seat: `${String.fromCharCode(64+c)}${r}`, roll: `${d.name}${100+studentCounter}`, dept: d });
             studentCounter++;
         }
         layout.push(rowArr);
      }
      setGrid(layout);
      setGenerated(true);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Seating Arrangement</h1>
            <p className="text-slate-500 font-medium">Algorithmic mixed layout generator.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Configuration</h3>
              <div className="space-y-4">
                  <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Rows</label>
                      <input type="number" min="1" max="20" value={rows} onChange={e=>setRows(Number(e.target.value))} className="w-full border border-slate-200 p-2 rounded-lg font-bold" />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Columns</label>
                      <input type="number" min="1" max="10" value={cols} onChange={e=>setCols(Number(e.target.value))} className="w-full border border-slate-200 p-2 rounded-lg font-bold" />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-slate-700 mt-4">
                      <input type="checkbox" checked={mixDepts} onChange={e=>setMixDepts(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
                      Interleave Departments (Anti-Copying)
                  </label>
                  <button onClick={generateSeating} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black shadow-md hover:bg-indigo-700 transition">⚙️ Generate Matrix</button>
              </div>
          </div>
          
          <div className="lg:col-span-3 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm overflow-x-auto">
             {!generated ? (
                 <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                     <span className="text-5xl mb-4">🪑</span>
                     <p className="font-bold">Configure and generate seating</p>
                 </div>
             ) : (
                 <div className="min-w-max p-4 bg-slate-50 rounded-2xl border border-slate-200">
                     <div className="mb-4 text-center w-full py-2 bg-slate-200 text-slate-500 font-black uppercase tracking-widest rounded-lg border border-slate-300">Whiteboard / Podium</div>
                     <table className="border-separate border-spacing-2 mx-auto">
                         <tbody>
                            {grid.map((row, rIdx) => (
                                <tr key={rIdx}>
                                    {row.map((cell, cIdx) => (
                                        <td key={cIdx} className={`p-3 rounded-lg border shadow-sm w-20 text-center ${cell.dept.color}`}>
                                            <div className="text-[9px] font-black mb-1 opacity-60">{cell.seat}</div>
                                            <div className="text-[10px] font-bold leading-tight">{cell.roll}</div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                         </tbody>
                     </table>
                     <div className="mt-6 flex justify-end gap-3">
                         <button className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl shadow-md text-sm">Save to Database</button>
                         <button onClick={()=>window.print()} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl shadow-sm hover:bg-slate-50 text-sm">Print Chart</button>
                     </div>
                 </div>
             )}
          </div>
      </div>

    </div>
  );
}
