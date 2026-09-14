import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { connectDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import dashboardRoutes from './routes/dashboard.routes';
import transactionRoutes from './routes/transaction.routes';
import reportRoutes from './routes/report.routes';

import path from 'path';
import fs from 'fs';

const app = express();

// Allowed origins
const allowedOrigins = env.CLIENT_URL.split(',').map((u) => u.trim());

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes('*') ||
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.includes('localhost')
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'FinSight API is running' });
});

// Serve frontend static build if present (for single-service deployment)
const possibleDistPaths = [
  path.resolve(__dirname, '../../frontend/dist'),
  path.resolve(process.cwd(), 'frontend/dist'),
  path.resolve(process.cwd(), 'dist/client'),
];
const frontendDist = possibleDistPaths.find((p) => fs.existsSync(p));
if (frontendDist) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Error handler (must be last)
app.use(errorHandler);

// Start server
const start = async () => {
  await connectDatabase();
  app.listen(env.PORT, () => {
    console.log(`\n  FinSight API Server`);
    console.log(`  ───────────────────`);
    console.log(`  → Local:   http://localhost:${env.PORT}`);
    console.log(`  → Client:  ${env.CLIENT_URL}`);
    console.log(`  → Env:     ${env.NODE_ENV}\n`);
  });
};

start();

export default app;
