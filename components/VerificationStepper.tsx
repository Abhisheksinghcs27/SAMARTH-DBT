
import React from 'react';

interface VerificationStepperProps {
  steps: { label: string; status: 'pending' | 'loading' | 'success' | 'error' }[];
}

const VerificationStepper: React.FC<VerificationStepperProps> = ({ steps }) => {
  return (
    <div className="space-y-4 py-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
              step.status === 'success' ? 'bg-emerald-500 border-emerald-500 text-white' :
              step.status === 'error' ? 'bg-red-500 border-red-500 text-white' :
              step.status === 'loading' ? 'bg-white border-indigo-500 text-indigo-500' :
              'bg-white border-slate-200 text-slate-300'
            }`}>
              {step.status === 'success' ? <i className="fa-solid fa-check text-[10px]"></i> :
               step.status === 'error' ? <i className="fa-solid fa-xmark text-[10px]"></i> :
               step.status === 'loading' ? <i className="fa-solid fa-circle-notch fa-spin text-[10px]"></i> :
               <span className="text-[10px]">{index + 1}</span>}
            </div>
            {index < steps.length - 1 && <div className="w-0.5 h-6 bg-slate-100 mt-1"></div>}
          </div>
          <div className="flex-1 pb-4">
            <p className={`text-xs font-bold uppercase tracking-wider ${
              step.status === 'pending' ? 'text-slate-300' : 'text-slate-700'
            }`}>
              {step.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VerificationStepper;
