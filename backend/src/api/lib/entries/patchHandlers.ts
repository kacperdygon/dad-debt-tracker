import type { Request, Response } from 'express';
import { getRoleByPin } from '@/api/lib/auth';
import { Entry, IEntryDocument } from '@/api/models/entryModel';
import { Types } from 'mongoose';

export const patchHandlers: Record<string, (req: Request, res: Response) => Promise<void>>  = {

  confirmEntry: async (req: Request, res: Response) => {
    const pin = req.cookies['pin'];

    if (await getRoleByPin(pin) != "dad"){
      return void res.status(401).json({
        message: 'No permission to perform this action',
      })
    }

    const _id = req.params.id;

    if (!Types.ObjectId.isValid(_id)) {
      return void res.status(400).json({ message: 'Invalid id parameter' });
    }

    const entry: IEntryDocument | null = await Entry.findById(_id);

    if (!entry) {
      return void res.status(404).json({
        message: 'Requested entry not found',
      })
    }

    if (entry.confirmed) {
      return void res.status(400).json({ message: 'Entry is already confirmed' });
    }

    entry.confirmed = true;
    await entry.save();

    return void res.status(200).json({
      message: 'Entry confirmed successfully',
    })
  }


}