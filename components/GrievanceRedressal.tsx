import React, { useState } from 'react';
import { Grievance } from '../types';

const GrievanceRedressal: React.FC = () => {
  const [grievances, setGrievances] = useState<Grievance[]>([
    { id: 'GR-1024', beneficiaryId: 'BT-001', subject: 'Delay in DBT Disbursement', status: 'In-Progress', createdAt: '2024-05-10', description: 'Application sanctioned 5 days ago but amount not received.' },
    { id: 'GR-1011', beneficiaryId: 'BT-003', subject: 'Aadhaar Verification Failed', status: 'Resolved', createdAt: '2024-05-02', description: 'System kept showing Aadhaar mismatch.' },
  ]);

  const [form, setForm] = useState({ id: '', subject: '', desc: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id || !form.subject) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      const newG: Grievance = {
        id: `GR-${Math.floor(Math.random() * 9000) + 1000}`,
        beneficiaryId: form.id,
        subject: form.subject,
        description: form.desc,
        status: 'Open',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setGrievances(prev => [newG, ...prev]);
      setForm({ id: '', subject: '', desc: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fadeIn">
      <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-indigo-900/5">
        <div className="mb-10">
          <div className="w-16 h-16 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center text-indigo-600 mb-8 shadow-inner">
            <i className="fa-solid fa-headset text-2xl"></i>
          </div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Lodge Grievance</h3>
          <p className="text-slate-400 font-medium mt-2">Nodal officers respond within a 48-hour service window.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Reference ID</label>
            <input 
              required
              value={form.id}
              onChange={e => setForm({...form, id: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-bold placeholder:text-slate-300" 
              placeholder="e.g. BT-2024-XXXXX" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Issue Subject</label>
            <input 
              required
              value={form.subject}
              onChange={e => setForm({...form, subject: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-bold placeholder:text-slate-300" 
              placeholder="Brief summary of concern" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Message Detail</label>
            <textarea 
              rows={4} 
              required
              value={form.desc}
              onChange={e => setForm({...form, desc: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 px-6 py-4 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium resize-none placeholder:text-slate-300" 
              placeholder="Provide context..." 
            />
          </div>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.5rem] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 uppercase tracking-widest text-[11px]"
          >
            {isSubmitting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
            Lodge Support Ticket
          </button>
        </form>
      </div>

      <div className="space-y-8">
        <div className="flex justify-between items-center px-4">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Tickets</h3>
          <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full uppercase tracking-widest">Global Status</span>
        </div>
        <div className="space-y-6">
          {grievances.map(g => (
            <div key={g.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-xl transition-all animate-fadeIn">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block mb-1">{g.id}</span>
                  <h4 className="font-black text-slate-900 text-lg tracking-tight">{g.subject}</h4>
                </div>
                <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm ${
                  g.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' : 
                  g.status === 'In-Progress' ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-500'
                }`}>
                  {g.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed italic mb-8">"{g.description}"</p>
              <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-2">
                  <i className="fa-regular fa-clock"></i>
                  FILED ON {g.createdAt}
                </span>
                <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">View Timeline</button>
              </div>
            </div>
          ))}
          {grievances.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100">
               <i className="fa-solid fa-check-double text-slate-200 text-4xl mb-4"></i>
               <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active complaints</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrievanceRedressal;