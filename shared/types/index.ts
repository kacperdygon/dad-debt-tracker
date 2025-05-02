export enum EntryStatus {
  CONFIRMED = 'confirmed',
  PENDING = 'pending',
  REJECTED = 'rejected',
}

export enum ChartDataPeriod {
  LAST_MONTH = "last-month",
    LAST_3_MONTHS = "last-3-months",
    LAST_6_MONTHS = "last-6-months",
    LAST_YEAR = "last-year"
}

export enum SortBy{
  DATE_DESC = "date-desc",
  DATE_ASC = "date-asc",
  BALANCE_DESC = "balance-desc",
  BALANCE_ASC = "balance-asc"
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
    oldValue?: any;
    newValue?: any;
  }
}

// Populated response
export interface IActionResponse extends Omit<IAction, 'authId'> {
  authId: {
    _id: string;
    role: string;
  };
  targetExists: boolean;
}

export interface IAuth {
  _id: string;
  pin: string;
  role: string;
}

export interface BalanceByDate {
  _id: Date
  summedBalance: number
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

export interface EntryFilters{
  author: string[];
  status?: string[];
  sign: string[];
}

export interface EntryFetchOptions {
  showRejected: boolean,
  sortBy: SortBy,
  filter: EntryFilters
}