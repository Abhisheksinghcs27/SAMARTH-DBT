
export enum ApplicationStatus {
  PENDING = 'PENDING',
  VERIFIED_AADHAAR = 'VERIFIED_AADHAAR',
  VERIFIED_CCTNS = 'VERIFIED_CCTNS',
  SANCTIONED = 'SANCTIONED',
  DISBURSED = 'DISBURSED',
  REJECTED = 'REJECTED'
}

export enum CaseType {
  PCR_ACT = 'PCR Act, 1955',
  POA_ACT = 'PoA Act, 1989',
  INTERCASTE_MARRIAGE = 'Inter-caste Marriage Incentive'
}

export interface VerificationResult {
  isVerified: boolean;
  score: number;
  remarks: string;
  matchedFields: string[];
}

export interface Beneficiary {
  id: string;
  name: string;
  aadhaar: string;
  phone: string;
  caseType: CaseType;
  status: ApplicationStatus;
  amount: number;
  firNumber?: string;
  appliedDate: string;
  bankAccount: string;
  ifsc: string;
  statement?: string;
  aiVerification?: VerificationResult;
  // Enhanced fields for government application
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Transgender' | 'Other';
  fathersName?: string;
  mothersName?: string;
  permanentAddress?: string;
  currentAddress?: string;
  district?: string;
  state?: string;
  pinCode?: string;
  email?: string;
  alternatePhone?: string;
  pan?: string;
  voterId?: string;
  casteCertificateNumber?: string;
  casteCertificateIssuedBy?: string;
  casteCertificateDate?: string;
  incomeCertificateNumber?: string;
  annualIncome?: number;
  incidentDate?: string;
  incidentPlace?: string;
  policeStation?: string;
  firDate?: string;
  firSections?: string;
  accusedDetails?: string;
  familyMembers?: number;
  dependents?: number;
  bankAccountHolderName?: string;
  bankName?: string;
  branchName?: string;
  accountType?: 'Savings' | 'Current';
}

export interface Grievance {
  id: string;
  beneficiaryId: string;
  subject: string;
  description: string;
  status: 'Open' | 'In-Progress' | 'Resolved' | 'Escalated';
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'application_submitted' | 'verification_started' | 'aadhaar_verified' | 'cctns_verified' | 'ai_verified' | 'sanctioned' | 'disbursed' | 'rejected' | 'comment';
  title: string;
  description: string;
  officerName?: string;
  officerId?: string;
  metadata?: Record<string, any>;
}

export interface TrackingData {
  applicationId: string;
  events: TimelineEvent[];
  currentStatus: ApplicationStatus;
  estimatedCompletionDate?: string;
  assignedOfficer?: {
    name: string;
    id: string;
    department: string;
  };
  paymentDetails?: {
    utrNumber?: string;
    transactionDate?: string;
    bankName?: string;
    accountNumber: string;
    ifsc: string;
  };
}
