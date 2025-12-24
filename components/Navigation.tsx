import React from 'react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: 'victim' | 'official';
  onRoleSwitch: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, userRole, onRoleSwitch }) => {
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
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 w-11 h-11 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <i className="fa-solid fa-scale-balanced text-white text-lg"></i>
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-slate-900 block leading-none">JUSTICESTREAM</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">Gov of India Portal</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center bg-slate-100 p-1.5 rounded-2xl gap-1">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
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
            <button 
              onClick={onRoleSwitch}
              className="group relative flex items-center gap-3 bg-slate-900 text-white px-5 py-2.5 rounded-2xl transition-all hover:bg-slate-800 shadow-xl shadow-slate-200"
            >
              <div className="flex flex-col items-start">
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Active Portal</span>
                <span className="text-xs font-bold leading-none">{userRole === 'victim' ? 'Victim Access' : 'Official Portal'}</span>
              </div>
              <i className="fa-solid fa-right-left text-[10px] text-slate-500 group-hover:text-white transition-colors"></i>
            </button>
            
            <div className="hidden sm:flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-tighter">System ID</span>
                <span className="text-xs font-black text-slate-900 block">AD-2024-X9</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userRole}`} alt="avatar" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;