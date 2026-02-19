import express, { Response } from 'express';
import Application, { ApplicationStatus } from '../models/Application';
import TimelineEvent from '../models/TimelineEvent';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth';
import {
  verifyAadhaar,
  fetchCCTNSData,
  verifyBankAccount,
} from '../services/verificationService';
import { analyzeCaseForVerification } from '../services/geminiService';

const router = express.Router();

// Execute verification flow
router.post(
  '/:id/verify',
  authenticate,
  requireRole(['official']),
  async (req: AuthRequest, res: Response) => {
    try {
      const application = await Application.findOne({ id: req.params.id });
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      const results: any = {
        aadhaar: { verified: false, error: null },
        cctns: { verified: false, data: null, error: null },
        bank: { verified: false, error: null },
        ai: { verified: false, result: null, error: null },
      };

      // Step 1: Aadhaar Verification
      try {
        const aadhaarOk = await verifyAadhaar(application.aadhaar);
        results.aadhaar.verified = aadhaarOk;
        if (aadhaarOk) {
          application.status = ApplicationStatus.VERIFIED_AADHAAR;
          await application.save();

          await new TimelineEvent({
            applicationId: application.id,
            type: 'aadhaar_verified',
            title: 'Aadhaar Verification Complete',
            description: `Aadhaar number ${application.aadhaar.slice(0, 4)}-XXXX-XXXX verified successfully`,
            timestamp: new Date().toISOString(),
            officerName: 'UIDAI Gateway',
            officerId: 'UIDAI-AUTO',
          }).save();
        } else {
          results.aadhaar.error = 'Aadhaar verification failed';
        }
      } catch (error: any) {
        results.aadhaar.error = error.message;
      }

      // Step 2: CCTNS Verification
      if (application.firNumber) {
        try {
          const cctnsData = await fetchCCTNSData(application.firNumber);
          results.cctns.verified = !!cctnsData;
          results.cctns.data = cctnsData;

          if (cctnsData) {
            application.status = ApplicationStatus.VERIFIED_CCTNS;
            await application.save();

            await new TimelineEvent({
              applicationId: application.id,
              type: 'cctns_verified',
              title: 'CCTNS FIR Verification Complete',
              description: `FIR ${application.firNumber} verified. Sections: ${cctnsData.sections?.join(', ') || 'N/A'}`,
              timestamp: new Date().toISOString(),
              officerName: 'CCTNS System',
              officerId: 'CCTNS-AUTO',
              metadata: { firData: cctnsData },
            }).save();
          }
        } catch (error: any) {
          results.cctns.error = error.message;
        }
      }

      // Step 3: Bank Account Verification
      try {
        const bankOk = await verifyBankAccount(application.bankAccount, application.ifsc);
        results.bank.verified = bankOk;
        if (!bankOk) {
          results.bank.error = 'Bank account verification failed';
        }
      } catch (error: any) {
        results.bank.error = error.message;
      }

      // Step 4: AI Verification
      if (application.statement && results.cctns.data) {
        try {
          const aiResult = await analyzeCaseForVerification(
            results.cctns.data,
            application.statement
          );
          results.ai.verified = aiResult.isVerified;
          results.ai.result = aiResult;

          application.aiVerification = aiResult;
          await application.save();

          await new TimelineEvent({
            applicationId: application.id,
            type: 'ai_verified',
            title: 'AI Verification Complete',
            description: aiResult.remarks,
            timestamp: new Date().toISOString(),
            officerName: 'AI Verification Engine',
            officerId: 'AI-VERIFY',
            metadata: {
              score: aiResult.score,
              matchedFields: aiResult.matchedFields,
            },
          }).save();
        } catch (error: any) {
          results.ai.error = error.message;
        }
      }

      res.json({ results, application });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Initiate disbursement
router.post(
  '/:id/disburse',
  authenticate,
  requireRole(['official']),
  async (req: AuthRequest, res: Response) => {
    try {
      const application = await Application.findOne({ id: req.params.id });
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      if (application.status !== ApplicationStatus.SANCTIONED) {
        return res
          .status(400)
          .json({ error: 'Application must be sanctioned before disbursement' });
      }

      // Simulate PFMS transfer
      const utrNumber = `PFMS${Math.floor(Math.random() * 1000000000)}`;
      const transactionDate = new Date().toISOString();

      application.status = ApplicationStatus.DISBURSED;
      await application.save();

      await new TimelineEvent({
        applicationId: application.id,
        type: 'disbursed',
        title: 'Payment Disbursed',
        description: `Funds have been transferred to your bank account via PFMS gateway`,
        timestamp: transactionDate,
        officerName: 'PFMS System',
        officerId: 'PFMS-AUTO',
        metadata: {
          utrNumber,
          transactionDate,
          amount: application.amount,
        },
      }).save();

      res.json({
        application,
        payment: {
          utrNumber,
          transactionDate,
          amount: application.amount,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
