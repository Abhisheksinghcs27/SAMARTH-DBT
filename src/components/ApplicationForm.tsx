import React, { useState } from 'react';
import { CaseType, ApplicationStatus } from '../../types';

interface ApplicationFormProps {
  onSubmit: (data: any) => void;
}

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, icon, ...props }) => (
  <div className="space-y-2">
    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">
      {label}
      {props.required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
        <i className={`fa-solid ${icon} text-xs`}></i>
      </div>
      <input
        {...props}
        aria-label={label}
        className="w-full bg-slate-50 border border-slate-200 px-11 py-3.5 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-sm font-semibold"
      />
    </div>
  </div>
);

const SelectField: React.FC<{
  label: string;
  icon: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  options: { value: string; label: string }[];
}> = ({ label, icon, name, value, onChange, required, options }) => (
  <div className="space-y-2">
    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
        <i className={`fa-solid ${icon} text-xs`}></i>
      </div>
      <select
        className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-semibold appearance-none"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="">Select {label}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
        <i className="fa-solid fa-chevron-down text-[10px]"></i>
      </div>
    </div>
  </div>
);

const ApplicationForm: React.FC<ApplicationFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    dateOfBirth: '',
    gender: '',
    fathersName: '',
    mothersName: '',
    aadhaar: '',
    pan: '',
    voterId: '',
    phone: '',
    alternatePhone: '',
    email: '',
    
    // Address Details
    permanentAddress: '',
    currentAddress: '',
    district: '',
    state: '',
    pinCode: '',
    
    // Case Information
    caseType: CaseType.POA_ACT,
    
    // Incident Details
    incidentDate: '',
    incidentPlace: '',
    policeStation: '',
    firNumber: '',
    firDate: '',
    firSections: '',
    accusedDetails: '',
    statement: '',
    
    // Caste & Income
    casteCertificateNumber: '',
    casteCertificateIssuedBy: '',
    casteCertificateDate: '',
    incomeCertificateNumber: '',
    annualIncome: '',
    
    // Family Details
    familyMembers: '',
    dependents: '',
    
    // Bank Details
    bankAccountHolderName: '',
    bankAccount: '',
    bankName: '',
    branchName: '',
    ifsc: '',
    accountType: '',
    
    // Declaration
    declarationAccepted: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.declarationAccepted) {
      alert('Please accept the declaration to proceed');
      return;
    }
    onSubmit({
      ...formData,
      id: `BT-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`,
      status: ApplicationStatus.PENDING,
      appliedDate: new Date().toISOString().split('T')[0],
      amount: formData.caseType === CaseType.INTERCASTE_MARRIAGE ? 250000 : 82500,
      annualIncome: formData.annualIncome ? parseFloat(formData.annualIncome) : undefined,
      familyMembers: formData.familyMembers ? parseInt(formData.familyMembers) : undefined,
      dependents: formData.dependents ? parseInt(formData.dependents) : undefined
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir'
  ];

  return (
    <div className="max-w-5xl mx-auto animate-fadeIn pb-12">
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-indigo-900/5 border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 p-12 text-white relative">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <i className="fa-solid fa-file-invoice text-2xl"></i>
              </div>
              <div>
                <h2 className="text-4xl font-black tracking-tight">Application for Relief</h2>
                <p className="text-slate-300 text-sm font-bold mt-1">Under PCR Act, 1955 & PoA Act, 1989</p>
              </div>
            </div>
            <p className="text-slate-400 text-base font-medium opacity-90">Direct Benefit Transfer (DBT) Scheme - Government of India</p>
          </div>
          <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-10 rotate-12">
            <i className="fa-solid fa-shield-halved text-9xl"></i>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-10">
          {/* Section 1: Personal Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b-2 border-indigo-100">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-user text-indigo-600"></i>
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider">Section A: Personal Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField 
                label="Full Name (As per Aadhaar)" 
                icon="fa-user-tag" 
                required 
                placeholder="Enter full legal name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <InputField 
                label="Date of Birth" 
                icon="fa-calendar" 
                required
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
              />
              <SelectField
                label="Gender"
                icon="fa-venus-mars"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                options={[
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                  { value: 'Transgender', label: 'Transgender' },
                  { value: 'Other', label: 'Other' }
                ]}
              />
              <InputField 
                label="Father's / Husband's Name" 
                icon="fa-user-group" 
                required
                placeholder="Enter father's or husband's name"
                name="fathersName"
                value={formData.fathersName}
                onChange={handleChange}
              />
              <InputField 
                label="Mother's Name" 
                icon="fa-user-group" 
                required
                placeholder="Enter mother's name"
                name="mothersName"
                value={formData.mothersName}
                onChange={handleChange}
              />
              <InputField 
                label="Aadhaar Number" 
                icon="fa-id-card" 
                required 
                maxLength={12}
                placeholder="12-digit Aadhaar"
                name="aadhaar"
                value={formData.aadhaar}
                onChange={handleChange}
                pattern="[0-9]{12}"
              />
            </div>
          </div>

          {/* Section 2: Identity Documents */}
          <div className="pt-8 border-t border-slate-200 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b-2 border-indigo-100">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-id-badge text-indigo-600"></i>
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider">Section B: Identity & Documentation</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField 
                label="PAN Number (Optional)" 
                icon="fa-file-invoice" 
                placeholder="ABCDE1234F"
                name="pan"
                value={formData.pan}
                onChange={handleChange}
                maxLength={10}
                pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
              />
              <InputField 
                label="Voter ID Number (Optional)" 
                icon="fa-id-card-clip" 
                placeholder="Enter Voter ID"
                name="voterId"
                value={formData.voterId}
                onChange={handleChange}
              />
              <InputField 
                label="Caste Certificate Number" 
                icon="fa-certificate" 
                required
                placeholder="Certificate number"
                name="casteCertificateNumber"
                value={formData.casteCertificateNumber}
                onChange={handleChange}
              />
              <InputField 
                label="Issued By (Authority)" 
                icon="fa-building-columns" 
                required
                placeholder="e.g. SDM Office, District"
                name="casteCertificateIssuedBy"
                value={formData.casteCertificateIssuedBy}
                onChange={handleChange}
              />
              <InputField 
                label="Certificate Issue Date" 
                icon="fa-calendar-check" 
                required
                type="date"
                name="casteCertificateDate"
                value={formData.casteCertificateDate}
                onChange={handleChange}
              />
              <InputField 
                label="Income Certificate Number (Optional)" 
                icon="fa-file-contract" 
                placeholder="Certificate number"
                name="incomeCertificateNumber"
                value={formData.incomeCertificateNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Section 3: Contact & Address */}
          <div className="pt-8 border-t border-slate-200 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b-2 border-indigo-100">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-location-dot text-indigo-600"></i>
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider">Section C: Contact & Address Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField 
                label="Primary Mobile Number" 
                icon="fa-mobile-screen" 
                required
                placeholder="10-digit mobile number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
                pattern="[0-9]{10}"
              />
              <InputField 
                label="Alternate Mobile Number (Optional)" 
                icon="fa-phone" 
                placeholder="10-digit alternate number"
                name="alternatePhone"
                value={formData.alternatePhone}
                onChange={handleChange}
                maxLength={10}
              />
              <InputField 
                label="Email Address (Optional)" 
                icon="fa-envelope" 
                type="email"
                placeholder="your.email@example.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <div className="md:col-span-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1 block mb-2">
                  Permanent Address <span className="text-red-500">*</span>
                </label>
                <textarea 
                  required
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-sm font-medium resize-none"
                  placeholder="House No., Street, Village/Town"
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleChange}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1 block mb-2">
                  Current Address (If different from permanent)
                </label>
                <textarea 
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-sm font-medium resize-none"
                  placeholder="House No., Street, Village/Town"
                  name="currentAddress"
                  value={formData.currentAddress}
                  onChange={handleChange}
                />
              </div>
              <SelectField
                label="State"
                icon="fa-map"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                options={indianStates.map(s => ({ value: s, label: s }))}
              />
              <InputField 
                label="District" 
                icon="fa-city" 
                required
                placeholder="Enter district name"
                name="district"
                value={formData.district}
                onChange={handleChange}
              />
              <InputField 
                label="PIN Code" 
                icon="fa-location-pin" 
                required
                placeholder="6-digit PIN"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                maxLength={6}
                pattern="[0-9]{6}"
              />
            </div>
          </div>

          {/* Section 4: Case & Incident Details */}
          <div className="pt-8 border-t border-slate-200 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b-2 border-indigo-100">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-gavel text-indigo-600"></i>
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider">Section D: Case & Incident Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="Relief Category"
                icon="fa-tags"
                name="caseType"
                value={formData.caseType}
                onChange={handleChange}
                required
                options={[
                  { value: CaseType.POA_ACT, label: CaseType.POA_ACT },
                  { value: CaseType.PCR_ACT, label: CaseType.PCR_ACT },
                  { value: CaseType.INTERCASTE_MARRIAGE, label: CaseType.INTERCASTE_MARRIAGE }
                ]}
              />
              <InputField 
                label="Date of Incident" 
                icon="fa-calendar-days" 
                required
                type="date"
                name="incidentDate"
                value={formData.incidentDate}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
              />
              <InputField 
                label="Place of Incident" 
                icon="fa-map-location-dot" 
                required
                placeholder="Village/Town, District"
                name="incidentPlace"
                value={formData.incidentPlace}
                onChange={handleChange}
              />
              <InputField 
                label="Police Station" 
                icon="fa-building-shield" 
                required
                placeholder="Name of police station"
                name="policeStation"
                value={formData.policeStation}
                onChange={handleChange}
              />
              <InputField 
                label="FIR Number" 
                icon="fa-file-lines" 
                placeholder="e.g. RJ/JPR/2024/201"
                name="firNumber"
                value={formData.firNumber}
                onChange={handleChange}
              />
              <InputField 
                label="FIR Date" 
                icon="fa-calendar-check" 
                type="date"
                name="firDate"
                value={formData.firDate}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
              />
              <InputField 
                label="Sections Under Which FIR Registered" 
                icon="fa-book" 
                placeholder="e.g. IPC 323, 506, PoA Act Section 3(1)(r)"
                name="firSections"
                value={formData.firSections}
                onChange={handleChange}
              />
              <InputField 
                label="Details of Accused (Optional)" 
                icon="fa-user-shield" 
                placeholder="Name and details of accused persons"
                name="accusedDetails"
                value={formData.accusedDetails}
                onChange={handleChange}
              />
              <div className="md:col-span-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1 block mb-2">
                  Detailed Statement of Incident <span className="text-red-500">*</span>
                </label>
                <textarea 
                  required
                  rows={5}
                  className="w-full bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-sm font-medium resize-none"
                  placeholder="Provide a detailed account of the incident, including date, time, place, persons involved, and sequence of events. This will be used for AI verification against FIR records."
                  name="statement"
                  value={formData.statement}
                  onChange={handleChange}
                />
                <div className="flex items-start gap-3 bg-indigo-50 p-4 rounded-xl border border-indigo-100 mt-3">
                  <i className="fa-solid fa-circle-info text-indigo-500 text-lg mt-0.5"></i>
                  <p className="text-[11px] font-bold text-indigo-700 leading-relaxed">
                    <strong>Important:</strong> Your statement will be verified against CCTNS FIR records using AI. Ensure accuracy and consistency with the FIR details to avoid processing delays.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Family & Income Details */}
          <div className="pt-8 border-t border-slate-200 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b-2 border-indigo-100">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-users text-indigo-600"></i>
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider">Section E: Family & Income Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField 
                label="Total Family Members" 
                icon="fa-people-group" 
                required
                type="number"
                placeholder="Number of family members"
                name="familyMembers"
                value={formData.familyMembers}
                onChange={handleChange}
                min="1"
              />
              <InputField 
                label="Number of Dependents" 
                icon="fa-child" 
                required
                type="number"
                placeholder="Number of dependents"
                name="dependents"
                value={formData.dependents}
                onChange={handleChange}
                min="0"
              />
              <InputField 
                label="Annual Family Income (₹)" 
                icon="fa-indian-rupee-sign" 
                required
                type="number"
                placeholder="Total annual income"
                name="annualIncome"
                value={formData.annualIncome}
                onChange={handleChange}
                min="0"
                step="1000"
              />
            </div>
          </div>

          {/* Section 6: Bank Details */}
          <div className="pt-8 border-t border-slate-200 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b-2 border-indigo-100">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-building-columns text-indigo-600"></i>
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider">Section F: Bank Account Details (For DBT)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField 
                label="Account Holder Name" 
                icon="fa-user" 
                required
                placeholder="As per bank records"
                name="bankAccountHolderName"
                value={formData.bankAccountHolderName}
                onChange={handleChange}
              />
              <InputField 
                label="Bank Account Number" 
                icon="fa-wallet" 
                required
                placeholder="Enter account number"
                name="bankAccount"
                value={formData.bankAccount}
                onChange={handleChange}
              />
              <InputField 
                label="Bank Name" 
                icon="fa-landmark" 
                required
                placeholder="Name of bank"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
              />
              <InputField 
                label="Branch Name" 
                icon="fa-building" 
                required
                placeholder="Branch name"
                name="branchName"
                value={formData.branchName}
                onChange={handleChange}
              />
              <InputField 
                label="IFSC Code" 
                icon="fa-barcode" 
                required
                placeholder="e.g. SBIN0001234"
                name="ifsc"
                value={formData.ifsc}
                onChange={handleChange}
                pattern="[A-Z]{4}0[A-Z0-9]{6}"
                style={{ textTransform: 'uppercase' }}
              />
              <SelectField
                label="Account Type"
                icon="fa-file-invoice-dollar"
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                required
                options={[
                  { value: 'Savings', label: 'Savings Account' },
                  { value: 'Current', label: 'Current Account' }
                ]}
              />
            </div>
            <div className="bg-amber-50 p-5 rounded-2xl border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-triangle-exclamation text-amber-600 text-xl mt-0.5"></i>
                <div>
                  <p className="text-xs font-black text-amber-900 uppercase tracking-wider mb-2">Important Instructions</p>
                  <ul className="text-xs font-bold text-amber-800 space-y-1 list-disc list-inside">
                    <li>Account must be linked with Aadhaar (Aadhaar Seeding)</li>
                    <li>Account holder name should match with Aadhaar name</li>
                    <li>Ensure account is active and operational</li>
                    <li>Payment will be credited via PFMS (Public Financial Management System)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Section 7: Document Upload */}
          <div className="pt-8 border-t border-slate-200 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b-2 border-indigo-100">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-file-upload text-indigo-600"></i>
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider">Section G: Required Documents</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Aadhaar Card Copy', icon: 'fa-id-card', required: true },
                { label: 'FIR Copy', icon: 'fa-file-lines', required: true },
                { label: 'Caste Certificate', icon: 'fa-certificate', required: true },
                { label: 'Bank Passbook/Cancelled Cheque', icon: 'fa-book', required: true },
                { label: 'Income Certificate (if applicable)', icon: 'fa-file-contract', required: false },
                { label: 'Affidavit (Self-attested)', icon: 'fa-file-signature', required: true }
              ].map((doc, idx) => (
                <div key={idx} className="border-2 border-dashed border-slate-300 rounded-2xl p-6 hover:border-indigo-400 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                      <i className={`fa-solid ${doc.icon} text-slate-600 text-lg`}></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-slate-900 mb-1">
                        {doc.label}
                        {doc.required && <span className="text-red-500 ml-1">*</span>}
                      </p>
                      <button
                        type="button"
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-2"
                      >
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                        Upload Document (PDF/Image, Max 5MB)
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <p className="text-xs font-bold text-slate-600">
                <i className="fa-solid fa-info-circle text-indigo-600 mr-2"></i>
                All documents should be clear, legible, and self-attested. Maximum file size per document: 5MB. Accepted formats: PDF, JPG, PNG.
              </p>
            </div>
          </div>

          {/* Section 8: Declaration */}
          <div className="pt-8 border-t-2 border-slate-300 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b-2 border-indigo-100">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-handshake text-indigo-600"></i>
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider">Section H: Declaration & Consent</h3>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200">
              <div className="space-y-4 text-sm font-medium text-slate-700 leading-relaxed">
                <p>
                  I hereby declare that all the information furnished above is true, correct, and complete to the best of my knowledge and belief. 
                  I understand that any false or misleading information provided may result in rejection of my application and legal action.
                </p>
                <p>
                  I consent to the verification of my details through Aadhaar, CCTNS, and other government databases as required for processing this application.
                </p>
                <p>
                  I understand that the relief amount will be transferred directly to my bank account through the Direct Benefit Transfer (DBT) system.
                </p>
                <p>
                  I agree to provide any additional documents or information as may be required by the concerned authorities during the verification process.
                </p>
              </div>
              <div className="mt-6 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="declaration"
                  name="declarationAccepted"
                  checked={formData.declarationAccepted}
                  onChange={handleChange}
                  required
                  className="mt-1 w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="declaration" className="text-sm font-black text-slate-900 cursor-pointer">
                  I accept the above declaration and confirm that all information provided is correct. <span className="text-red-500">*</span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-8 flex flex-col sm:flex-row gap-4">
            <button 
              type="submit"
              className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-black py-5 rounded-3xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-xl shadow-indigo-200 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3"
            >
              <i className="fa-solid fa-paper-plane"></i>
              Submit Application
            </button>
            <button 
              type="reset"
              onClick={() => setFormData({
                name: '', dateOfBirth: '', gender: '', fathersName: '', mothersName: '',
                aadhaar: '', pan: '', voterId: '', phone: '', alternatePhone: '', email: '',
                permanentAddress: '', currentAddress: '', district: '', state: '', pinCode: '',
                caseType: CaseType.POA_ACT, incidentDate: '', incidentPlace: '', policeStation: '',
                firNumber: '', firDate: '', firSections: '', accusedDetails: '', statement: '',
                casteCertificateNumber: '', casteCertificateIssuedBy: '', casteCertificateDate: '',
                incomeCertificateNumber: '', annualIncome: '', familyMembers: '', dependents: '',
                bankAccountHolderName: '', bankAccount: '', bankName: '', branchName: '', ifsc: '', accountType: '',
                declarationAccepted: false
              })}
              className="px-10 bg-slate-100 text-slate-600 font-black py-5 rounded-3xl hover:bg-slate-200 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-rotate-left"></i>
              Reset Form
            </button>
          </div>

          {/* Footer Note */}
          <div className="pt-6 border-t border-slate-200">
            <p className="text-center text-xs font-bold text-slate-500">
              <i className="fa-solid fa-shield-halved text-indigo-600 mr-2"></i>
              Your application will be processed as per the guidelines of the PCR Act, 1955 and PoA Act, 1989. 
              Application ID will be generated upon successful submission.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
