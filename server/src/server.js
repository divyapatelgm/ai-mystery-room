import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

import app from './app.js';
import { connectDatabase } from './config/database.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  // Connect to MongoDB Atlas / local DB
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`  🕵️  AI MYSTERY ROOM — BACKEND SERVER`);
    console.log(`  Running on port: http://localhost:${PORT}`);
    console.log(`  Environment:     ${process.env.NODE_ENV || 'development'}`);
    console.log(`  Gemini Model:    ${process.env.GEMINI_MODEL || 'gemini-3.8-flash'}`);
    console.log(`===============================================`);
  });
}

startServer();

