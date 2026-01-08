
import React, { useState, useMemo } from 'react';
import { Beneficiary, ApplicationStatus, CaseType } from '../../types';
import { analyzeCaseForVerification } from '../services/geminiService';
import { fetchCCTNSData, initiatePFMSTransfer, verifyAadhaar } from '../services/mockApi';
import VerificationStepper from './VerificationStepper';

interface OfficerVerificationViewProps {
  applications: Beneficiary[];
  onAction: (id: string, status: ApplicationStatus) => void;
}

type SortOption = 'date_asc' | 'date_desc' | 'amount_desc' | 'amount_asc' | 'priority';
type FilterStatus = ApplicationStatus | 'ALL';
type FilterCaseType = CaseType | 'ALL';

const OfficerVerificationView: React.FC<OfficerVerificationViewProps> = ({ applications, onAction }) => {
  const [selectedApp, setSelectedApp] = useState<Beneficiary | null>(null);
  const [selectedApps, setSelectedApps] = useState<Set<string>>(new Set());
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
  const [caseTypeFilter, setCaseTypeFilter] = useState<FilterCaseType>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('date_desc');
  const [showBulkActions, setShowBulkActions] = useState(false);
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

  // Calculate priority based on AI score and time in queue
  const getPriority = (app: Beneficiary): 'high' | 'medium' | 'low' => {
    const daysInQueue = Math.floor((Date.now() - new Date(app.appliedDate).getTime()) / (1000 * 60 * 60 * 24));
    const aiScore = app.aiVerification?.score || 0;
    
    if (daysInQueue > 7 || (aiScore > 0 && aiScore < 60)) return 'high';
    if (daysInQueue > 3 || (aiScore > 0 && aiScore < 80)) return 'medium';
    return 'low';
  };

  const getDaysInQueue = (app: Beneficiary): number => {
    return Math.floor((Date.now() - new Date(app.appliedDate).getTime()) / (1000 * 60 * 60 * 24));
  };

  // Filter and sort applications
  const filteredAndSortedApps = useMemo(() => {
    let filtered = applications.filter(app => {
      const matchesSearch = searchQuery === '' || 
        app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.caseType.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
      const matchesCaseType = caseTypeFilter === 'ALL' || app.caseType === caseTypeFilter;
      
      return matchesSearch && matchesStatus && matchesCaseType;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date_asc':
          return new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime();
        case 'date_desc':
          return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
        case 'amount_desc':
          return b.amount - a.amount;
        case 'amount_asc':
          return a.amount - b.amount;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[getPriority(b)] - priorityOrder[getPriority(a)];
        default:
          return 0;
      }
    });

    return filtered;
  }, [applications, searchQuery, statusFilter, caseTypeFilter, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const total = filteredAndSortedApps.length;
    const pending = filteredAndSortedApps.filter(a => a.status === ApplicationStatus.PENDING).length;
    const sanctioned = filteredAndSortedApps.filter(a => a.status === ApplicationStatus.SANCTIONED).length;
    const highPriority = filteredAndSortedApps.filter(a => getPriority(a) === 'high').length;
    const avgAmount = total > 0 
      ? Math.round(filteredAndSortedApps.reduce((sum, a) => sum + a.amount, 0) / total)
      : 0;
    
    return { total, pending, sanctioned, highPriority, avgAmount };
  }, [filteredAndSortedApps]);

  const handleBulkAction = (status: ApplicationStatus) => {
    selectedApps.forEach(id => {
      onAction(id, status);
    });
    setSelectedApps(new Set());
    setShowBulkActions(false);
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedApps);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedApps(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const toggleSelectAll = () => {
    if (selectedApps.size === filteredAndSortedApps.length) {
      setSelectedApps(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedApps(new Set(filteredAndSortedApps.map(a => a.id)));
      setShowBulkActions(true);
    }
  };

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Queue</div>
          <div className="text-3xl font-black text-slate-900">{stats.total}</div>
        </div>
        <div className="bg-amber-50 p-6 rounded-2xl border-2 border-amber-200 shadow-sm">
          <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">Pending</div>
          <div className="text-3xl font-black text-amber-700">{stats.pending}</div>
        </div>
        <div className="bg-emerald-50 p-6 rounded-2xl border-2 border-emerald-200 shadow-sm">
          <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Sanctioned</div>
          <div className="text-3xl font-black text-emerald-700">{stats.sanctioned}</div>
        </div>
        <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200 shadow-sm">
          <div className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2">High Priority</div>
          <div className="text-3xl font-black text-red-700">{stats.highPriority}</div>
        </div>
        <div className="bg-indigo-50 p-6 rounded-2xl border-2 border-indigo-200 shadow-sm">
          <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Avg Amount</div>
          <div className="text-2xl font-black text-indigo-700">₹{(stats.avgAmount / 1000).toFixed(0)}K</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-2 relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input
              type="text"
              placeholder="Search by ID, name, or case type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 font-medium focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
            className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 font-bold text-sm focus:outline-none focus:border-indigo-500 transition-all"
          >
            <option value="ALL">All Status</option>
            {Object.values(ApplicationStatus).map(status => (
              <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
            ))}
          </select>
          <select
            value={caseTypeFilter}
            onChange={(e) => setCaseTypeFilter(e.target.value as FilterCaseType)}
            className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 font-bold text-sm focus:outline-none focus:border-indigo-500 transition-all"
          >
            <option value="ALL">All Case Types</option>
            {Object.values(CaseType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 font-bold text-xs focus:outline-none focus:border-indigo-500 transition-all"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="amount_desc">Highest Amount</option>
              <option value="amount_asc">Lowest Amount</option>
              <option value="priority">Priority</option>
            </select>
            <span className="text-xs text-slate-500 font-bold">
              Showing {filteredAndSortedApps.length} of {applications.length}
            </span>
          </div>
          {showBulkActions && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-600">{selectedApps.size} selected</span>
              <button
                onClick={() => handleBulkAction(ApplicationStatus.SANCTIONED)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all"
              >
                Bulk Approve
              </button>
              <button
                onClick={() => { setSelectedApps(new Set()); setShowBulkActions(false); }}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-300 transition-all"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 bg-slate-50/50 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h3 className="font-black text-slate-800 text-xl tracking-tight">Review Worklist</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Pending Official Action</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleSelectAll}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-black text-slate-700 uppercase tracking-widest transition-all"
                >
                  {selectedApps.size === filteredAndSortedApps.length ? 'Deselect All' : 'Select All'}
                </button>
                <div className="bg-indigo-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-lg shadow-indigo-200">
                  {filteredAndSortedApps.length}
                </div>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {filteredAndSortedApps.map((app) => {
                const priority = getPriority(app);
                const daysInQueue = getDaysInQueue(app);
                const isSelected = selectedApps.has(app.id);
                const isActive = selectedApp?.id === app.id;
                
                return (
                  <div 
                    key={app.id} 
                    className={`p-8 hover:bg-slate-50/50 cursor-pointer transition-all relative ${
                      isActive ? 'bg-indigo-50/30 border-l-8 border-indigo-600' : 'border-l-8 border-transparent'
                    } ${isSelected ? 'bg-blue-50/50' : ''}`}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest('.checkbox-container')) {
                        toggleSelect(app.id);
                      } else {
                        setSelectedApp(app);
                        setAiAnalysis(null);
                        resetSteps();
                      }
                    }}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="checkbox-container flex items-center pt-1">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(app.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-5 h-5 rounded border-2 border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </div>
                        <div className="w-14 h-14 bg-white border border-slate-100 rounded-3xl flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                          <i className="fa-solid fa-user-shield text-xl"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h4 className="font-black text-slate-900 text-lg leading-tight">{app.name}</h4>
                            {priority === 'high' && (
                              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                                <i className="fa-solid fa-exclamation-triangle"></i>
                                High Priority
                              </span>
                            )}
                            {priority === 'medium' && (
                              <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                                Medium
                              </span>
                            )}
                            {app.aiVerification && (
                              <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                app.aiVerification.isVerified 
                                  ? 'bg-emerald-100 text-emerald-700' 
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                AI: {app.aiVerification.score}%
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">{app.id}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500 font-medium flex-wrap">
                            <span className="flex items-center gap-1">
                              <i className="fa-solid fa-calendar"></i>
                              {daysInQueue} days in queue
                            </span>
                            <span className="flex items-center gap-1">
                              <i className="fa-solid fa-file-lines"></i>
                              {app.caseType}
                            </span>
                            {app.firNumber && (
                              <span className="flex items-center gap-1">
                                <i className="fa-solid fa-shield-halved"></i>
                                {app.firNumber}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-lg font-black text-slate-900 tracking-tighter mb-2">₹{app.amount.toLocaleString()}</p>
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                          app.status === ApplicationStatus.SANCTIONED ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredAndSortedApps.length === 0 && (
                <div className="p-24 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fa-solid fa-clipboard-check text-slate-200 text-3xl"></i>
                  </div>
                  <p className="font-black text-slate-300 text-xl uppercase tracking-widest">No Applications Found</p>
                </div>
              )}
            </div>
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
