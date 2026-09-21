import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiRouter } from './routes/api.js';
import { setupWebSocketServer } from './wsServer.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Health check root
app.get('/', (req, res) => {
  res.json({
    platform: 'UBIP-X',
    title: 'Universal Blockchain Intelligence & Physical Trust Platform',
    sih_problem_statement: 'PS ID: 26211',
    status: 'ONLINE',
    docs: '/api/status'
  });
});

const server = http.createServer(app);
setupWebSocketServer(server);

server.listen(PORT, () => {
  console.log(`============================================================`);
  console.log(` UBIP-X SERVER RUNNING ON http://localhost:${PORT}`);
  console.log(` WEBSOCKET STREAM AVAILABLE AT ws://localhost:${PORT}/ws`);
  console.log(` SIH 2026 PS ID: 26211 - "From Physical Evidence to Verifiable Digital Trust"`);
  console.log(`============================================================`);
});
