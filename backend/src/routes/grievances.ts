import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import Grievance from '../models/Grievance';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth';
import { generateGrievanceId } from '../utils/generateId';

const router = express.Router();

// Get all grievances
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const query: any = {};

    // Victims can only see their own grievances
    if (req.user?.role === 'victim') {
      query.userId = req.user.id;
    }

    const grievances = await Grievance.find(query)
      .sort({ createdAt: -1 })
      .populate('assignedOfficer', 'name officialId department')
      .limit(100);

    res.json({ grievances });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single grievance
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const grievance = await Grievance.findOne({ id: req.params.id }).populate(
      'assignedOfficer',
      'name officialId department'
    );

    if (!grievance) {
      return res.status(404).json({ error: 'Grievance not found' });
    }

    // Victims can only see their own grievances
    if (
      req.user?.role === 'victim' &&
      grievance.userId.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ grievance });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create new grievance
router.post(
  '/',
  authenticate,
  requireRole(['victim']),
  [
    body('beneficiaryId').notEmpty(),
    body('subject').notEmpty(),
    body('description').notEmpty(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const grievanceId = generateGrievanceId();

      const grievance = new Grievance({
        ...req.body,
        id: grievanceId,
        userId: req.user?.id,
        status: 'Open',
        createdAt: new Date().toISOString().split('T')[0],
      });

      await grievance.save();

      res.status(201).json({ grievance });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update grievance status (Officials only)
router.patch(
  '/:id/status',
  authenticate,
  requireRole(['official']),
  [
    body('status').isIn(['Open', 'In-Progress', 'Resolved', 'Escalated']),
    body('resolution').optional(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const grievance = await Grievance.findOne({ id: req.params.id });
      if (!grievance) {
        return res.status(404).json({ error: 'Grievance not found' });
      }

      grievance.status = req.body.status;
      if (req.body.resolution) {
        grievance.resolution = req.body.resolution;
      }
      if (req.body.status === 'Resolved') {
        grievance.resolvedAt = new Date().toISOString().split('T')[0];
        grievance.assignedOfficer = req.user?.id as any;
      }

      await grievance.save();

      res.json({ grievance });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Assign officer to grievance (Officials only)
router.patch(
  '/:id/assign',
  authenticate,
  requireRole(['official']),
  [body('officerId').notEmpty()],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const grievance = await Grievance.findOne({ id: req.params.id });
      if (!grievance) {
        return res.status(404).json({ error: 'Grievance not found' });
      }

      const User = (await import('../models/User')).default;
      const officer = await User.findOne({
        _id: req.body.officerId,
        role: 'official',
      });

      if (!officer) {
        return res.status(404).json({ error: 'Officer not found' });
      }

      grievance.assignedOfficer = req.body.officerId;
      if (grievance.status === 'Open') {
        grievance.status = 'In-Progress';
      }
      await grievance.save();

      const populatedGrievance = await Grievance.findOne({
        id: req.params.id,
      }).populate('assignedOfficer', 'name officialId department');

      res.json({ grievance: populatedGrievance });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
