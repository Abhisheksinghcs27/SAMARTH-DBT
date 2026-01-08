import React, { useState } from 'react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: 'victim' | 'official';
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, userRole, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-house' },
    ...(userRole === 'victim' ? [
      { id: 'apply', label: 'Apply', icon: 'fa-file-signature' },
      { id: 'status', label: 'Track', icon: 'fa-location-crosshairs' }
    ] : [
      { id: 'verifications', label: 'Review Queue', icon: 'fa-list-check' }
    ]),
    { id: 'grievances', label: 'Support', icon: 'fa-headset' }
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 w-11 h-11 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <i className="fa-solid fa-scale-balanced text-white text-lg"></i>
            </div>
            <div onClick={() => onTabChange('dashboard')} className="cursor-pointer">
              <span className="font-black text-xl tracking-tight text-slate-900 block leading-none">SAMARTH</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">Gov of India Portal</span>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center bg-slate-100 p-1.5 rounded-2xl gap-1">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                }`}
              >
                <i className={`fa-solid ${tab.icon} text-[10px]`}></i>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex flex-col items-start">
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Active Portal</span>
                <span className="text-xs font-bold leading-none">{userRole === 'victim' ? 'Victim Access' : 'Official Portal'}</span>
              </div>
            </div>
            
            <button 
              onClick={onLogout}
              className="hidden sm:flex items-center gap-3 bg-slate-900 text-white px-5 py-2.5 rounded-2xl transition-all hover:bg-slate-800 shadow-xl shadow-slate-200 cursor-pointer"
            >
              <i className="fa-solid fa-right-from-bracket text-[10px] text-slate-500 group-hover:text-white transition-colors"></i>
              Logout
            </button>
            
            <div className="hidden lg:flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-tighter">System ID</span>
                <span className="text-xs font-black text-slate-900 block">AD-2024-X9</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden cursor-pointer">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userRole}`} alt="avatar" />
              </div>
            </div>

            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 cursor-pointer"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <i className="fa-solid fa-times h-6 w-6"></i>
                ) : (
                  <i className="fa-solid fa-bars h-6 w-6"></i>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-white shadow-lg`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id)
                setIsMobileMenuOpen(false)
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-3 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <i className={`fa-solid ${tab.icon} w-4`}></i>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="border-t border-slate-200 px-2 py-3 space-y-2">
            <div className="px-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden cursor-pointer">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userRole}`} alt="avatar" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-bold leading-none">{userRole === 'victim' ? 'Victim Access' : 'Official Portal'}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-tighter">AD-2024-X9</span>
              </div>
            </div>
          <button
            onClick={() => {
              onLogout()
              setIsMobileMenuOpen(false)
            }}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-3 cursor-pointer text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            <i className="fa-solid fa-right-from-bracket w-4"></i>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;