import React, { useState, useEffect } from 'react';

export default function SemesterResult({ semesterId, rollNo, onBack, userName }) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalCredits: 0, sgpa: 0 });

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // NOTE: Change http://localhost:8080 to your deployed backend URL before pushing to Vercel!
        const response = await fetch(`http://localhost:8080/api/academic/${rollNo}/semester/${semesterId}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          setSubjects(data);
          let credits = 0;
          let earnedPoints = 0;
          data.forEach(sub => {
            credits += sub.credits;
            earnedPoints += (sub.credits * sub.points);
          });
          setStats({
            totalCredits: credits,
            sgpa: (earnedPoints / credits).toFixed(2)
          });
        }
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [semesterId, rollNo]);

  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500 ease-out pb-10 font-sans">
      
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          ← Back to Ledger
        </button>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 uppercase tracking-widest px-3 py-1 rounded-md">
          Official Record
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-32 text-slate-500 font-bold">Fetching records from database...</div>
      ) : subjects.length === 0 ? (
        <div className="bg-white border border-rose-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="text-4xl mb-4">📄</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No Records Found</h3>
          <p className="text-slate-500">Marks for Semester {semesterId} have not been published yet.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Semester {semesterId} Results</h2>
              <p className="text-slate-500 font-medium mt-1">{userName} • {rollNo}</p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total Credits</p>
                <p className="text-3xl font-bold text-slate-800">{stats.totalCredits}</p>
              </div>
              <div className="w-px h-12 bg-slate-200"></div>
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">SGPA</p>
                <p className="text-3xl font-bold text-blue-600">{stats.sgpa}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800">Subject-wise Performance</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-200 bg-white">
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Course Code</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Course Title</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Type</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Credits</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Grade</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subjects.map((sub, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4"><span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">{sub.courseCode}</span></td>
                      <td className="px-6 py-4"><span className="text-sm font-semibold text-slate-800">{sub.courseTitle}</span></td>
                      <td className="px-6 py-4 text-center"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{sub.courseType}</span></td>
                      <td className="px-6 py-4 text-center"><span className="text-sm font-medium text-slate-600">{sub.credits}</span></td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-lg font-black ${sub.grade === 'O' ? 'text-emerald-500' : 'text-blue-600'}`}>{sub.grade}</span>
                      </td>
                      <td className="px-6 py-4 text-right"><span className="text-sm font-bold text-slate-700">{sub.points}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}