import mongoose from 'mongoose';
import type { IEntry } from '@/lib/entries';
const { Schema, model } = mongoose;

const entrySchema = new Schema({
  title: String,
  date: Date,
  balanceChange: Number,
});

export const Entry = model<IEntry>('Entry', entrySchema);