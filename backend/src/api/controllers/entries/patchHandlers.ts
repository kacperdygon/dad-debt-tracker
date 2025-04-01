import type { Request, Response } from 'express';
import { Entry, IEntryDocument } from '@/api/models/entryModel';
import { Types } from 'mongoose';
import { ActionType, EntryStatus, IAction } from 'shared/dist';
import { addAction } from '@/api/lib/actions';
import { IAuthDocument } from '@/api/models/authModel';
import { getDifferences } from '@/api/lib/entries/helpers';

export const patchHandlers: Record<string, (req: Request, res: Response) => Promise<void>>  = {

  changeStatus: async (req: Request, res: Response) => {

    const user: IAuthDocument = req.auth;
    if (user?.role != "dad"){
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

    const action: Omit<IAction, '_id'> = {
      timestamp: new Date(),
      authId: user._id as string,
      actionType: ActionType.ChangeEntryStatus,
      targetId: entry._id as string,
      changes: {
        oldValue: { status: entry.status },
        newValue: { status: newStatus },
      }
    }
    console.log(newStatus);
    const addActionResult = await addAction(action);
    if (!addActionResult.ok) {
      return void res.status(400).json({ message: 'Error logging action: ' + addActionResult.message });
    }

    entry.status = newStatus;
    await entry.save();

    return void res.status(200).json({
      message: 'Status changed successfully',
    })
  },

  updateData: async (req: Request, res: Response) => {

      const { title, timestamp, balanceChange } = req.body;
      const _id = req.params.id;

      const parsedTimestamp = new Date(timestamp);

      if (!_id || !title || Number.isNaN(parsedTimestamp) || Number.isNaN(balanceChange)) {
        return void res.status(400).json({ message: 'Invalid request' });
      }
      if (!Types.ObjectId.isValid(_id)) {
        return void res.status(400).json({ message: 'Invalid id parameter' });
      }

      const user: IAuthDocument = req.auth;

      parsedTimestamp.setUTCHours(0, 0, 0, 0);

      try {

        const entry: IEntryDocument | null = await Entry.findById(_id);
        if (!entry) {
          return void res.status(404).json({ message: 'Requested entry not found' });
        }

        // !!!! dates never equal because they don't reference the same thing

        //temporary fix
        const sameDates = new Date(timestamp).getTime() == entry.timestamp.getTime();

        const oldValue: Record<string, unknown> = { title: entry.title, timestamp: !sameDates ? entry.timestamp : undefined, balanceChange: entry.balanceChange, status: entry.status };
        const newValue: Record<string, unknown> = { title: title, timestamp: !sameDates ? parsedTimestamp : undefined, balanceChange: balanceChange, status: user.role == 'dad' ? 'confirmed' : 'pending' };
        const differences = getDifferences(oldValue, newValue);

        if (Object.keys(differences.newValue).length === 0){
          return void res.status(400).json({message: 'No changes made'});
        }

        const action: Omit<IAction, '_id'> = {
          timestamp: new Date(),
          authId: user._id as string,
          actionType: ActionType.UpdateEntry,
          targetId: entry._id as string,
          changes: differences
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
  }


}