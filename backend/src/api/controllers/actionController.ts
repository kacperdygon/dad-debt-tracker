import type { Request, Response } from 'express';
import { Action, IActionDocument } from '@/api/models/actionModel';
import { IAuthDocument } from '@/api/models/authModel';
import { formatDates } from '@/api/lib/actions';

export async function getActions (req: Request, res: Response): Promise<void> {
  const limit = parseInt(req.query.limit as string, 10);
  const query = Action.find().sort({ timestamp: -1 });
  query.populate<{ auth: IAuthDocument }>('authId', '_id role');
  query.lean();
  if (!isNaN(limit)) {
    query.limit(limit);
  }
  try {
    const actions: IActionDocument[] = await query;

    for (const action of actions) {
      formatDates(action.changes.oldValue);
      formatDates(action.changes.newValue);
    }

    return void res.status(200).json({ message: 'Returned actions', data: {
      actions: actions
      } });
  } catch (error) {
    console.error('MongoDB error:', error);
    return void res.status(500).json({ message: 'Server error' });
  }
}