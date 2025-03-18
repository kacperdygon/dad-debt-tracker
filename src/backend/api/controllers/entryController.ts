import type { Request, Response } from 'express';
import { getRoleByPin } from '@/backend/api/lib/auth';
import { Entry } from '@/backend/api/models/entryModel';

export const addEntry = async (req: Request, res: Response) => {
  const { title, date, balanceChange } = req.body;
  if (!title || !date || !balanceChange) {
    return res.status(400).json({ message: 'One or more fields missing' });
  }
  try {
    const role = await getRoleByPin(req.cookies['pin']);
    if (!role) {
      return res.status(401).json({ message: 'Not authorized or signed in' });
    }
    console.log('sigma');
    const newEntry = new Entry({ title, date, balanceChange});
    await newEntry.save();
    return res.status(201).json({ message: 'Entry added successfully' });
  } catch (error) {
    console.error('MongoDB error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}