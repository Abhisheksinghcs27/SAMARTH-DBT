import React from 'react';
import { Beneficiary, ApplicationStatus } from '../../types';
import AILegalAssistant from './AILegalAssistant';

interface VictimDashboardProps {
  myApplications: Beneficiary[];
  onNavigate: (tab: string) => void;
}

const VictimDashboard: React.FC<VictimDashboardProps> = ({ myApplications, onNavigate }) => {
  const activeApp = 
    [...myApplications]
      .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
      .find(app => app.status !== ApplicationStatus.DISBURSED) 
    || myApplications[0];

  const governmentSchemes = [
    {
      name: 'PoA Act Relief Scheme',
      act: 'Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989',
      benefits: [
        { type: 'Economic Rehabilitation', amount: '₹82,500 - ₹8,25,000', description: 'Based on severity of atrocity' },
        { type: 'Immediate Relief', amount: '₹25,000 - ₹50,000', description: 'Within 24 hours of FIR registration' },
        { type: 'Medical Expenses', amount: 'Full reimbursement', description: 'Up to ₹2,00,000' },
        { type: 'Relocation Assistance', amount: '₹1,00,000', description: 'For forced displacement' }
      ],
      eligibility: 'Victims of atrocities under Sections 3(1) and 3(2) of PoA Act',
      helpline: '1800-180-1456',
      website: 'https://socialjustice.gov.in'
    },
    {
      name: 'PCR Act Relief Scheme',
      act: 'Protection of Civil Rights Act, 1955',
      benefits: [
        { type: 'Compensation for Untouchability', amount: '₹50,000 - ₹2,00,000', description: 'For denial of rights' },
        { type: 'Rehabilitation Grant', amount: '₹1,00,000', description: 'For social boycott victims' },
        { type: 'Legal Aid', amount: 'Free legal assistance', description: 'Through State Legal Services Authority' }
      ],
      eligibility: 'Victims of untouchability and civil rights violations',
      helpline: '1968',
      website: 'https://socialjustice.gov.in'
    },
    {
      name: 'Inter-caste Marriage Incentive',
      act: 'Dr. Ambedkar Scheme for Social Integration',
      benefits: [
        { type: 'Marriage Incentive', amount: '₹2,50,000', description: 'One-time grant for inter-caste marriages' },
        { type: 'Additional State Benefits', amount: 'Varies by state', description: 'State-specific schemes available' }
      ],
      eligibility: 'Inter-caste marriages where one spouse is SC/ST',
      helpline: '1800-180-1456',
      website: 'https://socialjustice.gov.in'
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10 animate-fadeIn px-4 sm:px-6 lg:px-0">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6 sm:p-10 md:p-12 lg:p-16 rounded-2xl sm:rounded-[2.5rem] lg:rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-8 lg:gap-10">
          <div className="max-w-2xl w-full flex flex-col">
            <div className="inline-flex items-center gap-2 sm:gap-2.5 bg-indigo-500/10 text-indigo-300 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-4 sm:mb-6 lg:mb-8 backdrop-blur-xl border border-indigo-500/20 flex-wrap self-start">
              <i className="fa-solid fa-fingerprint text-[9px] sm:text-[10px] shrink-0"></i>
              <span className="whitespace-nowrap">Government of India</span>
              <span className="hidden sm:inline">- Ministry of Social Justice & Empowerment</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.05] mb-4 sm:mb-6">
              Welcome back,<br className="hidden sm:block"/> 
              <span className="text-indigo-400 block sm:inline">{activeApp?.name || 'Beneficiary'}</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-relaxed opacity-90 max-w-xl">
              Access your Direct Benefit Transfer (DBT) status under PCR Act, 1955 & PoA Act, 1989. 
              Track relief applications and receive expert legal guidance in real-time.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto shrink-0 self-start lg:self-center">
            <button 
              onClick={() => onNavigate('apply')}
              className="bg-indigo-600 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl lg:rounded-[1.5rem] font-black text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] shadow-2xl shadow-indigo-600/40 hover:bg-indigo-500 hover:-translate-y-1 transition-all active:scale-95 text-center whitespace-nowrap"
            >
              Apply for Relief
            </button>
            <button 
              onClick={() => onNavigate('status')}
              className="bg-white/5 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl lg:rounded-[1.5rem] font-black text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] backdrop-blur-md hover:bg-white/10 transition-all active:scale-95 border border-white/10 text-center whitespace-nowrap"
            >
              Track Application
            </button>
          </div>
        </div>
        <div className="absolute top-[-40px] right-[-40px] opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-1000 pointer-events-none hidden lg:block">
          <i className="fa-solid fa-scale-balanced text-[24rem] rotate-12"></i>
        </div>
      </header>

      {/* Government Schemes Information */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-100 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
            <i className="fa-solid fa-landmark text-indigo-600 text-lg sm:text-xl"></i>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">Government Relief Schemes</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5">Ministry of Social Justice & Empowerment - DBT Portal</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {governmentSchemes.map((scheme, idx) => (
            <div key={idx} className="bg-gradient-to-br from-slate-50 to-white p-5 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-slate-200 hover:border-indigo-300 transition-all group flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <i className="fa-solid fa-shield-halved text-indigo-600 text-sm sm:text-base"></i>
                </div>
                <span className="text-[8px] sm:text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg uppercase tracking-wider whitespace-nowrap ml-auto">Active</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-900 mb-2 break-words leading-tight">{scheme.name}</h4>
              <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold mb-4 leading-snug line-clamp-2">{scheme.act}</p>
              <div className="space-y-2 mb-4 flex-1">
                {scheme.benefits.slice(0, 2).map((benefit, i) => (
                  <div key={i} className="bg-white p-2.5 sm:p-3 rounded-lg sm:rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between mb-1 gap-2">
                      <span className="text-[9px] sm:text-[10px] font-black text-slate-700 uppercase truncate flex-1 min-w-0">{benefit.type}</span>
                      <span className="text-[10px] sm:text-xs font-black text-indigo-600 whitespace-nowrap ml-2">{benefit.amount}</span>
                    </div>
                    <p className="text-[8px] sm:text-[9px] text-slate-500 font-medium line-clamp-1">{benefit.description}</p>
                  </div>
                ))}
              </div>
              <div className="pt-3 sm:pt-4 border-t border-slate-200 space-y-2 mt-auto">
                <div className="flex items-center gap-2 text-[9px] sm:text-[10px]">
                  <i className="fa-solid fa-phone text-indigo-600 shrink-0 w-3"></i>
                  <span className="font-black text-slate-900">Helpline: </span>
                  <span className="font-bold text-indigo-600 break-all">{scheme.helpline}</span>
                </div>
                <div className="flex items-start gap-2 text-[9px] sm:text-[10px]">
                  <i className="fa-solid fa-check-circle text-emerald-600 shrink-0 mt-0.5 w-3"></i>
                  <span className="font-medium text-slate-600 line-clamp-2 leading-snug">{scheme.eligibility}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start">
        
        {/* Left Column: Core Application Pulse & Quick Actions */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8 lg:space-y-10">
          <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50 relative group">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8 sm:mb-10 lg:mb-12">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner shrink-0">
                  <i className="fa-solid fa-bolt-lightning text-xs sm:text-sm animate-pulse"></i>
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Active Application Status</h3>
                  <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Real-time DBT Monitoring</p>
                </div>
              </div>
              <div className="bg-emerald-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-emerald-100 flex items-center gap-2 sm:gap-2.5 shrink-0">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[9px] sm:text-[10px] font-black text-emerald-700 uppercase tracking-widest whitespace-nowrap">System Online</span>
              </div>
            </div>

            {activeApp ? (
              <div className="space-y-8 sm:space-y-10 lg:space-y-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50/80 p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-slate-100 gap-6 sm:gap-8">
                  <div className="flex items-start sm:items-center gap-4 sm:gap-5 w-full sm:w-auto flex-1 min-w-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-16 bg-white rounded-2xl sm:rounded-3xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 shrink-0">
                      <i className="fa-solid fa-file-shield text-xl sm:text-2xl"></i>
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] sm:text-[10px] font-black text-indigo-600/50 uppercase tracking-[0.15em] sm:tracking-[0.2em] block mb-1.5 break-all">{activeApp.id}</span>
                      <p className="font-black text-slate-900 text-lg sm:text-xl tracking-tight break-words leading-tight mb-1.5">{activeApp.caseType}</p>
                      <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Applied: {new Date(activeApp.appliedDate).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right border-t sm:border-t-0 sm:border-l border-slate-200 pt-4 sm:pt-0 sm:pl-6 sm:pr-0 w-full sm:w-auto sm:min-w-[140px]">
                    <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Sanctioned Amount</p>
                    <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter leading-none">₹{activeApp.amount.toLocaleString()}</p>
                    <p className="text-[8px] sm:text-[9px] text-slate-500 font-medium mt-1.5">Via DBT to Bank Account</p>
                  </div>
                </div>
                
                <div className="relative pt-4 sm:pt-6 pb-2 px-2 sm:px-4 overflow-x-auto -mx-2 sm:mx-0">
                  <div className="flex justify-between items-start relative z-10 min-w-[400px] sm:min-w-0 gap-2 sm:gap-0">
                    {['Applied', 'Verification', 'Sanctioned', 'Disbursed'].map((step, i) => {
                      const isDone = i <= (activeApp.status === ApplicationStatus.DISBURSED ? 3 : activeApp.status === ApplicationStatus.SANCTIONED ? 2 : activeApp.status === ApplicationStatus.PENDING ? 0 : 1);
                      return (
                        <div key={step} className="flex flex-col items-center flex-1 min-w-0">
                          <div className={`w-10 h-10 sm:w-12 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-[10px] sm:text-xs font-bold border-2 transition-all duration-700 shrink-0 ${isDone ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white border-slate-200 text-slate-300'}`}>
                            {isDone ? <i className="fa-solid fa-check text-xs sm:text-sm"></i> : i + 1}
                          </div>
                          <span className={`text-[9px] sm:text-[10px] mt-3 sm:mt-5 font-black uppercase tracking-[0.1em] sm:tracking-[0.15em] text-center leading-tight ${isDone ? 'text-indigo-600' : 'text-slate-300'}`}>{step}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="absolute top-[28px] sm:top-[34px] left-[40px] sm:left-[50px] right-[40px] sm:right-[50px] h-1 bg-slate-100 -z-0 rounded-full"></div>
                  <div 
                    className="absolute top-[28px] sm:top-[34px] left-[40px] sm:left-[50px] h-1 bg-indigo-600 transition-all duration-1000 -z-0 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                    style={{ width: activeApp.status === ApplicationStatus.DISBURSED ? 'calc(100% - 80px)' : activeApp.status === ApplicationStatus.SANCTIONED ? '66%' : activeApp.status === ApplicationStatus.PENDING ? '0%' : '33%'}}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 sm:py-20 lg:py-24 bg-slate-50/50 rounded-2xl sm:rounded-3xl border border-dashed border-slate-200 px-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-sm border border-slate-100">
                  <i className="fa-solid fa-inbox text-slate-200 text-3xl sm:text-4xl"></i>
                </div>
                <p className="font-black text-slate-400 text-lg sm:text-xl uppercase tracking-tighter mb-2">No Active Applications</p>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mb-4 sm:mb-6 px-4">Apply for relief under PCR Act, PoA Act, or Inter-caste Marriage Incentive</p>
                <button onClick={() => onNavigate('apply')} className="bg-slate-900 text-white px-8 sm:px-10 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all hover:bg-slate-800">Apply for Relief</button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl text-white group cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-500 flex flex-col" onClick={() => onNavigate('apply')}>
              <div className="w-12 h-12 sm:w-14 sm:h-16 bg-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform backdrop-blur-xl border border-white/20 shrink-0">
                <i className="fa-solid fa-file-circle-plus text-xl sm:text-2xl"></i>
              </div>
              <h4 className="text-xl sm:text-2xl font-black tracking-tight mb-2 sm:mb-3 leading-tight">Apply for Relief</h4>
              <p className="text-indigo-100/80 text-sm sm:text-base font-medium leading-relaxed mb-4 flex-1">
                Apply for relief under PCR Act, PoA Act, or Inter-caste Marriage Incentive Scheme.
              </p>
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-check-circle text-[10px] sm:text-xs shrink-0 w-3.5"></i>
                  <span className="font-bold break-words leading-snug">PoA Act: ₹82,500 - ₹8,25,000</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-check-circle text-[10px] sm:text-xs shrink-0 w-3.5"></i>
                  <span className="font-bold break-words leading-snug">PCR Act: ₹50,000 - ₹2,00,000</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-check-circle text-[10px] sm:text-xs shrink-0 w-3.5"></i>
                  <span className="font-bold break-words leading-snug">Marriage Incentive: ₹2,50,000</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-slate-200 group cursor-pointer hover:border-amber-400/50 hover:shadow-2xl hover:shadow-slate-200 hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-500 flex flex-col" onClick={() => onNavigate('grievances')}>
              <div className="w-12 h-12 sm:w-14 sm:h-16 bg-amber-50 rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 sm:mb-8 text-amber-500 group-hover:scale-110 group-hover:-rotate-6 transition-transform border border-amber-100 shadow-sm shrink-0">
                <i className="fa-solid fa-headset text-xl sm:text-2xl"></i>
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2 sm:mb-3 leading-tight">Grievance Redressal</h4>
              <p className="text-slate-500 text-sm sm:text-base font-medium leading-relaxed mb-4 flex-1">
                Report delays, technical issues, or seek assistance from nodal officers.
              </p>
              <div className="bg-amber-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-amber-100 mt-auto">
                <p className="text-[10px] sm:text-xs font-black text-amber-900 uppercase tracking-wider mb-1">Response Time</p>
                <p className="text-xs sm:text-sm font-bold text-amber-700">Within 48 hours guaranteed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Assistant & Resources */}
        <div className="lg:col-span-5 space-y-6 sm:space-y-8 lg:space-y-10">
          
          {/* Prominent AI Assistant */}
          <AILegalAssistant />
          
          {/* Government Resources and Emergency Support */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Government Schemes & Resources */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm flex flex-col">
              <h3 className="font-black text-slate-900 text-[9px] sm:text-[10px] mb-4 sm:mb-6 flex items-center gap-2 uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                <i className="fa-solid fa-book text-indigo-600 shrink-0"></i>
                <span>Government Resources</span>
              </h3>
              <div className="space-y-3 sm:space-y-4 flex-1">
                <div className="p-3 sm:p-4 bg-slate-50/50 rounded-xl sm:rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all group cursor-pointer">
                  <p className="text-[8px] sm:text-[9px] font-black text-slate-900 uppercase tracking-widest mb-1.5 group-hover:text-indigo-600 transition-colors">PCR Act, 1955</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-snug line-clamp-2 mb-2">Protection of Civil Rights - Untouchability prevention</p>
                  <div className="flex items-center gap-2 text-[8px] sm:text-[9px] text-indigo-600 font-bold">
                    <i className="fa-solid fa-link shrink-0 w-3"></i>
                    <span className="break-all">socialjustice.gov.in</span>
                  </div>
                </div>
                <div className="p-3 sm:p-4 bg-slate-50/50 rounded-xl sm:rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all group cursor-pointer">
                  <p className="text-[8px] sm:text-[9px] font-black text-slate-900 uppercase tracking-widest mb-1.5 group-hover:text-indigo-600 transition-colors">PoA Act, 1989</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-snug line-clamp-2 mb-2">Prevention of Atrocities - Special courts & relief</p>
                  <div className="flex items-center gap-2 text-[8px] sm:text-[9px] text-indigo-600 font-bold">
                    <i className="fa-solid fa-link shrink-0 w-3"></i>
                    <span className="break-all">socialjustice.gov.in</span>
                  </div>
                </div>
                <div className="p-3 sm:p-4 bg-slate-50/50 rounded-xl sm:rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all group cursor-pointer">
                  <p className="text-[8px] sm:text-[9px] font-black text-slate-900 uppercase tracking-widest mb-1.5 group-hover:text-indigo-600 transition-colors">DBT Portal</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-snug line-clamp-2 mb-2">Direct Benefit Transfer - Track payments</p>
                  <div className="flex items-center gap-2 text-[8px] sm:text-[9px] text-indigo-600 font-bold">
                    <i className="fa-solid fa-link shrink-0 w-3"></i>
                    <span className="break-all">dbtbharat.gov.in</span>
                  </div>
                </div>
              </div>
              <button className="w-full text-[8px] sm:text-[9px] font-black text-indigo-600 uppercase tracking-widest py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-indigo-50 transition-colors mt-4 border border-indigo-100">
                View All Resources
              </button>
            </div>

            {/* Emergency Support Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 sm:p-8 rounded-2xl sm:rounded-3xl text-white shadow-2xl relative overflow-hidden group flex flex-col">
              <div className="relative z-10 flex-1">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shrink-0">
                    <i className="fa-solid fa-phone-flip text-[10px] sm:text-xs"></i>
                  </div>
                  <h3 className="font-black text-[9px] sm:text-[10px] tracking-widest uppercase">Emergency Helplines</h3>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="pb-2 sm:pb-3 border-b border-slate-800">
                    <span className="text-[8px] sm:text-[9px] text-slate-500 font-bold uppercase block mb-1">PoA Act Helpline</span>
                    <span className="text-lg sm:text-xl font-black text-indigo-400 tracking-tighter break-all">1800-180-1456</span>
                    <p className="text-[8px] sm:text-[9px] text-slate-400 font-medium mt-1">24/7 Toll-free Support</p>
                  </div>
                  <div className="pb-2 sm:pb-3 border-b border-slate-800">
                    <span className="text-[8px] sm:text-[9px] text-slate-500 font-bold uppercase block mb-1">Police Emergency</span>
                    <span className="text-lg sm:text-xl font-black text-indigo-400 tracking-tighter">112</span>
                    <p className="text-[8px] sm:text-[9px] text-slate-400 font-medium mt-1">National Emergency Number</p>
                  </div>
                  <div>
                    <span className="text-[8px] sm:text-[9px] text-slate-500 font-bold uppercase block mb-1">Legal Aid</span>
                    <span className="text-lg sm:text-xl font-black text-indigo-400 tracking-tighter">1968</span>
                    <p className="text-[8px] sm:text-[9px] text-slate-400 font-medium mt-1">State Legal Services Authority</p>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-[-20px] left-[-20px] opacity-[0.05] group-hover:rotate-12 transition-transform duration-700 pointer-events-none hidden sm:block">
                <i className="fa-solid fa-life-ring text-[8rem]"></i>
              </div>
            </div>

          </div>

          {/* Government Scheme Benefits Summary */}
          <div className="bg-gradient-to-br from-emerald-50 to-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 border-emerald-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                <i className="fa-solid fa-hand-holding-dollar text-emerald-600 text-base sm:text-lg"></i>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-base sm:text-lg font-black text-slate-900 leading-tight">Relief Amounts</h4>
                <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold mt-0.5">As per Government Guidelines</p>
              </div>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-emerald-100">
                <div className="flex items-center justify-between mb-1.5 sm:mb-2 gap-2">
                  <span className="text-[10px] sm:text-xs font-black text-slate-900 truncate flex-1 min-w-0">PoA Act Relief</span>
                  <span className="text-xs sm:text-sm font-black text-emerald-600 whitespace-nowrap ml-2">₹82,500 - ₹8,25,000</span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium leading-snug">Based on severity & sections</p>
              </div>
              <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-emerald-100">
                <div className="flex items-center justify-between mb-1.5 sm:mb-2 gap-2">
                  <span className="text-[10px] sm:text-xs font-black text-slate-900 truncate flex-1 min-w-0">PCR Act Relief</span>
                  <span className="text-xs sm:text-sm font-black text-emerald-600 whitespace-nowrap ml-2">₹50,000 - ₹2,00,000</span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium leading-snug">For civil rights violations</p>
              </div>
              <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-emerald-100">
                <div className="flex items-center justify-between mb-1.5 sm:mb-2 gap-2">
                  <span className="text-[10px] sm:text-xs font-black text-slate-900 truncate flex-1 min-w-0">Marriage Incentive</span>
                  <span className="text-xs sm:text-sm font-black text-emerald-600 whitespace-nowrap ml-2">₹2,50,000</span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium leading-snug">One-time grant for inter-caste marriage</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VictimDashboard;
