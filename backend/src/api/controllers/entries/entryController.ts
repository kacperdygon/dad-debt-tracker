import type { Request, Response } from 'express';
import { Entry, type IEntryDocument } from '../../models/entryModel';
import { Types } from 'mongoose';
import { patchHandlers } from '@/api/controllers/entries/patchHandlers';
import { ActionType, EntryStatus, IAction } from 'shared/dist';
import { addAction } from '@/api/lib/actions';
import { IAuthDocument } from '@/api/models/authModel';
import config from '@/api/lib/config';

export const getEntries = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10);
  const limit = config.pageLimit;
  let query;
  if (req.query.rejected === 'true'){
    query = Entry.find({ status: EntryStatus.REJECTED })
  } else {
    query = Entry.find({ status: {$ne: EntryStatus.REJECTED} })
  }
  query.sort({ timestamp: -1, _id: 1 });
  query.skip((page - 1) * limit)
  query.limit(limit);
  try {
    const entries: IEntryDocument[] = await query.exec();
    if (entries.length === 0) {
      return void res.status(200).json({ message: 'No entries on this page', data: {
        entries: []
      }})
    }
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
  
  const parsedTimestamp = new Date(timestamp);

  if (!title || Number.isNaN(parsedTimestamp.getTime()) || Number.isNaN(balanceChange)) {
    return void res.status(400).json({ message: 'Invalid request' });
  }

  const user: IAuthDocument = req.auth;

  parsedTimestamp.setUTCHours(0, 0, 0, 0);

  try {

    const status = user.role == 'dad' ? "confirmed" : "pending";

    const newEntry = new Entry({ title, timestamp: parsedTimestamp, balanceChange, status });

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

export const getTotalDebt = async (req: Request, res: Response) => {
  try {
    const result = await Entry.aggregate([
      {
        $match: { status: {$ne: EntryStatus.REJECTED} }
      },
      {
        $group: {
          _id: null,
          summedDebt: { $sum: "$balanceChange"}
        }
      },
      { $sort: { _id: 1 } },
    ])

    return void res.status(200).json({ message: 'Returned total debt', data: {
      totalDebt: result[0]?.summedDebt ?? 0
      } });
  } catch (error) {
    console.error('Server error:', error);
    return void res.status(500).json({ message: 'Server error' });
  }


}

export async function getUnconfirmedEntriesCount(req: Request, res: Response){
  try {
    const result = await Entry.countDocuments({status: EntryStatus.PENDING});

    return void res.status(200).json({ message: 'Returned unconfirmed entry count', data: {
        unconfirmedEntryCount: result
      } });
  } catch (error) {
    console.error('MongoDB error:', error);
    return void res.status(500).json({ message: 'Server error' });
  }
}

export async function getEntryPageCount(req: Request, res: Response){
  
  try {
    let result;
    if (req.query.rejected === 'true'){
      result = await Entry.countDocuments({ status: EntryStatus.REJECTED })
    } else {
      result = await Entry.countDocuments({ status: {$ne: EntryStatus.REJECTED} })
    }

    result = Math.ceil(result / config.pageLimit);

    return void res.status(200).json({ message: 'Returned page count', data: {
        pageCount: result
      } });
  } catch (error) {
    console.error('MongoDB error:', error);
    return void res.status(500).json({ message: 'Server error' });
  }
}

export async function getEntryPosition(req: Request, res: Response){

  const _id = req.params.id;

  if (!_id) {
    return void res.status(400).json({ message: 'Missing id' });
  }
  if (!Types.ObjectId.isValid(_id)) {
    return void res.status(400).json({ message: 'Invalid id parameter' });
  }
   
  try {

    const entry = await Entry.findById(_id);
    if (!entry) {
      return void res.status(404).json({ message: "Entry with this id doesn't exist" });
    }

    const entries = await Entry.find({
      status: entry.status == EntryStatus.REJECTED ? EntryStatus.REJECTED : { $ne: EntryStatus.REJECTED } 
    }).sort({timestamp: -1,  _id: 1});

    const index = entries.findIndex(entry => (entry._id as Types.ObjectId).toString() == _id);

    const entryPosition = index;
    const page = Math.ceil((entryPosition + 1) / config.pageLimit);
    const positionOnPage = entryPosition % config.pageLimit;
    const rejected = entry.status == EntryStatus.REJECTED;

    return void res.status(200).json({ message: "Returned entry position", data:{
      page: page,
      positionOnPage: positionOnPage,
      rejected: rejected
    }});

  } catch (error) {
    console.error('MongoDB error:', error);
    return void res.status(500).json({ message: 'Server error' });
  }
}