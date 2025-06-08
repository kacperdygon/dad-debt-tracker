import { SortBy, type EntryFetchOptions } from "shared";

export function getDefaultFetchOptions(){
  const options: EntryFetchOptions = {
    sortBy: SortBy.DATE_DESC,
    filter: {
      status: ['confirmed', 'pending'],
      time: {},
      balanceChange: {}
    },
  }
  return options;
}

export function arraysEqual(a: Array<unknown>, b: Array<unknown>) {
  if (a.length !== b.length) return false;
  a.sort();
  b.sort();
  return a.every((val, index) => val === b[index]);
}

export function constructParams(page: number, options: EntryFetchOptions): URLSearchParams{
  const params = new URLSearchParams({
    page: page.toString(),
    sortBy: options.sortBy,
  });

  const defaultOptions = getDefaultFetchOptions();

  if (!arraysEqual(options.filter.status, defaultOptions.filter.status)){
    params.append('status', options.filter.status.join(','));
  }
  if (options.filter.time?.startDate) {
    const parsedDate = options.filter.time.startDate.toISOString().split('T')[0];
    params.append('startDate', parsedDate);
  }
  if (options.filter.time?.endDate) {
    const parsedDate = options.filter.time.endDate.toISOString().split('T')[0];
    params.append('endDate', parsedDate);
  }
  if (options.filter.balanceChange?.min !== undefined) {
    const minBalanceChange = String(options.filter.balanceChange.min);
    params.append('minChange', minBalanceChange);
  }
  if (options.filter.balanceChange?.max !== undefined) {
    const maxBalanceChange = String(options.filter.balanceChange.max);
    params.append('maxChange', maxBalanceChange);
  }

  return params
}
