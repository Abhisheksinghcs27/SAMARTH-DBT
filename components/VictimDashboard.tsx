import React from 'react';
import { Beneficiary, ApplicationStatus } from '../types';
import AILegalAssistant from './AILegalAssistant';

interface VictimDashboardProps {
  myApplications: Beneficiary[];
  onNavigate: (tab: string) => void;
}

const VictimDashboard: React.FC<VictimDashboardProps> = ({ myApplications, onNavigate }) => {
  const activeApp = myApplications[0];

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Hero Section */}
      <header className="bg-slate-900 p-10 md:p-16 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 bg-indigo-500/10 text-indigo-300 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 backdrop-blur-xl border border-indigo-500/20">
              <i className="fa-solid fa-fingerprint text-[10px]"></i>
              Secure Identity Match
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.05] mb-6">
              Welcome back,<br/> 
              <span className="text-indigo-400">{activeApp?.name || 'Beneficiary'}</span>
            </h2>
            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed opacity-90">
              Access your Direct Benefit Transfer status and receive expert legal guidance in real-time.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <button 
              onClick={() => onNavigate('apply')}
              className="bg-indigo-600 text-white px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/40 hover:bg-indigo-500 hover:-translate-y-1 transition-all active:scale-95"
            >
              Start New Claim
            </button>
            <button 
              onClick={() => onNavigate('status')}
              className="bg-white/5 text-white px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] backdrop-blur-md hover:bg-white/10 transition-all active:scale-95 border border-white/10"
            >
              Track Case
            </button>
          </div>
        </div>
        <div className="absolute top-[-40px] right-[-40px] opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-1000 pointer-events-none">
          <i className="fa-solid fa-scale-balanced text-[24rem] rotate-12"></i>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Core Application Pulse & Quick Actions */}
        <div className="lg:col-span-7 space-y-10">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200/60 shadow-xl shadow-slate-200/50 relative group">
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                  <i className="fa-solid fa-bolt-lightning text-sm animate-pulse"></i>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Pulse</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Real-time DBT Monitoring</p>
                </div>
              </div>
              <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-2.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">System Online</span>
              </div>
            </div>

            {activeApp ? (
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50/80 p-8 rounded-[2rem] border border-slate-100 gap-8">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
                      <i className="fa-solid fa-file-shield text-2xl"></i>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-indigo-600/50 uppercase tracking-[0.2em] block mb-1">{activeApp.id}</span>
                      <p className="font-black text-slate-900 text-xl tracking-tight">{activeApp.caseType}</p>
                    </div>
                  </div>
                  <div className="text-left md:text-right border-l md:border-l-0 md:border-r border-slate-200 pl-6 md:pl-0 md:pr-8 py-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Approved Amount</p>
                    <p className="text-4xl font-black text-slate-900 tracking-tighter">₹{activeApp.amount.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="relative pt-6 pb-2 px-4">
                  <div className="flex justify-between relative z-10">
                    {['Draft', 'Checks', 'Approved', 'Paid'].map((step, i) => {
                      const isDone = i <= (activeApp.status === ApplicationStatus.DISBURSED ? 3 : activeApp.status === ApplicationStatus.SANCTIONED ? 2 : activeApp.status === ApplicationStatus.PENDING ? 0 : 1);
                      return (
                        <div key={step} className="flex flex-col items-center">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xs font-bold border-2 transition-all duration-700 ${isDone ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white border-slate-200 text-slate-300'}`}>
                            {isDone ? <i className="fa-solid fa-check text-sm"></i> : i + 1}
                          </div>
                          <span className={`text-[10px] mt-5 font-black uppercase tracking-[0.15em] ${isDone ? 'text-indigo-600' : 'text-slate-300'}`}>{step}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="absolute top-[34px] left-[50px] right-[50px] h-1 bg-slate-100 -z-0 rounded-full"></div>
                  <div 
                    className="absolute top-[34px] left-[50px] h-1 bg-indigo-600 transition-all duration-1000 -z-0 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                    style={{ width: activeApp.status === ApplicationStatus.DISBURSED ? 'calc(100% - 100px)' : activeApp.status === ApplicationStatus.SANCTIONED ? '66%' : activeApp.status === ApplicationStatus.PENDING ? '0%' : '33%'}}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="text-center py-24 bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm border border-slate-100">
                  <i className="fa-solid fa-inbox text-slate-200 text-4xl"></i>
                </div>
                <p className="font-black text-slate-400 text-xl uppercase tracking-tighter">No active dossiers found</p>
                <button onClick={() => onNavigate('apply')} className="mt-8 bg-slate-900 text-white px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all hover:bg-slate-800">Initiate First Claim</button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-indigo-600 p-10 rounded-[3rem] text-white group cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-2 transition-all duration-500" onClick={() => onNavigate('apply')}>
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform backdrop-blur-xl border border-white/20">
                <i className="fa-solid fa-plus-circle text-2xl"></i>
              </div>
              <h4 className="text-2xl font-black tracking-tight mb-3">Claim Incentives</h4>
              <p className="text-indigo-100/80 text-base font-medium leading-relaxed">Fast-track your application for Inter-caste marriage incentives or PCR relief.</p>
            </div>
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 group cursor-pointer hover:border-amber-400/50 hover:shadow-2xl hover:shadow-slate-200 hover:-translate-y-2 transition-all duration-500" onClick={() => onNavigate('grievances')}>
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-8 text-amber-500 group-hover:scale-110 group-hover:-rotate-6 transition-transform border border-amber-100 shadow-sm">
                <i className="fa-solid fa-headset text-2xl"></i>
              </div>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-3">Need Support?</h4>
              <p className="text-slate-500 text-base font-medium leading-relaxed">Connect with nodal officers to resolve application delays or technical hurdles.</p>
            </div>
          </div>
        </div>

        {/* Right Column: AI Assistant & Resources (Span 5) */}
        <div className="lg:col-span-5 space-y-10">
          
          {/* Prominent AI Assistant */}
          <AILegalAssistant />
          
          {/* Legal Resources and Emergency Support - Adjacent Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Legal Guide Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col">
              <h3 className="font-black text-slate-900 text-[10px] mb-6 flex items-center gap-2 uppercase tracking-[0.2em]">
                <i className="fa-solid fa-bookmark text-indigo-600"></i>
                Statutes
              </h3>
              <div className="space-y-4 flex-1">
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all group cursor-help">
                  <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-1 group-hover:text-indigo-600 transition-colors">PCR Act '55</p>
                  <p className="text-[11px] text-slate-500 font-medium leading-snug">Public institutional equality mandate.</p>
                </div>
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all group cursor-help">
                  <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-1 group-hover:text-indigo-600 transition-colors">PoA Act '89</p>
                  <p className="text-[11px] text-slate-500 font-medium leading-snug">Atrocity relief & specialized courts.</p>
                </div>
              </div>
              <button className="w-full text-[9px] font-black text-indigo-600 uppercase tracking-widest py-3 rounded-xl hover:bg-indigo-50 transition-colors mt-4 border border-indigo-100">Full Library</button>
            </div>

            {/* Emergency Support Card */}
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group flex flex-col">
              <div className="relative z-10 flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <i className="fa-solid fa-phone-flip text-xs"></i>
                  </div>
                  <h3 className="font-black text-[10px] tracking-widest uppercase">Emergency</h3>
                </div>
                <div className="space-y-4">
                  <div className="pb-3 border-b border-slate-800">
                    <span className="text-[9px] text-slate-500 font-bold uppercase block mb-1">National Toll-Free</span>
                    <span className="text-xl font-black text-indigo-400 tracking-tighter">14566</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Police Direct</span>
                    <span className="text-xl font-black text-indigo-400 tracking-tighter">112</span>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-[-20px] left-[-20px] opacity-[0.05] group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
                <i className="fa-solid fa-life-ring text-[8rem]"></i>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default VictimDashboard;