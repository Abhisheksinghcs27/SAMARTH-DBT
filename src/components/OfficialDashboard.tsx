import React from 'react';
import StatsCards from './StatsCards';
import AILegalAssistant from './AILegalAssistant';
import { Beneficiary, ApplicationStatus, CaseType } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line } from 'recharts';

const CHART_DATA = [
  { name: 'Jan', amount: 12.4, beneficiaries: 1240 },
  { name: 'Feb', amount: 19.8, beneficiaries: 1980 },
  { name: 'Mar', amount: 15.2, beneficiaries: 1520 },
  { name: 'Apr', amount: 22.1, beneficiaries: 2210 },
  { name: 'May', amount: 30.5, beneficiaries: 3050 },
  { name: 'Jun', amount: 28.3, beneficiaries: 2830 },
];

const PIE_DATA = [
  { name: 'PoA Act', value: 65, fill: '#4f46e5', amount: '₹142.5 Cr' },
  { name: 'PCR Act', value: 20, fill: '#818cf8', amount: '₹38.2 Cr' },
  { name: 'Inter-caste Marriage', value: 15, fill: '#c7d2fe', amount: '₹52.8 Cr' },
];

const SCHEME_PERFORMANCE = [
  { scheme: 'PoA Act Relief', target: 10000, achieved: 9240, utilization: 92.4, disbursed: 142.5 },
  { scheme: 'PCR Act Relief', target: 5000, achieved: 4560, utilization: 91.2, disbursed: 38.2 },
  { scheme: 'Marriage Incentive', target: 3000, achieved: 2112, utilization: 70.4, disbursed: 52.8 },
];

interface OfficialDashboardProps {
  apps: Beneficiary[];
  onNavigate: (tab: string) => void;
}

