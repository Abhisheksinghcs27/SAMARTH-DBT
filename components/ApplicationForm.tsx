import React, { useState } from 'react';
import { CaseType, ApplicationStatus } from '../types';

interface ApplicationFormProps {
  onSubmit: (data: any) => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    aadhaar: '',
    phone: '',
    caseType: CaseType.POA_ACT,
    firNumber: '',
    bankAccount: '',
    ifsc: '',
    statement: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: `BT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      status: ApplicationStatus.PENDING,
      appliedDate: new Date().toISOString().split('T')[0],
      amount: formData.caseType === CaseType.INTERCASTE_MARRIAGE ? 250000 : 82500
    });
  };

  const InputField = ({ label, icon, ...props }: any) => (
    <div className="space-y-2">
      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
          <i className={`fa-solid ${icon} text-xs`}></i>
        </div>
        <input 
          {...props}
          className="w-full bg-slate-50 border border-slate-200 px-11 py-3.5 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-sm font-semibold"
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-indigo-900/5 border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-12 text-white relative">
          <div className="relative z-10">
            <h2 className="text-4xl font-black tracking-tight mb-3">Relief Application</h2>
            <p className="text-slate-400 text-lg font-medium opacity-80">Direct Benefit Transfer Eligibility Process</p>
          </div>
          <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-10 rotate-12">
            <i className="fa-solid fa-file-invoice text-9xl"></i>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-12 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputField 
              label="Full Legal Name" 
              icon="fa-user-tag" 
              required 
              placeholder="As per Aadhaar"
              value={formData.name}
              onChange={(e: any) => setFormData({...formData, name: e.target.value})}
            />
            <InputField 
              label="Aadhaar Number" 
              icon="fa-id-card" 
              required maxLength={12}
              placeholder="12-digit UID"
              value={formData.aadhaar}
              onChange={(e: any) => setFormData({...formData, aadhaar: e.target.value})}
            />
            <InputField 
              label="Contact Number" 
              icon="fa-mobile-screen" 
              required
              placeholder="10-digit primary"
              value={formData.phone}
              onChange={(e: any) => setFormData({...formData, phone: e.target.value})}
            />
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Relief Category</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                  <i className="fa-solid fa-tags text-xs"></i>
                </div>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-semibold appearance-none"
                  value={formData.caseType}
                  onChange={(e) => setFormData({...formData, caseType: e.target.value as CaseType})}
                >
                  <option value={CaseType.POA_ACT}>{CaseType.POA_ACT}</option>
                  <option value={CaseType.PCR_ACT}>{CaseType.PCR_ACT}</option>
                  <option value={CaseType.INTERCASTE_MARRIAGE}>{CaseType.INTERCASTE_MARRIAGE}</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <i className="fa-solid fa-chevron-down text-[10px]"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-8">Incident & Evidence</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <InputField 
                label="FIR Reference Number" 
                icon="fa-building-shield" 
                placeholder="e.g. RJ/JPR/2024/201"
                value={formData.firNumber}
                onChange={(e: any) => setFormData({...formData, firNumber: e.target.value})}
              />
              <div className="flex items-center gap-4 bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                <i className="fa-solid fa-circle-info text-indigo-500 text-xl"></i>
                <p className="text-[11px] font-bold text-indigo-700 leading-relaxed">FIR details are verified in real-time with CCTNS records. Ensure accuracy to avoid delay.</p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Case Narrative</label>
              <textarea 
                rows={4}
                required
                className="w-full bg-slate-50 border border-slate-200 px-6 py-4 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-sm font-medium resize-none"
                placeholder="Briefly describe the context of the incident for AI Scrutiny..."
                value={formData.statement}
                onChange={(e) => setFormData({...formData, statement: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-8">Financial Linkage</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField 
                label="Bank Account Number" 
                icon="fa-building-columns" 
                required
                value={formData.bankAccount}
                onChange={(e: any) => setFormData({...formData, bankAccount: e.target.value})}
              />
              <InputField 
                label="IFSC Code" 
                icon="fa-landmark" 
                required
                placeholder="e.g. SBIN0001234"
                value={formData.ifsc}
                onChange={(e: any) => setFormData({...formData, ifsc: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-12 flex gap-4">
            <button 
              type="submit"
              className="flex-1 bg-indigo-600 text-white font-black py-5 rounded-3xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 uppercase tracking-[0.2em] text-xs"
            >
              Lodge Application
            </button>
            <button 
              type="reset"
              className="px-10 bg-slate-100 text-slate-500 font-bold py-5 rounded-3xl hover:bg-slate-200 transition-all uppercase tracking-widest text-[10px]"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;