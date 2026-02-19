
import React, { useState, useEffect } from 'react';
import Navigation from './src/components/Navigation';
import ApplicationForm from './src/components/ApplicationForm';
import VictimDashboard from './src/components/VictimDashboard';
import OfficialDashboard from './src/components/OfficialDashboard';
import OfficerVerificationView from './src/components/OfficerVerificationView';
import GrievanceRedressal from './src/components/GrievanceRedressal';
import TrackPage from './src/components/TrackPage';
import Login from './src/components/Login';
import { Beneficiary, ApplicationStatus, CaseType } from './types';
import { api } from './src/services/api';
import './index.css';

const INITIAL_APPS: Beneficiary[] = [
  { 
    id: 'BT-101', 
    name: 'Rajesh Kumar', 
    aadhaar: '456789012345', 
    phone: '9876543210', 
    caseType: CaseType.POA_ACT, 
    status: ApplicationStatus.PENDING, 
    amount: 82500, 
    appliedDate: '2024-05-12', 
    bankAccount: '3045678912', 
    ifsc: 'SBIN0001', 
    firNumber: 'FIR/2024/22', 
    statement: 'Physical assault and denial of access to community water source by members of local dominant community.',
    aiVerification: { isVerified: true, score: 94, remarks: "High semantic alignment with CCTNS FIR narrative.", matchedFields: ["Identity", "Incident Date", "Statute Section"] }
  },
  { 
    id: 'BT-102', 
    name: 'Sunita Meena', 
    aadhaar: '112233445566', 
    phone: '9123456789', 
    caseType: CaseType.INTERCASTE_MARRIAGE, 
    status: ApplicationStatus.PENDING, 
    amount: 250000, 
    appliedDate: '2024-05-14', 
    bankAccount: '9988776655', 
    ifsc: 'HDFC0001', 
    firNumber: '', 
    statement: 'Applying for incentive grant following legal marriage ceremony on 10th March 2024.',
    aiVerification: { isVerified: true, score: 88, remarks: "Marriage certificate records verified against municipal database.", matchedFields: ["Spouse Aadhaar", "Date of Marriage"] }
  },
  { 
    id: 'BT-103', 
    name: 'Anil Paswan', 
    aadhaar: '778899001122', 
    phone: '8877665544', 
    caseType: CaseType.POA_ACT, 
    status: ApplicationStatus.DISBURSED, 
    amount: 120000, 
    appliedDate: '2024-04-20', 
    bankAccount: '1122334455', 
    ifsc: 'ICIC0001', 
    firNumber: 'FIR/2024/09',
    aiVerification: { isVerified: false, score: 42, remarks: "Flagged: Semantic mismatch between FIR sections and victim narrative.", matchedFields: ["Identity"] }
  },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'victim' | 'official'>('victim');
  const [apps, setApps] = useState<Beneficiary[]>([]);
  const [notifications, setNotifications] = useState<{id: number, msg: string}[]>([]);
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);
  const [isLoadingApps, setIsLoadingApps] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role || 'victim');
        setIsAuthenticated(true);
      } catch (e) {
        api.logout();
      }
    }
    setIsGlobalLoading(false);
  }, []);

  // Load applications when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadApplications();
    }
  }, [isAuthenticated]);

  const loadApplications = async () => {
    try {
      setIsLoadingApps(true);
      const result = await api.getApplications();
      setApps(result.applications || []);
    } catch (error: unknown) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Failed to load applications:', error);
      }
      // If auth fails, logout
      const errorMessage = error instanceof Error ? error.message : '';
      if (errorMessage.includes('401') || errorMessage.includes('token')) {
        api.logout();
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoadingApps(false);
    }
  };

  const addNotification = (msg: string) => {
    const id = Date.now();
    setNotifications(prev => [{id, msg}, ...prev].slice(0, 5));
    setTimeout(() => setNotifications(prev => prev.filter(m => m.id !== id)), 5000);
  };

  const handleApply = async (newApp: any) => {
    try {
      setApps(prev => [newApp, ...prev]);
      addNotification("Application Lodged! Ref: " + newApp.id);
      setActiveTab('status');
      // Reload applications to get fresh data
      await loadApplications();
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Failed to handle application:', error);
      }
    }
  };

  const handleUpdateStatus = async (id: string, status: ApplicationStatus) => {
    try {
      await api.updateApplicationStatus(id, status);
      setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      addNotification(`Status Change: ${id} is now ${status}`);
      // Reload applications to get fresh data
      await loadApplications();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Failed to update status:', error);
      }
      alert('Failed to update status: ' + errorMessage);
    }
  };

  const handleLogin = (role: 'victim' | 'official') => {
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    api.logout();
    setIsAuthenticated(false);
    setActiveTab('dashboard');
    setApps([]);
  };

  if (isGlobalLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-[2rem] border-4 border-indigo-500/20 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <i className="fa-solid fa-scale-balanced text-indigo-500 text-3xl animate-pulse"></i>
          </div>
        </div>
        <p className="text-white font-black uppercase tracking-[0.3em] mt-8 text-xs animate-pulse">Syncing Secure Nodes</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 selection:bg-indigo-100 font-sans">
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        userRole={userRole}
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="fixed top-20 sm:top-24 right-4 sm:right-6 z-[100] flex flex-col gap-4 w-full max-w-sm">
          {notifications.map((n) => (
            <div key={n.id} className="bg-slate-900/95 backdrop-blur-xl text-white px-6 py-4 sm:px-8 sm:py-5 rounded-3xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] animate-slideInRight flex items-center gap-4 border border-slate-700/50">
              <div className="bg-indigo-600 w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
                <i className="fa-solid fa-bell text-sm"></i>
              </div>
              <p className="text-xs font-black uppercase tracking-tight leading-relaxed">{n.msg}</p>
            </div>
          ))}
        </div>

        {isLoadingApps ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 font-bold">Loading applications...</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              userRole === 'victim' ? (
                <VictimDashboard 
                  myApplications={apps} 
                  onNavigate={setActiveTab} 
                />
              ) : (
                <OfficialDashboard apps={apps} onNavigate={setActiveTab} />
              )
            )}

            {activeTab === 'apply' && <ApplicationForm onSubmit={handleApply} />}

            {activeTab === 'status' && (
              <TrackPage 
                applications={apps}
                userRole={userRole}
              />
            )}

            {activeTab === 'verifications' && (
              <OfficerVerificationView 
                applications={apps.filter(a => [ApplicationStatus.PENDING, ApplicationStatus.SANCTIONED].includes(a.status))} 
                onAction={handleUpdateStatus} 
              />
            )}
          </>
        )}

        {activeTab === 'grievances' && <GrievanceRedressal />}

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); } }
        .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slideInRight { animation: slideInRight 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 20px; }
        body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
      `}} />
    </div>
  );
};

export default App;
