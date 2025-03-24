import mongoose from 'mongoose';
const { Schema, model } = mongoose;

export const authSchema = new Schema({
  pin: String,
  role: String,
});

export const Auth = model('Auth', authSchema, 'pins');
