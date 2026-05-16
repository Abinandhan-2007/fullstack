import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useTheme } from '../../context/ThemeContext';

export default function LibraryBooks({ apiUrl, token, user }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/library/books');
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredBooks = data.filter(b => 
    b.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.isbn?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="h-96 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Institutional Catalog</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Browse and manage the complete repository of academic resources</p>
        </div>
        <button className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold shadow-xl shadow-violet-500/20 transition-all flex items-center gap-2">
           <span>➕</span> Add New Resource
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2rem] p-8 shadow-sm flex flex-col md:flex-row gap-6">
         <div className="flex-1 relative">
            <input 
               type="text"
               placeholder="Search by Title, Author, or ISBN..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl px-12 py-4 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-violet-500/10 transition-all"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">🔍</span>
         </div>
         <div className="flex gap-4">
            <select className="bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-xl px-4 py-2 text-xs font-bold dark:text-white outline-none">
               <option>All Categories</option>
               <option>Computer Science</option>
               <option>Electronics</option>
               <option>General</option>
            </select>
            <button className="px-6 py-2 bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-xl">Advanced Filter</button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col relative overflow-hidden group hover:border-violet-500 transition-all">
             <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-bl-[3rem] group-hover:scale-110 transition-transform"></div>
             
             <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                   <div className="w-12 h-12 bg-slate-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-2xl shadow-inner italic font-black text-violet-600">
                      📖
                   </div>
                   <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                     book.available ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                   }`}>
                      {book.available ? 'In-Stock' : 'Issued'}
                   </span>
                </div>
                
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight mb-2 group-hover:text-violet-600 transition-colors">
                   {book.title}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{book.author}</p>
                
                <div className="mt-8 flex justify-between items-center">
                   <div>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">ISBN</p>
                      <p className="text-[10px] font-bold text-slate-500">{book.isbn || '978-01...23'}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Location</p>
                      <p className="text-[10px] font-bold text-slate-500">{book.shelf || 'RACK-04'}</p>
                   </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 dark:border-gray-800 flex gap-2">
                   <button className="flex-1 py-3 bg-slate-900 dark:bg-violet-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-violet-500/10 hover:opacity-90 transition-opacity">Reserve</button>
                   <button className="px-4 py-3 bg-slate-100 dark:bg-gray-800 text-slate-400 rounded-xl hover:text-violet-600 transition-colors">📑</button>
                </div>
             </div>
          </div>
        ))}
        {filteredBooks.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-gray-800/30 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-gray-800">
             <p className="text-slate-400 italic font-medium">No resources found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
