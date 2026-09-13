// ============================================================
//  M-Pesa STK Push server — deploy one of these per tenant
//  (same pattern as Merkaz POS / GO OS: GitHub -> Render).
//  Everything tenant-specific lives in .env — this file and
//  everything under /src is identical across every client.
// ============================================================

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { mpesaRouter } from './src/routes/mpesa.js';

const app = express();
app.use(express.json());

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true,
}));

app.get('/', (_req, res) => res.json({ ok: true, service: 'mpesa-stk-server' }));
app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/mpesa', mpesaRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`M-Pesa STK server listening on port ${port} (env: ${process.env.MPESA_ENV || 'sandbox'})`);
});
