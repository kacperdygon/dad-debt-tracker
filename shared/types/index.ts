export enum EntryStatus {
  CONFIRMED = 'confirmed',
  PENDING = 'pending',
  REJECTED = 'rejected',
}

export interface IEntry {
  _id: string;
  title: string;
  timestamp: Date;
  balanceChange: number;
  status: string;
}

export interface IAction {
  _id: string;
  timestamp: Date;
  authId: string;
  actionType: ActionType;
  targetId?: string;
  changes: {
    oldValue?: any,
    newValue?: any,
  }
}

// Add entry - no target needed, new value needed, old value not needed
// Remove entry - target needed, new value not needed, old value needed
// Update entry - target needed, new value needed, old value needed
// Change entry status - target needed, new value needed, old value needed

export enum ActionType {
  AddEntry = 'addEntry',
  RemoveEntry = 'removeEntry',
  UpdateEntry = 'updateEntry',
  ChangeEntryStatus = 'changeEntryStatus',
}