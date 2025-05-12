import express from 'express';
import routes from './routes';
import cookieParser from 'cookie-parser';

import mongoose from 'mongoose';

import dotenv from 'dotenv';
const envPath = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envPath });

export async function connectMongoDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MongoDB URI not set');
  }
  await mongoose.connect(process.env.MONGODB_URI);
}

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api', routes);

export default app;
