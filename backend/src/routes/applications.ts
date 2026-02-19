import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import Application, { ApplicationStatus, CaseType } from '../models/Application';
import TimelineEvent from '../models/TimelineEvent';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth';
import { generateApplicationId } from '../utils/generateId';

const router = express.Router();

// Get all applications (with filters)
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { status, caseType, search, role } = req.query;
    const query: any = {};

    // Victims can only see their own applications
    if (req.user?.role === 'victim') {
      query.userId = req.user.id;
    }

    if (status && status !== 'ALL') {
      query.status = status;
    }

    if (caseType && caseType !== 'ALL') {
      query.caseType = caseType;
    }

    if (search) {
      query.$or = [
        { id: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { caseType: { $regex: search, $options: 'i' } },
      ];
    }

    const applications = await Application.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ applications });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single application
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

    res.json({ application });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create new application
router.post(
  '/',
  authenticate,
  requireRole(['victim']),
  [
    body('name').notEmpty(),
    body('aadhaar').isLength({ min: 12, max: 14 }),
    body('phone').isLength({ min: 10, max: 10 }),
    body('caseType').isIn(Object.values(CaseType)),
    body('bankAccount').notEmpty(),
    body('ifsc').matches(/^[A-Z]{4}0[A-Z0-9]{6}$/),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const applicationId = generateApplicationId();
      const amount =
        req.body.caseType === CaseType.INTERCASTE_MARRIAGE ? 250000 : 82500;

      const application = new Application({
        ...req.body,
        id: applicationId,
        userId: req.user?.id,
        status: ApplicationStatus.PENDING,
        appliedDate: new Date().toISOString().split('T')[0],
        amount,
        aadhaar: req.body.aadhaar.replace(/-/g, ''),
      });

      await application.save();

      // Create timeline event
      const timelineEvent = new TimelineEvent({
        applicationId,
        type: 'application_submitted',
        title: 'Application Submitted',
        description: `Application ${applicationId} has been successfully submitted for ${req.body.caseType}`,
        timestamp: new Date().toISOString(),
        metadata: { caseType: req.body.caseType, amount },
      });
      await timelineEvent.save();

      res.status(201).json({ application });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update application status (Officials only)
router.patch(
  '/:id/status',
  authenticate,
  requireRole(['official']),
  [body('status').isIn(Object.values(ApplicationStatus))],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const application = await Application.findOne({ id: req.params.id });
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      const oldStatus = application.status;
      application.status = req.body.status;
      await application.save();

      // Create timeline event
      const eventType =
        req.body.status === ApplicationStatus.SANCTIONED
          ? 'sanctioned'
          : req.body.status === ApplicationStatus.DISBURSED
          ? 'disbursed'
          : req.body.status === ApplicationStatus.REJECTED
          ? 'rejected'
          : 'comment';

      const timelineEvent = new TimelineEvent({
        applicationId: application.id,
        type: eventType,
        title: `Status Changed to ${req.body.status}`,
        description: `Application status updated from ${oldStatus} to ${req.body.status}`,
        timestamp: new Date().toISOString(),
        officerName: req.user?.id,
        officerId: req.user?.officialId,
      });
      await timelineEvent.save();

      res.json({ application });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update application (Victims can update their own applications)
router.patch(
  '/:id',
  authenticate,
  requireRole(['victim']),
  async (req: AuthRequest, res: Response) => {
    try {
      const application = await Application.findOne({ id: req.params.id });

      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      // Verify ownership
      if (application.userId.toString() !== req.user?.id) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Only allow updates if status is PENDING
      if (application.status !== ApplicationStatus.PENDING) {
        return res
          .status(400)
          .json({ error: 'Cannot update application after verification has started' });
      }

      // Allowed fields for update
      const allowedFields = [
        'name',
        'phone',
        'email',
        'dateOfBirth',
        'gender',
        'fathersName',
        'mothersName',
        'permanentAddress',
        'currentAddress',
        'district',
        'state',
        'pinCode',
        'alternatePhone',
        'pan',
        'voterId',
        'casteCertificateNumber',
        'casteCertificateIssuedBy',
        'casteCertificateDate',
        'incomeCertificateNumber',
        'annualIncome',
        'incidentDate',
        'incidentPlace',
        'policeStation',
        'firNumber',
        'firDate',
        'firSections',
        'accusedDetails',
        'familyMembers',
        'dependents',
        'statement',
        'bankAccountHolderName',
        'bankName',
        'branchName',
        'accountType',
      ];

      // Update only allowed fields
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          (application as any)[field] = req.body[field];
        }
      });

      // Clean Aadhaar if provided
      if (req.body.aadhaar) {
        application.aadhaar = req.body.aadhaar.replace(/-/g, '');
      }

      await application.save();

      res.json({ application });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get application statistics (Officials only)
router.get(
  '/stats/overview',
  authenticate,
  requireRole(['official']),
  async (req: AuthRequest, res: Response) => {
    try {
      const total = await Application.countDocuments();
      const pending = await Application.countDocuments({
        status: ApplicationStatus.PENDING,
      });
      const sanctioned = await Application.countDocuments({
        status: ApplicationStatus.SANCTIONED,
      });
      const disbursed = await Application.countDocuments({
        status: ApplicationStatus.DISBURSED,
      });
      const rejected = await Application.countDocuments({
        status: ApplicationStatus.REJECTED,
      });

      const poaAct = await Application.countDocuments({
        caseType: CaseType.POA_ACT,
      });
      const pcrAct = await Application.countDocuments({
        caseType: CaseType.PCR_ACT,
      });
      const marriage = await Application.countDocuments({
        caseType: CaseType.INTERCASTE_MARRIAGE,
      });

      const totalAmount = await Application.aggregate([
        { $match: { status: ApplicationStatus.DISBURSED } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);

      res.json({
        total,
        pending,
        sanctioned,
        disbursed,
        rejected,
        byCaseType: { poaAct, pcrAct, marriage },
        totalDisbursed: totalAmount[0]?.total || 0,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
