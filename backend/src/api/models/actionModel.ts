import { ActionType } from 'shared';
import { model, Schema, Document } from 'mongoose';
import { IAuthDocument } from '@/api/models/authModel';

export interface IActionDocument extends Document {
  timestamp: Date;
  authId: Schema.Types.ObjectId | IAuthDocument;
  actionType: ActionType;
  targetId: string;
  changes: {
    oldValue?: Record<string, unknown>,
    newValue?: Record<string, unknown>,
  }
}

const changesSchema = new Schema({
  oldValue: Schema.Types.Mixed,
  newValue: Schema.Types.Mixed
}, { _id: false});

const actionSchema = new Schema({
  timestamp: { type: Date, required: true },
  actionType: { type: String, enum: Object.values(ActionType), required: true},
  authId: { type: Schema.Types.ObjectId, ref: 'Auth', required: true },
  targetId: { type: Schema.Types.ObjectId, ref: 'Entry' },
  changes: changesSchema
})

export const Action = model<IActionDocument>('Action', actionSchema);