/**
 * Seed script to populate database with demo users
 * Run with: npm run seed
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';
import Application, { ApplicationStatus, CaseType } from '../models/Application';
import Grievance from '../models/Grievance';
import TimelineEvent from '../models/TimelineEvent';
import { connectDatabase } from '../config/database';
import { generateGrievanceId } from '../utils/generateId';

// Load environment variables
dotenv.config();

const demoVictims = [
  {
    aadhaar: '123456789012',
    password: 'victim123',
    role: 'victim' as const,
  },
  {
    aadhaar: '987654321098',
    password: 'test1234',
    role: 'victim' as const,
  },
  {
    aadhaar: '111122223333',
    password: 'demo1234',
    role: 'victim' as const,
  },
];

const demoOfficials = [
  {
    officialId: 'OFF001',
    password: 'official123',
    role: 'official' as const,
    name: 'Rajesh Kumar',
    department: 'District Administration',
    designation: 'District Collector',
    email: 'rajesh.kumar@samarth.gov.in',
  },
  {
    officialId: 'OFF002',
    password: 'admin1234',
    role: 'official' as const,
    name: 'Priya Sharma',
    department: 'Social Welfare',
    designation: 'Deputy Director',
    email: 'priya.sharma@samarth.gov.in',
  },
  {
    officialId: 'OFF003',
    password: 'verify123',
    role: 'official' as const,
    name: 'Amit Patel',
    department: 'Verification Unit',
    designation: 'Verification Officer',
    email: 'amit.patel@samarth.gov.in',
  },
];

type DemoApplicationSeed = {
  id: string;
  victimAadhaar: string;
  name: string;
  phone: string;
  caseType: CaseType;
  status: ApplicationStatus;
  amount: number;
  appliedDaysAgo?: number;
  aiScore?: number;
};

const DEMO_APPLICATIONS: DemoApplicationSeed[] = [
  {
    id: 'BT-DEMO-0001',
    victimAadhaar: '123456789012',
    name: 'Demo Victim One',
    phone: '9876543210',
    caseType: CaseType.POA_ACT,
    status: ApplicationStatus.PENDING,
    amount: 82500,
    appliedDaysAgo: 9,
    aiScore: 35,
  },
  {
    id: 'BT-DEMO-0002',
    victimAadhaar: '123456789012',
    name: 'Demo Victim One',
    phone: '9876543210',
    caseType: CaseType.PCR_ACT,
    status: ApplicationStatus.VERIFIED_AADHAAR,
    amount: 82500,
    appliedDaysAgo: 7,
    aiScore: 82,
  },
  {
    id: 'BT-DEMO-0003',
    victimAadhaar: '987654321098',
    name: 'Demo Victim Two',
    phone: '9123456780',
    caseType: CaseType.POA_ACT,
    status: ApplicationStatus.VERIFIED_CCTNS,
    amount: 82500,
    appliedDaysAgo: 11,
    aiScore: 88,
  },
  {
    id: 'BT-DEMO-0004',
    victimAadhaar: '111122223333',
    name: 'Demo Victim Three',
    phone: '9012345678',
    caseType: CaseType.INTERCASTE_MARRIAGE,
    status: ApplicationStatus.SANCTIONED,
    amount: 250000,
    appliedDaysAgo: 15,
    aiScore: 91,
  },
  {
    id: 'BT-DEMO-0005',
    victimAadhaar: '987654321098',
    name: 'Demo Victim Two',
    phone: '9123456780',
    caseType: CaseType.PCR_ACT,
    status: ApplicationStatus.DISBURSED,
    amount: 82500,
    appliedDaysAgo: 18,
    aiScore: 95,
  },
  {
    id: 'BT-DEMO-0006',
    victimAadhaar: '111122223333',
    name: 'Demo Victim Three',
    phone: '9012345678',
    caseType: CaseType.POA_ACT,
    status: ApplicationStatus.REJECTED,
    amount: 82500,
    appliedDaysAgo: 13,
    aiScore: 41,
  },
  {
    id: 'BT-DEMO-0007',
    victimAadhaar: '123456789012',
    name: 'Demo Victim One',
    phone: '9876543210',
    caseType: CaseType.POA_ACT,
    status: ApplicationStatus.PENDING,
    amount: 82500,
    appliedDaysAgo: 3,
    aiScore: 72,
  },
  {
    id: 'BT-DEMO-0008',
    victimAadhaar: '987654321098',
    name: 'Demo Victim Two',
    phone: '9123456780',
    caseType: CaseType.INTERCASTE_MARRIAGE,
    status: ApplicationStatus.VERIFIED_AADHAAR,
    amount: 250000,
    appliedDaysAgo: 5,
    aiScore: 64,
  },
  {
    id: 'BT-DEMO-0009',
    victimAadhaar: '111122223333',
    name: 'Demo Victim Three',
    phone: '9012345678',
    caseType: CaseType.POA_ACT,
    status: ApplicationStatus.PENDING,
    amount: 82500,
    appliedDaysAgo: 2,
    aiScore: 85,
  },
] as const;

const DEMO_GRIEVANCES = [
  {
    // id will be generated on first run, but we’ll upsert by (beneficiaryId + userId + subject)
    beneficiaryId: 'BT-DEMO-0002',
    victimAadhaar: '123456789012',
    subject: 'Aadhaar verification taking longer than expected',
    description:
      'My application is stuck at Aadhaar verification. Please confirm if additional documents are required.',
    status: 'In-Progress' as const,
    assignToOfficialId: 'OFF003',
  },
  {
    beneficiaryId: 'BT-DEMO-0005',
    victimAadhaar: '987654321098',
    subject: 'Payment credited but SMS not received',
    description:
      'The amount is credited in my bank account but I did not receive any notification. Please share UTR details.',
    status: 'Resolved' as const,
    resolution:
      'UTR has been shared and SMS delivery confirmed. Please check SMS inbox/spam. Amount is successfully credited.',
    assignToOfficialId: 'OFF001',
  },
  {
    beneficiaryId: 'BT-DEMO-0006',
    victimAadhaar: '111122223333',
    subject: 'Application rejected - need clarification',
    description:
      'My application got rejected. Please share the exact reason and what changes are needed to re-apply.',
    status: 'Escalated' as const,
    assignToOfficialId: 'OFF002',
  },
] as const;

function isoDateDaysAgo(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

function isoTimestampDaysAgo(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

async function upsertApplicationTimeline(params: {
  applicationId: string;
  status: ApplicationStatus;
  officer?: { name: string; officialId: string };
  amount: number;
  caseType: CaseType;
}) {
  const { applicationId, status, officer, amount, caseType } = params;

  await TimelineEvent.deleteMany({ applicationId });

  const baseEvents: Array<{
    type: any;
    title: string;
    description: string;
    timestamp: string;
    metadata?: Record<string, any>;
  }> = [
    {
      type: 'application_submitted',
      title: 'Application Submitted',
      description: `Application ${applicationId} submitted for ${caseType}`,
      timestamp: isoTimestampDaysAgo(12),
      metadata: { caseType, amount },
    },
  ];

  if (status !== ApplicationStatus.PENDING) {
    baseEvents.push({
      type: 'verification_started',
      title: 'Verification Started',
      description: 'Your application has entered the verification pipeline.',
      timestamp: isoTimestampDaysAgo(11),
    });
  }

  if (
    [
      ApplicationStatus.VERIFIED_AADHAAR,
      ApplicationStatus.VERIFIED_CCTNS,
      ApplicationStatus.SANCTIONED,
      ApplicationStatus.DISBURSED,
    ].includes(status)
  ) {
    baseEvents.push({
      type: 'aadhaar_verified',
      title: 'Aadhaar Verified',
      description: 'Aadhaar verification completed successfully.',
      timestamp: isoTimestampDaysAgo(10),
      metadata: { score: 0.96 },
    });
  }

  if (
    [
      ApplicationStatus.VERIFIED_CCTNS,
      ApplicationStatus.SANCTIONED,
      ApplicationStatus.DISBURSED,
    ].includes(status)
  ) {
    baseEvents.push({
      type: 'cctns_verified',
      title: 'CCTNS Verified',
      description: 'FIR / CCTNS details verified successfully.',
      timestamp: isoTimestampDaysAgo(9),
      metadata: { firMatch: true },
    });
  }

  // Add an AI verification event for richer demo tracking UI
  if (
    [
      ApplicationStatus.VERIFIED_CCTNS,
      ApplicationStatus.SANCTIONED,
      ApplicationStatus.DISBURSED,
    ].includes(status)
  ) {
    baseEvents.push({
      type: 'ai_verified',
      title: 'AI Verification Completed',
      description: 'AI checks completed with high confidence.',
      timestamp: isoTimestampDaysAgo(8),
      metadata: { score: 0.92, matchedFields: ['name', 'aadhaar', 'dob'] },
    });
  }

  if ([ApplicationStatus.SANCTIONED, ApplicationStatus.DISBURSED].includes(status)) {
    baseEvents.push({
      type: 'sanctioned',
      title: 'Sanction Approved',
      description: 'Your application has been sanctioned by the authority.',
      timestamp: isoTimestampDaysAgo(6),
      metadata: { sanctionedAmount: amount },
    });
  }

  if (status === ApplicationStatus.DISBURSED) {
    baseEvents.push({
      type: 'disbursed',
      title: 'Amount Disbursed',
      description: 'Funds have been transferred to your bank account.',
      timestamp: isoTimestampDaysAgo(3),
      metadata: { utrNumber: `UTR${Date.now().toString().slice(-10)}` },
    });
  }

  if (status === ApplicationStatus.REJECTED) {
    baseEvents.push({
      type: 'rejected',
      title: 'Application Rejected',
      description:
        'Application rejected due to missing/incorrect supporting information. Please review and re-apply.',
      timestamp: isoTimestampDaysAgo(5),
      metadata: { reason: 'Insufficient supporting documents' },
    });
  }

  await TimelineEvent.insertMany(
    baseEvents.map((e) => ({
      applicationId,
      ...e,
      officerName: officer?.name,
      officerId: officer?.officialId,
    }))
  );
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to database
    await connectDatabase();

    // Seed Victims
    console.log('👤 Seeding victim accounts...');
    for (const victim of demoVictims) {
      const existingUser = await User.findOne({
        aadhaar: victim.aadhaar,
        role: 'victim',
      });

      if (existingUser) {
        // Update password if user exists
        const hashedPassword = await bcrypt.hash(victim.password, 10);
        existingUser.password = hashedPassword;
        await existingUser.save();
        console.log(`  ✅ Updated victim: ${victim.aadhaar}`);
      } else {
        // Create new user
        const hashedPassword = await bcrypt.hash(victim.password, 10);
        const user = new User({
          ...victim,
          password: hashedPassword,
        });
        await user.save();
        console.log(`  ✅ Created victim: ${victim.aadhaar}`);
      }
    }

    // Seed Officials
    console.log('\n👔 Seeding official accounts...');
    for (const official of demoOfficials) {
      const existingUser = await User.findOne({
        officialId: official.officialId,
        role: 'official',
      });

      if (existingUser) {
        // Update password and details if user exists
        const hashedPassword = await bcrypt.hash(official.password, 10);
        existingUser.password = hashedPassword;
        existingUser.name = official.name;
        existingUser.department = official.department;
        existingUser.designation = official.designation;
        existingUser.email = official.email;
        await existingUser.save();
        console.log(`  ✅ Updated official: ${official.officialId} (${official.name})`);
      } else {
        // Create new user
        const hashedPassword = await bcrypt.hash(official.password, 10);
        const user = new User({
          ...official,
          password: hashedPassword,
        });
        await user.save();
        console.log(`  ✅ Created official: ${official.officialId} (${official.name})`);
      }
    }

    // Fetch seeded users for relations
    const victimsByAadhaar = new Map(
      (await User.find({ role: 'victim', aadhaar: { $in: demoVictims.map((v) => v.aadhaar) } }))
        .map((u) => [u.aadhaar!, u])
    );
    const officialsById = new Map(
      (await User.find({ role: 'official', officialId: { $in: demoOfficials.map((o) => o.officialId) } }))
        .map((u) => [u.officialId!, u])
    );

    // Seed Applications
    console.log('\n📄 Seeding demo applications (multi-status)...');
    for (const app of DEMO_APPLICATIONS) {
      const victim = victimsByAadhaar.get(app.victimAadhaar);
      if (!victim) {
        console.log(`  ⚠️ Skipping application ${app.id} (victim not found: ${app.victimAadhaar})`);
        continue;
      }

      const appliedDate = isoDateDaysAgo(app.appliedDaysAgo ?? 12);
      const officerForTimeline =
        officialsById.get('OFF003') || officialsById.get('OFF001') || officialsById.get('OFF002');

      await Application.updateOne(
        { id: app.id },
        {
          $set: {
            id: app.id,
            userId: victim._id,
            name: app.name,
            aadhaar: app.victimAadhaar,
            phone: app.phone,
            caseType: app.caseType,
            status: app.status,
            amount: app.amount,
            appliedDate,
            bankAccount: `XXXX${app.victimAadhaar.slice(-4)}`,
            ifsc: 'SBIN0001234',
            bankName: 'State Bank of India',
            branchName: 'Demo Branch',
            accountType: 'Savings',
            firNumber: app.caseType === CaseType.INTERCASTE_MARRIAGE ? undefined : 'FIR-2025-0142',
            firDate: app.caseType === CaseType.INTERCASTE_MARRIAGE ? undefined : isoDateDaysAgo(20),
            policeStation: app.caseType === CaseType.INTERCASTE_MARRIAGE ? undefined : 'Kotwali',
            district: 'Demo District',
            state: 'Demo State',
            pinCode: '110001',
            email: `${app.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
            incidentDate: app.caseType === CaseType.INTERCASTE_MARRIAGE ? undefined : isoDateDaysAgo(22),
            incidentPlace: app.caseType === CaseType.INTERCASTE_MARRIAGE ? undefined : 'Demo Locality',
            statement:
              'This is demo seed data for showcasing application workflow, verification, and tracking timeline.',
            aiVerification: {
              isVerified: app.status === ApplicationStatus.REJECTED ? false : app.status !== ApplicationStatus.PENDING,
              score:
                app.aiScore !== undefined
                  ? app.aiScore
                  : app.status === ApplicationStatus.REJECTED
                  ? 41
                  : 92,
              remarks:
                app.status === ApplicationStatus.REJECTED
                  ? 'Some fields did not match provided records.'
                  : app.status === ApplicationStatus.PENDING
                  ? 'Preliminary AI triage score to assist queue prioritization.'
                  : 'High confidence match across core identity fields.',
              matchedFields: ['name', 'aadhaar', 'dob'],
            },
          },
        },
        { upsert: true }
      );

      await upsertApplicationTimeline({
        applicationId: app.id,
        status: app.status,
        amount: app.amount,
        caseType: app.caseType,
        officer: officerForTimeline
          ? { name: officerForTimeline.name || 'Demo Officer', officialId: officerForTimeline.officialId! }
          : undefined,
      });

      console.log(`  ✅ Upserted application: ${app.id} (${app.status})`);
    }

    // Seed Grievances
    console.log('\n📝 Seeding demo grievances...');
    for (const g of DEMO_GRIEVANCES) {
      const victim = victimsByAadhaar.get(g.victimAadhaar);
      if (!victim) {
        console.log(`  ⚠️ Skipping grievance for ${g.victimAadhaar} (victim not found)`);
        continue;
      }

      const officer = officialsById.get(g.assignToOfficialId);
      const createdAt = isoDateDaysAgo(7);

      const existing = await Grievance.findOne({
        userId: victim._id,
        beneficiaryId: g.beneficiaryId,
        subject: g.subject,
      });

      const grievanceId = existing?.id || generateGrievanceId();

      await Grievance.updateOne(
        { id: grievanceId },
        {
          $set: {
            id: grievanceId,
            beneficiaryId: g.beneficiaryId,
            userId: victim._id,
            subject: g.subject,
            description: g.description,
            status: g.status,
            createdAt,
            assignedOfficer: officer?._id,
            resolvedAt: g.status === 'Resolved' ? isoDateDaysAgo(2) : undefined,
            resolution: g.status === 'Resolved' ? (g as any).resolution : undefined,
          },
        },
        { upsert: true }
      );

      console.log(`  ✅ Upserted grievance: ${grievanceId} (${g.status})`);
    }

    console.log('\n✨ Database seeding completed successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('\n👤 Victims:');
    demoVictims.forEach((v) => {
      console.log(`   Aadhaar: ${v.aadhaar.replace(/(\d{4})(?=\d)/g, '$1-')} | Password: ${v.password}`);
    });
    console.log('\n👔 Officials:');
    demoOfficials.forEach((o) => {
      console.log(`   ID: ${o.officialId} | Password: ${o.password} | Name: ${o.name}`);
    });
    console.log('\n📖 See DEMO_CREDENTIALS.md for more details.\n');
    console.log('📄 Demo Application IDs (for tracking):');
    DEMO_APPLICATIONS.forEach((a) => console.log(`   ${a.id}  (${a.status})`));

    // Close connection
    await mongoose.connection.close();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error seeding database:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run seed
seedDatabase();
