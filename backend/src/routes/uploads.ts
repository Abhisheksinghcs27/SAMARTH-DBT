import express, { Response } from 'express';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth';
import { upload } from '../config/multer';
import Application from '../models/Application';

const router = express.Router();

// Upload documents for an application
router.post(
  '/application/:id',
  authenticate,
  requireRole(['victim']),
  upload.array('documents', 10),
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

      if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      const files = Array.isArray(req.files) ? req.files : [req.files];
      const filePaths = files.map((file: any) => `/uploads/${file.filename}`);

      // Update application with document paths
      if (!application.documents) {
        application.documents = [];
      }
      application.documents.push(...filePaths);
      await application.save();

      res.json({
        message: 'Files uploaded successfully',
        files: filePaths,
        application,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get uploaded documents for an application
router.get(
  '/application/:id',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const application = await Application.findOne({ id: req.params.id });

      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      // Verify ownership or official access
      if (
        req.user?.role === 'victim' &&
        application.userId.toString() !== req.user.id
      ) {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.json({
        documents: application.documents || [],
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
