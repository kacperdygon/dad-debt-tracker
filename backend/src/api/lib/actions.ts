import { ActionType, IAction } from 'shared/dist';
import { Action } from '@/api/models/actionModel';

export function validateAction(action: Omit<IAction, '_id' | 'timestamp' | 'userPin'>): { result: boolean; message: string } {
  const actionType = action.actionType;

  const validations: Record<ActionType, () => { result: boolean; message: string }> = {
    [ActionType.UpdateEntry]: () => {
      if (!action.targetId || !action.changes.newValue || !action.changes.oldValue) {
        return { result: false, message: 'Missing one field or more on update entry action' };
      }
      return { result: true, message: 'Action validated successfully' };
    },
    [ActionType.AddEntry]: () => {
      if (!action.changes.newValue) {
        return { result: false, message: 'Missing field new value on add entry action' };
      }
      return { result: true, message: 'Action validated successfully' };
    },
    [ActionType.RemoveEntry]: () => {
      if (!action.targetId) {
        return { result: false, message: 'Missing target field on remove entry action' };
      }
      return { result: true, message: 'Action validated successfully' };
    },
    [ActionType.ChangeEntryStatus]: () => {
      if (!action.targetId || !action.changes.newValue || !action.changes.oldValue) {
        return { result: false, message: 'Missing old or new value on change entry status action' };
      }
      return { result: true, message: 'Action validated successfully' };
    }
  };

  const validation = validations[actionType];

  return validation ? validation() : { result: false, message: 'Invalid action type' };
}


export async function addAction(action: Omit<IAction, '_id'>): Promise<{ ok: boolean; message: string }> {
  const validation = validateAction(action);
  if (!validation.result) { return { ok: false, message: `Action validation failed: ${validation.message}` }; }

  const newAction = new Action(action);
  try{
    await newAction.save();
    return { ok: true, message: 'Action added successfully' };
  } catch (error) {
    return { ok: false, message: 'Error when saving action: ' + error };
  }
}

export function formatDates(obj: Record<string, any>): Record<string, any> {
  if (!obj || typeof obj !== 'object') return obj;
  for (const key in obj) {
    if (obj[key] instanceof Date) {
      obj[key] = obj[key].toLocaleDateString();
    }
    if (typeof obj[key] === 'object') {
      obj[key] = formatDates(obj[key]);
    }
  }

  return obj;
}