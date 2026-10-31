import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { guestAuthMiddleware } from './middleware/guestAuth.js';
import { errorHandler } from './middleware/errorHandler.js';
import caseRoutes from './routes/caseRoutes.js';
import historyRoutes from './routes/historyRoutes.js';

const app = express();

// Security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS setup
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('CORS origin access blocked by security policy.'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parsing
app.use(express.json({ limit: '500kb' }));

// Cookie parsing with signed cookie secret
const sessionSecret = process.env.SESSION_SECRET || 'noir_detective_default_secret_key_2026';
app.use(cookieParser(sessionSecret));

// Guest session middleware for all API requests
app.use(guestAuthMiddleware);

// Health check endpoint (as specified in SPEC.md FR and Acceptance Criteria)
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'AI Mystery Room Backend',
    database: dbStatusMap[dbState] || 'unknown',
    guestId: req.guestId ? 'active' : 'unassigned',
  });
});

// Case History Route (must be mounted before /api/cases/:id to avoid conflict, or dedicated /api/cases/history)
app.use('/api/cases/history', historyRoutes);

// Case Routes
app.use('/api/cases', caseRoutes);

// Catch 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`,
    code: 'ENDPOINT_NOT_FOUND',
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;
