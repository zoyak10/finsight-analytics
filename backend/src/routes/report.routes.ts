import { Router } from 'express';
import { exportReport, getExportPreview } from '../controllers/report.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { reportExportSchema } from '../schemas/report.schema';

const router = Router();

router.use(authenticate);

router.post('/export', validate(reportExportSchema), exportReport);
router.get('/preview', getExportPreview);

export default router;
