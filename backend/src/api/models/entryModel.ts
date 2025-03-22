import { model, Schema, Document } from 'mongoose';

export interface IEntryDocument extends Document {
  title: string;
  timestamp: Date;
  balanceChange: number;
  confirmed: boolean;
}

const entrySchema = new Schema({
  title: String,
  timestamp: Date,
  balanceChange: Number,
  confirmed: Boolean,
});

export const Entry = model<IEntryDocument>('Entry', entrySchema);
