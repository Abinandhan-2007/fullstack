import React, { useState, useEffect } from 'react';

export default function AdminCourses({ apiUrl, token }) {
  const [activeSemTab, setActiveSemTab] = useState('Sem 5');
  const semesters = ['Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7'];
  
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [courseModal, setCourseModal] = useState(false);

  useEffect(() => {
    // Simulated fetch of rich course data
    setTimeout(() => {
        setCourses([
            { id: 1, code: 'CS501', name: 'Software Engineering', credits: 3, faculty: 'Dr. Alan Turing', syllabusCompletion: 85, evaluationScore: 4.8, type: 'Core', prereqs: ['CS301'] },
            { id: 2, code: 'CS502', name: 'Computer Networks', credits: 4, faculty: 'Prof. Sarah', syllabusCompletion: 60, evaluationScore: 4.2, type: 'Core', prereqs: [] },
            { id: 3, code: 'IT503', name: 'Cloud Computing', credits: 3, faculty: 'Dr. Grace Hopper', syllabusCompletion: 40, evaluationScore: 4.9, type: 'Elective', prereqs: ['CS502'] },
            { id: 4, code: 'CS504', name: 'Machine Learning', credits: 4, faculty: 'Dr. Andrew Ng', syllabusCompletion: 90, evaluationScore: 4.6, type: 'Core', prereqs: ['MA201'] },
        ]);
        setIsLoading(false);
    }, 500);
  }, []);

  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);

  if (isLoading) return <div className="py-20 flex justify-center"><div className="animate-spin h-10 w-10 border-b-2 border-slate-900 rounded-full"></div></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Courses & Syllabus</h1>
            <p className="text-slate-500 font-medium mt-1">Manage curriculum, prerequisite mapping, and track syllabus completion.</p>
         </div>
         <button onClick={() => setCourseModal(true)} className="px-6 py-3 bg-[#2563EB] text-white rounded-xl font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition">➕ Add New Course</button>
      </div>

      {/* Analytics & Control Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3 bg-slate-50 p-1.5 rounded-2xl flex gap-1 border border-slate-200 overflow-x-auto custom-scrollbar">
             {semesters.map(sem => (
                 <button key={sem} onClick={() => setActiveSemTab(sem)} className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeSemTab === sem ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:bg-slate-100'}`}>
                     {sem} Curriculum
                 </button>
             ))}
          </div>
          <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-4 flex items-center justify-between">
             <span className="text-xs font-black uppercase text-emerald-800 tracking-widest leading-tight">Total<br/>Credits</span>
             <span className="text-3xl font-black text-emerald-600">{totalCredits}</span>
          </div>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
         {courses.map(course => (
             <div key={course.id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 flex flex-col lg:flex-row gap-6 relative group overflow-hidden">
                 
                 {/* Type Strip */}
                 <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${course.type === 'Core' ? 'bg-indigo-500' : 'bg-amber-400'}`}></div>

                 {/* Info Block */}
                 <div className="flex-1 lg:pl-2">
                     <div className="flex items-center gap-3 mb-2">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-md">{course.code}</span>
                        <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-md border ${course.type === 'Core' ? 'border-indigo-100 text-indigo-600 bg-indigo-50' : 'border-amber-100 text-amber-600 bg-amber-50'}`}>{course.type}</span>
                     </div>
                     <h3 className="text-xl font-black text-slate-800 leading-tight mb-1">{course.name}</h3>
                     <p className="text-sm font-bold text-slate-500 mb-4 flex items-center gap-2"><span>👨‍🏫 Assigned: <span className="text-slate-700">{course.faculty}</span></span></p>
                     
                     <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                         <span className="uppercase tracking-widest">Prerequisites:</span>
                         {course.prereqs.length > 0 ? course.prereqs.map((p, i) => <span key={i} className="bg-white border border-slate-200 px-2 py-1 rounded text-slate-700 shadow-sm flex items-center gap-1">🔗 {p}</span>) : <span className="text-slate-400 italic">None Required</span>}
                     </div>
                 </div>

                 {/* Metrics Block */}
                 <div className="w-full lg:w-72 flex lg:flex-col justify-between gap-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-6">
                     
                     {/* Syllabus Completion */}
                     <div className="w-1/2 lg:w-full">
                         <div className="flex justify-between items-end mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syllabus Covered</span>
                            <span className="font-black text-sm text-slate-700">{course.syllabusCompletion}%</span>
                         </div>
                         <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                             <div className={`h-full rounded-full transition-all ${course.syllabusCompletion > 75 ? 'bg-emerald-500' : course.syllabusCompletion > 40 ? 'bg-blue-500' : 'bg-rose-500'}`} style={{width: `${course.syllabusCompletion}%`}}></div>
                         </div>
                     </div>

                     {/* Stats */}
                     <div className="w-1/2 lg:w-full flex justify-between items-center bg-slate-50 rounded-xl border border-slate-100 p-3">
                         <div className="text-center"><span className="block text-[10px] font-black text-slate-400 uppercase">Credits</span><span className="text-xl font-black text-slate-800">{course.credits}</span></div>
                         <div className="w-px h-8 bg-slate-200"></div>
                         <div className="text-center"><span className="block text-[10px] font-black text-slate-400 uppercase">Eval Score</span><span className="text-xl font-black text-amber-500 flex items-center gap-1">★ {course.evaluationScore}</span></div>
                     </div>
                 </div>
                 
                 {/* Action Panel */}
                 <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded drop-shadow hover:bg-slate-200 text-xs font-bold">Clone</button>
                     <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded drop-shadow hover:bg-blue-100 text-xs font-bold">Edit</button>
                 </div>
             </div>
         ))}
      </div>
      
      {/* Add/Edit Modal Stub */}
      {courseModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl p-8 border border-slate-200 text-center relative">
                 <button onClick={() => setCourseModal(false)} className="absolute top-4 right-4 bg-slate-100 w-8 h-8 rounded-full font-bold hover:bg-slate-200">&times;</button>
                 <div className="text-4xl mb-2">🎓</div>
                 <h2 className="text-xl font-black text-slate-800 mb-1">Course Builder</h2>
                 <p className="text-slate-500 text-sm mb-6">Outcome mapping and advanced course creation UI.</p>
                 <button onClick={() => setCourseModal(false)} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition">Close Placeholder</button>
              </div>
          </div>
      )}

    </div>
  );
}
