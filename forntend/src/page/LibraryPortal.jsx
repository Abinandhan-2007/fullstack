import React, { useState, useEffect } from 'react';

const LibraryPortal = ({ handleLogout, apiUrl, loggedInEmail, token, userName }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Common Headers
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [bookRes, issueRes] = await Promise.all([
          fetch(`${apiUrl}/api/host/all-books`, { headers }).catch(() => null),
          fetch(`${apiUrl}/api/host/all-bookissues`, { headers }).catch(() => null)
        ]);

        if (bookRes?.ok) setBooks(await bookRes.json() || []);
        if (issueRes?.ok) setIssues(await issueRes.json() || []);
      } catch (err) {
        console.error("Failed to load Library dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [apiUrl, token]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'catalog', label: 'Book Catalog', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'issue', label: 'Issue Book', icon: 'M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4' },
    { id: 'return', label: 'Return Book', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
    { id: 'overdue', label: 'Overdue Tracker', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'eresources', label: 'E-Resources', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' }
  ];

  /* ---------------- CALCULATIONS ---------------- */
  const calculateDaysOverdue = (dueDateStr) => {
    if (!dueDateStr) return 0;
    const due = new Date(dueDateStr);
    const today = new Date();
    const diff = today - due;
    if (diff <= 0) return 0;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  /* ---------------- MODULE: DASHBOARD ---------------- */
  const renderDashboard = () => {
    const overdueIssues = issues.filter(i => i.status === 'Issued' && calculateDaysOverdue(i.dueDate) > 0);
    const totalFine = issues.reduce((acc, curr) => acc + (curr.fine || 0), 0);
    const mostBorrowed = [...books].sort((a,b) => (b.totalCopies - b.availableCopies) - (a.totalCopies - a.availableCopies)).slice(0, 5);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Books', value: books.reduce((a,b)=>a+(b.totalCopies||0), 0), color: 'text-indigo-600' },
            { label: 'Books Checked Out', value: issues.filter(i=>i.status === 'Issued').length, color: 'text-blue-500' },
            { label: 'Current Overdue', value: overdueIssues.length, color: 'text-rose-500' },
            { label: 'Total Fines Collected', value: `₹${totalFine}`, color: 'text-emerald-500' }
          ].map((kpi, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
              <p className="text-sm font-medium text-slate-500 mb-2">{kpi.label}</p>
              <p className={`text-3xl font-black ${kpi.color}`}>{kpi.value.toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
               <h3 className="font-bold text-slate-800">Most Borrowed Books</h3>
            </div>
            <div className="p-4">
               <ul className="space-y-3">
                 {mostBorrowed.map((b, i) => (
                   <li key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-lg transition-colors">
                     <div className="flex space-x-3 items-center">
                       <div className="w-8 h-10 bg-indigo-100 rounded border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">{i+1}</div>
                       <div>
                         <p className="font-medium text-slate-800 text-sm truncate max-w-[200px]" title={b.title}>{b.title}</p>
                         <p className="text-xs text-slate-500">{b.author}</p>
                       </div>
                     </div>
                     <div className="text-right text-xs">
                       <span className="font-bold text-slate-700">{b.totalCopies - b.availableCopies}</span>
                       <span className="text-slate-400 ml-1">Issued</span>
                     </div>
                   </li>
                 ))}
                 {!mostBorrowed.length && <div className="text-center text-slate-500 py-4">No data available</div>}
               </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
               <h3 className="font-bold text-slate-800">Recent Transactions</h3>
            </div>
            <div className="divide-y divide-slate-100">
               {(issues || []).slice(0, 5).map((iss, i) => (
                 <div key={i} className="p-4 px-6 flex justify-between items-center hover:bg-slate-50">
                   <div>
                     <h4 className="font-medium text-slate-800 text-sm truncate max-w-[200px]" title={iss.bookTitle}>{iss.bookTitle}</h4>
                     <div className="text-xs text-slate-500 mt-0.5">{iss.studentName} ({iss.registerNumber})</div>
                   </div>
                   <div className="text-right">
                     <span className={`px-2 py-1 rounded text-xs font-bold ${iss.status === 'Issued' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{iss.status}</span>
                     <div className="text-xs text-slate-400 mt-1">{iss.status === 'Issued' ? iss.issueDate : iss.returnDate}</div>
                   </div>
                 </div>
               ))}
               {!issues?.length && <div className="p-8 text-center text-slate-500">No recent transactions.</div>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ---------------- MODULE: CATALOG ---------------- */
  const [bookForm, setBookForm] = useState({ title: '', author: '', isbn: '', category: 'Textbook', department: 'CSE', totalCopies: 5, publisher: '', publishYear: '', location: 'Rack 1A' });
  const [catSearch, setCatSearch] = useState('');
  
  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/api/host/add-book`, {
        method: 'POST',
        headers,
        body: JSON.stringify({...bookForm, availableCopies: bookForm.totalCopies})
      });
      if(res.ok) {
        setBooks([...books, await res.json()]);
        setBookForm({ title: '', author: '', isbn: '', category: 'Textbook', department: 'CSE', totalCopies: 5, publisher: '', publishYear: '', location: 'Rack 1A' });
        alert('Book added to catalog');
      }
    } catch(err) {}
  };

  const renderCatalog = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 cursor-pointer flex justify-between items-center text-slate-800 font-bold" onClick={() => document.getElementById('add-book-form').classList.toggle('hidden')}>
           Add New Book
           <span className="text-slate-400 text-sm font-normal">Click to toggle</span>
        </div>
        <form id="add-book-form" onSubmit={handleAddBook} className="p-6 hidden grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-200 bg-slate-50/50">
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Title</label><input required type="text" value={bookForm.title} onChange={e=>setBookForm({...bookForm, title: e.target.value})} className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 outline-none focus:border-indigo-400" /></div>
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Author</label><input required type="text" value={bookForm.author} onChange={e=>setBookForm({...bookForm, author: e.target.value})} className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 outline-none focus:border-indigo-400" /></div>
          <div><label className="block text-xs font-medium text-slate-700 mb-1">ISBN</label><input required type="text" value={bookForm.isbn} onChange={e=>setBookForm({...bookForm, isbn: e.target.value})} className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 outline-none focus:border-indigo-400" /></div>
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Category</label><select value={bookForm.category} onChange={e=>setBookForm({...bookForm, category: e.target.value})} className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 outline-none focus:border-indigo-400"><option>Textbook</option><option>Reference</option><option>Magazine</option></select></div>
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Department</label><select value={bookForm.department} onChange={e=>setBookForm({...bookForm, department: e.target.value})} className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 outline-none focus:border-indigo-400"><option>CSE</option><option>ECE</option><option>MECH</option><option>CIVIL</option><option>General</option></select></div>
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Total Copies</label><input required type="number" value={bookForm.totalCopies} onChange={e=>setBookForm({...bookForm, totalCopies: parseInt(e.target.value)})} className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 outline-none focus:border-indigo-400" /></div>
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Publisher</label><input type="text" value={bookForm.publisher} onChange={e=>setBookForm({...bookForm, publisher: e.target.value})} className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 outline-none focus:border-indigo-400" /></div>
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Publish Year</label><input type="text" value={bookForm.publishYear} onChange={e=>setBookForm({...bookForm, publishYear: e.target.value})} className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 outline-none focus:border-indigo-400" /></div>
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Location / Rack</label><input required type="text" value={bookForm.location} onChange={e=>setBookForm({...bookForm, location: e.target.value})} className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 outline-none focus:border-indigo-400" /></div>
          <div className="md:col-span-3 flex justify-end"><button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-6 py-2 transition-colors">Save Book</button></div>
        </form>

        <div className="p-4 border-b border-slate-200">
           <input type="text" placeholder="Search by Title, Author, or ISBN..." value={catSearch} onChange={e=>setCatSearch(e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-indigo-400 bg-slate-50" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate-700">Title & ISBN</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Author & Publisher</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Location</th>
                <th className="px-6 py-3 font-semibold text-slate-700 text-center">Status</th>
                <th className="px-6 py-3 font-semibold text-slate-700 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(books || []).filter(b => b.title?.toLowerCase().includes(catSearch.toLowerCase()) || b.isbn?.includes(catSearch)).map((bk, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4 truncate max-w-[250px]">
                    <div className="font-bold text-slate-800 truncate" title={bk.title}>{bk.title}</div>
                    <div className="text-xs text-slate-500 font-mono mt-1">ISBN: {bk.isbn}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-700">{bk.author}</div>
                    <div className="text-xs text-slate-500 mt-1">{bk.publisher} ({bk.publishYear})</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-700 font-medium">{bk.location}</div>
                    <div className="text-xs text-slate-500 mt-1">{bk.department} / {bk.category}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-xs font-bold text-slate-500 mb-1">{bk.availableCopies} of {bk.totalCopies} Available</div>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${bk.availableCopies > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {bk.availableCopies > 0 ? 'Available' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-center">
                    <button className="text-rose-600 hover:text-rose-800 font-medium text-sm">Delete</button>
                  </td>
                </tr>
              ))}
              {!books?.length && <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No books found in catalog.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  /* ---------------- MODULE: ISSUE BOOK ---------------- */
  const [isRoll, setIsRoll] = useState('');
  const [isStud, setIsStud] = useState({ name: 'Alex Johnson', registerNumber: 'REG2024101', department: 'CSE' });
  const [isIsbn, setIsIsbn] = useState('');
  const [isBookObj, setIsBookObj] = useState(null);
  
  const handleIssue = async (e) => {
    e.preventDefault();
    if(!isBookObj || !isStud) return;
    
    // Default due date: 14 days
    const dDate = new Date(); dDate.setDate(dDate.getDate() + 14);

    const newIssue = {
      bookId: isBookObj.id,
      bookTitle: isBookObj.title,
      isbn: isBookObj.isbn,
      studentName: isStud.name,
      registerNumber: isStud.registerNumber,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: dDate.toISOString().split('T')[0],
      fine: 0,
      status: 'Issued'
    };

    try {
      const res = await fetch(`${apiUrl}/api/host/add-bookissue`, { method: 'POST', headers, body: JSON.stringify(newIssue) });
      if(res.ok) {
        setIssues([await res.json(), ...issues]);
        alert('Book Issued successfully!');
        setIsBookObj(null); setIsIsbn(''); setIsRoll(''); setIsStud(null);
      }
    } catch(err) {}
  };

  const renderIssue = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50"><h3 className="font-bold text-slate-800">Issue Process</h3></div>
        <form onSubmit={handleIssue} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Student Roll Number</label>
            <div className="flex space-x-2">
               <input type="text" value={isRoll} onChange={e=>setIsRoll(e.target.value)} placeholder="Search and Enter..." className="flex-1 bg-slate-50 border border-slate-200 rounded px-4 py-2 outline-none focus:border-indigo-400" />
               <button type="button" onClick={() => setIsStud({ name: 'Alex Johnson', registerNumber: isRoll, department: 'CSE' })} className="bg-slate-800 text-white px-4 rounded font-medium hover:bg-slate-900 transition text-sm">Verify</button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Book ISBN / Auto-Search</label>
            <div className="flex space-x-2">
               <input type="text" value={isIsbn} onChange={e=>setIsIsbn(e.target.value)} placeholder="Scan ISBN..." className="flex-1 bg-slate-50 border border-slate-200 rounded px-4 py-2 outline-none focus:border-indigo-400" />
               <button type="button" onClick={() => {
                 const found = books.find(b => b.isbn === isIsbn || b.title.includes(isIsbn));
                 if(found) setIsBookObj(found); else alert('Book not found or matched.');
               }} className="bg-slate-800 text-white px-4 rounded font-medium hover:bg-slate-900 transition text-sm">Find</button>
            </div>
          </div>

          <button type="submit" disabled={!isStud || !isBookObj} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-lg px-6 py-3 transition-colors shadow-sm mt-4">
            Confirm Issue (14 Days)
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {isStud && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm">
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Student Verified</h4>
            <p className="font-bold text-blue-900 text-lg">{isStud.name}</p>
            <p className="text-blue-700 text-sm mt-1">{isStud.registerNumber} • {isStud.department} Dept</p>
          </div>
        )}
        {isBookObj && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 shadow-sm">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Book Selected</h4>
            <p className="font-bold text-emerald-900 text-lg">{isBookObj.title}</p>
            <p className="text-emerald-700 text-sm mt-1 mb-3">{isBookObj.author} • ISBN: {isBookObj.isbn}</p>
            <div className={`inline-block px-3 py-1 rounded text-sm font-bold ${isBookObj.availableCopies > 0 ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'}`}>
               {isBookObj.availableCopies} Copies Available in {isBookObj.location}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  /* ---------------- MODULE: RETURN BOOK ---------------- */
  const [retRoll, setRetRoll] = useState('');
  const [retStudIssues, setRetStudIssues] = useState([]);

  const searchReturn = () => {
    if(retRoll) {
       setRetStudIssues(issues.filter(i => i.registerNumber === retRoll && i.status === 'Issued'));
    }
  };

  const handleReturn = async (issueId, dOverdue) => {
    const fineAmt = dOverdue > 0 ? (dOverdue * 2) : 0;
    if(fineAmt > 0) {
      if(!window.confirm(`Collect fine of ₹${fineAmt} before returning?`)) return;
    }
    
    try {
      const target = issues.find(i => i.id === issueId);
      const res = await fetch(`${apiUrl}/api/host/update-bookissue/${issueId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({...target, status: 'Returned', returnDate: new Date().toISOString().split('T')[0], fine: fineAmt})
      });
      if(res.ok) {
         setIssues(issues.map(async i => i.id === issueId ? await res.json() : i));
         setRetStudIssues(retStudIssues.filter(i => i.id !== issueId)); // remove from local view
         alert('Book returned successfully.');
      }
    } catch(err){}
  };

  const renderReturn = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row items-end space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1 max-w-sm">
          <label className="block text-sm font-medium text-slate-700 mb-1">Search Student Register No</label>
          <div className="flex space-x-2">
            <input type="text" value={retRoll} onChange={e => setRetRoll(e.target.value)} placeholder="e.g. REG..." className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400" />
            <button onClick={searchReturn} className="bg-slate-800 hover:bg-slate-900 text-white px-4 rounded-lg font-medium transition-colors">Search</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50"><h3 className="font-bold text-slate-800">Currently Issued Books</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate-700">Book Title</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Issue / Due Date</th>
                <th className="px-6 py-3 font-semibold text-slate-700 text-center">Overdue Days</th>
                <th className="px-6 py-3 font-semibold text-slate-700 text-center">Fine (₹2/day)</th>
                <th className="px-6 py-3 font-semibold text-slate-700 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(retStudIssues || []).map((iss, idx) => {
                const daysOvd = calculateDaysOverdue(iss.dueDate);
                return (
                 <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-slate-800">{iss.bookTitle} <div className="text-xs text-slate-500 font-normal">ISBN: {iss.isbn}</div></td>
                    <td className="px-6 py-4 text-slate-600"><div>Out: {iss.issueDate}</div><div className="font-medium text-slate-800 text-xs mt-1">Due: {iss.dueDate}</div></td>
                    <td className="px-6 py-4 text-center">
                      {daysOvd > 0 ? <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded font-bold text-xs">{daysOvd} Days</span> : <span className="text-slate-400">-</span>}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-amber-600">{daysOvd > 0 ? `₹${daysOvd * 2}` : '-'}</td>
                    <td className="px-6 py-4 flex justify-center">
                       <button onClick={() => handleReturn(iss.id, daysOvd)} className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-4 py-1.5 rounded-lg font-bold transition-colors">Mark Returned</button>
                    </td>
                 </tr>
                )
              })}
              {!retStudIssues?.length && <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">Search a student to view issued books.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  /* ---------------- MODULE: OVERDUE TRACKER ---------------- */
  const renderOverdue = () => {
    const overdueList = issues.filter(i => i.status === 'Issued' && calculateDaysOverdue(i.dueDate) > 0)
                              .sort((a,b) => calculateDaysOverdue(b.dueDate) - calculateDaysOverdue(a.dueDate));
    
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
           <h3 className="font-bold text-slate-800 flex items-center"><svg className="w-5 h-5 text-rose-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Defaulter Tracker</h3>
           <div className="text-sm font-medium text-slate-600">Active Defaulters: <span className="text-rose-600 font-bold">{overdueList.length}</span></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate-700">Student & Reg No</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Book Details</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Due Date</th>
                <th className="px-6 py-3 font-semibold text-slate-700 text-center">Overdue Days</th>
                <th className="px-6 py-3 font-semibold text-slate-700 text-center">Accrued Fine</th>
                <th className="px-6 py-3 font-semibold text-slate-700 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {overdueList.map((ov, idx) => {
                 const days = calculateDaysOverdue(ov.dueDate);
                 return (
                   <tr key={idx} className="hover:bg-slate-50">
                     <td className="px-6 py-4"><div className="font-medium text-slate-800">{ov.studentName}</div><div className="text-xs text-slate-500">{ov.registerNumber}</div></td>
                     <td className="px-6 py-4"><div className="font-medium text-slate-700 truncate max-w-[150px]">{ov.bookTitle}</div></td>
                     <td className="px-6 py-4 text-slate-600 font-medium text-xs">{ov.dueDate}</td>
                     <td className="px-6 py-4 text-center"><span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded font-black text-xs">{days}</span></td>
                     <td className="px-6 py-4 text-center font-black text-slate-800">₹{days * 2}</td>
                     <td className="px-6 py-4 flex justify-center"><button className="text-blue-600 bg-blue-50 px-3 py-1 rounded hover:bg-blue-100 font-medium text-xs">Send Reminder</button></td>
                   </tr>
                 )
              })}
              {!overdueList.length && <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500 block">No overdue books at the moment. Excellent!</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  /* ---------------- RETURN PORTAL ---------------- */
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans">
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col shadow-lg md:shadow-none`}>
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h1 className="text-xl font-black text-indigo-700 tracking-tight">Library<span className="text-slate-800">Portal</span></h1>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-slate-600">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveMenu(item.id); setIsSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeMenu === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <svg className={`w-5 h-5 ${activeMenu === item.id ? 'text-indigo-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}/>
                </svg>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-200">
           <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              <span>Sign Out</span>
           </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm px-4 md:px-8 py-4 flex justify-between items-center">
           <div className="flex items-center">
             <button onClick={() => setIsSidebarOpen(true)} className="md:hidden mr-4 text-slate-500 hover:text-slate-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
             </button>
             <h2 className="text-xl font-bold text-slate-800 capitalize">{menuItems.find(m => m.id === activeMenu)?.label}</h2>
           </div>
           <div className="flex items-center space-x-4">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-bold text-slate-800">{userName}</p>
               <p className="text-xs text-slate-500">Chief Librarian</p>
             </div>
             <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border-2 border-indigo-200">
               {userName?.charAt(0) || 'L'}
             </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
           {loading ? (
              <div className="h-full flex items-center justify-center">
                 <svg className="animate-spin h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              </div>
           ) : (
              <div className="max-w-6xl mx-auto pb-12">
                 {activeMenu === 'dashboard' && renderDashboard()}
                 {activeMenu === 'catalog' && renderCatalog()}
                 {activeMenu === 'issue' && renderIssue()}
                 {activeMenu === 'return' && renderReturn()}
                 {activeMenu === 'overdue' && renderOverdue()}
                 {activeMenu === 'eresources' && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                       <div className="px-6 py-4 border-b border-slate-200 bg-slate-50"><h3 className="font-bold text-slate-800">Digital Library & E-Journals</h3></div>
                       <table className="w-full text-left text-sm whitespace-nowrap">
                         <thead className="bg-slate-50 border-b border-slate-200">
                           <tr><th className="px-6 py-3 font-semibold text-slate-700">Resource Name</th><th className="px-6 py-3 font-semibold text-slate-700">Type & Access</th><th className="px-6 py-3 font-semibold text-slate-700 text-center">Action</th></tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                           <tr className="hover:bg-slate-50">
                             <td className="px-6 py-4 font-bold text-slate-700">IEEE Xplore Digital Library</td>
                             <td className="px-6 py-4 text-slate-600">Journal <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs ml-2 font-medium">Campus Network</span></td>
                             <td className="px-6 py-4 text-center"><button onClick={()=>window.open('https://ieeexplore.ieee.org', '_blank')} className="text-blue-600 underline font-medium">Access Link</button></td>
                           </tr>
                         </tbody>
                       </table>
                    </div>
                 )}
              </div>
           )}
        </main>
      </div>
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
    </div>
  );
};

export default LibraryPortal;
