import type { Request, Response } from 'express';
import { getRoleByPin } from '../lib/auth';
import { Entry, type IEntryDocument } from '../models/entryModel';
import { Types } from 'mongoose';
import { patchHandlers } from '@/api/lib/entries/patchHandlers';

export const getEntries = async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string, 10);
  const orderBy = req.query.orderBy;
  const query = Entry.find().sort({ timestamp: -1 });
  if (orderBy == 'oldest') {
    query.sort({ timestamp: 1 });
  }
  if (!isNaN(limit)) {
    query.limit(limit);
  }
  try {
    const entries: IEntryDocument[] = await query;
    return void res.status(200).json({ message: 'Returned entries', entries: entries });
  } catch (error) {
    console.error('MongoDB error:', error);
    return void res.status(500).json({ message: 'Server error' });
  }
};

export const addEntry = async (req: Request, res: Response): Promise<void> => {
  const { title, timestamp, balanceChange } = req.body;

  if (!title || !timestamp || !balanceChange) {
    return void res.status(400).json({ message: 'One or more fields missing' });
  }

  try {

    const role = await getRoleByPin(req.cookies['pin']);

    if (!role) {
      return void res.status(401).json({ message: 'Not authorized or signed in' });
    }

    const confirmed = role == 'dad';

    const newEntry = new Entry({ title, timestamp, balanceChange, confirmed });
    await newEntry.save();

    return void res.status(201).json({ message: 'Entry added successfully', entry: newEntry });

  } catch (error) {
    console.error('MongoDB error:', error);
    return void res.status(500).json({ message: 'Server error' });
  }
};

export const updateEntry = async (req: Request, res: Response) => {
  const { title, timestamp, balanceChange } = req.body;
  const _id = req.params.id;

  if (!_id || !title || !timestamp || !balanceChange) {
    return void res.status(400).json({ message: 'One or more fields missing' });
  }
  if (!Types.ObjectId.isValid(_id)) {
    return void res.status(400).json({ message: 'Invalid id parameter' });
  }

  try {
    const entry: IEntryDocument | null = await Entry.findById(_id);
    if (!entry) {
      return void res.status(404).json({ message: 'Requested entry not found' });
    }

    entry.title = title;
    entry.timestamp = timestamp;
    entry.balanceChange = balanceChange;
    await entry.save();

    return void res.status(200).json({ message: 'Entry edited successfully', entry: entry });
  } catch (error) {
    console.error('MongoDB error:', error);
    return void res.status(500).json({ message: 'Server error' });
  }
};

export const deleteEntry = async (req: Request, res: Response) => {
  const _id = req.params.id;

  if (!_id) {
    return void res.status(400).json({ message: 'Missing id' });
  }
  if (!Types.ObjectId.isValid(_id)) {
    return void res.status(400).json({ message: 'Invalid id parameter' });
  }

  try {
    const result = await Entry.findByIdAndDelete(_id);
    if (!result) {
      return void res.status(404).json({ message: "Entry with this id doesn't exist" });
    }

    return void res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('MongoDB error:', error);
    return void res.status(500).json({ message: 'Server error' });
  }
};

export const patchEntry = async (req: Request, res: Response) => {
  const requestBody = req.body;
  const { patchType }  = requestBody;

  const handler = patchHandlers[patchType];

  if (!handler) {
    return void res.status(404).json({ message: 'Requested patch type not found' });
  }

  return await handler(req, res);

}