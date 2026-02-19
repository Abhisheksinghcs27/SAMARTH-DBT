import mongoose, { Schema, Document } from 'mongoose';

export enum ApplicationStatus {
  PENDING = 'PENDING',
  VERIFIED_AADHAAR = 'VERIFIED_AADHAAR',
  VERIFIED_CCTNS = 'VERIFIED_CCTNS',
  SANCTIONED = 'SANCTIONED',
  DISBURSED = 'DISBURSED',
  REJECTED = 'REJECTED',
}

export enum CaseType {
  PCR_ACT = 'PCR Act, 1955',
  POA_ACT = 'PoA Act, 1989',
  INTERCASTE_MARRIAGE = 'Inter-caste Marriage Incentive',
}

export interface VerificationResult {
  isVerified: boolean;
  score: number;
  remarks: string;
  matchedFields: string[];
}

export interface IApplication extends Document {
  id: string;
  userId: mongoose.Types.ObjectId;
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
  documents?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    aadhaar: { type: String, required: true },
    phone: { type: String, required: true },
    caseType: {
      type: String,
      enum: Object.values(CaseType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.PENDING,
      index: true,
    },
    amount: { type: Number, required: true },
    firNumber: String,
    appliedDate: { type: String, required: true },
    bankAccount: { type: String, required: true },
    ifsc: { type: String, required: true },
    statement: String,
    aiVerification: {
      isVerified: Boolean,
      score: Number,
      remarks: String,
      matchedFields: [String],
    },
    dateOfBirth: String,
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Transgender', 'Other'],
    },
    fathersName: String,
    mothersName: String,
    permanentAddress: String,
    currentAddress: String,
    district: String,
    state: String,
    pinCode: String,
    email: String,
    alternatePhone: String,
    pan: String,
    voterId: String,
    casteCertificateNumber: String,
    casteCertificateIssuedBy: String,
    casteCertificateDate: String,
    incomeCertificateNumber: String,
    annualIncome: Number,
    incidentDate: String,
    incidentPlace: String,
    policeStation: String,
    firDate: String,
    firSections: String,
    accusedDetails: String,
    familyMembers: Number,
    dependents: Number,
    bankAccountHolderName: String,
    bankName: String,
    branchName: String,
    accountType: {
      type: String,
      enum: ['Savings', 'Current'],
    },
    documents: [String],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IApplication>('Application', ApplicationSchema);
