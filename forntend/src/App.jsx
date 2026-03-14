// ==========================================
// MAIN GATEKEEPER
// ==========================================
export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const HOST_EMAIL = "kvabhinanthan@gmail.com";
  const apiUrl = "https://fullstack-q3c5.onrender.com"; // Your backend URL

  const determineRole = async (email) => {
    // 1. Check for Admin/Host
    if (email.toLowerCase() === HOST_EMAIL.toLowerCase()) {
      setRole('host');
      setLoading(false);
      return;
    }
    
    try {
      // 2. Fetch BOTH Staff and Student lists from database
      const [staffRes, studentRes] = await Promise.all([
        fetch(`${apiUrl}/api/host/all-staff`),
        fetch(`${apiUrl}/api/host/all-students`)
      ]);

      let isStaff = false;
      let isStudent = false;

      // 3. Check if email exists in Staff List
      if (staffRes.ok) {
        const staffList = await staffRes.json();
        isStaff = staffList.some(s => s.email.toLowerCase() === email.toLowerCase());
      }

      // 4. Check if email exists in Student List
      if (studentRes.ok && !isStaff) {
        const studentList = await studentRes.json();
        isStudent = studentList.some(s => s.email.toLowerCase() === email.toLowerCase());
      }

      // 5. Assign appropriate role, or DENY access
      if (isStaff) {
        setRole('staff');
      } else if (isStudent) {
        setRole('student');
      } else {
        setRole('denied'); // <--- NEW: Triggers the Access Denied screen
      }
    } catch {
      setRole('denied'); // If database connection fails, deny access for safety
    }
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
    } else { 
      setLoading(false); 
    }
  }, []);

  // --- UI SCREENS ---

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
      <p className="font-bold text-slate-500 tracking-widest uppercase text-sm animate-pulse">Authenticating User...</p>
    </div>
  );

  // 1. LOGIN SCREEN
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-12 rounded-[3rem] shadow-xl text-center border border-slate-100">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white font-black text-4xl mx-auto mb-8 shadow-lg shadow-blue-600/30">C</div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">Institution Portal</h2>
          <p className="text-slate-500 mb-10 font-medium">Sign in with your registered Google account</p>
          <div className="flex justify-center scale-110">
            <GoogleLogin onSuccess={handleLogin} theme="filled_blue" shape="pill" size="large" />
          </div>
        </div>
      </div>
    );
  }

  // 2. ACCESS DENIED SCREEN
  if (role === 'denied') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-10 rounded-[2.5rem] shadow-xl text-center border border-rose-100">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 border border-rose-100">
            ⛔
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Access Denied</h2>
          <p className="text-slate-500 mb-8 font-medium leading-relaxed">
            Your email address <span className="font-bold text-slate-800">({user.email})</span> is not registered in the system. Please ask the Administrator to add you to the directory.
          </p>
          <button 
            onClick={handleLogout} 
            className="w-full bg-slate-900 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-sm"
          >
            Sign out & Try another account
          </button>
        </div>
      </div>
    );
  }

  // 3. AUTHORIZED PORTAL ROUTING
  return (
    <>
      {role === 'host' && <AdminPortal user={user} handleLogout={handleLogout} apiUrl={apiUrl} />}
      {role === 'staff' && <StaffPortal user={user} handleLogout={handleLogout} apiUrl={apiUrl} />}
      {role === 'student' && <StudentPortal user={user} handleLogout={handleLogout} apiUrl={apiUrl} />}
    </>
  );
}