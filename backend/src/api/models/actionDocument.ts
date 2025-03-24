import { ActionType, IAction } from 'shared/dist';
import { model, Schema, Document } from 'mongoose';

export interface IActionDocument extends Omit<IAction, '_id'>, Document {}

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
