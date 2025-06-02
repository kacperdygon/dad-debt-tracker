import type { Request, Response } from 'express';
import { Action, IActionDocument } from '@/api/models/actionModel';
import { IAuthDocument } from '@/api/models/authModel';
import { formatDates } from '@/api/lib/actions';
import config from '@/api/lib/config';
import { Entry } from '../models/entryModel';
import { Types } from 'mongoose';

export async function getActions (req: Request, res: Response): Promise<void> {
  const page = parseInt(req.query.page as string, 10);
  const limit = config.pageLimit;

  const _id = req.params.id;
  const filters: Record<string, string> = {};
  if (_id){
    if (!Types.ObjectId.isValid(_id)) {
      return void res.status(400).json({ message: 'Invalid id parameter' });
    }
    filters.targetId = _id;
  }
  
  
  const query = Action.find(filters).sort({ timestamp: -1 });
  query.populate<{ auth: IAuthDocument }>('authId', '_id role');
  query.lean();
  query.skip((page - 1) * limit)
  query.limit(limit);

  const pagesQuery = Action.countDocuments(filters);
  try {
    const actions: IActionDocument[] = await query;

    for (const action of actions) {
      formatDates(action.changes.oldValue);
      formatDates(action.changes.newValue);
    }

    const mappedActions = await Promise.all(
      actions.map(async (action) => {
      const targetExists = await Entry.exists({_id: action.targetId});
      return {...action, targetExists: targetExists ? true : false}
    }))

    const pageQueryResult = await pagesQuery.exec();
    const pageCount = Math.ceil(pageQueryResult / config.pageLimit);

    return void res.status(200).json({ message: 'Returned actions', data: {
      actions: mappedActions,
      pageCount: pageCount
      } });
  } catch (error) {
    console.error('MongoDB error:', error);
    return void res.status(500).json({ message: 'Server error' });
  }
}

export async function getActionPageCount(req: Request, res: Response): Promise<void> {

  try {
    const actionPageCount: number = await Action.countDocuments();

    const result = Math.ceil(actionPageCount / config.pageLimit);

    return void res.status(200).json({ message: 'Returned actions', data: {
      actionPageCount: result
      } });
  } catch (error) {
    console.error('MongoDB error:', error);
    return void res.status(500).json({ message: 'Server error' });
  }
}