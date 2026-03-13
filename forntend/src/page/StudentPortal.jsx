const StudentPortal = ({ user, handleLogout }) => {
   const portals = [
    { title: 'Dashboard', icon: '📊', desc: 'Return to the main engineering analytics and system metrics panel.', color: 'bg-blue-500' },
    { title: 'Skill Test', icon: '💻', desc: 'Practice programming MCQs and technical coding challenges.', color: 'bg-indigo-500' },
    { title: 'Academic Data', icon: '🎓', desc: 'View your overall CGPA, semester credits, and university records.', color: 'bg-emerald-500' },
    { title: 'Subjects', icon: '📚', desc: 'Access standard course materials, assignments, and NPTEL tracking.', color: 'bg-amber-500' },
    { title: 'Placement', icon: '🚀', desc: 'Track interview schedules, resume updates, and upcoming placement drives.', color: 'bg-violet-500' },
    { title: 'Leave', icon: '📅', desc: 'Apply for on-duty (OD), medical leave, or general absences.', color: 'bg-rose-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <header className="bg-white shadow-sm border-b border-slate-200 px-8 py-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-inner">
            C
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Central<span className="text-blue-600">Portal</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            {/* Displaying the ACTUAL name from Google! */}
            <p className="text-sm font-bold text-slate-700">{user.name}</p>
            <p className="text-xs text-slate-500 font-medium">{user.email}</p>
          </div>
          {/* Displaying the ACTUAL profile picture from Google! */}
          <img 
            src={user.picture} 
            alt="Profile" 
            className="w-10 h-10 rounded-full border-2 border-slate-200 shadow-sm"
          />
          <button 
            onClick={handleLogout}
            className="text-sm font-semibold text-rose-500 hover:text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors ml-2"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 md:py-20 animate-in fade-in duration-500 slide-in-from-bottom-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">
            Welcome to your Workspace, {user.given_name}
          </h2>
          <p className="text-slate-500 mt-3 font-medium text-lg">
            Select a module below to access your tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portals.map((portal, index) => (
            <a key={index} href="#" className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group block">
              <div className={`w-16 h-16 ${portal.color} rounded-2xl flex items-center justify-center text-3xl shadow-inner mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {portal.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                {portal.title}
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                {portal.desc}
              </p>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}

// ==========================================
// MAIN GATEKEEPER
// ==========================================
export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const HOST_EMAIL = "kvabhinanthan@gmail.com";

  const determineRole = async (email) => {
    if (email.toLowerCase() === HOST_EMAIL.toLowerCase()) {
      setRole('host');
      setLoading(false);
      return;
    }
    try {
      // Check database for Staff
      const res = await fetch("https://fullstack-q3c5.onrender.com/api/host/all-staff");
      if (res.ok) {
        const staffList = await res.json();
        const isStaff = staffList.some(s => s.email.toLowerCase() === email.toLowerCase());
        setRole(isStaff ? 'staff' : 'student');
      } else { setRole('student'); }
    } catch { setRole('student'); }
    setLoading(false);
  };

  const handleLogin = (response) => {
    const decoded = jwtDecode(response.credential);
    setUser(decoded);
    localStorage.setItem("user", JSON.stringify(decoded));
    determineRole(decoded.email);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      const u = JSON.parse(saved);
      setUser(u);
      determineRole(u.email);
    } else { setLoading(false); }
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-slate-400 animate-pulse">Synchronizing Data...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-12 rounded-[3rem] shadow-2xl text-center border">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white font-black text-4xl mx-auto mb-8 shadow-lg">C</div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">Institution Portal</h2>
          <p className="text-slate-500 mb-10">Sign in with Google to continue</p>
          <div className="flex justify-center scale-110">
            <GoogleLogin onSuccess={handleLogin} theme="filled_blue" shape="pill" size="large" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {role === 'host' && <HostPortal user={user} handleLogout={handleLogout} />}
      {role === 'staff' && <StaffPortal user={user} handleLogout={handleLogout} />}
      {role === 'student' && <StudentPortal user={user} handleLogout={handleLogout} />}
    </>
  );
}