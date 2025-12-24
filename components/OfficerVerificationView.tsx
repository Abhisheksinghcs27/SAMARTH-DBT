
import React, { useState } from 'react';
import { Beneficiary, ApplicationStatus } from '../types';
import { analyzeCaseForVerification } from '../services/geminiService';
import { fetchCCTNSData, initiatePFMSTransfer, verifyAadhaar } from '../services/mockApi';
import VerificationStepper from './VerificationStepper';

interface OfficerVerificationViewProps {
  applications: Beneficiary[];
  onAction: (id: string, status: ApplicationStatus) => void;
}

const OfficerVerificationView: React.FC<OfficerVerificationViewProps> = ({ applications, onAction }) => {
  const [selectedApp, setSelectedApp] = useState<Beneficiary | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [vSteps, setVSteps] = useState<{ label: string; status: 'pending' | 'loading' | 'success' | 'error' }[]>([
    { label: 'Aadhaar Identity Check', status: 'pending' },
    { label: 'CCTNS FIR Lookup', status: 'pending' },
    { label: 'AI Semantic Match', status: 'pending' },
    { label: 'PFMS Bank Linkage', status: 'pending' },
  ]);

  const updateStep = (index: number, status: 'pending' | 'loading' | 'success' | 'error') => {
    setVSteps(prev => prev.map((s, i) => i === index ? { ...s, status } : s));
  };

  const resetSteps = () => {
    setVSteps([
      { label: 'Aadhaar Identity Check', status: 'pending' },
      { label: 'CCTNS FIR Lookup', status: 'pending' },
      { label: 'AI Semantic Match', status: 'pending' },
      { label: 'PFMS Bank Linkage', status: 'pending' },
    ]);
  };

  const handleVerificationFlow = async (app: Beneficiary) => {
    setIsProcessing(true);
    resetSteps();
    
    try {
      updateStep(0, 'loading');
      const aadhaarOk = await verifyAadhaar(app.aadhaar);
      if (!aadhaarOk) {
        updateStep(0, 'error');
        throw new Error("Aadhaar Verification Failed");
      }
      updateStep(0, 'success');
      
      updateStep(1, 'loading');
      const cctnsData = await fetchCCTNSData(app.firNumber || '');
      updateStep(1, 'success');
      
      updateStep(2, 'loading');
      const result = await analyzeCaseForVerification(cctnsData, app.statement || '');
      setAiAnalysis(result);
      updateStep(2, 'success');

      updateStep(3, 'loading');
      // Bank check simulation
      await new Promise(r => setTimeout(r, 1000));
      updateStep(3, 'success');
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDisbursement = async (app: Beneficiary) => {
    setIsProcessing(true);
    try {
      const response = await initiatePFMSTransfer(app.id, app.amount);
      setTimeout(() => onAction(app.id, ApplicationStatus.DISBURSED), 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 bg-slate-50/50 border-b border-slate-200 flex justify-between items-center">
            <div>
              <h3 className="font-black text-slate-800 text-xl tracking-tight">Review Worklist</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Pending Official Action</p>
            </div>
            <div className="bg-indigo-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-lg shadow-indigo-200">
              {applications.length}
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {applications.map((app) => (
              <div 
                key={app.id} 
                onClick={() => { setSelectedApp(app); setAiAnalysis(null); resetSteps(); }}
                className={`p-8 hover:bg-slate-50/50 cursor-pointer transition-all ${selectedApp?.id === app.id ? 'bg-indigo-50/30 border-l-8 border-indigo-600' : 'border-l-8 border-transparent'}`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-white border border-slate-100 rounded-3xl flex items-center justify-center text-slate-400 shadow-sm">
                      <i className="fa-solid fa-user-shield text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-lg leading-tight">{app.name}</h4>
                      <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mt-1">{app.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900 tracking-tighter">₹{app.amount.toLocaleString()}</p>
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                      app.status === ApplicationStatus.SANCTIONED ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {applications.length === 0 && (
              <div className="p-24 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fa-solid fa-clipboard-check text-slate-200 text-3xl"></i>
                </div>
                <p className="font-black text-slate-300 text-xl uppercase tracking-widest">Queue Cleared</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        {selectedApp ? (
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 p-10 sticky top-28 animate-fadeIn">
            <h3 className="font-black text-slate-900 text-2xl mb-8 tracking-tighter">Validation Engine</h3>
            
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification Status</span>
                <VerificationStepper steps={vSteps} />
              </div>

              {aiAnalysis && (
                <div className={`p-8 rounded-3xl border-2 transition-all ${aiAnalysis.isVerified ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">AI Integrity Score</span>
                    <span className={`text-2xl font-black ${aiAnalysis.isVerified ? 'text-emerald-600' : 'text-red-600'}`}>{aiAnalysis.score}%</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-4 font-medium leading-relaxed italic">"{aiAnalysis.remarks}"</p>
                  <div className="flex flex-wrap gap-2">
                    {aiAnalysis.matchedFields.map((field: string, i: number) => (
                      <span key={i} className="text-[9px] bg-white border border-slate-200 px-3 py-1 rounded-full text-slate-500 font-bold uppercase">{field}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 pt-6">
                {!aiAnalysis && !isProcessing && selectedApp.status === ApplicationStatus.PENDING && (
                  <button 
                    onClick={() => handleVerificationFlow(selectedApp)}
                    className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-sm hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
                  >
                    <i className="fa-solid fa-vial-circle-check text-indigo-400"></i>
                    Execute Global Check
                  </button>
                )}

                {selectedApp.status === ApplicationStatus.SANCTIONED ? (
                  <button 
                    disabled={isProcessing}
                    onClick={() => handleDisbursement(selectedApp)}
                    className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black text-sm hover:bg-emerald-700 shadow-xl shadow-emerald-200 disabled:opacity-50 transition-all uppercase tracking-widest flex items-center justify-center gap-3"
                  >
                    <i className="fa-solid fa-indian-rupee-sign"></i>
                    Final Release
                  </button>
                ) : (
                  <>
                    <button 
                      disabled={isProcessing || !aiAnalysis || !aiAnalysis.isVerified}
                      onClick={() => onAction(selectedApp.id, ApplicationStatus.SANCTIONED)}
                      className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-100 disabled:opacity-50 transition-all uppercase tracking-widest"
                    >
                      Authorize Payment
                    </button>
                    <button 
                      disabled={isProcessing}
                      onClick={() => onAction(selectedApp.id, ApplicationStatus.REJECTED)}
                      className="w-full bg-white text-red-600 py-4 rounded-3xl font-bold border-2 border-red-50 hover:bg-red-50 transition-all text-xs uppercase tracking-widest"
                    >
                      Decline Claim
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-100/50 rounded-[3rem] border-4 border-dashed border-slate-200 p-20 text-center sticky top-28">
            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-slate-200 shadow-xl rotate-12">
              <i className="fa-solid fa-hand-pointer text-4xl"></i>
            </div>
            <p className="text-slate-400 font-black text-lg uppercase tracking-tighter max-w-[150px] mx-auto leading-tight">Pick an entry to begin scrutiny</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficerVerificationView;
