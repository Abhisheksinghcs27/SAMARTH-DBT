import express, { Response } from 'express';
import Application from '../models/Application';
import TimelineEvent from '../models/TimelineEvent';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get tracking data for an application
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const application = await Application.findOne({ id: req.params.id });
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Victims can only see their own applications
    if (
      req.user?.role === 'victim' &&
      application.userId.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const events = await TimelineEvent.find({
      applicationId: req.params.id,
    }).sort({ timestamp: 1 });

    const estimatedDate = new Date(application.appliedDate);
    estimatedDate.setDate(
      estimatedDate.getDate() +
        (application.status === 'DISBURSED' ? 7 : 10)
    );

    const trackingData = {
      applicationId: application.id,
      events,
      currentStatus: application.status,
      estimatedCompletionDate:
        application.status !== 'DISBURSED'
          ? estimatedDate.toISOString().split('T')[0]
          : undefined,
      assignedOfficer:
        application.status !== 'PENDING'
          ? {
              name: 'Officer Name',
              id: 'OFF-001',
              department: 'Verification Department',
            }
          : undefined,
      paymentDetails:
        application.status === 'DISBURSED'
          ? {
              utrNumber: events.find((e) => e.type === 'disbursed')?.metadata
                ?.utrNumber,
              transactionDate: events.find((e) => e.type === 'disbursed')
                ?.timestamp,
              bankName: application.bankName || 'Bank Name',
              accountNumber: application.bankAccount,
              ifsc: application.ifsc,
            }
          : undefined,
    };

    res.json({ tracking: trackingData });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
