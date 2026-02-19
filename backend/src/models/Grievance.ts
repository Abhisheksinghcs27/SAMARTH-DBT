import mongoose, { Schema, Document } from 'mongoose';

export interface IGrievance extends Document {
  id: string;
  beneficiaryId: string;
  userId: mongoose.Types.ObjectId;
  subject: string;
  description: string;
  status: 'Open' | 'In-Progress' | 'Resolved' | 'Escalated';
  createdAt: string;
  resolvedAt?: string;
  resolution?: string;
  assignedOfficer?: mongoose.Types.ObjectId;
  createdAtDate: Date;
  updatedAt: Date;
}

const GrievanceSchema = new Schema<IGrievance>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    beneficiaryId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['Open', 'In-Progress', 'Resolved', 'Escalated'],
      default: 'Open',
      index: true,
    },
    createdAt: { type: String, required: true },
    resolvedAt: String,
    resolution: String,
    assignedOfficer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IGrievance>('Grievance', GrievanceSchema);
