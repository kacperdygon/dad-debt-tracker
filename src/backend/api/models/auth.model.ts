import mongoose from 'mongoose'

const authSchema = new mongoose.Schema({
  pin: String,
});

export const Auth = mongoose.model('Auth', authSchema);