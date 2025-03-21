import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const authSchema = new Schema({
  pin: String,
  role: String,
});

export const Auth = model('Auth', authSchema, 'pins');
