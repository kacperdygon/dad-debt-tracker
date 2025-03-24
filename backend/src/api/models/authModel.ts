import { model, Schema, Document } from 'mongoose';

export interface IAuthDocument extends Document {
  pin: string,
  role: string,
}

export const authSchema = new Schema({
  pin: String,
  role: String,
});

export const Auth = model('Auth', authSchema, 'pins');
