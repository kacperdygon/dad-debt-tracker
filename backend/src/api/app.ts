import express from 'express';
import cors from 'cors';
import routes from './routes';
import cookieParser from 'cookie-parser';

import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();

export async function connectMongoDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MongoDB URI not set');
  }
  await mongoose.connect(process.env.MONGODB_URI);
}

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());

app.use('/api', routes);

export default app;
