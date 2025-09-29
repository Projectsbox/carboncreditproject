import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { projectsRouter } from './routes/projects';
import { validationsRouter } from './routes/validations';
import { transactionsRouter } from './routes/transactions';
import { adminRouter } from './routes/admin';

dotenv.config({ path: '../.env' });

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/validations', validationsRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/admin', adminRouter);

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});


