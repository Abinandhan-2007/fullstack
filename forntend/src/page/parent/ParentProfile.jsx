import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function ParentProfile({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Mocked detailed profile
      setData({
        ward: {
          name: 'Abinandhan',
          regNo: '7376211CS101',
          degree: 'B.E. Computer Science & Engineering',
          year: 'III Year / VI Semester',
          section: 'A',
          hostel: 'A-Wing, Room 204',
          busRoute: 'R-14 (Pollachi)',
          advisor: 'Dr. Sarah Wilson'
        },
        guardian: {
          primaryName: 'Senthil Kumar',
          relation: 'Father',
          email: 'senthil@example.com',
          phone: '+91 98765 43210',
          emergency: '+91 99887 76655',
          address: '42, Golden Streets, Coimbatore - 641001'
        }
      });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <div className="flex justify-between items-end px-4">
         <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic">Ward Confidential Profile</h1>
            <p className="text-slate-500 dark:text-gray-400 text-sm">Official institutional records for student and guardian association</p>
         </div>
         <button className="px-6 py-3 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-600 shadow-sm hover:bg-rose-50 transition-all">Update Contacts</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Ward Details */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-bl-[4rem]"></div>
               <div className="flex items-center gap-6 mb-10">
                  <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-[2rem] flex items-center justify-center text-3xl font-black shadow-inner">🎓</div>
                  <div>
                     <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic underline decoration-rose-500">{data.ward.name}</h3>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{data.ward.regNo}</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                  {[
                    { label: 'Degree Program', val: data.ward.degree },
                    { label: 'Academic Year', val: data.ward.year },
                    { label: 'Section / Class', val: data.ward.section },
                    { label: 'Residential Wing', val: data.ward.hostel },
                    { label: 'Transportation', val: data.ward.busRoute },
                    { label: 'Faculty Advisor', val: data.ward.advisor },
                  ].map((item, i) => (
                    <div key={i} className="group">
                       <p className="text-[9px] font-black text-slate-300 dark:text-gray-600 uppercase tracking-[0.2em] mb-1 group-hover:text-rose-500 transition-colors">{item.label}</p>
                       <p className="text-sm font-black text-slate-700 dark:text-gray-300 italic">{item.val}</p>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white flex items-center justify-between shadow-2xl shadow-indigo-500/20">
               <div>
                  <h4 className="text-lg font-black uppercase tracking-tight italic">Student ID Card</h4>
                  <p className="text-xs text-indigo-200 mt-1">Digital copy verified by Institution Registrar</p>
               </div>
               <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/20">View Document</button>
            </div>
         </div>

         {/* Guardian Details */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[3rem] p-10 shadow-sm flex flex-col h-full">
               <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-8 italic">Guardian Info</h3>
               
               <div className="space-y-8 flex-1">
                  <div>
                     <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Primary Relationship</p>
                     <p className="text-base font-black text-slate-900 dark:text-white italic">{data.guardian.primaryName} ({data.guardian.relation})</p>
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Registered Phone</p>
                     <p className="text-sm font-black text-slate-700 dark:text-gray-300 italic">{data.guardian.phone}</p>
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Email Address</p>
                     <p className="text-sm font-black text-slate-700 dark:text-gray-300 italic underline decoration-slate-200">{data.guardian.email}</p>
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Emergency Contact</p>
                     <p className="text-sm font-black text-rose-600 italic">{data.guardian.emergency}</p>
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Residential Address</p>
                     <p className="text-sm font-black text-slate-700 dark:text-gray-300 italic leading-relaxed">{data.guardian.address}</p>
                  </div>
               </div>

               <div className="mt-10 p-6 bg-slate-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-gray-700 text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase leading-relaxed italic">
                     Contact the office for change of residential address or primary phone.
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
