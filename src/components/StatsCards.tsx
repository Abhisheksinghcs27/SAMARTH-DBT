import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const StatsCards: React.FC = () => {
  const [stats, setStats] = useState([
    { 
      title: 'Total Beneficiaries', 
      value: '0', 
      diff: '+0%', 
      icon: 'fa-users', 
      color: 'indigo',
      description: 'Across all schemes',
      trend: 'up'
    },
    { 
      title: 'Amount Disbursed', 
      value: '₹0', 
      diff: '+0%', 
      icon: 'fa-indian-rupee-sign', 
      color: 'emerald',
      description: 'FY 2024-25',
      trend: 'up'
    },
    { 
      title: 'Pending Verifications', 
      value: '0', 
      diff: '-0%', 
      icon: 'fa-clock-rotate-left', 
      color: 'amber',
      description: 'Under review',
      trend: 'down'
    },
    { 
      title: 'Sanctioned', 
      value: '0', 
      diff: '+0%', 
      icon: 'fa-check-circle', 
      color: 'rose',
      description: 'Ready for disbursement',
      trend: 'up'
    },
  ]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const result = await api.getApplicationStats();
        if (result) {
          const totalDisbursed = result.totalDisbursed || 0;
          const disbursedInCr = (totalDisbursed / 10000000).toFixed(1);
          
          setStats([
            { 
              title: 'Total Beneficiaries', 
              value: result.total?.toLocaleString() || '0', 
              diff: '+0%', 
              icon: 'fa-users', 
              color: 'indigo',
              description: 'Across all schemes',
              trend: 'up'
            },
            { 
              title: 'Amount Disbursed', 
              value: `₹${disbursedInCr} Cr`, 
              diff: '+0%', 
              icon: 'fa-indian-rupee-sign', 
              color: 'emerald',
              description: 'FY 2024-25',
              trend: 'up'
            },
            { 
              title: 'Pending Verifications', 
              value: result.pending?.toLocaleString() || '0', 
              diff: '-0%', 
              icon: 'fa-clock-rotate-left', 
              color: 'amber',
              description: 'Under review',
              trend: 'down'
            },
            { 
              title: 'Sanctioned', 
              value: result.sanctioned?.toLocaleString() || '0', 
              diff: '+0%', 
              icon: 'fa-check-circle', 
              color: 'rose',
              description: 'Ready for disbursement',
              trend: 'up'
            },
          ]);
        }
      } catch (error) {
        // Only log in development
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error('Failed to load stats:', error);
        }
        // Silently fail in production - stats will show default values
      }
    };

    loadStats();
  }, []);

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
            <div className="text-right">
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg block mb-1 ${
                stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {stat.diff}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">vs last month</span>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.title}</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1 tracking-tighter">{stat.value}</h3>
            <p className="text-[10px] text-slate-500 font-medium mt-1">{stat.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
