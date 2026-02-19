import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  aadhaar?: string;
  officialId?: string;
  password: string;
  role: 'victim' | 'official';
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  designation?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    aadhaar: {
      type: String,
      sparse: true,
      unique: true,
      index: true,
    },
    officialId: {
      type: String,
      sparse: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['victim', 'official'],
      required: true,
    },
    name: String,
    email: String,
    phone: String,
    department: String,
    designation: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>('User', UserSchema);
