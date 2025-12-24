
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
}

export interface Grievance {
  id: string;
  beneficiaryId: string;
  subject: string;
  description: string;
  status: 'Open' | 'In-Progress' | 'Resolved' | 'Escalated';
  createdAt: string;
}

export interface VerificationResult {
  isVerified: boolean;
  score: number;
  remarks: string;
  matchedFields: string[];
}
