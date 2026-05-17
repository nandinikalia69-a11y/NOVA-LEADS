import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

import authRoutes from './routes/auth.routes';
import leadRoutes from './routes/lead.routes';

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'NOVA LEADS OS API is running' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/leads', leadRoutes);

export default app;
