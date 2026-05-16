import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';

// Import All Portals
import LoginPage from './page/LoginPage';
import AdminPortal from './page/AdminPortal';
import StaffPortal from './page/StaffPortal';
import StudentPortal from './page/StudentPortal';
import ParentPortal from './page/ParentPortal';
import COEPortal from './page/COEPortal';
import FinancePortal from './page/FinancePortal';
import HostelPortal from './page/HostelPortal';
import LibraryPortal from './page/LibraryPortal';
import PlacementPortal from './page/PlacementPortal';
import StaffAdminPortal from './page/StaffAdminPortal';

export default function App() {
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loggedInEmail, setLoggedInEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [linkedId, setLinkedId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use the local backend or deployed backend
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080"; // Fallback to 8080. VITE_API_URL to be set in Vercel
  useEffect(() => {
    // Check if the user is already logged in
    const savedToken = localStorage.getItem('erp_token');
    const savedRole = localStorage.getItem('erp_role');
    const savedEmail = localStorage.getItem('erp_email');
    const savedName = localStorage.getItem('erp_name');

    if (savedToken && savedRole) {
      setToken(savedToken);
      setRole(savedRole);
      setLoggedInEmail(savedEmail);
      setUserName(savedName);
      setLinkedId(localStorage.getItem('erp_linked_id'));
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (userRole) => {
    setToken(localStorage.getItem('erp_token'));
    setRole(userRole);
    setLoggedInEmail(localStorage.getItem('erp_email'));
    setUserName(localStorage.getItem('erp_name'));
    setLinkedId(localStorage.getItem('erp_linked_id'));
  };

  const handleLogout = () => {
    localStorage.removeItem('erp_token');
    localStorage.removeItem('erp_role');
    localStorage.removeItem('erp_email');
    localStorage.removeItem('erp_name');
    setRole(null);
    setToken(null);
    setLoggedInEmail(null);
    setUserName(null);
    setLinkedId(null);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Common props distributed to all authenticated portals
  const portalProps = {
    handleLogout,
    apiUrl,
    loggedInEmail,
    token,
    userName,
    linkedId
  };

  if (!role || !token) {
    return <LoginPage apiUrl={apiUrl} onLoginSuccess={handleLoginSuccess} />;
  }

  // --- ROUTER LOGIC ---
  const renderPortal = () => {
    // Standardize role by removing ROLE_ prefix if present
    const normalizedRole = role?.toUpperCase().replace('ROLE_', '');

    switch (normalizedRole) {
      case 'ADMIN':
        return <AdminPortal {...portalProps} />;
      case 'STAFF':
        return <StaffPortal {...portalProps} />;
      case 'STUDENT':
        return <StudentPortal {...portalProps} />;
      case 'PARENT':
        return <ParentPortal {...portalProps} />;
      case 'COE':
        return <COEPortal {...portalProps} />;
      case 'FINANCE':
        return <FinancePortal {...portalProps} />;
      case 'WARDEN':
        return <HostelPortal {...portalProps} />;
      case 'LIBRARIAN':
        return <LibraryPortal {...portalProps} />;
      case 'PLACEMENT':
        return <PlacementPortal {...portalProps} />;
      case 'STAFFADMIN':
        return <StaffAdminPortal {...portalProps} />;
      default:
        return (
          <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-200">
            <div className="bg-white dark:bg-gray-800 max-w-md w-full p-10 rounded-[2.5rem] shadow-xl text-center border border-rose-100 dark:border-rose-900/50">
              <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">⛔</div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Invalid Role Configured</h2>
              <p className="text-slate-500 dark:text-gray-400 mb-8 text-sm leading-relaxed">
                The role <span className="font-bold text-slate-900 dark:text-gray-200">{role}</span> is not mapped to any portal.
              </p>
              <button onClick={handleLogout} className="w-full bg-slate-900 dark:bg-rose-600 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-rose-700 transition-all shadow-sm">Back to Login</button>
            </div>
          </div>
        );
    }
  };

  return (
    <ThemeProvider>
      {renderPortal()}
    </ThemeProvider>
  );
}