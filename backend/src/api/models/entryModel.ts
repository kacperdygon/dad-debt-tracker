import { model, Schema, Document } from 'mongoose';

export interface IEntryDocument extends Document {
  title: string;
  timestamp: Date;
  balanceChange: number;
  status: EntryStatus;
}

export enum EntryStatus {
  CONFIRMED = 'confirmed',
  PENDING = 'pending',
  REJECTED = 'rejected',
}

const entrySchema = new Schema({
  title: String,
  timestamp: Date,
  balanceChange: Number,
  status: String,
});

export const Entry = model<IEntryDocument>('Entry', entrySchema);
