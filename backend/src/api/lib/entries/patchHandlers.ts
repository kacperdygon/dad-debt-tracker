import type { Request, Response } from 'express';
import { getRoleByPin } from '@/api/lib/auth';
import { Entry, EntryStatus, IEntryDocument } from '@/api/models/entryModel';
import { Types } from 'mongoose';

export const patchHandlers: Record<string, (req: Request, res: Response) => Promise<void>>  = {

  changeStatus: async (req: Request, res: Response) => {
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

    const { newStatus } = req.body;
    if (!newStatus) {
      return void res.status(400).json({ message: 'New status field is missing' });
    }
    if (!Object.values(EntryStatus).includes(newStatus)) {
      return void res.status(400).json({ message: 'Invalid status field' });
    }

    const entry: IEntryDocument | null = await Entry.findById(_id);
    if (!entry) {
      return void res.status(404).json({
        message: 'Requested entry not found',
      })
    }

    if (entry.status == newStatus) {
      return void res.status(400).json({ message: 'Status is already changed' });
    }

    entry.status = newStatus;
    await entry.save();

    return void res.status(200).json({
      message: 'Status changed successfully',
    })
  }


}