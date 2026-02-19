import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth';

const router = express.Router();

// Register/Login for Victims
router.post(
  '/victim/login',
  [
    body('aadhaar').isLength({ min: 12, max: 14 }).trim(),
    body('password').isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { aadhaar, password } = req.body;
      const cleanedAadhaar = aadhaar.replace(/-/g, '');

      let user = await User.findOne({ aadhaar: cleanedAadhaar, role: 'victim' });

      if (!user) {
        // Auto-register if user doesn't exist
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({
          aadhaar: cleanedAadhaar,
          password: hashedPassword,
          role: 'victim',
        });
        await user.save();
      } else {
        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
      }

      const token = generateToken(user._id.toString());

      res.json({
        token,
        user: {
          id: user._id,
          role: user.role,
          aadhaar: user.aadhaar,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Login for Officials
router.post(
  '/official/login',
  [
    body('officialId').trim().isLength({ min: 3 }),
    body('password').isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { officialId, password } = req.body;

      const user = await User.findOne({ officialId, role: 'official' });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken(user._id.toString());

      res.json({
        token,
        user: {
          id: user._id,
          role: user.role,
          officialId: user.officialId,
          name: user.name,
          department: user.department,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// List all officials (for assigning to grievances)
router.get(
  '/officials',
  authenticate,
  requireRole(['official']),
  async (req: Request, res: Response) => {
    try {
      const officials = await User.find({ role: 'official' })
        .select('-password')
        .sort({ name: 1 });

      res.json({ officials });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Create official account (Admin function - in production, this should be restricted)
router.post(
  '/official/register',
  authenticate,
  requireRole(['official']),
  [
    body('officialId').trim().isLength({ min: 3 }),
    body('password').isLength({ min: 6 }),
    body('name').notEmpty(),
    body('department').notEmpty(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { officialId, password, name, department, email, designation } =
        req.body;

      // Check if official already exists
      const existingUser = await User.findOne({ officialId, role: 'official' });
      if (existingUser) {
        return res.status(400).json({ error: 'Official ID already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        officialId,
        password: hashedPassword,
        role: 'official',
        name,
        department,
        email,
        designation,
      });

      await user.save();

      res.status(201).json({
        message: 'Official account created successfully',
        user: {
          id: user._id,
          officialId: user.officialId,
          name: user.name,
          department: user.department,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
