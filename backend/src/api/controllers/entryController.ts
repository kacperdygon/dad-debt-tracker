import type { Request, Response } from 'express';
import { Entry, type IEntryDocument } from '../models/entryModel';
import { Types } from 'mongoose';
import { patchHandlers } from '@/api/lib/entries/patchHandlers';
import { ActionType, IAction } from 'shared/dist';
import { addAction } from '@/api/lib/actions';
import { IAuthDocument } from '@/api/models/authModel';

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
    return void res.status(200).json({ message: 'Returned entries',  data: {
        entries: entries
    } });
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

  const user: IAuthDocument = req.auth;

  try {

    const status = user.role == 'dad' ? "confirmed" : "pending";

    const newEntry = new Entry({ title, timestamp, balanceChange, status });

    const action: Omit<IAction, '_id'> = {
      timestamp: new Date(),
      authId: user._id as string,
      actionType: ActionType.AddEntry,
      targetId: newEntry._id as string,
      changes: {
        newValue: { title, timestamp: new Date(timestamp), balanceChange }
      }
    }
    const addActionResult = await addAction(action);
    if (!addActionResult.ok) {
      return void res.status(400).json({ message: 'Error logging action: ' + addActionResult.message });
    }

    await newEntry.save();

    return void res.status(201).json({ message: 'Entry added successfully',  data: {
        entry: newEntry
    } });

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

  const user: IAuthDocument = req.auth;

  try {

    const entry: IEntryDocument | null = await Entry.findById(_id);
    if (!entry) {
      return void res.status(404).json({ message: 'Requested entry not found' });
    }

    const action: Omit<IAction, '_id'> = {
      timestamp: new Date(),
      authId: user._id as string,
      actionType: ActionType.UpdateEntry,
      targetId: entry._id as string,
      changes: {
        oldValue: { title: entry.title, timestamp: entry.timestamp, balanceChange: entry.balanceChange },
        newValue: { title: title, timestamp: new Date(timestamp), balanceChange: balanceChange }
      }
    }
    const addActionResult = await addAction(action);
    if (!addActionResult.ok) {
      return void res.status(400).json({ message: 'Error logging action: ' + addActionResult.message });
    }

    Object.assign(entry, {title, timestamp, balanceChange});
    await entry.save();

    return void res.status(200).json({ message: 'Entry edited successfully',  data: {
        entry: entry
      }});
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

  const user: IAuthDocument = req.auth;

  try {

    const entry = await Entry.findByIdAndDelete(_id);
    if (!entry) {
      return void res.status(404).json({ message: "Entry with this id doesn't exist" });
    }

    const action: Omit<IAction, '_id'> = {
      timestamp: new Date(),
      authId: user._id as string,
      actionType: ActionType.RemoveEntry,
      targetId: entry._id as string,
      changes: {
        oldValue: { title: entry.title, timestamp: new Date(entry.timestamp), balanceChange: entry.balanceChange, status: entry.status },
      }
    }
    const addActionResult = await addAction(action);
    if (!addActionResult.ok) {
      return void res.status(400).json({ message: 'Error logging action: ' + addActionResult.message });
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