const OfficialDashboard: React.FC<OfficialDashboardProps> = ({ apps, onNavigate }) => {
  // Calculate AI Verification summaries
  const verifiedApps = apps.filter(a => !!a.aiVerification);
  const averageConfidence = verifiedApps.length > 0 
    ? Math.round(verifiedApps.reduce((acc, curr) => acc + (curr.aiVerification?.score || 0), 0) / verifiedApps.length)
    : 0;
  
  const flaggedCount = verifiedApps.filter(a => a.aiVerification?.score && a.aiVerification.score < 60).length;
  const criticalRemarks = verifiedApps
    .filter(a => {
      const remarks = a.aiVerification?.remarks?.toLowerCase() || '';
      return remarks.includes('flagged') || (a.aiVerification?.score || 100) < 60;
    })
    .slice(0, 3);

  // Calculate scheme-wise statistics
  const poaActApps = apps.filter(a => a.caseType === CaseType.POA_ACT);
  const pcrActApps = apps.filter(a => a.caseType === CaseType.PCR_ACT);
  const marriageApps = apps.filter(a => a.caseType === CaseType.INTERCASTE_MARRIAGE);

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10 animate-fadeIn px-4 sm:px-6 lg:px-0">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
            <div className="flex -space-x-2 shrink-0">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[9px] sm:text-[10px] font-bold">SJ</div>
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-white">E</div>
            </div>
            <span className="text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em]">Ministry of Social Justice & Empowerment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tighter break-words">NATIONAL DBT COMMAND CENTER</h1>
          <p className="text-slate-500 mt-2 font-medium max-w-lg text-sm sm:text-base">
            Real-time monitoring of PCR Act, PoA Act, and Inter-caste Marriage Incentive schemes. 
            Track fund flow, multi-agency compliance, and grievance resolution.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 shrink-0">
          <button className="bg-white border border-slate-200 px-4 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm">
            <i className="fa-solid fa-cloud-arrow-down"></i> <span className="whitespace-nowrap">Sync Data</span>
          </button>
          <button onClick={() => onNavigate('verifications')} className="bg-slate-900 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-white shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
            <i className="fa-solid fa-bolt-lightning text-amber-400"></i> <span className="whitespace-nowrap">Process Queue</span>
          </button>
        </div>
      </header>
      
      <StatsCards />

      {/* Government Schemes Overview */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 sm:gap-3 flex-wrap">
              <i className="fa-solid fa-landmark text-indigo-600 shrink-0"></i>
              <span className="break-words">Government Schemes Performance</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">FY 2024-25 - Ministry of Social Justice & Empowerment</p>
          </div>
          <div className="bg-indigo-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-indigo-100 shrink-0">
            <span className="text-[9px] sm:text-[10px] font-black text-indigo-600 uppercase tracking-wider whitespace-nowrap">Live Data</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {SCHEME_PERFORMANCE.map((scheme, idx) => (
            <div key={idx} className="bg-gradient-to-br from-slate-50 to-white p-5 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-slate-200 hover:border-indigo-300 transition-all">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base sm:text-lg font-black text-slate-900 break-words flex-1 pr-2">{scheme.scheme}</h4>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-chart-line text-indigo-600 text-sm sm:text-base"></i>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500">Target</span>
                  <span className="text-xs sm:text-sm font-black text-slate-900">{scheme.target.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500">Achieved</span>
                  <span className="text-xs sm:text-sm font-black text-indigo-600">{scheme.achieved.toLocaleString()}</span>
                </div>
                <div className="pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-500">Utilization</span>
                    <span className="text-xs sm:text-sm font-black text-emerald-600">{scheme.utilization}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 sm:h-2">
                    <div 
                      className="bg-indigo-600 h-1.5 sm:h-2 rounded-full transition-all"
                      style={{ width: `${scheme.utilization}%` }}
                    ></div>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-200">
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500 block mb-1">Amount Disbursed</span>
                  <span className="text-lg sm:text-xl font-black text-slate-900">{scheme.disbursed} Cr</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Scrutiny Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
        <div className="lg:col-span-3 bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative group">
           <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 lg:gap-10">
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                  <circle 
                    cx="80" cy="80" r="70" 
                    stroke="currentColor" 
                    strokeWidth="12" 
                    fill="transparent" 
                    strokeDasharray={440}
                    strokeDashoffset={440 - (440 * averageConfidence) / 100}
                    className="text-indigo-600 transition-all duration-1000 ease-out" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">{averageConfidence}%</span>
                  <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest">AI Confidence</span>
                </div>
              </div>
              <div className="flex-1 space-y-4 sm:space-y-6 w-full">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 sm:gap-3 flex-wrap">
                    <span>AI Verification Engine</span>
                    <span className="bg-indigo-50 text-indigo-600 text-[9px] sm:text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest border border-indigo-100 whitespace-nowrap">Neural Network</span>
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1">
                    Cross-referencing FIR semantics with victim testimonies using Google Gemini AI. 
                    Integrated with CCTNS and UIDAI for comprehensive verification.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100">
                    <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Applications Audited</p>
                    <p className="text-xl sm:text-2xl font-black text-slate-900">{verifiedApps.length}</p>
                    <p className="text-[8px] sm:text-[9px] text-slate-500 font-medium mt-1">Total verified</p>
                  </div>
                  <div className="bg-rose-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-rose-100">
                    <p className="text-[9px] sm:text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Flagged for Review</p>
                    <p className="text-xl sm:text-2xl font-black text-rose-600">{flaggedCount}</p>
                    <p className="text-[8px] sm:text-[9px] text-rose-500 font-medium mt-1">Requires attention</p>
                  </div>
                </div>
              </div>
              <div className="hidden xl:block w-px h-32 bg-slate-100"></div>
              <div className="flex-1 space-y-3 sm:space-y-4 w-full lg:w-auto">
                <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Critical AI Remarks</p>
                <div className="space-y-2 sm:space-y-3">
                  {criticalRemarks.map(app => (
                    <div key={app.id} className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-slate-50 rounded-lg sm:rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] sm:text-[11px] font-black text-slate-700 leading-tight mb-0.5 break-words">{app.id} / {app.name}</p>
                        <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium line-clamp-2 italic">"{app.aiVerification?.remarks}"</p>
                      </div>
                    </div>
                  ))}
                  {criticalRemarks.length === 0 && (
                    <p className="text-[10px] sm:text-[11px] text-slate-400 font-bold italic">No critical anomalies detected in recent audit.</p>
                  )}
                </div>
              </div>
           </div>
           <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity hidden lg:block">
              <i className="fa-solid fa-brain text-[12rem]"></i>
           </div>
        </div>
        <div className="lg:col-span-1 bg-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-center border border-slate-800">
           <div className="relative z-10 text-center">
              <i className="fa-solid fa-shield-virus text-3xl sm:text-4xl text-indigo-400 mb-3 sm:mb-4"></i>
              <h4 className="text-base sm:text-lg font-black tracking-tight mb-2">Integrity Shield</h4>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium leading-relaxed px-2 sm:px-4 mb-3 sm:mb-4">
                AI verification prevents misallocation by detecting 99.2% of procedural inconsistencies.
              </p>
              <div className="bg-indigo-600/20 p-2.5 sm:p-3 rounded-lg sm:rounded-xl border border-indigo-500/30 mb-3 sm:mb-4">
                <p className="text-[9px] sm:text-[10px] font-black text-indigo-300 uppercase tracking-wider mb-1">Accuracy Rate</p>
                <p className="text-xl sm:text-2xl font-black text-white">99.2%</p>
              </div>
              <button onClick={() => onNavigate('verifications')} className="text-[9px] sm:text-[10px] font-black text-indigo-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] hover:text-indigo-300 transition-colors">
                Audit Full Logs <i className="fa-solid fa-arrow-right ml-1"></i>
              </button>
           </div>
        </div>
      </div>

      {/* Financial Disbursement & Scheme Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8 lg:mb-10">
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-slate-800 text-base sm:text-lg flex items-center gap-2 flex-wrap">
                <i className="fa-solid fa-chart-bar text-indigo-600 shrink-0"></i>
                <span>Financial Disbursement Trends</span>
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-1 uppercase tracking-wider font-bold">FY 2024-25 (₹ in Crores)</p>
            </div>
            <select className="bg-slate-50 border-none text-[10px] sm:text-xs font-bold text-slate-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto">
              <option>Last 6 Months</option>
              <option>Year to Date</option>
              <option>Last Financial Year</option>
            </select>
          </div>
          <div className="h-[250px] sm:h-[280px] lg:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_DATA}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 600, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 600, fill: '#94a3b8'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '12px'}}
                  formatter={(value: any) => [`₹${value} Cr`, 'Amount']}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {CHART_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === CHART_DATA.length - 1 ? '#4f46e5' : '#818cf8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-black text-slate-800 text-base sm:text-lg mb-2 flex items-center gap-2">
            <i className="fa-solid fa-chart-pie text-indigo-600"></i>
            <span>Scheme Distribution</span>
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-400 mb-4 sm:mb-6 uppercase font-bold">Case Volume by Act</p>
          <div className="h-[180px] sm:h-[200px] lg:h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={PIE_DATA} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                  {PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any, name?: string, props?: any) => [
                  `${value}% (${props?.payload?.amount ?? ''})`,
                  name ?? ''
                ]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 sm:space-y-3 mt-3 sm:mt-4">
            {PIE_DATA.map(item => (
              <div key={item.name} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg sm:rounded-xl">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0" style={{ backgroundColor: item.fill }}></div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-600 truncate">{item.name}</span>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className="text-[10px] sm:text-xs font-black text-slate-900 block">{item.value}%</span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-500">{item.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scheme-wise Statistics & District Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-800 overflow-hidden relative">
          <div className="relative z-10">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <i className="fa-solid fa-map-location-dot text-indigo-400 text-lg sm:text-xl shrink-0"></i>
              <h3 className="text-lg sm:text-xl font-black text-white">District-wise Distribution</h3>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mb-4 sm:mb-6">Real-time geographic distribution of pending cases across districts.</p>
            <div className="bg-slate-800 h-48 sm:h-56 lg:h-64 rounded-xl sm:rounded-2xl border border-slate-700 flex items-center justify-center relative">
               <i className="fa-solid fa-map text-4xl sm:text-5xl lg:text-6xl text-slate-700 opacity-20"></i>
               <div className="absolute top-1/4 left-1/3 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
               <div className="absolute top-1/2 left-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-amber-500 rounded-full animate-pulse delay-75 shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
               <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-150"></div>
               <div className="absolute top-1/3 right-1/3 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-indigo-500 rounded-full animate-pulse delay-200"></div>
            </div>
            <div className="mt-4 sm:mt-6 flex flex-wrap gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase">Critical (50+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase">Pending (20-50)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase">Resolved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scheme-wise Application Statistics */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h3 className="font-black text-slate-800 text-base sm:text-lg mb-4 sm:mb-6 flex items-center gap-2">
            <i className="fa-solid fa-chart-line text-indigo-600"></i>
            <span>Scheme-wise Applications</span>
          </h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-indigo-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-indigo-200">
              <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white shrink-0">
                    <i className="fa-solid fa-shield-halved text-sm"></i>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-black text-slate-900 truncate">PoA Act, 1989</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold">Prevention of Atrocities</p>
                  </div>
                </div>
                <span className="text-base sm:text-lg font-black text-indigo-600 shrink-0">{poaActApps.length}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] sm:text-xs">
                <span className="text-slate-500 font-bold">Pending: {poaActApps.filter(a => a.status === ApplicationStatus.PENDING).length}</span>
                <span className="text-emerald-600 font-black">Disbursed: {poaActApps.filter(a => a.status === ApplicationStatus.DISBURSED).length}</span>
              </div>
            </div>
            <div className="bg-purple-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-purple-200">
              <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white shrink-0">
                    <i className="fa-solid fa-scale-balanced text-sm"></i>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-black text-slate-900 truncate">PCR Act, 1955</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold">Protection of Civil Rights</p>
                  </div>
                </div>
                <span className="text-base sm:text-lg font-black text-purple-600 shrink-0">{pcrActApps.length}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] sm:text-xs">
                <span className="text-slate-500 font-bold">Pending: {pcrActApps.filter(a => a.status === ApplicationStatus.PENDING).length}</span>
                <span className="text-emerald-600 font-black">Disbursed: {pcrActApps.filter(a => a.status === ApplicationStatus.DISBURSED).length}</span>
              </div>
            </div>
            <div className="bg-emerald-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-emerald-200">
              <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white shrink-0">
                    <i className="fa-solid fa-heart text-sm"></i>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-black text-slate-900 truncate">Inter-caste Marriage</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold">Marriage Incentive Scheme</p>
                  </div>
                </div>
                <span className="text-base sm:text-lg font-black text-emerald-600 shrink-0">{marriageApps.length}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] sm:text-xs">
                <span className="text-slate-500 font-bold">Pending: {marriageApps.filter(a => a.status === ApplicationStatus.PENDING).length}</span>
                <span className="text-emerald-600 font-black">Disbursed: {marriageApps.filter(a => a.status === ApplicationStatus.DISBURSED).length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Government Guidelines & Resources */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <h3 className="font-black text-slate-800 text-base sm:text-lg mb-4 sm:mb-6 flex items-center gap-2">
          <i className="fa-solid fa-book-open text-indigo-600"></i>
          <span>Government Guidelines & Circulars</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-slate-50 p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-100 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                <i className="fa-solid fa-file-pdf text-indigo-600 text-sm"></i>
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-black text-slate-900">PoA Act Guidelines</p>
                <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold">2024 Revision</p>
              </div>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-600 font-medium mb-3 line-clamp-3">
              Updated guidelines for relief disbursement under Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989.
            </p>
            <a href="#" className="text-[10px] sm:text-xs font-black text-indigo-600 uppercase tracking-wider hover:underline inline-flex items-center gap-1">
              View Document <i className="fa-solid fa-arrow-right"></i>
            </a>
          </div>
          <div className="bg-slate-50 p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                <i className="fa-solid fa-file-pdf text-purple-600 text-sm"></i>
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-black text-slate-900">PCR Act Circular</p>
                <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold">2024 Revision</p>
              </div>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-600 font-medium mb-3 line-clamp-3">
              Standard operating procedures for processing applications under Protection of Civil Rights Act, 1955.
            </p>
            <a href="#" className="text-[10px] sm:text-xs font-black text-indigo-600 uppercase tracking-wider hover:underline inline-flex items-center gap-1">
              View Document <i className="fa-solid fa-arrow-right"></i>
            </a>
          </div>
          <div className="bg-slate-50 p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                <i className="fa-solid fa-file-pdf text-emerald-600 text-sm"></i>
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-black text-slate-900">DBT Guidelines</p>
                <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold">PFMS Integration</p>
              </div>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-600 font-medium mb-3 line-clamp-3">
              Direct Benefit Transfer guidelines and PFMS integration procedures for seamless fund disbursement.
            </p>
            <a href="#" className="text-[10px] sm:text-xs font-black text-indigo-600 uppercase tracking-wider hover:underline inline-flex items-center gap-1">
              View Document <i className="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>

      <AILegalAssistant />
    </div>
  );
};

export default OfficialDashboard;
