import { Router } from 'express';
import { getSummary, getTrends, getCategories } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { dashboardQuerySchema } from '../schemas/transaction.schema';

const router = Router();

router.use(authenticate);

router.get('/summary', validate(dashboardQuerySchema, 'query'), getSummary);
router.get('/trends', validate(dashboardQuerySchema, 'query'), getTrends);
router.get('/categories', validate(dashboardQuerySchema, 'query'), getCategories);

export default router;
