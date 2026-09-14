import { Router } from 'express';
import { getTransactions, getTransactionById, getUsers } from '../controllers/transaction.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { transactionQuerySchema } from '../schemas/transaction.schema';

const router = Router();

router.use(authenticate);

router.get('/', validate(transactionQuerySchema, 'query'), getTransactions);
router.get('/users', getUsers);
router.get('/:id', getTransactionById);

export default router;
