import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth';
import { getLegalGuidance } from '../services/geminiService';

const router = express.Router();

// Get legal guidance from AI
router.post(
  '/guidance',
  authenticate,
  [body('query').notEmpty(), body('history').optional().isArray()],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { query, history = [] } = req.body;

      const guidance = await getLegalGuidance(query, history);

      res.json({ response: guidance });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
