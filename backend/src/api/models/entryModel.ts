import { model, Schema, Document } from 'mongoose';
import { EntryStatus } from 'shared';

export interface IEntryDocument extends Document {
  title: string;
  timestamp: Date;
  balanceChange: number;
  status: EntryStatus;
}

const entrySchema = new Schema({
  title: String,
  timestamp: Date,
  balanceChange: Number,
  status: String,
});

export const Entry = model<IEntryDocument>('Entry', entrySchema);
