import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

// --- PLACEHOLDERS FOR YOUR NEW PAGES ---
// (We will create these files in the /pages folder next)
const Dashboard = () => <div className="p-10"><h1>Dashboard Page</h1><Link to="/" className="text-blue-500 underline">Back to Home</Link></div>;
const SkillTest = () => <div className="p-10"><h1>Skill Test Page</h1><Link to="/" className="text-blue-500 underline">Back to Home</Link></div>;
const AcademicData = () => <div className="p-10"><h1>Academic Data Page</h1><Link to="/" className="text-blue-500 underline">Back to Home</Link></div>;
const Subjects = () => <div className="p-10"><h1>Subjects Page</h1><Link to="/" className="text-blue-500 underline">Back to Home</Link></div>;
const Placement = () => <div className="p-10"><h1>Placement Page</h1><Link to="/" className="text-blue-500 underline">Back to Home</Link></div>;
const Leave = () => <div className="p-10"><h1>Leave Portal</h1><Link to="/" className="text-blue-500 underline">Back to Home</Link></div>;

function App() {
  const [user, setUser] = useState(null);
  const [backendMessage, setBackendMessage] = useState("");

  // 1. Check if user is already logged in (Local Storage)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // 2. Fetch connection status from your Render Backend
  useEffect(() => {
    if (user) {
      fetch("https://fullstack-q3c5.onrender.com/api/status")
        .then(res => res.json())
        .then(data => setBackendMessage(data.message))
        .catch(err => console.error("Backend offline", err));
    }
  }, [user]);

  const handleLogin = () => {
    // Simulated Google Login for now
    const mockUser = { name: "Abinandhan", email: "abi@example.com" };
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const portals = [
    { id: 'dashboard', title: 'Dashboard', icon: '📊', color: 'bg-blue-500' },
    { id: 'skill-test', title: 'Skill Test', icon: '🧠', color: 'bg-purple-500' },
    { id: 'academic-data', title: 'Academic Data', icon: '🎓', color: 'bg-emerald-500' },
    { id: 'subjects', title: 'Subjects', icon: '📚', color: 'bg-orange-500' },
    { id: 'placement', title: 'Placement', icon: '💼', color: 'bg-indigo-500' },
    { id: 'leave', title: 'Leave', icon: '📝', color: 'bg-rose-500' },
  ];

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans">
        {!user ? (
          // --- LOGIN SCREEN ---
          <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
            <h1 className="text-5xl font-black mb-4">CENTRAL PORTAL</h1>
            <p className="mb-8 opacity-80 text-lg">Engineering Student Gateway</p>
            <button 
              onClick={handleLogin}
              className="bg-white text-indigo-600 px-8 py-4 rounded-full font-bold shadow-2xl hover:scale-105 transition-transform"
            >
              Sign in with Google
            </button>
          </div>
        ) : (
          // --- MAIN APP CONTENT ---
          <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <header className="flex justify-between items-center mb-10">
              <div>
                <h1 className="text-3xl font-black text-slate-900">CENTRAL PORTAL</h1>
                <p className="text-slate-500">Welcome back, {user.name}!</p>
              </div>
              <button onClick={handleLogout} className="text-slate-400 hover:text-rose-500 transition-colors">Logout</button>
            </header>

            {/* Backend Connection Success Banner */}
            {backendMessage && (
              <div className="bg-emerald-100 border border-emerald-200 text-emerald-800 p-4 rounded-2xl mb-8 text-center font-bold">
                ✅ {backendMessage}
              </div>
            )}

            <Routes>
              {/* Home Grid View */}
              <Route path="/" element={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {portals.map((portal) => (
                    <Link to={`/${portal.id}`} key={portal.id} className="group transition-all hover:-translate-y-2">
                      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center">
                        <div className={`${portal.color} w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-lg shadow-blue-200`}>
                          {portal.icon}
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">{portal.title}</h2>
                        <p className="text-slate-400 mt-2 text-sm leading-relaxed">Enter the {portal.title} workspace to manage your data.</p>
                      </div>
                    </Link>
                  ))}
                </div>
              } />

              {/* Individual Portal Pages */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/skill-test" element={<SkillTest />} />
              <Route path="/academic-data" element={<AcademicData />} />
              <Route path="/subjects" element={<Subjects />} />
              <Route path="/placement" element={<Placement />} />
              <Route path="/leave" element={<Leave />} />
            </Routes>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;