import React, { useState } from 'react';

export default function AdminCertificates() {
  const [certType, setCertType] = useState('Bonafide');
  const [studentRoll, setStudentRoll] = useState('');
  const [issueLog, setIssueLog] = useState([
     { id: 'CERT-2026-001', type: 'Bonafide', roll: '737622CS101', date: '2026-04-10' },
     { id: 'CERT-2026-002', type: 'Course Completion', roll: '737622IT204', date: '2026-04-11' }
  ]);

  const [preview, setPreview] = useState(false);
  const [certNumber] = useState(`CERT-${new Date().getFullYear()}-${Math.floor(Math.random()*900)+100}`);

  const handleGenerate = () => {
     if (!studentRoll) return alert('Enter Roll Number to generate.');
     setPreview(true);
  };

  const handlePrint = () => {
     window.print();
     // Log the issue
     if (!issueLog.find(i => i.id === certNumber)) {
         setIssueLog([{ id: certNumber, type: certType, roll: studentRoll, date: new Date().toISOString().split('T')[0] }, ...issueLog]);
     }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm print:hidden">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Certificate Generator</h1>
            <p className="text-slate-500 font-medium mt-1">Generate print-ready official university documents with auto-logging.</p>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
         
         {/* Config Panel */}
         <div className="w-full lg:w-80 shrink-0 space-y-6 print:hidden">
             <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                 <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Configuration</h3>
                 
                 <div className="space-y-4">
                     <div>
                         <label className="block text-xs font-bold text-slate-600 mb-1.5">Certificate Type</label>
                         <select value={certType} onChange={e => {setCertType(e.target.value); setPreview(false);}} className="w-full outline-none border border-slate-200 rounded-xl p-3 text-sm font-bold shadow-sm bg-white cursor-pointer">
                             <option value="Bonafide">Bonafide Certificate</option>
                             <option value="Course Completion">Course Completion</option>
                             <option value="Attendance">Attendance Percentage</option>
                             <option value="Character">Character & Conduct</option>
                         </select>
                     </div>
                     <div>
                         <label className="block text-xs font-bold text-slate-600 mb-1.5">Target Student Roll No.</label>
                         <input type="text" placeholder="e.g. 737622CS101" value={studentRoll} onChange={e => {setStudentRoll(e.target.value.toUpperCase()); setPreview(false);}} className="w-full outline-none border border-slate-200 rounded-xl p-3 text-sm font-bold shadow-sm focus:border-indigo-500 uppercase" />
                     </div>
                 </div>

                 <button onClick={handleGenerate} className="w-full mt-8 py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all active:scale-95">Preview Certificate</button>
             </div>

             {/* Issue Log Mini */}
             <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                 <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Recent Issue Log</h3>
                 <div className="space-y-3">
                     {issueLog.slice(0,4).map((log, i) => (
                         <div key={i} className="border-l-2 border-indigo-500 pl-3">
                             <p className="text-xs font-bold text-slate-800">{log.id}</p>
                             <p className="text-[10px] font-medium text-slate-500 mt-0.5">{log.type} • {log.roll}</p>
                         </div>
                     ))}
                 </div>
                 <button className="w-full mt-4 py-2 bg-slate-50 text-slate-600 text-xs font-bold rounded hover:bg-slate-100 transition border border-slate-200">Export Complete Log</button>
             </div>
         </div>

         {/* A4 Preview Screen */}
         <div className="flex-1 bg-slate-100 p-4 lg:p-8 rounded-[2rem] border border-slate-200 shadow-inner flex flex-col items-center justify-center min-h-[800px] print:bg-white print:p-0 print:border-none print:shadow-none print:-m-10">
             
             {!preview ? (
                 <div className="text-center text-slate-400 print:hidden">
                    <span className="text-6xl">📄</span>
                    <p className="font-bold mt-4 text-slate-500">Document Preview Area</p>
                    <p className="text-sm">Configure panel on the left and generate.</p>
                 </div>
             ) : (
                 <div className="relative w-full max-w-[210mm] aspect-[1/1.414] bg-white shadow-2xl p-12 print:shadow-none print:p-0">
                     
                     <div className="absolute top-4 right-10 print:hidden">
                         <button onClick={handlePrint} className="px-6 py-2 bg-slate-900 text-white rounded font-bold shadow hover:bg-slate-800 flex items-center gap-2"><span>🖨️</span> Print A4</button>
                     </div>

                     {/* Document Content (A4 Proportions) */}
                     <div className="w-full h-full border-4 border-double border-slate-800 p-8 flex flex-col items-center text-center relative">
                         
                         {/* Header Letterhead */}
                         <div className="flex flex-col items-center border-b-2 border-slate-900 pb-6 w-full mb-8">
                             <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center text-white text-3xl font-serif font-bold mb-4 border-2 border-slate-900 shadow">A</div>
                             <h1 className="text-3xl font-black font-serif uppercase tracking-widest text-slate-900">Apex University</h1>
                             <p className="text-xs font-bold text-slate-600 tracking-widest mt-1">Autonomous Institution Affiliated to Global Tech</p>
                             <p className="text-[10px] text-slate-500 mt-1">ISO 9001:2020 Certified • NAAC A++ Accredited</p>
                         </div>

                         {/* Meta */}
                         <div className="w-full flex justify-between text-xs font-bold font-serif mb-12">
                             <p>Ref: <span className="text-red-700">{certNumber}</span></p>
                             <p>Date: {new Date().toLocaleDateString()}</p>
                         </div>

                         {/* Title */}
                         <h2 className="text-2xl font-black font-serif uppercase tracking-widest border-b border-black pb-1 mb-10">{certType} Certificate</h2>

                         {/* Body Text */}
                         <div className="w-full text-justify text-sm font-serif leading-loose px-4 text-slate-800 mb-20 flex-1">
                             <p className="indent-10">
                                 This is to certify that Mr./Ms. <span className="font-bold border-b border-dashed border-black px-4">{studentRoll ? "Alumni " + studentRoll : "........................"}</span>, 
                                 bearing Roll Number <span className="font-bold border-b border-dashed border-black px-4">{studentRoll || "........................"}</span>, is a bonafide student of this institution.
                                 {certType === 'Course Completion' && " They have successfully completed the prescribed courses and fulfilled all academic requirements for the degree."}
                                 {certType === 'Attendance' && " Their overall attendance percentage for the current academic year stands at a highly commendable 94.5%, fulfilling all academic statutes."}
                                 {certType === 'Character' && " During their tenure at this university, to the best of our knowledge, their character and conduct have been exemplary, and they have not been involved in any disciplinary proceedings."}
                             </p>
                             <p className="indent-10 mt-6">
                                 This certificate is issued exclusively upon the request of the student for official verification purposes.
                             </p>
                         </div>

                         {/* Signatures */}
                         <div className="w-full flex justify-between items-end mt-auto px-8 mb-4">
                             <div className="flex flex-col items-center">
                                 <div className="w-32 h-10 border-b border-black mb-2 opacity-20"></div> {/* Digital Signature Placeholder */}
                                 <p className="text-xs font-bold font-serif uppercase">Head of Department</p>
                             </div>
                             <div className="w-24 h-24 rounded-full border-4 border-double border-red-800 text-red-800 flex items-center justify-center rotate-[-15deg] opacity-60">
                                 <span className="font-bold text-[10px] uppercase text-center leading-tight tracking-widest">Official<br/>Seal</span>
                             </div>
                             <div className="flex flex-col items-center">
                                 <div className="w-32 h-10 border-b border-black mb-2 flex items-end justify-center"><span className="font-dancing text-2xl text-blue-800 -mb-2">A. Director</span></div> {/* Digital Signature Simulation */}
                                 <p className="text-xs font-bold font-serif uppercase">Principal / Dean</p>
                             </div>
                         </div>
                     </div>
                 </div>
             )}

         </div>
      </div>
    </div>
  );
}
