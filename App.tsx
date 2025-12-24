
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import ApplicationForm from './components/ApplicationForm';
import VictimDashboard from './components/VictimDashboard';
import OfficialDashboard from './components/OfficialDashboard';
import OfficerVerificationView from './components/OfficerVerificationView';
import GrievanceRedressal from './components/GrievanceRedressal';
import { Beneficiary, ApplicationStatus, CaseType } from './types';

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
  const [userRole, setUserRole] = useState<'victim' | 'official'>('victim');
  const [apps, setApps] = useState<Beneficiary[]>(INITIAL_APPS);
  const [notifications, setNotifications] = useState<{id: number, msg: string}[]>([]);
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsGlobalLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const addNotification = (msg: string) => {
    const id = Date.now();
    setNotifications(prev => [{id, msg}, ...prev].slice(0, 5));
    setTimeout(() => setNotifications(prev => prev.filter(m => m.id !== id)), 5000);
  };

  const handleApply = (newApp: any) => {
    setApps(prev => [newApp, ...prev]);
    addNotification("Application Lodged! Ref: " + newApp.id);
    setActiveTab('status');
  };

  const handleUpdateStatus = (id: string, status: ApplicationStatus) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    addNotification(`Status Change: ${id} is now ${status}`);
  };

  if (isGlobalLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
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

  return (
    <div className="min-h-screen bg-slate-50 pb-24 selection:bg-indigo-100 font-sans">
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        userRole={userRole}
        onRoleSwitch={() => {
          setIsGlobalLoading(true);
          setUserRole(prev => prev === 'official' ? 'victim' : 'official');
          setActiveTab('dashboard');
          setTimeout(() => setIsGlobalLoading(false), 800);
        }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12">
        <div className="fixed top-24 right-6 z-[100] flex flex-col gap-4">
          {notifications.map((n) => (
            <div key={n.id} className="bg-slate-900/95 backdrop-blur-xl text-white px-8 py-5 rounded-3xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] animate-slideInRight flex items-center gap-5 border border-slate-700/50 max-w-sm">
              <div className="bg-indigo-600 w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
                <i className="fa-solid fa-bell text-sm"></i>
              </div>
              <p className="text-xs font-black uppercase tracking-tight leading-relaxed">{n.msg}</p>
            </div>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          userRole === 'victim' ? (
            <VictimDashboard 
              myApplications={apps.filter(a => a.name === 'Rajesh Kumar' || a.id.startsWith('BT-'))} 
              onNavigate={setActiveTab} 
            />
          ) : (
            <OfficialDashboard apps={apps} onNavigate={setActiveTab} />
          )
        )}

        {activeTab === 'apply' && <ApplicationForm onSubmit={handleApply} />}

        {activeTab === 'status' && (
          <div className="max-w-4xl mx-auto space-y-12">
            <header className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
                <i className="fa-solid fa-tower-broadcast animate-pulse"></i>
                Live Tracking Active
              </div>
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Your Case Journey</h2>
              <p className="text-slate-500 font-medium">Transparent, end-to-end monitoring of your relief application.</p>
            </header>
            
            <div className="space-y-8">
              {apps.filter(a => userRole === 'official' || a.name === 'Rajesh Kumar' || a.id.length < 15).map(app => (
                <div key={app.id} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200 hover:border-indigo-300 transition-all hover:shadow-xl hover:shadow-indigo-500/5 group">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-400 transition-colors">
                        <i className="fa-solid fa-folder-open text-2xl"></i>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">{app.id}</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">FILED {app.appliedDate}</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">{app.caseType}</h3>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-[2rem] text-right shrink-0 border border-slate-100 group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-200">Total Sanction</p>
                      <p className="text-3xl font-black text-indigo-600 tracking-tighter group-hover:text-white transition-colors">₹{app.amount.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="relative pt-8 px-6 pb-2">
                    <div className="flex justify-between relative z-10">
                      {['Applied', 'Verified', 'Sanctioned', 'Settled'].map((step, idx) => {
                        const isComplete = (idx === 0) || 
                                         (idx === 1 && ![ApplicationStatus.PENDING].includes(app.status)) ||
                                         (idx === 2 && [ApplicationStatus.SANCTIONED, ApplicationStatus.DISBURSED].includes(app.status)) ||
                                         (idx === 3 && app.status === ApplicationStatus.DISBURSED);
                        return (
                          <div key={step} className="flex flex-col items-center">
                            <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center text-sm font-bold border-2 transition-all duration-700 shadow-sm ${
                              isComplete ? 'bg-indigo-600 border-indigo-600 text-white rotate-[15deg] scale-110 shadow-xl shadow-indigo-200' : 'bg-white border-slate-100 text-slate-200'
                            }`}>
                              {isComplete ? <i className="fa-solid fa-check"></i> : idx + 1}
                            </div>
                            <span className={`text-[10px] mt-6 font-black uppercase tracking-[0.1em] ${isComplete ? 'text-indigo-600' : 'text-slate-300'}`}>
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="absolute top-[36px] left-14 right-14 h-1.5 bg-slate-50 -z-0 rounded-full"></div>
                    <div 
                      className="absolute top-[36px] left-14 h-1.5 bg-indigo-600 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-full shadow-[0_0_15px_rgba(79,70,229,0.3)]" 
                      style={{ width: app.status === ApplicationStatus.DISBURSED ? 'calc(100% - 112px)' : app.status === ApplicationStatus.SANCTIONED ? '66%' : app.status === ApplicationStatus.PENDING ? '0%' : '33%'}}
                    ></div>
                  </div>
                  
                  {app.status === ApplicationStatus.DISBURSED && (
                    <div className="mt-12 p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center justify-between animate-fadeIn">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                           <i className="fa-solid fa-shield-heart"></i>
                         </div>
                         <div>
                           <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Payment Settled</p>
                           <p className="text-xs font-bold text-slate-600">Funds transferred via PFMS gateway on {app.appliedDate}</p>
                         </div>
                       </div>
                       <button className="text-xs font-black text-emerald-700 uppercase tracking-widest hover:underline">Download Reciept</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'verifications' && (
          <OfficerVerificationView 
            applications={apps.filter(a => [ApplicationStatus.PENDING, ApplicationStatus.SANCTIONED].includes(a.status))} 
            onAction={handleUpdateStatus} 
          />
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
