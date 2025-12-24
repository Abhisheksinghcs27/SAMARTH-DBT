
import React from 'react';
import StatsCards from './StatsCards';
import AILegalAssistant from './AILegalAssistant';
import { Beneficiary, ApplicationStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const CHART_DATA = [
  { name: 'Jan', amount: 12.4 },
  { name: 'Feb', amount: 19.8 },
  { name: 'Mar', amount: 15.2 },
  { name: 'Apr', amount: 22.1 },
  { name: 'May', amount: 30.5 },
];

const PIE_DATA = [
  { name: 'PoA Act', value: 65, fill: '#4f46e5' },
  { name: 'PCR Act', value: 20, fill: '#818cf8' },
  { name: 'Marriage', value: 15, fill: '#c7d2fe' },
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
    .filter(a => a.aiVerification?.remarks.toLowerCase().includes('flagged') || (a.aiVerification?.score || 100) < 60)
    .slice(0, 3);

  return (
    <div className="space-y-10 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold">SJ</div>
              <div className="w-6 h-6 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">DS</div>
            </div>
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">National Command Center</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">ADMINISTRATIVE OVERSIGHT</h1>
          <p className="text-slate-500 mt-2 font-medium max-w-lg">Monitoring real-time fund flow, multi-agency compliance, and grievance resolution efficiency.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 px-5 py-3 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
            <i className="fa-solid fa-cloud-arrow-down"></i> Data Sync
          </button>
          <button onClick={() => onNavigate('verifications')} className="bg-slate-900 px-6 py-3 rounded-2xl text-sm font-bold text-white shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2">
            <i className="fa-solid fa-bolt-lightning text-amber-400"></i> Process Queue
          </button>
        </div>
      </header>
      
      <StatsCards />

      {/* AI Scrutiny Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative group">
           <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="relative w-40 h-40 shrink-0">
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
                  <span className="text-4xl font-black text-slate-900 tracking-tighter">{averageConfidence}%</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Avg. Confidence</span>
                </div>
              </div>
              <div className="flex-1 space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    AI Scrutiny Insights
                    <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest border border-indigo-100">Neural Sync</span>
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">Cross-referencing FIR semantics with victim testimonies across the worklist.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Applications Audited</p>
                    <p className="text-2xl font-black text-slate-900">{verifiedApps.length}</p>
                  </div>
                  <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Flagged for Review</p>
                    <p className="text-2xl font-black text-rose-600">{flaggedCount}</p>
                  </div>
                </div>
              </div>
              <div className="hidden xl:block w-px h-32 bg-slate-100"></div>
              <div className="flex-1 space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Critical AI Remarks</p>
                <div className="space-y-3">
                  {criticalRemarks.map(app => (
                    <div key={app.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
                      <div>
                        <p className="text-[11px] font-black text-slate-700 leading-tight mb-0.5">{app.id} / {app.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium truncate max-w-[180px] italic">"{app.aiVerification?.remarks}"</p>
                      </div>
                    </div>
                  ))}
                  {criticalRemarks.length === 0 && (
                    <p className="text-[11px] text-slate-400 font-bold italic">No critical anomalies detected in recent audit.</p>
                  )}
                </div>
              </div>
           </div>
           <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity">
              <i className="fa-solid fa-brain text-[12rem]"></i>
           </div>
        </div>
        <div className="lg:col-span-1 bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-center border border-slate-800">
           <div className="relative z-10 text-center">
              <i className="fa-solid fa-shield-virus text-4xl text-indigo-400 mb-4"></i>
              <h4 className="text-lg font-black tracking-tight mb-2">Integrity Shield</h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed px-4">AI verification prevents misallocation by detecting 99.2% of procedural inconsistencies.</p>
              <button onClick={() => onNavigate('verifications')} className="mt-6 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] hover:text-indigo-300 transition-colors">Audit Full Logs <i className="fa-solid fa-arrow-right ml-1"></i></button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Financial Disbursement Trends</h3>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-bold">Consolidated (₹ in Crores)</p>
            </div>
            <select className="bg-slate-50 border-none text-xs font-bold text-slate-600 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Last 6 Months</option>
              <option>Year to Date</option>
            </select>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_DATA}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '16px'}} />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {CHART_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === CHART_DATA.length - 1 ? '#4f46e5' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 text-lg mb-2">Scheme Distribution</h3>
          <p className="text-xs text-slate-400 mb-6 uppercase font-bold">Case Volume by Act</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={PIE_DATA} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {PIE_DATA.map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }}></div>
                  <span className="text-xs font-bold text-slate-600">{item.name}</span>
                </div>
                <span className="text-xs font-black text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-800 overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white mb-2">District Heatmap</h3>
            <p className="text-slate-400 text-sm mb-6">Real-time geographic distribution of pending cases.</p>
            <div className="bg-slate-800 h-64 rounded-2xl border border-slate-700 flex items-center justify-center relative">
               <i className="fa-solid fa-map-location-dot text-6xl text-slate-700 opacity-20"></i>
               <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
               <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-amber-500 rounded-full animate-pulse delay-75 shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
               <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-150"></div>
            </div>
            <div className="mt-6 flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Resolved</span>
              </div>
            </div>
          </div>
        </div>
        <AILegalAssistant />
      </div>
    </div>
  );
};

export default OfficialDashboard;
