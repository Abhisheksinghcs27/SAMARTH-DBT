
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
      <header className="bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] relative overflow-hidden group">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-3 bg-indigo-500/20 text-indigo-300 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] mb-6 backdrop-blur-md">
              <i className="fa-solid fa-lock"></i>
              Secure Identity Match
            </div>
            <h2 className="text-5xl font-black tracking-tighter leading-tight">Welcome, {activeApp?.name || 'Beneficiary'}</h2>
            <p className="text-slate-400 mt-4 text-lg font-medium leading-relaxed opacity-80">Empowering your rights with transparent digital justice. Your safety and dignity are our priority.</p>
          </div>
          <button 
            onClick={() => onNavigate('status')}
            className="bg-white text-slate-900 px-8 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-transform"
          >
            Track Case
          </button>
        </div>
        <div className="absolute top-[-50px] right-[-50px] opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
          <i className="fa-solid fa-scale-balanced text-[20rem] rotate-12"></i>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative group hover:border-indigo-200 transition-colors">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <i className="fa-solid fa-hourglass-half animate-spin-slow"></i>
                </div>
                Live Application Pulse
              </h3>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auto-Sync Active</span>
            </div>

            {activeApp ? (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50/50 p-6 rounded-3xl border border-slate-100 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm">
                      <i className="fa-solid fa-file-shield text-lg"></i>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{activeApp.id}</span>
                      <p className="font-black text-slate-800 text-lg tracking-tight">{activeApp.caseType}</p>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Projected Relief</p>
                    <p className="text-2xl font-black text-indigo-600 tracking-tighter">₹{activeApp.amount.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="relative pt-6 px-6">
                  <div className="flex justify-between mb-6">
                    {['Draft', 'Checks', 'Final', 'Paid'].map((step, i) => {
                      const isDone = i <= (activeApp.status === ApplicationStatus.DISBURSED ? 3 : activeApp.status === ApplicationStatus.SANCTIONED ? 2 : activeApp.status === ApplicationStatus.PENDING ? 0 : 1);
                      return (
                        <div key={step} className="flex flex-col items-center">
                          <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center text-xs font-bold border-2 transition-all duration-1000 ${isDone ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white border-slate-100 text-slate-200'}`}>
                            {isDone ? <i className="fa-solid fa-check"></i> : i + 1}
                          </div>
                          <span className={`text-[10px] mt-4 font-black uppercase tracking-[0.1em] ${isDone ? 'text-indigo-600' : 'text-slate-300'}`}>{step}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="absolute top-[41px] left-16 right-16 h-1 bg-slate-100 -z-0 rounded-full"></div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fa-solid fa-folder-plus text-slate-200 text-3xl"></i>
                </div>
                <p className="font-black text-slate-400 text-lg uppercase tracking-widest">No Active Records</p>
                <button onClick={() => onNavigate('apply')} className="mt-8 bg-indigo-600 text-white px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-105 transition-all">Start Claim Process</button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white group cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/20 transition-all" onClick={() => onNavigate('apply')}>
              <div className="w-14 h-14 bg-indigo-500 rounded-[1.25rem] flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-700/50">
                <i className="fa-solid fa-file-circle-plus text-2xl"></i>
              </div>
              <h4 className="text-xl font-black tracking-tight">File New Claim</h4>
              <p className="text-indigo-200/80 text-sm mt-2 font-medium">Quick 5-step digital application for PCR or PoA Act assistance.</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 group cursor-pointer hover:border-amber-200 transition-all" onClick={() => onNavigate('grievances')}>
              <div className="w-14 h-14 bg-amber-50 rounded-[1.25rem] flex items-center justify-center mb-6 text-amber-500 group-hover:rotate-[-12deg] transition-transform">
                <i className="fa-solid fa-headset text-2xl"></i>
              </div>
              <h4 className="text-xl font-black text-slate-800 tracking-tight">Need Assistance?</h4>
              <p className="text-slate-500 text-sm mt-2 font-medium">Direct line to grievance officers for application delays or issues.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <AILegalAssistant />
          
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
            <h3 className="font-black text-slate-800 text-lg mb-8 flex items-center gap-3">
              <i className="fa-solid fa-shield-halved text-indigo-600"></i>
              Legal Literacy
            </h3>
            <div className="space-y-6">
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-indigo-50/50 transition-colors">
                <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2">PCR Act, 1955</p>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Protects against untouchability in public places like wells, temples, and schools.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-indigo-50/50 transition-colors">
                <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2">PoA Act, 1989</p>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Mandatory cash relief within 7 days of FIR for victims of caste-based atrocities.</p>
              </div>
              <button className="w-full text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] pt-2 hover:underline">Explore Full Knowledge Base</button>
            </div>
          </div>

          <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
             <div className="relative z-10">
               <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-indigo-600 rounded-[1rem] flex items-center justify-center text-white shadow-xl shadow-indigo-900/50">
                   <i className="fa-solid fa-phone-volume text-lg"></i>
                 </div>
                 <h3 className="font-black text-lg tracking-tight">Help Desk</h3>
               </div>
               <div className="space-y-6">
                 <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">National Toll Free</span>
                   <span className="text-xl font-black text-indigo-400 tracking-tighter">14566</span>
                 </div>
                 <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Police (Atrocity Unit)</span>
                   <span className="text-xl font-black text-indigo-400 tracking-tighter">112</span>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VictimDashboard;
