import mongoose, { Schema, Document } from 'mongoose';

export interface ITimelineEvent extends Document {
  applicationId: string;
  type:
    | 'application_submitted'
    | 'verification_started'
    | 'aadhaar_verified'
    | 'cctns_verified'
    | 'ai_verified'
    | 'sanctioned'
    | 'disbursed'
    | 'rejected'
    | 'comment';
  title: string;
  description: string;
  timestamp: string;
  officerName?: string;
  officerId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const TimelineEventSchema = new Schema<ITimelineEvent>(
  {
    applicationId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        'application_submitted',
        'verification_started',
        'aadhaar_verified',
        'cctns_verified',
        'ai_verified',
        'sanctioned',
        'disbursed',
        'rejected',
        'comment',
      ],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    timestamp: { type: String, required: true },
    officerName: String,
    officerId: String,
    metadata: Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITimelineEvent>('TimelineEvent', TimelineEventSchema);
