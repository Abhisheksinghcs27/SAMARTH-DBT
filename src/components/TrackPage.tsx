
import React, { useState, useEffect, useMemo } from 'react';
import { Beneficiary, ApplicationStatus, TrackingData, TimelineEvent } from '../../types';
import { api } from '../services/api';

interface TrackPageProps {
  applications: Beneficiary[];
  userRole: 'victim' | 'official';
}

const TrackPage: React.FC<TrackPageProps> = ({ applications, userRole }) => {
  const [selectedApp, setSelectedApp] = useState<Beneficiary | null>(null);
  const [trackingData, setTrackingData] = useState<Map<string, TrackingData>>(new Map());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'ALL'>('ALL');
  const [isLoading, setIsLoading] = useState(false);

  // Load tracking data for applications
  useEffect(() => {
    const loadTrackingData = async () => {
      setIsLoading(true);
      const newTrackingData = new Map<string, TrackingData>();

      for (const app of applications) {
        try {
          const result = await api.getTracking(app.id);
          if (result.tracking) {
            newTrackingData.set(app.id, result.tracking);
          }
        } catch (error) {
          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.error(`Failed to load tracking for ${app.id}:`, error);
          }
          // Silently fail in production - tracking data will be unavailable
        }
      }

      setTrackingData(newTrackingData);
      setIsLoading(false);
    };

    if (applications.length > 0) {
      loadTrackingData();
    } else {
      setIsLoading(false);
    }
  }, [applications]);

  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = searchQuery === '' || 
        app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.caseType.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchQuery, statusFilter]);

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'application_submitted': return 'fa-file-circle-plus';
      case 'verification_started': return 'fa-hourglass-half';
      case 'aadhaar_verified': return 'fa-fingerprint';
      case 'cctns_verified': return 'fa-shield-halved';
      case 'ai_verified': return 'fa-robot';
      case 'sanctioned': return 'fa-check-circle';
      case 'disbursed': return 'fa-money-bill-wave';
      case 'rejected': return 'fa-xmark-circle';
      default: return 'fa-circle';
    }
  };

  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'application_submitted': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'verification_started': return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'aadhaar_verified': return 'bg-indigo-100 text-indigo-600 border-indigo-200';
      case 'cctns_verified': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'ai_verified': return 'bg-cyan-100 text-cyan-600 border-cyan-200';
      case 'sanctioned': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'disbursed': return 'bg-green-100 text-green-600 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const badges = {
      [ApplicationStatus.PENDING]: 'bg-amber-100 text-amber-700 border-amber-200',
      [ApplicationStatus.VERIFIED_AADHAAR]: 'bg-blue-100 text-blue-700 border-blue-200',
      [ApplicationStatus.VERIFIED_CCTNS]: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      [ApplicationStatus.SANCTIONED]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      [ApplicationStatus.DISBURSED]: 'bg-green-100 text-green-700 border-green-200',
      [ApplicationStatus.REJECTED]: 'bg-red-100 text-red-700 border-red-200'
    };
    return badges[status] || badges[ApplicationStatus.PENDING];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-bold">Loading tracking data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
          <i className="fa-solid fa-tower-broadcast animate-pulse"></i>
          Live Tracking Active
        </div>
        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter">
          {userRole === 'official' ? 'Application Tracking' : 'Your Case Journey'}
        </h2>
        <p className="text-slate-500 font-medium px-4">
          {userRole === 'official' 
            ? 'Monitor and track all applications in real-time' 
            : 'Transparent, end-to-end monitoring of your relief application.'}
        </p>
      </header>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
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
            onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | 'ALL')}
            className="px-6 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 font-bold text-sm focus:outline-none focus:border-indigo-500 transition-all"
          >
            <option value="ALL">All Status</option>
            {Object.values(ApplicationStatus).map(status => (
              <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 font-bold">
          <i className="fa-solid fa-filter"></i>
          <span>Showing {filteredApps.length} of {applications.length} applications</span>
        </div>
      </div>
      
      <div className="space-y-8">
        {filteredApps.length === 0 ? (
          <div className="bg-white p-24 rounded-3xl border border-slate-200 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-inbox text-slate-200 text-4xl"></i>
            </div>
            <p className="font-black text-slate-400 text-xl uppercase tracking-tighter">No applications found</p>
          </div>
        ) : (
          filteredApps.map(app => {
            const tracking = trackingData.get(app.id);
            const isSelected = selectedApp?.id === app.id;
            
            return (
              <div 
                key={app.id} 
                className={`bg-white rounded-[2rem] sm:rounded-[3rem] shadow-sm border-2 transition-all hover:shadow-xl hover:shadow-indigo-500/5 group ${
                  isSelected ? 'border-indigo-500 shadow-lg' : 'border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div 
                  className="p-6 sm:p-10 cursor-pointer"
                  onClick={() => setSelectedApp(isSelected ? null : app)}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sm:mb-10 gap-6">
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 rounded-[1.25rem] sm:rounded-[1.5rem] flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-400 transition-colors">
                        <i className="fa-solid fa-folder-open text-xl sm:text-2xl"></i>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">{app.id}</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">FILED {app.appliedDate}</span>
                          <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full border ${getStatusBadge(app.status)}`}>
                            {app.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">{app.name}</h3>
                        <p className="text-sm text-slate-500 font-medium mt-1">{app.caseType}</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] text-right shrink-0 border border-slate-100 group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all w-full md:w-auto">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-200">Total Sanction</p>
                      <p className="text-2xl sm:text-3xl font-black text-indigo-600 tracking-tighter group-hover:text-white transition-colors">₹{app.amount.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="relative pt-8 px-2 sm:px-6 pb-2">
                    <div className="flex justify-between relative z-10">
                      {['Applied', 'Verified', 'Sanctioned', 'Settled'].map((step, idx) => {
                        const isComplete = (idx === 0) || 
                                         (idx === 1 && ![ApplicationStatus.PENDING].includes(app.status)) ||
                                         (idx === 2 && [ApplicationStatus.SANCTIONED, ApplicationStatus.DISBURSED].includes(app.status)) ||
                                         (idx === 3 && app.status === ApplicationStatus.DISBURSED);
                        return (
                          <div key={step} className="flex flex-col items-center w-16 text-center">
                            <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-[1.25rem] sm:rounded-[1.5rem] flex items-center justify-center text-sm font-bold border-2 transition-all duration-700 shadow-sm ${
                              isComplete ? 'bg-indigo-600 border-indigo-600 text-white rotate-[15deg] scale-110 shadow-xl shadow-indigo-200' : 'bg-white border-slate-100 text-slate-300'
                            }`}>
                              {isComplete ? <i className="fa-solid fa-check"></i> : idx + 1}
                            </div>
                            <span className={`text-[9px] sm:text-[10px] mt-4 sm:mt-6 font-black uppercase tracking-[0.1em] ${isComplete ? 'text-indigo-600' : 'text-slate-300'}`}>
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="absolute top-[32px] sm:top-[36px] left-10 right-10 sm:left-14 sm:right-14 h-1.5 bg-slate-50 -z-0 rounded-full"></div>
                    <div 
                      className={`absolute top-[32px] sm:top-[36px] left-10 sm:left-14 h-1.5 bg-indigo-600 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-full shadow-[0_0_15px_rgba(79,70,229,0.3)] ${
                        app.status === ApplicationStatus.DISBURSED 
                          ? 'w-[calc(100%-80px)] sm:w-[calc(100%-112px)]' 
                          : ''
                      }`}
                      style={app.status !== ApplicationStatus.DISBURSED ? { 
                        width: app.status === ApplicationStatus.SANCTIONED 
                          ? '66%' 
                          : app.status === ApplicationStatus.PENDING 
                            ? '0%' 
                            : '33%'
                      } : undefined}
                    ></div>
                  </div>
                </div>

                {/* Expanded Timeline View */}
                {isSelected && tracking && (
                  <div className="border-t border-slate-200 p-6 sm:p-10 bg-slate-50/30 animate-fadeIn">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Timeline */}
                      <div className="lg:col-span-2">
                        <h4 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                          <i className="fa-solid fa-timeline text-indigo-600"></i>
                          Timeline Events
                        </h4>
                        <div className="space-y-4">
                          {tracking.events.map((event, idx) => (
                            <div key={event.id} className="relative pl-10 pb-6 last:pb-0">
                              {idx < tracking.events.length - 1 && (
                                <div className="absolute left-5 top-8 bottom-0 w-0.5 bg-slate-200"></div>
                              )}
                              <div className="relative">
                                <div className={`absolute left-0 w-10 h-10 rounded-2xl flex items-center justify-center border-2 ${getEventColor(event.type)}`}>
                                  <i className={`fa-solid ${getEventIcon(event.type)} text-sm`}></i>
                                </div>
                                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                                  <div className="flex justify-between items-start mb-2">
                                    <h5 className="font-black text-slate-900">{event.title}</h5>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                                      {formatDate(event.timestamp)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-slate-600 font-medium mb-3">{event.description}</p>
                                  {event.officerName && (
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                      <i className="fa-solid fa-user-tie"></i>
                                      <span className="font-bold">{event.officerName}</span>
                                      {event.officerId && (
                                        <>
                                          <span className="text-slate-300">•</span>
                                          <span>{event.officerId}</span>
                                        </>
                                      )}
                                    </div>
                                  )}
                                  {event.metadata && Object.keys(event.metadata).length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-slate-100">
                                      <div className="flex flex-wrap gap-2">
                                        {Object.entries(event.metadata).map(([key, value]) => (
                                          <span key={key} className="text-[9px] bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg text-slate-600 font-bold">
                                            {key}: {String(value)}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Details Sidebar */}
                      <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                          <h5 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-widest">Application Details</h5>
                          <div className="space-y-3 text-xs">
                            <div>
                              <span className="text-slate-400 font-bold uppercase block mb-1">Application ID</span>
                              <span className="text-slate-900 font-black">{app.id}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 font-bold uppercase block mb-1">Case Type</span>
                              <span className="text-slate-900 font-black">{app.caseType}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 font-bold uppercase block mb-1">Applied Date</span>
                              <span className="text-slate-900 font-black">{formatDate(app.appliedDate)}</span>
                            </div>
                            {tracking.assignedOfficer && (
                              <div>
                                <span className="text-slate-400 font-bold uppercase block mb-1">Assigned Officer</span>
                                <span className="text-slate-900 font-black">{tracking.assignedOfficer.name}</span>
                                <span className="text-slate-500 text-[10px] block mt-1">{tracking.assignedOfficer.department}</span>
                              </div>
                            )}
                            {tracking.estimatedCompletionDate && (
                              <div>
                                <span className="text-slate-400 font-bold uppercase block mb-1">Estimated Completion</span>
                                <span className="text-slate-900 font-black">{formatDate(tracking.estimatedCompletionDate)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {tracking.paymentDetails && (
                          <div className="bg-emerald-50 rounded-2xl p-6 border-2 border-emerald-200 shadow-sm">
                            <h5 className="text-sm font-black text-emerald-900 mb-4 uppercase tracking-widest flex items-center gap-2">
                              <i className="fa-solid fa-money-bill-wave"></i>
                              Payment Details
                            </h5>
                            <div className="space-y-3 text-xs">
                              {tracking.paymentDetails.utrNumber && (
                                <div>
                                  <span className="text-emerald-700 font-bold uppercase block mb-1">UTR Number</span>
                                  <span className="text-emerald-900 font-black">{tracking.paymentDetails.utrNumber}</span>
                                </div>
                              )}
                              {tracking.paymentDetails.transactionDate && (
                                <div>
                                  <span className="text-emerald-700 font-bold uppercase block mb-1">Transaction Date</span>
                                  <span className="text-emerald-900 font-black">{formatDate(tracking.paymentDetails.transactionDate)}</span>
                                </div>
                              )}
                              <div>
                                <span className="text-emerald-700 font-bold uppercase block mb-1">Bank Account</span>
                                <span className="text-emerald-900 font-black">****{app.bankAccount.slice(-4)}</span>
                              </div>
                              <div>
                                <span className="text-emerald-700 font-bold uppercase block mb-1">IFSC</span>
                                <span className="text-emerald-900 font-black">{app.ifsc}</span>
                              </div>
                            </div>
                            <button className="w-full mt-4 bg-emerald-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all">
                              <i className="fa-solid fa-download mr-2"></i>
                              Download Receipt
                            </button>
                          </div>
                        )}

                        {app.aiVerification && (
                          <div className={`rounded-2xl p-6 border-2 shadow-sm ${
                            app.aiVerification.isVerified 
                              ? 'bg-emerald-50 border-emerald-200' 
                              : 'bg-red-50 border-red-200'
                          }`}>
                            <h5 className="text-sm font-black mb-4 uppercase tracking-widest flex items-center gap-2">
                              <i className="fa-solid fa-robot"></i>
                              AI Verification
                            </h5>
                            <div className="space-y-3">
                              <div>
                                <span className="text-xs font-bold uppercase block mb-1">Score</span>
                                <span className={`text-2xl font-black ${
                                  app.aiVerification.isVerified ? 'text-emerald-700' : 'text-red-700'
                                }`}>
                                  {app.aiVerification.score}%
                                </span>
                              </div>
                              <div>
                                <span className="text-xs font-bold uppercase block mb-2">Matched Fields</span>
                                <div className="flex flex-wrap gap-2">
                                  {app.aiVerification.matchedFields.map((field, i) => (
                                    <span key={i} className="text-[9px] bg-white border border-slate-200 px-2 py-1 rounded-lg font-bold">
                                      {field}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {app.status === ApplicationStatus.DISBURSED && !isSelected && (
                  <div className="border-t border-slate-200 p-6 sm:p-6 bg-emerald-50 rounded-b-[2rem] sm:rounded-b-[3rem] flex flex-wrap items-center justify-between gap-4 animate-fadeIn">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                        <i className="fa-solid fa-shield-heart"></i>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Payment Settled</p>
                        <p className="text-xs font-bold text-slate-600">Funds transferred via PFMS gateway</p>
                      </div>
                    </div>
                    <button className="text-xs font-black text-emerald-700 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                      Download Receipt
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TrackPage;
