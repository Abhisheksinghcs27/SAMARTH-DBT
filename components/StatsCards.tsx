import React from 'react';

const StatsCards: React.FC = () => {
  const stats = [
    { title: 'Total Beneficiaries', value: '14,208', diff: '+12%', icon: 'fa-users', color: 'indigo' },
    { title: 'Amount Disbursed', value: '₹42.8 Cr', diff: '+8%', icon: 'fa-indian-rupee-sign', color: 'emerald' },
    { title: 'Pending Checks', value: '1,124', diff: '-4%', icon: 'fa-clock-rotate-left', color: 'amber' },
    { title: 'Mean Processing', value: '4.2 Days', diff: '0%', icon: 'fa-bolt-lightning', color: 'rose' },
  ];

  const colors: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all group-hover:scale-110 ${colors[stat.color]}`}>
              <i className={`fa-solid ${stat.icon} text-lg`}></i>
            </div>
            <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${
              stat.diff.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}>
              {stat.diff}
            </span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.title}</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1 tracking-tighter">{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;