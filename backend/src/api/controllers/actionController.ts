import type { NextFunction, Request, Response } from 'express';
import { Action, IActionDocument } from '@/api/models/actionModel';
import { IAuthDocument } from '@/api/models/authModel';

export async function getActions (req: Request, res: Response, next: NextFunction): Promise<void> {
  const limit = parseInt(req.query.limit as string, 10);
  const query = Action.find().sort({ timestamp: -1 });
  query.populate<{ auth: IAuthDocument }>('authId');
  query.lean();
  if (!isNaN(limit)) {
    query.limit(limit);
  }
  try {
    const actions: IActionDocument[] = await query;
    return void res.status(200).json({ message: 'Returned actions', actions: actions });
  } catch (error) {
    console.error('MongoDB error:', error);
    return void res.status(500).json({ message: 'Server error' });
  }
}