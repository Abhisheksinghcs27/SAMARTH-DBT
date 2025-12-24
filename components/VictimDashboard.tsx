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
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <header className="bg-slate-900 p-10 md:p-14 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] mb-6 backdrop-blur-md border border-indigo-500/20">
              <i className="fa-solid fa-shield-halved text-[8px]"></i>
              Secure Identity Match
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[1.1]">Welcome back,<br/> {activeApp?.name || 'Beneficiary'}</h2>
            <p className="text-slate-400 mt-4 text-base md:text-lg font-medium leading-relaxed opacity-80">Your portal for direct financial relief and legal guidance under the PCR and PoA Acts.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => onNavigate('apply')}
              className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all active:scale-95"
            >
              New Claim
            </button>
            <button 
              onClick={() => onNavigate('status')}
              className="bg-white/10 text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider backdrop-blur-md hover:bg-white/20 transition-all active:scale-95 border border-white/10"
            >
              Track Progress
            </button>
          </div>
        </div>
        <div className="absolute top-[-50px] right-[-50px] opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-1000">
          <i className="fa-solid fa-scale-balanced text-[20rem] rotate-12"></i>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Case Updates & Actions */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-slate-200/60 shadow-sm relative group">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <i className="fa-solid fa-tower-broadcast text-xs animate-pulse"></i>
                </div>
                Application Pulse
              </h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Monitoring</span>
              </div>
            </div>

            {activeApp ? (
              <div className="space-y-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50 p-6 rounded-2xl border border-slate-100 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
                      <i className="fa-solid fa-file-invoice-dollar text-xl"></i>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-indigo-600/60 uppercase tracking-widest">{activeApp.id}</span>
                      <p className="font-black text-slate-800 text-lg tracking-tight">{activeApp.caseType}</p>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Entitled Relief</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">₹{activeApp.amount.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="relative pt-4 pb-4">
                  <div className="flex justify-between relative z-10">
                    {['Draft', 'Checks', 'Sanction', 'Settled'].map((step, i) => {
                      const isDone = i <= (activeApp.status === ApplicationStatus.DISBURSED ? 3 : activeApp.status === ApplicationStatus.SANCTIONED ? 2 : activeApp.status === ApplicationStatus.PENDING ? 0 : 1);
                      return (
                        <div key={step} className="flex flex-col items-center">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-bold border-2 transition-all duration-700 ${isDone ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white border-slate-200 text-slate-300'}`}>
                            {isDone ? <i className="fa-solid fa-check"></i> : i + 1}
                          </div>
                          <span className={`text-[10px] mt-4 font-black uppercase tracking-[0.1em] ${isDone ? 'text-indigo-600' : 'text-slate-300'}`}>{step}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="absolute top-[26px] left-[40px] right-[40px] h-0.5 bg-slate-100 -z-0"></div>
                  <div 
                    className="absolute top-[26px] left-[40px] h-0.5 bg-indigo-600 transition-all duration-1000 -z-0"
                    style={{ width: activeApp.status === ApplicationStatus.DISBURSED ? 'calc(100% - 80px)' : activeApp.status === ApplicationStatus.SANCTIONED ? '66%' : activeApp.status === ApplicationStatus.PENDING ? '0%' : '33%'}}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <i className="fa-solid fa-folder-open text-3xl"></i>
                </div>
                <p className="font-black text-slate-400 text-lg uppercase tracking-tight">No active applications</p>
                <button onClick={() => onNavigate('apply')} className="mt-8 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-slate-800">Start Claim Process</button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-indigo-600 p-8 rounded-[2rem] text-white group cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500" onClick={() => onNavigate('apply')}>
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform backdrop-blur-md border border-white/10">
                <i className="fa-solid fa-plus text-xl"></i>
              </div>
              <h4 className="text-xl font-black tracking-tight mb-2">New Assistance</h4>
              <p className="text-indigo-100/70 text-sm font-medium leading-relaxed">Lodge a new claim for relief under PCR or PoA Acts in minutes.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 group cursor-pointer hover:border-amber-400/50 transition-all duration-500" onClick={() => onNavigate('grievances')}>
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 text-amber-500 group-hover:scale-110 transition-transform border border-amber-100 shadow-sm">
                <i className="fa-solid fa-comment-dots text-xl"></i>
              </div>
              <h4 className="text-xl font-black text-slate-800 tracking-tight mb-2">Help Desk</h4>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">Report delays, site issues, or talk to a nodal officer about your case.</p>
            </div>
          </div>
        </div>

        {/* Right Column: AI Assistant & Literacy */}
        <div className="lg:col-span-4 space-y-8">
          <AILegalAssistant />
          
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 className="font-black text-slate-800 text-sm mb-6 flex items-center gap-3 uppercase tracking-widest">
              <i className="fa-solid fa-book-open text-indigo-600"></i>
              Legal Guide
            </h3>
            <div className="space-y-4">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors group">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1 group-hover:text-indigo-600 transition-colors">PCR Act, 1955</p>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Safeguards against discriminatory practices in public spaces.</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors group">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1 group-hover:text-indigo-600 transition-colors">PoA Act, 1989</p>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Ensures swift relief for victims of caste-based atrocities.</p>
              </div>
              <button className="w-full text-[10px] font-black text-indigo-600 uppercase tracking-widest pt-2 hover:underline">Knowledge Repository</button>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/50">
                  <i className="fa-solid fa-phone-volume text-sm"></i>
                </div>
                <h3 className="font-black text-sm tracking-tight uppercase tracking-widest">Helplines</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-tight">National Support</span>
                  <span className="text-lg font-black text-indigo-400 tracking-tighter">14566</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-tight">Women Emergency</span>
                  <span className="text-lg font-black text-indigo-400 tracking-tighter">1091</span>
                </div>
              </div>
            </div>
            <div className="absolute bottom-[-20px] left-[-20px] opacity-[0.05]">
              <i className="fa-solid fa-phone text-8xl"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VictimDashboard;