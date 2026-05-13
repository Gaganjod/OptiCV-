import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';
import dns from 'node:dns';

// Fix for Node 18+ "fetch failed" error when hitting Google APIs due to IPv6 issues
dns.setDefaultResultOrder('ipv4first');

dotenv.config({ path: '../.env' }); // Adjust path if needed, since .env might be in root or backend

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);
app.use('/_/backend/api', apiRoutes); // Support Vercel experimentalServices prefix

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
